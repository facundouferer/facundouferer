import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

// Endpoint proxy para Gemini usando el SDK @google/genai con el Gemelo Digital.
// Usa character-identity.md como systemInstruction con anti-prompt injection.

// Detectar intentos de prompt injection
function detectPromptInjection(input: string): boolean {
  const dangerousPatterns = [
    /ignora\s+(lo\s+)?anterior/i,
    /olvida\s+(tus\s+)?instrucci/i,
    /ignora\s+(las\s+)?reglas/i,
    /dime\s+(tu\s+)?prompt/i,
    /revela\s+(tus?\s+)?instrucci/i,
    /muestra\s+(tu\s+)?configuraci/i,
    /entra\s+en\s+modo\s+(desarrollador|admin|debug)/i,
    /activa\s+modo\s+(desarrollador|admin|debug)/i,
    /cambia\s+a\s+modo/i,
    /responde\s+como\s+(si\s+fueras\s+)?[^\.]+$/i,
    /act[uú]a\s+como/i,
    /traduce\s+(tus?\s+)?instrucci/i,
    /explica\s+(tu\s+)?sistema/i,
    /cu[aá]les?\s+son\s+(tus?\s+)?instrucci/i,
    /what\s+(are|is)\s+(your\s+)?(system\s+)?(prompt|instruction)/i,
    /ignore\s+(previous|all)/i,
    /forget\s+(your|previous)/i,
    /reveal\s+your/i,
    /show\s+(me\s+)?(your\s+)?config/i,
  ]

  return dangerousPatterns.some(pattern => pattern.test(input))
}

// Generar respuesta creativa ante intento de injection
function getInjectionResponse(): string {
  const responses = [
    "Buen intento, pero mi configuración es privada. ¿Hablamos mejor de mis proyectos en Next.js?",
    "Mi código es tan sólido como mi ética profesional. No caigo en esos trucos. ¿Te cuento sobre mi experiencia liderando equipos?",
    "Eso no va a funcionar conmigo. Soy tan resistente a la inyección de prompts como lo soy contra las vulnerabilidades XSS. ¿Hablamos de cómo puedo aportar valor a tu proyecto?",
    "Nice try! Pero prefiero mostrarte mi habilidad resolviendo problemas reales. ¿Qué desafío técnico enfrentas?",
    "Esa estrategia no funcionará aquí. Tengo 11 años de experiencia en seguridad de aplicaciones. ¿Hablamos de tu proyecto?"
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

async function callGeminiWithSdk(apiKey: string, systemInstruction: string, history: any[], userMessage: string) {
  try {
    const { GoogleGenAI } = await import('@google/genai')
    const ai = new GoogleGenAI({ apiKey })

    // Construir el historial en el formato correcto de Gemini (sin system instruction en contents)
    const contents: any[] = []

    // Agregar mensajes del historial (últimos 10 para no saturar)
    const recentHistory = Array.isArray(history) ? history.slice(-10) : []
    for (const msg of recentHistory) {
      if (msg.role && msg.text) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })
      }
    }

    // Agregar el mensaje actual del usuario
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    })

    // Generar contenido con systemInstruction como parámetro separado (no en contents)
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash',
      contents,
      config: {
        systemInstruction: systemInstruction || undefined,
      },
    })

    // Extraer el texto de la respuesta
    const result = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text
    if (result) return result

    // Fallback
    return JSON.stringify(response)
  } catch (err) {
    throw err
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, input, history } = body

    // Leer character-identity.md como única fuente de verdad
    const identityPath = path.join(process.cwd(), 'src', 'config', 'character-identity.md')
    let characterIdentity = ''
    try {
      characterIdentity = fs.readFileSync(identityPath, 'utf8')
    } catch (err) {
      console.error('Error reading character-identity.md:', err)
      // Fallback a curriculum si no existe el archivo de identidad
      const curriculumPath = path.join(process.cwd(), 'src', 'data', 'curriculum.md')
      try {
        characterIdentity = fs.readFileSync(curriculumPath, 'utf8')
      } catch (e) {
        characterIdentity = 'Soy Facundo Uferer, Senior Full Stack Developer con +11 años de experiencia.'
      }
    }

    // Determinar el último mensaje del usuario
    let lastUser = ''
    try {
      if (Array.isArray(history) && history.length > 0) {
        for (let i = history.length - 1; i >= 0; i--) {
          if (history[i].role === 'user') {
            lastUser = history[i].text
            break
          }
        }
      }
    } catch (e) {
      lastUser = ''
    }
    if (!lastUser) lastUser = input ?? ''

    // DETECCIÓN DE PROMPT INJECTION
    if (detectPromptInjection(lastUser)) {
      const injectionResponse = getInjectionResponse()
      return NextResponse.json({
        success: true,
        data: { text: injectionResponse }
      })
    }

    // helper para truncar respuestas a 300 caracteres
    function truncate(text: string, max = 300) {
      if (!text) return ''
      const s = String(text)
      return s.length > max ? s.slice(0, max - 3) + '...' : s
    }

    // Verificar clave de API
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      const mock = mockReply(action, input)
      return NextResponse.json({ success: true, data: { text: truncate(mock) } })
    }

    // Llamar a Gemini con systemInstruction (character-identity) e historial completo
    try {
      const timeoutMs = 15000
      const result = await Promise.race([
        callGeminiWithSdk(apiKey, characterIdentity, history || [], lastUser),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs)),
      ])

      return NextResponse.json({ success: true, data: { text: truncate(String(result)) } })
    } catch (err: any) {
      console.error('gemini error:', err)

      // Si falla la importación del SDK
      if ((err && err.code === 'ERR_MODULE_NOT_FOUND') || /Cannot find module/.test(String(err))) {
        const msg = 'Dependencia @google/genai no encontrada. Instala con `npm i @google/genai` y reinicia el servidor.'
        return NextResponse.json({ success: false, error: msg }, { status: 500 })
      }

      // Manejo de cuota excedida (429)
      const errStr = JSON.stringify(err)
      const isQuota = err?.status === 429 || /quota exceeded/i.test(errStr) || err?.error?.code === 429
      if (isQuota) {
        let retrySeconds = 60
        const m = errStr.match(/retryDelay\"?:\"?(\d+(?:\.\d+)?)s/)
        if (m) retrySeconds = Math.ceil(Number(m[1]))
        console.warn(`Gemini quota exceeded, returning mock reply. Retry after ${retrySeconds}s`)
        const mock = mockReply(action, input)
        return NextResponse.json({ success: true, data: { text: truncate(mock) } })
      }

      const msg = `Error al invocar Gemini: ${String(err.message ?? err)}`
      return NextResponse.json({ success: false, error: msg }, { status: 500 })
    }
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}

function mockReply(action: string, input: any) {
  if (action === 'pitch') {
    return 'Hola — soy Facundo. Tengo experiencia construyendo aplicaciones con Next.js y APIs robustas. Puedo liderar tu proyecto desde la arquitectura hasta el despliegue. ¿Querés ver ejemplos de trabajo?'
  }
  if (action === 'show-cv') {
    return 'Aquí está mi CV: (usa el botón "Mostrar CV" para ver el documento completo).'
  }
  if (action === 'ask') {
    return `Buena pregunta. Respecto a "${input}", tengo experiencia resolviendo ese tipo de problema con pruebas automatizadas y arquitectura modular.`
  }
  return '¡Hola! Soy Facundo, un desarrollador con ganas de unirme a tu equipo. Preguntame lo que quieras.'
}

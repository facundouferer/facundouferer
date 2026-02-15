import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

// Endpoint mejorado que usa Gemini con character-identity.md como systemInstruction
// Request: POST { question: string }
// Response: { success: boolean, data?: { text: string }, error?: string }

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

async function callGeminiWithSdk(apiKey: string, systemInstruction: string, question: string, history: any[]) {
  try {
    const { GoogleGenAI } = await import('@google/genai')
    const ai = new GoogleGenAI({ apiKey })

    // Obtener el modelo (no pasar propiedades no soportadas por los tipos)
    const model = await ai.models.get({ model: 'gemini-2.0-flash-exp' })

    // Construir el historial en formato Gemini
    const contents: any[] = []
    // Agregar system instruction como primer mensaje (si existe)
    if (systemInstruction) {
      contents.push({ role: 'system', parts: [{ text: systemInstruction }] })
    }

    const recentHistory = Array.isArray(history) ? history.slice(-10) : []
    for (const msg of recentHistory) {
      if (msg.role && msg.text) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })
      }
    }

    // Agregar pregunta actual
    contents.push({ role: 'user', parts: [{ text: question }] })

    // Generar contenido con todo el contexto
    // El SDK puede exponer distintos tipos; casteamos a any para evitar errores de tipos
    const response = await (model as any).generateContent({ contents })

    // Extraer el texto de la respuesta
    const result = response.response?.text?.() || response.response?.candidates?.[0]?.content?.parts?.[0]?.text
    if (result) return result

    // Fallback
    return JSON.stringify(response)
  } catch (err) {
    throw err
  }
}

export async function POST(req: Request) {
  try {
    const { question, history } = await req.json()
    if (!question || typeof question !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
    }

    // DETECCIÓN DE PROMPT INJECTION
    if (detectPromptInjection(question)) {
      const injectionResponse = getInjectionResponse()
      return NextResponse.json({
        success: true,
        data: { text: injectionResponse }
      })
    }

    // Leer character-identity.md como única fuente de verdad
    const identityPath = path.join(process.cwd(), 'src', 'config', 'character-identity.md')
    let characterIdentity = ''
    try {
      characterIdentity = fs.readFileSync(identityPath, 'utf8')
    } catch (err) {
      console.error('Error reading character-identity.md:', err)
      // Fallback a curriculum si no existe
      const curriculumPath = path.join(process.cwd(), 'src', 'data', 'curriculum.md')
      try {
        characterIdentity = fs.readFileSync(curriculumPath, 'utf8')
      } catch (e) {
        characterIdentity = 'Soy Facundo Uferer, Senior Full Stack Developer con +11 años de experiencia.'
      }
    }

    // helper para truncar respuestas
    function truncate(text: string, max = 300) {
      if (!text) return ''
      const s = String(text)
      return s.length > max ? s.slice(0, max - 3) + '...' : s
    }

    // Verificar clave de API
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      // Fallback sin Gemini - usar historial para evitar loops
      return NextResponse.json({
        success: true,
        data: { text: fallbackMock(question, history || []) }
      })
    }

    // Llamar a Gemini con systemInstruction e historial
    try {
      const timeoutMs = 15000
      const result = await Promise.race([
        callGeminiWithSdk(apiKey, characterIdentity, question, history || []),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs)),
      ])

      return NextResponse.json({ success: true, data: { text: truncate(String(result)) } })
    } catch (err: any) {
      console.error('gemini error in cv-query:', err)

      // Si falla la importación del SDK
      if ((err && err.code === 'ERR_MODULE_NOT_FOUND') || /Cannot find module/.test(String(err))) {
        return NextResponse.json({
          success: true,
          data: { text: fallbackMock(question, history || []) }
        })
      }

      // Manejo de cuota excedida (429)
      const errStr = JSON.stringify(err)
      const isQuota = err?.status === 429 || /quota exceeded/i.test(errStr) || err?.error?.code === 429
      if (isQuota) {
        console.warn('Gemini quota exceeded in cv-query, using fallback')
        return NextResponse.json({
          success: true,
          data: { text: fallbackMock(question, history || []) }
        })
      }

      // Cualquier otro error: usar fallback con historial
      return NextResponse.json({
        success: true,
        data: { text: fallbackMock(question, history || []) }
      })
    }
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}

// Fallback cuando no hay Gemini disponible - con detección de repeticiones
function fallbackMock(question: string, history: any[]) {
  const q = question.toLowerCase()

  // Detectar si ya respondimos algo similar recientemente
  const recentAssistantMessages = history
    .filter(m => m.role === 'assistant')
    .slice(-3)  // Últimas 3 respuestas
    .map(m => m.text)

  // Helper para verificar si ya dijimos esto
  function alreadySaid(text: string): boolean {
    return recentAssistantMessages.some(msg =>
      msg && msg.includes(text.slice(0, 50))  // Comparar primeros 50 chars
    )
  }

  // Respuestas sobre contratación/pitch (con variaciones)
  if (/convenc/i.test(q) || /contrat/i.test(q) || /pitch/i.test(q) || /diseñ|disen|web|sitio/i.test(q)) {
    const responses = [
      'Hola — soy Facundo. Tengo +11 años construyendo aplicaciones con React, Next.js y Node.js. Puedo liderar tu proyecto desde la arquitectura hasta el despliegue. ¿Hablamos?',
      '¡Claro! Especializado en React y Next.js. +11 años de experiencia, desde startups hasta gobierno. ¿Qué tipo de sitio necesitás?',
      'Absolutamente. He diseñado y desarrollado decenas de sitios web profesionales. ¿Querés ver mi portfolio en facundouferer.ar?',
      'Sí, estoy disponible. Full Stack con énfasis en frontend moderno. ¿Cuándo necesitarías arrancar? Te paso mi email: juanfacundouf@gmail.com'
    ]
    // Buscar una respuesta que NO hayamos dado recientemente
    for (const resp of responses) {
      if (!alreadySaid(resp)) return resp
    }
    // Si todas fueron usadas, rotar
    return responses[history.length % responses.length]
  }

  // Respuestas sobre stack tecnológico (con variaciones)
  if (/tecnolog|stack|react|next|node|typescript/i.test(q)) {
    const responses = [
      'Domino React, Next.js, TypeScript, Node.js, Express, NestJS, MongoDB, MySQL, Docker, AWS y Vercel. Stack moderno y probado en producción.',
      'Mi stack principal: React 19, Next.js 15, TypeScript, Node.js, Tailwind CSS. También manejo Docker, AWS y bases de datos SQL/NoSQL.',
      'Frontend: React + Next.js + TypeScript. Backend: Node + Express/NestJS. DevOps: Docker + AWS/Vercel. Todo con +8 años de experiencia en producción.'
    ]
    for (const resp of responses) {
      if (!alreadySaid(resp)) return resp
    }
    return responses[history.length % responses.length]
  }

  // Respuestas sobre experiencia (con variaciones)
  if (/experienc|proyecto|años|trabajos/i.test(q)) {
    const responses = [
      '+11 años de experiencia profesional. Consultor freelance, profesor en UTN, ex-tech lead en gobierno. Proyectos con millones de usuarios.',
      '11 años construyendo software, desde startups hasta aplicaciones gubernamentales con millones de usuarios. También enseño en la universidad.',
      'Amplia experiencia: freelance internacional, tech lead en gobierno, profesor universitario. Portfolio público en facundouferer.ar'
    ]
    for (const resp of responses) {
      if (!alreadySaid(resp)) return resp
    }
    return responses[history.length % responses.length]
  }

  // Respuestas sobre docencia
  if (/profesor|docente|enseñ|mentor/i.test(q)) {
    return 'Profesor titular de JAVA en UTN desde 2019. Ex-mentor técnico en Coderhouse. Experto en code reviews y formación de equipos.'
  }

  // Respuestas sobre contacto
  if (/contacto|email|linkedin|web/i.test(q)) {
    return 'Email: juanfacundouf@gmail.com | LinkedIn: linkedin.com/in/facundouferer | Portfolio: facundouferer.ar'
  }

  // Respuestas sobre CV
  if (/cv|curricul|resum/i.test(q)) {
    return 'Podés ver mi CV completo en facundouferer.ar o contactarme en juanfacundouf@gmail.com'
  }

  // Respuestas sobre disponibilidad
  if (/disponib|empez|cuando/i.test(q)) {
    return 'Estoy disponible para proyectos remotos. Puedo arrancar según tus tiempos. Contactame: juanfacundouf@gmail.com'
  }

  // Pregunta abierta/inicial (con variación)
  if (alreadySaid('¡Hola! Soy Facundo')) {
    return '¿En qué puedo ayudarte? Puedo contarte sobre mi experiencia, stack técnico, o discutir tu proyecto. También podés ver mi portfolio en facundouferer.ar'
  }

  return '¡Hola! Soy Facundo, Senior Full Stack Developer con +11 años de experiencia. ¿Qué te gustaría saber sobre mi experiencia o stack técnico?'
}

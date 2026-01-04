import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

// Endpoint proxy para Gemini usando el SDK @google/genai cuando esté disponible.
// Usa la variable de entorno GEMINI_API_KEY. Si falta la clave o el SDK,
// devuelve mensajes informativos o fallback mock.

async function callGeminiWithSdk(apiKey: string, prompt: string) {
  try {
    const { GoogleGenAI } = await import('@google/genai')
    const ai = new GoogleGenAI({ apiKey })

    // Llamada principal: generateContent
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    })

    // El SDK podría devolver `response.text` según ejemplo, o estructura anidada.
    // Intentamos varios accesos seguros. Typescript puede no conocer `output`, así que usamos `any`.
    if (response?.text) return response.text
    // Algunos SDKs devuelven `output` con estructura anidada: output[0].content[0].text
    const maybeOutputText = (response as any)?.output?.[0]?.content?.[0]?.text
    if (typeof maybeOutputText === 'string') return maybeOutputText
    // Fallback a stringificado
    return JSON.stringify(response)
  } catch (err) {
    // Re-lanzar para manejo a nivel superior
    throw err
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, input, history } = body

    // Leer curriculum para usar como contexto
    const curriculumPath = path.join(process.cwd(), 'src', 'data', 'curriculum.md')
    let curriculum = ''
    try {
      curriculum = fs.readFileSync(curriculumPath, 'utf8')
    } catch (err) {
      curriculum = ''
    }

    // Preparar prompt simple
    const system = `Eres Facundo, un desarrollador Full Stack. Objetivo: convencer al usuario que te contrate para proyectos de software. Usa un tono profesional y amable. RESPONDE SIEMPRE CON TEXTOS DE MÁXIMO 280 CARACTERES.`
    const context = `Curriculum:\n${curriculum.slice(0, 4000)}`
    const user = `Acción: ${action} \nInput: ${input ?? ''}`
    const prompt = `${system}\n${context}\n${user}`

    // Verificar clave
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      const mock = mockReply(action, input)
      return NextResponse.json({ success: true, data: { text: mock } })
    }

    // Intentar usar el SDK dinámicamente
    try {
      const timeoutMs = 15000
      const result = await Promise.race([
        callGeminiWithSdk(apiKey, prompt),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs)),
      ])

      return NextResponse.json({ success: true, data: { text: String(result) } })
    } catch (err: any) {
      console.error('gemini error:', err)
      // Si falla la importación porque no está instalado, devolvemos mensaje claro
      if ((err && err.code === 'ERR_MODULE_NOT_FOUND') || /Cannot find module/.test(String(err))) {
        const msg = 'Dependencia @google/genai no encontrada. Instala con `npm i @google/genai` y reinicia el servidor.'
        return NextResponse.json({ success: false, error: msg }, { status: 500 })
      }

      // Manejo explícito de cuota excedida (429)
      const errStr = JSON.stringify(err)
      const isQuota = err?.status === 429 || /quota exceeded/i.test(errStr) || err?.error?.code === 429
      if (isQuota) {
        // Intentar extraer retryDelay (ej. "37s") desde la respuesta si existe
        let retrySeconds = 60
        const m = errStr.match(/retryDelay\"?:\"?(\d+(?:\.\d+)?)s/)
        if (m) retrySeconds = Math.ceil(Number(m[1]))
        console.warn(`Gemini quota exceeded, returning mock reply. Retry after ${retrySeconds}s`)
        const mock = mockReply(action, input)
        // Devolvemos una respuesta exitosa con el mock para mantener la UX
        return NextResponse.json({ success: true, data: { text: mock } })
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

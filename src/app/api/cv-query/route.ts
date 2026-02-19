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

    // Construir el historial en formato Gemini (sin system instruction en contents)
    const contents: any[] = []

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

  // Respuestas sobre contratación/pitch (con variaciones) — SIN repetir saludo
  if (/convenc/i.test(q) || /contrat/i.test(q) || /pitch/i.test(q) || /diseñ|disen|web|sitio/i.test(q)) {
    const responses = [
      'Tengo +11 años construyendo aplicaciones con React, Next.js y Node.js. Puedo liderar tu proyecto desde la arquitectura hasta el despliegue. ¿Hablamos?',
      '¡Claro! Especializado en React y Next.js. +11 años de experiencia, desde startups hasta gobierno. ¿Qué tipo de sitio necesitás?',
      'Absolutamente. He diseñado y desarrollado decenas de sitios web profesionales. ¿Querés ver mi portfolio en facundouferer.ar?',
      'Sí, estoy disponible. Full Stack con énfasis en frontend moderno. ¿Cuándo necesitarías arrancar? Te paso mi email: juanfacundouf@gmail.com'
    ]
    for (const resp of responses) {
      if (!alreadySaid(resp)) return resp
    }
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

  // Respuestas sobre inteligencia artificial, IA, machine learning, LLMs
  if (/inteligencia\s*artificial|\bia\b|machine\s*learning|llm|chatgpt|gpt|openai|deep\s*learning|modelo|prompting|automatizaci/i.test(q)) {
    const responses = [
      '¡Por supuesto! Trabajo con IA e integración de LLMs en aplicaciones. Uso GitHub Copilot, Cursor, n8n y prompting avanzado. De hecho, ¡este chat es una prueba de ello! 😄',
      'Sí, integro IA en mis proyectos: automatización con n8n, prompting de LLMs, desarrollo asistido por IA. Este mismo chatbot es un ejemplo de mi trabajo con IA.',
      'Absolutamente. Tengo experiencia integrando modelos de IA en aplicaciones web, automatización de workflows con n8n, y desarrollo asistido por IA. ¿Querés saber más?',
      'Claro que sí. De hecho, estás hablando con una IA que diseñé y programé. Además trabajo con n8n, LLMs y herramientas de desarrollo asistido por IA.'
    ]
    for (const resp of responses) {
      if (!alreadySaid(resp)) return resp
    }
    return responses[history.length % responses.length]
  }

  // Preguntas meta: ¿sos un bot?, ¿sos real?, ¿sos el verdadero Facundo?
  if (/\b(bot|robot|real|verdadero|humano|person|ia|artificial|gemelo|digital|clon|crees que|sos vos|eres t[uú])\b/i.test(q)) {
    const responses = [
      'Soy el gemelo digital de Facundo, una IA que él diseñó para que puedas conocer su perfil. Si querés hablar con el real, ¡agendá una reunión! 😉 juanfacundouf@gmail.com',
      '¡Buena pregunta! Soy una IA creada por Facundo. Él me programó con su experiencia y perfil profesional. Para el Facundo de carne y hueso: juanfacundouf@gmail.com',
      'No te voy a mentir: soy su gemelo digital, una IA. Pero toda la info que te doy es real. ¿Querés hablar con el verdadero Facundo? Te paso su contacto.',
      'Técnicamente soy una IA, pero represento fielmente a Facundo y su experiencia de +11 años. ¿Querés coordinar una llamada con el real? 🎯'
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

  // Preguntas tipo "¿sabés X?" / "¿podés hacer X?" — cuando no matchea ninguna categoría conocida
  // Lista las tecnologías que sí sabe + filosofía de IA y arquitectura
  if (/sab[eé]s|pod[eé]s|hac[eé]s|conoc[eé]s|mane[jg]|usa[sr]?|trabaj/i.test(q)) {
    const responses = [
      'Mi stack principal incluye: React, Next.js, TypeScript, Node.js, Express, NestJS, MongoDB, MySQL, Docker, AWS, Vercel y herramientas de IA. Y lo que no domino aún, con IA y conocimiento sólido de arquitectura de software, lo aprendo rápido. ¿Hablamos de tu proyecto?',
      'Domino React, Next.js, TypeScript, Node.js, bases de datos SQL/NoSQL, Docker y AWS. Pero aprendí que con IA como copiloto y entendiendo bien la arquitectura general, cualquier stack nuevo es cuestión de días, no meses. ¿Qué necesitás?',
      'Trabajo con: React, Next.js, TypeScript, Node, NestJS, MongoDB, MySQL, Docker, AWS, Vercel, n8n y herramientas de IA. Y la realidad hoy es que dominando la arquitectura, la IA te ayuda a adaptarte a cualquier tecnología nueva rápidamente. ¿Contame tu proyecto!'
    ]
    for (const resp of responses) {
      if (!alreadySaid(resp)) return resp
    }
    return responses[history.length % responses.length]
  }

  // Catch-all — invitar a agendar una llamada real
  const fallbacks = [
    'Para que no sigas hablando con un bot, ¿qué te parece si agendamos una llamada? Escribime a juanfacundouf@gmail.com y coordinamos 😉',
    'Mejor hablemos en persona. Podés escribirme a juanfacundouf@gmail.com para agendar una reunión y charlar sobre tu proyecto. ¡Te espero!',
    'Creo que esto se resuelve mejor en una conversación real. Agendemos una llamada: juanfacundouf@gmail.com. ¡Va a ser más productivo! 🚀'
  ]
  for (const resp of fallbacks) {
    if (!alreadySaid(resp)) return resp
  }
  return fallbacks[history.length % fallbacks.length]
}

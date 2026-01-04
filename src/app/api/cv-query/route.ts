import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

// Endpoint simple que busca información en src/data/curriculum.md
// Request: POST { question: string }
// Response: { success: boolean, data?: { text: string }, error?: string }

export async function POST(req: Request) {
  try {
    const { question } = await req.json()
    if (!question || typeof question !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
    }

    const curriculumPath = path.join(process.cwd(), 'src', 'data', 'curriculum.md')
    let curriculum = ''
    try {
      curriculum = fs.readFileSync(curriculumPath, 'utf8')
    } catch (err) {
      console.error('cv-query read error', err)
      return NextResponse.json({ success: false, error: 'Could not read curriculum' }, { status: 500 })
    }

    // Generar respuesta basada en el curriculum
    let answer = generateAnswerFromCurriculum(question, curriculum)
    if (!answer || answer.trim().length === 0) {
      answer = fallbackMock(question)
    }
    // Asegurar tono persuasivo breve
    answer = makePersuasive(answer)
    // Truncar a 280 caracteres por seguridad
    if (answer.length > 280) answer = answer.slice(0, 277) + '...'
    return NextResponse.json({ success: true, data: { text: answer } })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}

// Lógica simple de búsqueda/extracción
function generateAnswerFromCurriculum(question: string, curriculum: string) {
  const q = question.toLowerCase()

  // Secciones clave
  const sections = extractSections(curriculum)

  // Búsquedas directas por palabras clave
  if (/tecnolog/i.test(q) || /stack|javascript|typescript|next\.js|react|node/.test(q)) {
    return shortParagraph(sections['Habilidades'] || sections['Resumen'])
  }

  if (/experienc|proyecto|proyectos|trabaj/i.test(q)) {
    return shortParagraph(sections['Experiencia destacada'] || sections['Resumen'])
  }

  if (/educ|universi|profesor|docente/i.test(q)) {
    return shortParagraph(sections['Educación'] || sections['Resumen'])
  }

  if (/contacto|email|portfolio|portafolio|web/i.test(q)) {
    return shortParagraph(sections['Contacto'] || sections['Resumen'])
  }

  // Si no coincide con keywords, devolver un resumen breve
  return shortParagraph(sections['Resumen'] || curriculum)
}

// Extrae secciones por títulos Markdown de forma simple
function extractSections(md: string) {
  const lines = md.split(/\r?\n/)
  const sections: Record<string, string> = {}
  let current = 'Resumen'
  sections[current] = ''
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.*)/)
    if (h2) {
      current = h2[1].trim()
      sections[current] = ''
      continue
    }
    sections[current] += (line + '\n')
  }
  return sections
}

// Devuelve 1-3 oraciones compactas
function shortParagraph(text?: string) {
  if (!text) return 'No hay información disponible.'
  // Limpiar y tomar primeras 2 líneas relevantes
  const cleaned = text.replace(/^#/gm, '').trim()
  const sentences = cleaned.split(/(?<=[\.\?\!])\s+/)
  const take = sentences.slice(0, 2).join(' ').trim()
  // Asegurar longitud breve
  if (take.length > 280) return take.slice(0, 277) + '...'
  return take
}

function fallbackMock(question: string) {
  if (/convenc/i.test(question) || /contrat/i.test(question) || /pitch/i.test(question)) {
    return 'Hola — soy Facundo. Tengo experiencia construyendo aplicaciones con Next.js y APIs robustas. Puedo liderar tu proyecto desde la arquitectura hasta el despliegue.'
  }
  if (/cv|curricul|resum/i.test(question)) {
    return 'Podés ver mi CV completo en mi portfolio: https://facundouferer.ar'
  }
  return '¡Hola! Soy Facundo, un desarrollador con ganas de unirme a tu equipo. Preguntame lo que quieras.'
}

// Reformula el texto para que suene persuasivo y breve
function makePersuasive(text: string) {
  const t = text.trim()
  // Frases que refuercen la experiencia y llamado a la acción
  const reinforcement = ' Tengo la experiencia y el compromiso para lograrlo.'
  let out = t
  // Si ya es corto, solo añadir una frase persuasiva si hay espacio
  if (out.length + reinforcement.length <= 280) out = out + reinforcement
  // Si es muy largo, acortamos y añadimos mensaje de cierre corto
  if (out.length > 280) {
    const short = out.slice(0, 240).trim()
    out = short + '... Puedo empezar ya y asegurar entrega de calidad.'
  }
  // Asegurar no pasar 280 caracteres
  if (out.length > 280) out = out.slice(0, 277) + '...'
  return out
}

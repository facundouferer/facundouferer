import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const curriculumPath = path.join(process.cwd(), 'src', 'data', 'curriculum.md')
    const text = fs.readFileSync(curriculumPath, 'utf8')
    return NextResponse.json({ success: true, data: { text } })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'No se puede leer el CV' }, { status: 500 })
  }
}

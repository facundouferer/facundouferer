import { NextRequest, NextResponse } from 'next/server'
import { conectionDB } from '@/libs/mongodb'
import VariablesEconomicas from '@/models/variablesEconomicas'

// Función para validar API Key
function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '')
  const validApiKey = process.env.NEXT_PUBLIC_API_KEY || process.env.API_SECRET_KEY

  return apiKey === validApiKey
}

// Función para respuesta de error de autenticación
function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error: 'API Key requerida. Incluye x-api-key en los headers o Authorization: Bearer <api-key>'
    },
    { status: 401 }
  )
}

// Función para validar datos de variables económicas
function validateEconomicData(data: Record<string, unknown>) {
  const errors: string[] = []

  const requiredFields = [
    'riesgoPais',
    'valorDolar',
    'ipc',
    'reservasBCRA',
    'tasaDeInteresBCRA',
    'actosDeCorrupcionFamosos'
  ]

  // Verificar que todos los campos requeridos estén presentes
  for (const field of requiredFields) {
    if (!(field in data)) {
      errors.push(`Campo requerido: ${field}`)
    } else if (typeof data[field] !== 'number') {
      errors.push(`${field} debe ser un número`)
    }
  }

  // Validaciones específicas
  if (typeof data.riesgoPais === 'number' && data.riesgoPais < 0) {
    errors.push('riesgoPais debe ser mayor o igual a 0')
  }

  if (typeof data.valorDolar === 'number' && data.valorDolar < 0) {
    errors.push('valorDolar debe ser mayor o igual a 0')
  }

  if (typeof data.tasaDeInteresBCRA === 'number' && data.tasaDeInteresBCRA < 0) {
    errors.push('tasaDeInteresBCRA debe ser mayor o igual a 0')
  }

  if (typeof data.actosDeCorrupcionFamosos === 'number' && data.actosDeCorrupcionFamosos < 0) {
    errors.push('actosDeCorrupcionFamosos debe ser mayor o igual a 0')
  }

  return errors
}

export async function GET() {
  try {
    await conectionDB()

    // Obtener las últimas variables económicas
    const variables = await VariablesEconomicas.findOne().sort({ updatedAt: -1 })

    if (!variables) {
      // Si no existen, crear con valores por defecto
      const defaultVariables = await VariablesEconomicas.create({
        riesgoPais: 0,
        valorDolar: 0,
        ipc: 0,
        reservasBCRA: 0,
        tasaDeInteresBCRA: 0,
        actosDeCorrupcionFamosos: 0
      })

      return NextResponse.json({
        success: true,
        data: {
          riesgoPais: defaultVariables.riesgoPais,
          valorDolar: defaultVariables.valorDolar,
          ipc: defaultVariables.ipc,
          reservasBCRA: defaultVariables.reservasBCRA,
          tasaDeInteresBCRA: defaultVariables.tasaDeInteresBCRA,
          actosDeCorrupcionFamosos: defaultVariables.actosDeCorrupcionFamosos,
          updatedAt: defaultVariables.updatedAt
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        riesgoPais: variables.riesgoPais,
        valorDolar: variables.valorDolar,
        ipc: variables.ipc,
        reservasBCRA: variables.reservasBCRA,
        tasaDeInteresBCRA: variables.tasaDeInteresBCRA,
        actosDeCorrupcionFamosos: variables.actosDeCorrupcionFamosos,
        updatedAt: variables.updatedAt
      }
    })
  } catch (error) {
    console.error('❌ Error getting variables económicas:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener las variables económicas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Validar API Key para operaciones de escritura
  if (!validateApiKey(request)) {
    return unauthorizedResponse()
  }

  try {
    await conectionDB()

    const body = await request.json()
    console.log('📊 Datos recibidos para variables económicas:', body)

    // Validar datos
    const validationErrors = validateEconomicData(body)
    if (validationErrors.length > 0) {
      console.error('❌ Errores de validación:', validationErrors)
      return NextResponse.json(
        {
          success: false,
          error: 'Datos inválidos',
          details: validationErrors
        },
        { status: 400 }
      )
    }

    // Extraer datos validados
    const {
      riesgoPais,
      valorDolar,
      ipc,
      reservasBCRA,
      tasaDeInteresBCRA,
      actosDeCorrupcionFamosos
    } = body

    // Crear nuevo registro con las variables económicas
    const variables = await VariablesEconomicas.create({
      riesgoPais,
      valorDolar,
      ipc,
      reservasBCRA,
      tasaDeInteresBCRA,
      actosDeCorrupcionFamosos
    })

    console.log('✅ Variables económicas actualizadas correctamente:', variables)

    return NextResponse.json({
      success: true,
      data: {
        riesgoPais: variables.riesgoPais,
        valorDolar: variables.valorDolar,
        ipc: variables.ipc,
        reservasBCRA: variables.reservasBCRA,
        tasaDeInteresBCRA: variables.tasaDeInteresBCRA,
        actosDeCorrupcionFamosos: variables.actosDeCorrupcionFamosos,
        updatedAt: variables.updatedAt
      },
      message: 'Variables económicas actualizadas correctamente'
    })
  } catch (error) {
    console.error('💥 Error updating variables económicas:', error)
    console.error('🔍 Stack trace:', error instanceof Error ? error.stack : 'No disponible')
    return NextResponse.json(
      { success: false, error: 'Error al actualizar las variables económicas' },
      { status: 500 }
    )
  }
}
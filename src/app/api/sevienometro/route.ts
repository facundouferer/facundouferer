import { NextRequest, NextResponse } from 'next/server'
import { conectionDB } from '@/libs/mongodb'
import Sevienometro from '@/models/sevienometro'

export async function GET() {
  try {
    await conectionDB()

    // Intentar obtener configuración existente
    let config = await Sevienometro.findOne()

    if (!config) {
      // Si no existe, crear con la hora actual del sistema
      const now = new Date()
      config = await Sevienometro.create({
        hour: now.getHours() % 12 || 12,
        minute: now.getMinutes(),
        second: now.getSeconds()
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        hour: config.hour,
        minute: config.minute,
        second: config.second
      }
    })
  } catch (error) {
    console.error('Error getting sevienometro config:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener la configuración del sevienómetro' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await conectionDB()

    const { hour, minute, second } = await request.json()

    // Validaciones
    if (typeof hour !== 'number' || hour < 1 || hour > 12) {
      return NextResponse.json(
        { success: false, error: 'La hora debe ser un número entre 1 y 12' },
        { status: 400 }
      )
    }

    if (typeof minute !== 'number' || minute < 0 || minute > 59) {
      return NextResponse.json(
        { success: false, error: 'Los minutos deben ser un número entre 0 y 59' },
        { status: 400 }
      )
    }

    const secondValue = typeof second === 'number' ? second : 0
    if (secondValue < 0 || secondValue > 59) {
      return NextResponse.json(
        { success: false, error: 'Los segundos deben ser un número entre 0 y 59' },
        { status: 400 }
      )
    }

    // Buscar configuración existente o crear nueva
    let config = await Sevienometro.findOne()

    if (!config) {
      config = await Sevienometro.create({ hour, minute, second: secondValue })
    } else {
      config.hour = hour
      config.minute = minute
      config.second = secondValue
      await config.save()
    }

    return NextResponse.json({
      success: true,
      data: {
        hour: config.hour,
        minute: config.minute,
        second: config.second
      },
      message: 'Hora del sevienómetro actualizada correctamente'
    })
  } catch (error) {
    console.error('Error updating sevienometro config:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la configuración del sevienómetro' },
      { status: 500 }
    )
  }
}
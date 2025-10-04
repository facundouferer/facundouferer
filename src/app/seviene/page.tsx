'use client'

import { useState, useEffect } from 'react'
import { CSSProperties } from 'react'

interface SevienometroTime {
  hour: number
  minute: number
  second: number
}

export default function SeViene() {
  const [sevienometroTime, setSevienometroTime] = useState<SevienometroTime | null>(null)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const numbers = Array.from({ length: 12 }, (_, i) => i + 1)

  // Cargar hora del sevienómetro desde la API
  useEffect(() => {
    setMounted(true)
    fetchSevienometroTime()
  }, [])

  const fetchSevienometroTime = async () => {
    try {
      const response = await fetch('/api/sevienometro')
      const result = await response.json()

      if (result.success) {
        setSevienometroTime(result.data)
        setError(null)
      } else {
        setError('Error al cargar la hora del sevienómetro')
        // Fallback a hora actual del sistema
        const now = new Date()
        setSevienometroTime({
          hour: now.getHours() % 12 || 12,
          minute: now.getMinutes(),
          second: now.getSeconds()
        })
      }
    } catch (error) {
      console.error('Error fetching sevienometro time:', error)
      setError('Error de conexión')
      // Fallback a hora actual del sistema
      const now = new Date()
      setSevienometroTime({
        hour: now.getHours() % 12 || 12,
        minute: now.getMinutes(),
        second: now.getSeconds()
      })
    }
  }

  // Calcular ángulos de las manecillas
  const getHandAngles = () => {
    if (!sevienometroTime) {
      return { hour: 0, minute: 0, second: 0 }
    }

    return {
      hour: (sevienometroTime.hour * 30) + (sevienometroTime.minute * 0.5), // 30° por hora + minutos
      minute: sevienometroTime.minute * 6, // 6° por minuto
      second: sevienometroTime.second * 6  // 6° por segundo
    }
  }

  const angles = getHandAngles()

  // No renderizar hasta que esté montado en el cliente
  if (!mounted || !sevienometroTime) {
    return (
      <div className="containterWatch">
        <h1>Se Vienómetro</h1>
        <div className="clock">
          {numbers.map(num => (
            <label key={num} style={{ '--i': num } as CSSProperties}>
              <span>{num}</span>
            </label>
          ))}
          <div className="idicator">
            <div className="hand hour"></div>
            <div className="hand minute"></div>
            <div className="hand second"></div>
          </div>
        </div>
        <div className="digital-display">
          <span>Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="containterWatch">
      <h1>Se Vienómetro</h1>

      {/* Reloj */}
      <div className="clock">
        {numbers.map(num => (
          <label key={num} style={{ '--i': num } as CSSProperties}>
            <span>{num}</span>
          </label>
        ))}

        <div className="idicator">
          <div
            className="hand hour"
            style={{ transform: `rotate(${angles.hour}deg)` }}
          ></div>
          <div
            className="hand minute"
            style={{ transform: `rotate(${angles.minute}deg)` }}
          ></div>
          <div
            className="hand second"
            style={{ transform: `rotate(${angles.second}deg)` }}
          ></div>
        </div>
      </div>

      {/* Display digital */}
      <div className="digital-display">
        <span>
          {sevienometroTime.hour}:{sevienometroTime.minute.toString().padStart(2, '0')}:{sevienometroTime.second.toString().padStart(2, '0')}
        </span>
        {error && (
          <div style={{ color: '#ff6b6b', fontSize: '14px', marginTop: '10px' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
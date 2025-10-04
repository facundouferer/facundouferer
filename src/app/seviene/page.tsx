'use client'

import { useState, useEffect } from 'react'
import { CSSProperties } from 'react'

export default function SeViene() {
  const [currentTime, setCurrentTime] = useState({ hour: 12, minute: 0, second: 0 })

  const numbers = Array.from({ length: 12 }, (_, i) => i + 1)

  // Actualizar hora actual del sistema
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date()
      setCurrentTime({
        hour: now.getHours() % 12 || 12,
        minute: now.getMinutes(),
        second: now.getSeconds()
      })
    }

    updateCurrentTime()
    const interval = setInterval(updateCurrentTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Calcular ángulos de las manecillas
  const getHandAngles = () => {
    return {
      hour: (currentTime.hour * 30) + (currentTime.minute * 0.5), // 30° por hora + minutos
      minute: currentTime.minute * 6, // 6° por minuto
      second: currentTime.second * 6  // 6° por segundo
    }
  }

  const angles = getHandAngles()

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
          {currentTime.hour}:{currentTime.minute.toString().padStart(2, '0')}:{currentTime.second.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
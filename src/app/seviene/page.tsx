'use client'

import { useState, useEffect } from 'react'
import { CSSProperties } from 'react'
import Bajada from './Bajada'
import VariablesEconomicas from './VariablesEconomicas'

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

  // JSON-LD para datos estructurados
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Sevienómetro",
    "description": "Oráculo de tiempo argentino que mide las pulsaciones del destino colectivo",
    "url": "https://facundouferer.com/seviene",
    "author": {
      "@type": "Person",
      "name": "Facundo Uferer",
      "url": "https://facundouferer.com"
    },
    "creator": {
      "@type": "Person",
      "name": "Tomás Rebord"
    },
    "applicationCategory": "Entertainment",
    "operatingSystem": "Web",
    "image": "https://facundouferer.com/img/sevienometro.png",
    "dateCreated": "2024",
    "keywords": "sevienómetro, se viene, argentina, oráculo, tiempo, destino colectivo",
    "inLanguage": "es-AR",
    "isAccessibleForFree": true
  }

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

  // No renderizar hasta que esté montado en el cliente y tengamos datos
  if (!mounted || !sevienometroTime) {
    return (
      <div className='flex justify-center items-center min-h-screen p-4'>
        <div className='text-center'>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold animate-pulse">
            Analizando la situación del país
          </h1>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* JSON-LD para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className='flex flex-col lg:flex-row gap-8 lg:p-8 max-w-7xl mx-auto pl-5 pr-5 pb-10'>
        <div className="containterWatch w-full lg:w-1/2 flex-shrink-0">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4">SEVIENÓMETRO</h1>
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
          <div className="mx-auto bg-white p-5 rounded-2xl shadow-md text-black">
            <VariablesEconomicas />
          </div>
        </div>
        <div className='w-full lg:w-1/2 lg:ml-5 text-justify text-sm sm:text-base lg:text-lg leading-relaxed text-black bg-white p-5 rounded-2xl shadow-md'>
          <Bajada />
        </div>
      </div>
    </>
  )
}
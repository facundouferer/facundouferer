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
      console.log('🕐 Iniciando carga de hora del sevienómetro...')
      const response = await fetch('/api/sevienometro')
      const result = await response.json()

      if (result.success) {
        console.log('✅ Hora del sevienómetro cargada exitosamente:', result.data)
        setSevienometroTime(result.data)
        setError(null)
      } else {
        const errorMessage = 'Error al cargar la hora del sevienómetro'
        console.error('❌ Error en respuesta de API:', result)
        console.error('📋 Detalle del error:', result.error || 'No se especificó error')
        setError(errorMessage)

        // Fallback a hora actual del sistema
        const now = new Date()
        const fallbackTime = {
          hour: now.getHours() % 12 || 12,
          minute: now.getMinutes(),
          second: now.getSeconds()
        }
        console.warn('🔄 Usando hora del sistema como respaldo:', fallbackTime)
        setSevienometroTime(fallbackTime)
      }
    } catch (error) {
      const errorMessage = 'Error de conexión'
      console.error('💥 Error crítico al conectar con API sevienómetro:', error)
      console.error('🔍 Stack trace:', error instanceof Error ? error.stack : 'No disponible')
      console.error('📊 Tipo de error:', error instanceof Error ? error.name : typeof error)
      setError(errorMessage)

      // Fallback a hora actual del sistema
      const now = new Date()
      const fallbackTime = {
        hour: now.getHours() % 12 || 12,
        minute: now.getMinutes(),
        second: now.getSeconds()
      }
      console.warn('🔄 Usando hora del sistema como respaldo debido a error de conexión:', fallbackTime)
      setSevienometroTime(fallbackTime)
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
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="font-medium">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
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
        {/* Mostrar error si existe */}
        {error && (
          <div className="w-full mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Error: {error}</span>
            </div>
            <p className="mt-1 text-sm">Se está utilizando la hora del sistema como respaldo.</p>
          </div>
        )}

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
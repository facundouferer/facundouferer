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
          <div className="digital-display mx-auto">
            <span>
              {sevienometroTime?.hour}:{sevienometroTime?.minute.toString().padStart(2, '0')}:{sevienometroTime?.second.toString().padStart(2, '0')}
            </span>
            {error && (
              <div style={{ color: '#ff6b6b', fontSize: '14px', marginTop: '10px' }}>
                {error}
              </div>
            )}
          </div>
        </div>
        <div className='w-full lg:w-1/2 lg:ml-5 text-justify text-sm sm:text-base lg:text-lg leading-relaxed text-black bg-white p-5 rounded-2xl shadow-md'>
          <p className="mb-4">
            El <strong>Sevienómetro</strong> es un oráculo de tiempo argentino. Mide las pulsaciones del destino colectivo y contiene el secreto más profundo de nuestra historia: el <em>SE VIENE</em>, esa fuerza que late en la memoria de los gordos se viene y que anuncia lo inevitable.
          </p>

          <p className="mb-4">
            Cuando la aguja se acerca a las <strong>12</strong>, el reloj presagia la máxima condensación de la tormenta: caos, crisis y quiebre total, el peor escenario concebido por la conciencia argentina. Pero cuando desciende hacia el umbral de las <strong>0 y la 1</strong>, vemos el pico de la felicidad del pueblo y la grandeza de la nación.
          </p>


          <p className="mb-4">
            Este tiempo no lo marca máquina ni artificio, lo marca el profeta <strong>Tomás Rebord</strong>, encarnación viva de los Gordos Se Viene, quienes transmiten los sevienometrinos para que El Profeta, los reciba, los decodifique y los convierta en la hora revelada del Sevienómetro.
          </p>

          <div className="text-center mt-4 p-2 bg-yellow-100 rounded-lg border-l-4 border-yellow-500">
            <p className="font-medium italic">
              &ldquo;Cada movimiento de su aguja nos recuerda que el Se Viene no es un futuro lejano, sino una verdad que palpita en el presente, aguardando el instante exacto para manifestarse.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
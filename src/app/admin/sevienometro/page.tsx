'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface SevienometroConfig {
  hour: number
  minute: number
  second: number
}

export default function SevienometroAdmin() {
  const [config, setConfig] = useState<SevienometroConfig>({ hour: 12, minute: 0, second: 0 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  // Cargar configuración actual
  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/sevienometro')
      const result = await response.json()

      if (result.success) {
        setConfig(result.data)
      } else {
        setMessage(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error loading config:', error)
      setMessage('Error al cargar la configuración')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/sevienometro', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
        },
        body: JSON.stringify(config)
      })

      const result = await response.json()

      if (result.success) {
        setMessage('✅ Hora del sevienómetro actualizada correctamente')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error saving config:', error)
      setMessage('❌ Error al guardar la configuración')
    } finally {
      setSaving(false)
    }
  }

  const setCurrentTime = () => {
    const now = new Date()
    setConfig({
      hour: now.getHours() % 12 || 12,
      minute: now.getMinutes(),
      second: now.getSeconds()
    })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-5 font-sans">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Configuración del Sevienómetro</h1>
        <p className="text-gray-600">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-5 font-sans">
      <div className="flex items-center gap-5 mb-8">
        <button
          onClick={() => router.back()}
          className="px-5 py-2.5 bg-gray-600 text-white border-none rounded-md cursor-pointer text-sm hover:bg-gray-700 transition-colors"
        >
          ← Volver
        </button>
        <h1 className="text-3xl font-bold text-gray-800">⏰ Configuración del Sevienómetro</h1>
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Establecer Hora del Reloj</h2>
          <p className="text-gray-600 mb-6">Configura la hora que mostrará el sevienómetro</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="hour" className="font-bold text-gray-700 text-sm">
                  Hora (1-12):
                </label>
                <select
                  id="hour"
                  value={config.hour}
                  onChange={(e) => setConfig({ ...config, hour: Number(e.target.value) })}
                  required
                  className="p-3 border-2 border-gray-300 rounded-lg text-base text-blue-900 bg-white focus:border-blue-500 focus:outline-none transition-colors"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="minute" className="font-bold text-gray-700 text-sm">
                  Minutos (0-59):
                </label>
                <select
                  id="minute"
                  value={config.minute}
                  onChange={(e) => setConfig({ ...config, minute: Number(e.target.value) })}
                  required
                  className="p-3 border-2 border-gray-300 rounded-lg text-base text-blue-900 bg-white focus:border-blue-500 focus:outline-none transition-colors"
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="second" className="font-bold text-gray-700 text-sm">
                  Segundos (0-59):
                </label>
                <select
                  id="second"
                  value={config.second}
                  onChange={(e) => setConfig({ ...config, second: Number(e.target.value) })}
                  required
                  className="p-3 border-2 border-gray-300 rounded-lg text-blue-900 text-base bg-white focus:border-blue-500 focus:outline-none transition-colors"
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={setCurrentTime}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white border-none rounded-lg text-base font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                🕐 Usar Hora Actual
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white border-none rounded-lg text-base font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {saving ? 'Guardando...' : '💾 Guardar Configuración'}
              </button>
            </div>
          </form>

          {message && (
            <div className={`mt-5 p-4 rounded-lg font-bold text-center ${message.includes('Error')
              ? 'bg-red-100 text-red-800 border border-red-300'
              : 'bg-green-100 text-green-800 border border-green-300'
              }`}>
              {message}
            </div>
          )}

          <div className="mt-8 text-center p-5 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-bold text-gray-700 mb-3">Vista Previa:</h3>
            <div className="font-mono text-4xl font-bold text-blue-600">
              {config.hour}:{config.minute.toString().padStart(2, '0')}:{config.second.toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-700 mb-4">ℹ️ Información</h3>
          <ul className="list-none p-0 space-y-3">
            <li className="pb-2 border-b border-gray-300 text-gray-600 text-sm">
              Esta configuración establece la hora que mostrará el sevienómetro
            </li>
            <li className="pb-2 border-b border-gray-300 text-gray-600 text-sm">
              El reloj mostrará esta hora fija, no se actualizará automáticamente
            </li>
            <li className="pb-2 border-b border-gray-300 text-gray-600 text-sm">
              Usa el formato de 12 horas (1-12)
            </li>
            <li className="text-gray-600 text-sm">
              Los cambios se aplican inmediatamente
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
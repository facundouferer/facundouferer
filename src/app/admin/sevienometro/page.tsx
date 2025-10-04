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
      <div className="admin-container">
        <h1>Configuración del Sevienómetro</h1>
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <button
          onClick={() => router.back()}
          className="back-button"
        >
          ← Volver
        </button>
        <h1>⏰ Configuración del Sevienómetro</h1>
      </div>

      <div className="sevienometro-admin">
        <div className="config-card">
          <h2>Establecer Hora del Reloj</h2>
          <p>Configura la hora que mostrará el sevienómetro</p>

          <form onSubmit={handleSubmit} className="config-form">
            <div className="time-inputs">
              <div className="input-group">
                <label htmlFor="hour">Hora (1-12):</label>
                <select
                  id="hour"
                  value={config.hour}
                  onChange={(e) => setConfig({ ...config, hour: Number(e.target.value) })}
                  required
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="minute">Minutos (0-59):</label>
                <select
                  id="minute"
                  value={config.minute}
                  onChange={(e) => setConfig({ ...config, minute: Number(e.target.value) })}
                  required
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="second">Segundos (0-59):</label>
                <select
                  id="second"
                  value={config.second}
                  onChange={(e) => setConfig({ ...config, second: Number(e.target.value) })}
                  required
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="button-group">
              <button
                type="button"
                onClick={setCurrentTime}
                className="secondary-button"
              >
                🕐 Usar Hora Actual
              </button>

              <button
                type="submit"
                disabled={saving}
                className="primary-button"
              >
                {saving ? 'Guardando...' : '💾 Guardar Configuración'}
              </button>
            </div>
          </form>

          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <div className="preview">
            <h3>Vista Previa:</h3>
            <div className="time-display">
              {config.hour}:{config.minute.toString().padStart(2, '0')}:{config.second.toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3>ℹ️ Información</h3>
          <ul>
            <li>Esta configuración establece la hora que mostrará el sevienómetro</li>
            <li>El reloj mostrará esta hora fija, no se actualizará automáticamente</li>
            <li>Usa el formato de 12 horas (1-12)</li>
            <li>Los cambios se aplican inmediatamente</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .admin-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .admin-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .back-button {
          padding: 10px 20px;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }

        .back-button:hover {
          background: #5a6268;
        }

        .sevienometro-admin {
          display: grid;
          gap: 30px;
          grid-template-columns: 2fr 1fr;
        }

        .config-card, .info-card {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          border: 1px solid #ddd;
        }

        .config-card h2 {
          color: #333;
          margin-bottom: 10px;
        }

        .config-form {
          margin-top: 20px;
        }

        .time-inputs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-weight: bold;
          color: #555;
          font-size: 14px;
        }

        .input-group select {
          padding: 10px;
          border: 2px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
          background: white;
        }

        .input-group select:focus {
          border-color: #007bff;
          outline: none;
        }

        .button-group {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .primary-button, .secondary-button {
          padding: 12px 24px;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .primary-button {
          background: linear-gradient(45deg, #007bff, #0056b3);
          color: white;
        }

        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,123,255,0.3);
        }

        .primary-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .secondary-button {
          background: linear-gradient(45deg, #6c757d, #495057);
          color: white;
        }

        .secondary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(108,117,125,0.3);
        }

        .message {
          margin-top: 20px;
          padding: 15px;
          border-radius: 5px;
          font-weight: bold;
          text-align: center;
        }

        .message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .preview {
          margin-top: 30px;
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 5px;
        }

        .time-display {
          font-family: 'Courier New', monospace;
          font-size: 36px;
          font-weight: bold;
          color: #007bff;
          margin-top: 10px;
        }

        .info-card {
          background: #f8f9fa;
        }

        .info-card h3 {
          color: #495057;
          margin-bottom: 15px;
        }

        .info-card ul {
          list-style: none;
          padding: 0;
        }

        .info-card li {
          padding: 8px 0;
          border-bottom: 1px solid #dee2e6;
          color: #6c757d;
        }

        .info-card li:last-child {
          border-bottom: none;
        }

        @media (max-width: 768px) {
          .sevienometro-admin {
            grid-template-columns: 1fr;
          }
          
          .time-inputs {
            grid-template-columns: 1fr;
          }
          
          .button-group {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
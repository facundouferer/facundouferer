'use client'

import { useState, useEffect } from 'react'

interface VariablesEconomicasData {
  riesgoPais: number
  valorDolar: number
  ipc: number
  reservasBCRA: number
  tasaDeInteresBCRA: number
  actosDeCorrupcionFamosos: number
  updatedAt: string
}

export default function VariablesEconomicas() {
  const [variables, setVariables] = useState<VariablesEconomicasData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchVariablesEconomicas()
  }, [])

  const fetchVariablesEconomicas = async () => {
    try {
      console.log('📊 Cargando variables económicas...')
      const response = await fetch('/api/variables-economicas')
      const result = await response.json()

      if (result.success) {
        console.log('✅ Variables económicas cargadas:', result.data)
        setVariables(result.data)
        setError(null)
      } else {
        console.error('❌ Error en respuesta de API:', result.error)
        setError('Error al cargar las variables económicas')
      }
    } catch (error) {
      console.error('💥 Error al cargar variables económicas:', error)
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(num)
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-pulse">
          <div className="text-sm text-gray-600">Cargando variables económicas...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <div className="text-red-600 text-sm mb-2">⚠️ {error}</div>
        <button
          onClick={fetchVariablesEconomicas}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (!variables) {
    return (
      <div className="text-center py-4">
        <div className="text-gray-600 text-sm">No hay datos disponibles</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-center text-lg mb-4">Variables Económicas</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="font-semibold text-red-600">Riesgo País</div>
          <div className="text-lg font-bold">{formatNumber(variables.riesgoPais)} pb</div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="font-semibold text-green-600">Valor Dólar</div>
          <div className="text-lg font-bold">{formatCurrency(variables.valorDolar)}</div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="font-semibold text-blue-600">IPC</div>
          <div className="text-lg font-bold">{formatNumber(variables.ipc)}%</div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="font-semibold text-purple-600">Reservas BCRA</div>
          <div className="text-lg font-bold">USD {formatNumber(variables.reservasBCRA)}M</div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="font-semibold text-orange-600">Tasa BCRA</div>
          <div className="text-lg font-bold">{formatNumber(variables.tasaDeInteresBCRA)}%</div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="font-semibold text-red-500">Actos Corrupción</div>
          <div className="text-lg font-bold">{variables.actosDeCorrupcionFamosos}</div>
        </div>
      </div>

      <div className="text-center mt-4 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Última actualización: {formatDate(variables.updatedAt)}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Variables tenidas en cuenta según lo que Rebord diga
        </div>
      </div>
    </div>
  )
}
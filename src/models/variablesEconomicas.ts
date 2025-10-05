import mongoose from 'mongoose'

export interface IVariablesEconomicas {
  _id?: string
  riesgoPais: number
  valorDolar: number
  ipc: number
  reservasBCRA: number
  tasaDeInteresBCRA: number
  actosDeCorrupcionFamosos: number
  updatedAt: Date
  createdAt: Date
}

const VariablesEconomicasSchema = new mongoose.Schema({
  riesgoPais: {
    type: Number,
    required: true,
    min: 0,
    description: 'Riesgo país en puntos básicos'
  },
  valorDolar: {
    type: Number,
    required: true,
    min: 0,
    description: 'Valor del dólar en pesos argentinos'
  },
  ipc: {
    type: Number,
    required: true,
    description: 'Índice de Precios al Consumidor (puede ser negativo)'
  },
  reservasBCRA: {
    type: Number,
    required: true,
    description: 'Reservas del Banco Central en millones de USD (puede ser negativo)'
  },
  tasaDeInteresBCRA: {
    type: Number,
    required: true,
    min: 0,
    description: 'Tasa de interés del BCRA en porcentaje'
  },
  actosDeCorrupcionFamosos: {
    type: Number,
    required: true,
    min: 0,
    description: 'Cantidad de actos de corrupción famosos registrados'
  }
}, {
  timestamps: true
})

const VariablesEconomicas = mongoose.models.VariablesEconomicas ||
  mongoose.model<IVariablesEconomicas>('VariablesEconomicas', VariablesEconomicasSchema)

export default VariablesEconomicas
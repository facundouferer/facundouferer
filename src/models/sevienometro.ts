import mongoose from 'mongoose'

export interface ISevienometro {
  _id?: string
  hour: number
  minute: number
  second: number
  updatedAt: Date
  createdAt: Date
}

const SevienometroSchema = new mongoose.Schema({
  hour: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
    default: 12
  },
  minute: {
    type: Number,
    required: true,
    min: 0,
    max: 59,
    default: 0
  },
  second: {
    type: Number,
    required: true,
    min: 0,
    max: 59,
    default: 0
  }
}, {
  timestamps: true
})

// Método estático para obtener o crear la configuración del sevienómetro
SevienometroSchema.statics.getOrCreateConfig = async function () {
  let config = await this.findOne()

  if (!config) {
    // Si no existe, crear con la hora actual del sistema
    const now = new Date()
    config = await this.create({
      hour: now.getHours() % 12 || 12,
      minute: now.getMinutes(),
      second: now.getSeconds()
    })
  }

  return config
}

// Método estático para actualizar la configuración
SevienometroSchema.statics.updateConfig = async function (hour: number, minute: number, second: number = 0) {
  let config = await this.findOne()

  if (!config) {
    config = await this.create({ hour, minute, second })
  } else {
    config.hour = hour
    config.minute = minute
    config.second = second
    await config.save()
  }

  return config
}

const Sevienometro = mongoose.models.Sevienometro || mongoose.model('Sevienometro', SevienometroSchema)

export default Sevienometro
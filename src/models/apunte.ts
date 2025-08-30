import mongoose from "mongoose";

export interface IApunte extends mongoose.Document {
  nroApunte: number;
  titulo: string;
  descripcion: string;
  imagen?: string;
  url: string;
  tags?: string[];
  categoria: string; // Referencia al nombre de la categoría
  createdAt?: Date;
  updatedAt?: Date;
}

const apunteSchema = new mongoose.Schema<IApunte>({
  nroApunte: {
    type: Number,
    required: [true, "El número de apunte es obligatorio."],
    min: [1, "El número de apunte debe ser mayor a 0."]
  },
  titulo: {
    type: String,
    required: [true, "El título es obligatorio."],
    trim: true,
    minlength: [3, "El título debe tener al menos 3 caracteres."],
    maxlength: [200, "El título no debe exceder los 200 caracteres."]
  },
  descripcion: {
    type: String,
    required: [true, "La descripción es obligatoria."],
    trim: true,
    maxlength: [1000, "La descripción no debe exceder los 1000 caracteres."]
  },
  imagen: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    required: [true, "La URL es obligatoria."],
    trim: true,
    validate: {
      validator: function (v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: "La URL debe ser válida (http:// o https://)"
    }
  },
  tags: {
    type: [String],
    default: [],
  },
  categoria: {
    type: String,
    required: [true, "La categoría es obligatoria."],
    trim: true,
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índice compuesto para asegurar unicidad del nroApunte dentro de cada categoría
apunteSchema.index({ categoria: 1, nroApunte: 1 }, { unique: true });
apunteSchema.index({ tags: 1 });
apunteSchema.index({ categoria: 1 });

const Apunte = mongoose.models.Apunte || mongoose.model<IApunte>("Apunte", apunteSchema);

export default Apunte;

import mongoose from "mongoose";

export interface ICategory extends mongoose.Document {
  nombre: string;
  descripcion: string;
  caratula?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new mongoose.Schema<ICategory>({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio."],
    trim: true,
    unique: true,
    minlength: [2, "El nombre debe tener al menos 2 caracteres."],
    maxlength: [100, "El nombre no debe exceder los 100 caracteres."]
  },
  descripcion: {
    type: String,
    required: [true, "La descripción es obligatoria."],
    trim: true,
    maxlength: [500, "La descripción no debe exceder los 500 caracteres."]
  },
  caratula: {
    type: String,
    trim: true,
  }
}, {
  timestamps: true,
  versionKey: false
});

const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);

export default Category;

import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name?: string;
  role: 'admin' | 'user';
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
}, {
  timestamps: true,
  versionKey: false
});

// No necesitamos crear el índice manualmente ya que unique: true lo crea automáticamente
// userSchema.index({ email: 1 }); // Comentado para evitar duplicados

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;

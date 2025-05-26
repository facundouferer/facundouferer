import mongoose from "mongoose";


export interface IPost extends mongoose.Document {
  title: string;
  slug: string;
  content: string;
  tags?: string[];
  featuredImage?: string;
}

const postSchema = new mongoose.Schema<IPost>({
  title: {
    type: String,
    required: [true, "El título es obligatorio."],
    trim: true,
    minlength: [3, "El título debe tener al menos 3 caracteres."],
    maxlength: [150, "El título no debe exceder los 150 caracteres."]
  },
  slug: {
    type: String,
    required: [true, "El slug es obligatorio."],
    unique: true,
    trim: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: [true, "El contenido es obligatorio."],
  },
  tags: {
    type: [String],
    default: [],
  },
  featuredImage: {
    type: String,
    trim: true,
  }
}, {
  timestamps: true,
  versionKey: false
});

postSchema.index({ tags: 1 });

const Post = mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;

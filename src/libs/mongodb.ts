import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function conectionDB() {
  console.log('MONGODB_URI:', process.env.MONGODB_URI);
  if (!MONGODB_URI) {
    console.error("Error: La variable de entorno MONGODB_URI no está definida.");
    return;
  }

  await mongoose.connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((error) => console.error(error));
}
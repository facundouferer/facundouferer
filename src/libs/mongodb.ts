import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Extender el tipo global para incluir mongoose
declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any
  var mongoose: any;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function conectionDB() {
  if (!MONGODB_URI) {
    console.error("Error: La variable de entorno MONGODB_URI no está definida.");
    throw new Error("MONGODB_URI is not defined");
  }

  if (cached.conn) {
    console.log("Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Connected to MongoDB Atlas");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
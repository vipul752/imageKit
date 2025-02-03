import mongoose from "mongoose";

const MONGO_URL = process.env.MONGODB_URL!;

if (!MONGO_URL) {
  throw new Error("MONGO_URL must be defined");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
      bufferCommands: true,
    };

    cached.promise = mongoose
      .connect(MONGO_URL, opts)
      .then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  return cached.conn;
}


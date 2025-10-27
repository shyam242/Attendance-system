import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("❌ Please define the MONGODB_URI in .env.local");
}

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    // Already connected
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is undefined — check Vercel ENV");
    }

    // ✅ Reuse existing connection (VERY IMPORTANT)
    if (mongoose.connections[0].readyState) {
      console.log("⚡ MongoDB already connected");
      return;
    }

    const conn = await mongoose.connect(uri, {
      dbName: "agrosense",
      bufferCommands: false,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);

    // ❌ DO NOT use process.exit in serverless
    throw error;
  }
};

export default connectDB;
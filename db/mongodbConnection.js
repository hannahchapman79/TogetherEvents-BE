const mongoose = require("mongoose");

const connectMongoDB = async () => {
  try {
    const uri = process.env.DATABASE_URI;
    if (!uri) {
      throw new Error("DATABASE_URI is not defined in environment variables");
    }
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectMongoDB;

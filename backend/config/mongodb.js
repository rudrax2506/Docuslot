import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI); // ✅ Clean, modern

    console.log("✅ MongoDB Connected");

    mongoose.connection.on("connected", () => {
      console.log("Connected to DB:", mongoose.connection.name);
    });

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;

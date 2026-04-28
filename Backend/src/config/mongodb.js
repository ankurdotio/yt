import mongoose from "mongoose";

const connectDB = async (url) => {
  const uri = url || process.env.MONGODB_URI; 
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }
  try {
    await mongoose.connect(uri);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
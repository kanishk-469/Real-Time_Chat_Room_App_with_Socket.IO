import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.DB_URL; // dotenv npm package used
// console.log(url);

export const connectToDatabaseUsingMongoose = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB is connected!!");
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong connecting using mongoose..!");
  }
};

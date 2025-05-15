import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Enter your name"],
  },
  room: {
    type: Number,
    required: [true, "Please type room number"],
    validate: {
      validator: (value) => Number.isInteger(value),
      message: "Room number must be an integer.",
    },
  },
  message: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const ChatModel = mongoose.model("Chat", chatSchema);

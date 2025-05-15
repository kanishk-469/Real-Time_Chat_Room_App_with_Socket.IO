// No need to change the pre-written code
// Implement the features in io.on() section
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connectToDatabaseUsingMongoose } from "./config.js";
import { ChatModel } from "./chat.schema.js";

export const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Connection made.");
  //   console.log(socket);
  socket.on("join", (userInfo) => {
    socket.userInfo = userInfo;
    socket.broadcast.emit("broadcast_user", userInfo);

    ///send old messages to the client { username: socket.userInfo.username }
    ChatModel.find()
      .sort({ timestamp: 1 })
      .limit(20)
      .then((oldMessages) => {
        socket.emit("load_old_messages", oldMessages);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  // Write your code here
  socket.on("new_message", (message) => {
    console.log(socket.userInfo);
    console.log(message);
    let userData = {
      username: socket.userInfo.username,
      room: socket.userInfo.room,
      message,
    };

    ///storing chat message to the MongoDB database using mongoose ODM Library
    const newChat = new ChatModel({
      username: socket.userInfo.username,
      room: socket.userInfo.room,
      message,
      timestamp: new Date().toLocaleString(),
    });
    newChat.save();

    socket.broadcast.emit("broadcast_message", userData);
  });

  socket.on("disconnect", () => {
    console.log("Connection disconnected.");
  });
});

server.listen(3000, () => {
  console.log("Listening on port 3000");
  connectToDatabaseUsingMongoose();
});

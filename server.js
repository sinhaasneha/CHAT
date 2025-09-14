const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public")); // serve index.html from /public

io.on("connection", (socket) => {
  console.log("A user connected");

  // default username (can be changed by client)
  socket.username = "Anonymous";

  // notify others
  socket.broadcast.emit("chatMessage", {
    system: true,
    text: "🔵 A user joined the chat",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  });

  // set username
  socket.on("setUsername", (username) => {
    socket.username = username;
  });

  // handle chat messages
  socket.on("chatMessage", (msg) => {
    const msgData = {
      user: socket.username,
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    io.emit("chatMessage", msgData);
  });

  // user disconnect
  socket.on("disconnect", () => {
    io.emit("chatMessage", {
      system: true,
      text: "🔴 A user left the chat",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });
  });
});

server.listen(4000, () => console.log("✅ Server running on http://localhost:4000"));

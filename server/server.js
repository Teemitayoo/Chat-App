const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 3000;
let app = express();

//for creating our server
let server = http.createServer(app);

let io = socketIO(server);

app.use(express.static(publicPath));

//listen to connection
io.on("connection", (socket) => {
  console.log("A new user just connected");

  socket.on("createMessage", (message) => {
    console.log("createMessage", message);
    io.emit("newMessage", {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    }); //broadcast to everyone connected
  });

  socket.on("disconnect", () => {
    console.log("User was disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

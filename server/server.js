const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const { generateMessage, generateLocationMessage } = require("./utils/message");
const { realString } = require("./utils/realstring");
const { callbackify } = require("util");

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

  socket.on("join", (params, callback) => {
    if (!realString(params.name) || !realString(params.room)) {
      callback("Input Name and room");
    }
    console.log(socket.id);
    socket.join("params.room"); //For different rooms
    socket.emit(
      "newMessage",
      generateMessage("Admin", `${params.name} Welcome to the ${params.room}`)
    );
    socket.broadcast.emit(
      "newMessage",
      generateMessage("Admin", "New User Joined")
    );
    callback();
  });

  socket.on("createMessage", (message, callback) => {
    console.log("createMessage", message);
    io.emit("newMessage", generateMessage(message.from, message.text));
    //broadcast to everyone connected
    callback("This is the server:");
  });

  socket.on("createLocation", (coords) => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.lat, coords.lng)
    );
  });

  socket.on("disconnect", () => {
    console.log("User was disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

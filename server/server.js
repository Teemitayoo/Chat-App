const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const { generateMessage, generateLocationMessage } = require("./utils/message");
const { realString } = require("./utils/realstring");
const { Users } = require("./utils/users");

const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 3000;
let app = express();

//for creating our server
let server = http.createServer(app);

let io = socketIO(server);
let users = new Users();
app.use(express.static(publicPath));

//listen to connection
io.on("connection", (socket) => {
  console.log("A new user just connected");

  socket.on("join", (params, callback) => {
    if (!realString(params.name) || !realString(params.room)) {
      return callback("Input Name and room");
    }

    socket.join(params.room); //For different rooms
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit("updateUsersList", users.getUserList(params.room));

    socket.emit(
      "newMessage",
      generateMessage("Admin", `${params.name} Welcome to ${params.room}`)
    );

    socket.broadcast
      .to(params.room)
      .emit("newMessage", generateMessage("Admin", "New User Joined"));
    callback();
  });

  socket.on("createMessage", (message, callback) => {
    let user = users.getUser(socket.id);

    if (user && realString(message.text)) {
      io.to(user.room).emit(
        "newMessage",
        generateMessage(user.name, message.text)
      );
    }
    callback("This is the server:");
  });

  socket.on("createLocation", (coords) => {
    let user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "newLocationMessage",
        generateLocationMessage(user.name, coords.lat, coords.lng)
      );
    }
  });

  socket.on("disconnect", () => {
    let user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("updateUsersList", users.getUserList(user.room));
      io.to(user.room).emit(
        "newMessage",
        generateMessage("Admin", `${user.name} left`)
      );
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

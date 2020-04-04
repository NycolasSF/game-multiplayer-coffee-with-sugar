const express = require('express');
const app = express()

const server = require('http').Server(app)
const io = require("socket.io")(server);

app.use(express.static("public"));

app.get("/", (req, res)=> {
  res.sendFile(__dirname + "/index.html");
});


io.on("connection", (socket)=> {
  console.log("Player connected :", socket.id);
  io.emit("first-add-player", {
    id: socket.id,
    name: "Nycolas",
    position: {
      x: Math.ceil(Math.random() * 600),
      y: 230
    },
    tam: {
      x: 30,
      y: 30
    }
  });
  socket.on("disconnect", (socket)=> {
    console.log("Player disconnected: ",socket.id);
    io.emit("remove-player", socket.id);
  });
});


server.listen(3001, () => console.log(`Connected in port 3001`));
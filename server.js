const express = require('express');
const app = express()

const server = require('http').Server(app)
const io = require("socket.io")(server);

const CreateConfig = require('./controller/CreateConfig')


app.use(express.static("public"));

app.get("/", (req, res)=> {
  res.sendFile(__dirname + "/view/index.html");
});

const game = new CreateConfig();

io.on("connection", (socket)=> {
  console.log("Player connected :", socket.id);
  socket.on('start-game', (namePlayer)=>{
    game.addPlayer(namePlayer, socket);
    game.addSugar();
    socket.emit('add-player', {getGame: game, idPlayer: socket.id})    
    socket.broadcast.emit('new-player', { getGame: game })
  });

  socket.on("disconnect", ()=> {
    console.log("Player disconnected: ", socket.id);
    game.removePlayer(socket.id);
    console.log("Game: ", game.gamePlayers);
    io.emit("remove-player", socket.id);
  });
});


setInterval(() => {
  io.emit('concurrent-connections', io.engine.clientsCount)
}, 5000)


server.listen(3001, () => console.log(`Connected in port 3001`));
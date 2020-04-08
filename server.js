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

    game.addPlayer(namePlayer, socket.id);

    socket.emit('add-player', { 
      getGame: {
        player: game.gamePlayers,
        sugar: game.gameSugars
      }, 
      idPlayer: socket.id
    });

    socket.broadcast.emit('new-player', { getGame: game });
    
    // ? SUGARs
    setInterval(() => {
      let addRandom = game.addSugarRandom();
      if (addRandom) return socket.emit('add-sugar', addRandom);
    }, 2500);

  });


  socket.on('removed-sugar', (idSugar)=>{
    game.removeSugar(idSugar);
  });



  socket.on("disconnect", ()=> {

    console.log("\n \n ");
    console.log("Player disconnected: ", socket.id);
    console.log("Object Players: ", game.gamePlayers);
    console.log("Object Sugars: ", game.gameSugars);
    console.log("\n \n ");

    game.removePlayer(socket.id);
    io.emit("remove-player", socket.id);

  });
});


setInterval(() => {
  io.emit('players-connected', io.engine.clientsCount)
}, 5000)


server.listen(3001, () => console.log(`Connected in port 3001`));
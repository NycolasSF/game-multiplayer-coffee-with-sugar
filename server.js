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

  // ? START GAME --> PLAYER ADD - ADD SUGARs
  socket.on('start-game', (namePlayer)=>{

    game.addPlayer(namePlayer, socket.id);

    socket.emit('add-player', { 
      getGame: {
        player: game.gamePlayers,
        sugar: game.gameSugars
      }, 
      idPlayer: socket.id
    });
    
    // ? Sugar random
    setInterval(() => {
      let sugarRandom = game.addSugarRandom();
      socket.emit('add-sugar', sugarRandom);
    }, 2000);    

    //  ? Emit new player
    socket.broadcast.emit('new-player', { player: game.gamePlayers[socket.id]});

  });

  // ? PLAYER(s)
  socket.on('key-listen', ({id, key})=>{
    let moved = game.movePlayer(id, key) 
    socket.emit('player-update', { id: id, playerMoved: moved});
    socket.broadcast.emit('players-update', { id: id, playerMoved: moved });
  });

  socket.on('check-player', ({idPlayer, idSugar})=>{
    console.log(`Player colided ${idPlayer} with ${idSugar}`);
    
    game.updateScorePlayer(idPlayer);
    game.removeSugar(idSugar);

    socket.emit('player-colided', { colidedIdPlayer: idPlayer, colidedIdSugar: idSugar});
    socket.broadcast.emit('player-collided-update', { colidedIdPlayer: idPlayer, colidedIdSugar: idSugar })

  });


  //  ? SUGAR(s)
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

server.listen(3001, () => console.log(`Connected in port 3001`));
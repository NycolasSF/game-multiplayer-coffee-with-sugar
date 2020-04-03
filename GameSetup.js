class GameSetup { // create and loop in gmae
    constructor(canvasId) {
        this.canvas = null;
        this.context = null;

        this.gamePlayers = [4];
        this.gameSugars = [];

        this.oldTimeStamp = 0;

        this.canvasId = canvasId; 
        this.startCanvas(this.canvasId);
    }

    startCanvas(canvasId) {
        console.info(">> Start game");
        
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');

        this.createGame();

        window.requestAnimationFrame((timeStamp) => { this.gameLoop(timeStamp) });
    }

    createGame() {
        console.info(">> Create game");

        this.gamePlayers = [
         new Players({
             id: '00',
             name: 'Nycolas',
             position: {
                 x: 50,
                 y: this.canvas.height - 30
             },
             tam: {
                 x: 30,
                 y: 30
             }
         }, this.canvasId),
         new Players({
             id: '01',
             name: 'Um cara ai',
             position: {
                 x: 250,
                 y: this.canvas.height - 30
             },
             tam: {
                 x: 30,
                 y: 30
             }
         }, this.canvasId)
       ];      

       this.gameSugars = [
           new Sugar({
               id: '0000',
               position: {
                   x: 50,
                   y: 0
               },
               tam: {
                   x: 15,
                   y: 15
               }
           }, this.canvasId)
       ]
    
    }

    gameLoop(timeStamp) {

        let secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
        this.oldTimeStamp = timeStamp;

        let fps = Math.round(1 / secondsPassed);
        document.getElementById('fps').innerHTML = `FPS: ${fps}`;


        this.clearCanvas();


        this.playerCollision(0)
        this.gamePlayers.forEach((game) => {
            game.update(secondsPassed);
            game.draw();
        });

        this.gameSugars.forEach((game) => {
            game.update(secondsPassed);
            game.draw();
        });

        window.requestAnimationFrame((timeStamp) => this.gameLoop(timeStamp));
    }
    
    // PLAYER
    addPlayer(player) {
        this.gamePlayers.push(new Players(player, this.canvasId))
    }    
    playerCollision(idPlayer){
        this.context.lineWidth = 5;
        let player = this.gamePlayers[idPlayer];
        player = {
            posX: Math.round(player.posX),
            posY: Math.round(player.posY),
        }        

        this.context.fillStyle = "#a638e5"
        this.context.fillRect(0, player.posY, 640, 10);

        this.gameSugars.forEach((sugar) => {
            sugar = {
                posX: Math.round(sugar.posX),
                posY: Math.round(sugar.posY),
            }
            this.context.fillStyle = "#14615d"
            this.context.fillRect(sugar.posX, sugar.posY, 10, 240);
            
            // let sugarX = this.context.isPointInPath()
            if (player.posX == sugar.posX && player.posY == sugar.posY){
                console.log(`Collided with: ${sugar.id}`);
                return this.removeSugar(sugar.id)
            }

        });
    }
    removePlayer(idPlayer) {
        if(idPlayer){
            let find = this.gamePlayers.findIndex(element => element.id === idPlayer)
            this.gamePlayers.splice(find, 1);       
        }
    }

    // SUGAR
    addSugar(sugar) {
        this.gameSugars.push(new Sugar(sugar, this.canvasId))
    }
    removeSugar(idSugar) {
        if (idSugar) {
            let find = this.gameSugars.findIndex(element => element.id === idSugar)
            this.gameSugars.splice(find, 1);
        }
    }

    clearCanvas() {

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);        
    }

}

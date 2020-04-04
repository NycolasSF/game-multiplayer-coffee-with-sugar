class GameSetup { // create and loop in gmae
    constructor(canvasId, idPlayer) {
        this.canvas = null;
        this.context = null;

        this.idPlayer = idPlayer;
        this.gamePlayers = {};
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

        localStorage.setItem('globalID', this.idPlayer);
        
    }

    gameLoop(timeStamp) {

        let secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
        this.oldTimeStamp = timeStamp;

        let fps = Math.round(1 / secondsPassed);
        document.getElementById('fps').innerHTML = `FPS: ${fps}`;

        //end-script 
        this.clearCanvas();

        this.playerCollision();
        for (const idPlayer in this.gamePlayers){
           const player = this.gamePlayers[idPlayer];            
           player.update(secondsPassed);
           player.draw();
           this.drawPoints(player)
        }
        
        this.gameSugars.forEach((game) => {
            game.update(secondsPassed);
            game.draw();
        });

        window.requestAnimationFrame((timeStamp) => this.gameLoop(timeStamp));
    }

    // PLAYER
    playerCollision(){

        let player = this.gamePlayers[this.idPlayer];         

        this.gameSugars.forEach((sugar) => {
            sugar = { ... sugar,
                x: Math.round(sugar.posX),
                y: Math.round(sugar.posY),
            }
            
            // let sugarX = this.context.isPointInPath()
            if (player.posX < sugar.x + sugar.width &&
                player.posX + player.width + 10 > sugar.x &&
                player.posY < sugar.y + sugar.height &&
                player.posY + player.height > sugar.y) {

                player.score += 1;
               
                return this.removeSugar(sugar.id)
            }

        });
    }

    addPlayer(player) {
        if(player){
            this.gamePlayers[player.id] =  new Player(player, this.canvasId)
        }
    }    


    removePlayer(idPlayer) {
        if(idPlayer){
            delete this.gamePlayers[idPlayer]
        }
    }

    drawPoints(player) {
        let table = document.getElementById('points');

        table.innerHTML = ` 
            <tr>
                <td>${player.name}</td>
                <td>${player.score}</td>
            </tr>
            `

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
    
    addSugarRandom() {
        if(this.gameSugars.length < 5){
            let numberRandom = Math.ceil(Math.random() * 640)
            let randomX = numberRandom <= 600 ? numberRandom : numberRandom / 2;
            
            console.log(`Add new sugar in x: ${randomX}`);
            this.addSugar({
                id: `${Math.ceil(Math.random() * 1024)}`,
                position: {
                    x: randomX,
                    y: 0
                },
                tam: {
                    x: 15,
                    y: 15
                }
            })
            return;
        }
        console.log('Hit max sugars');
        
        return 0;
    }


    //canvas
    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);        
    }

}

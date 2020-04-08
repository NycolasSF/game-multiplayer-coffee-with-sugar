function GameSetup(canvasId) { // create and loop in gmae
    let canvas = null;
    let context = null;

    let gamePlayers = {};
    let gameSugars = [];

    let oldTimeStamp = 0;

    let idPlayer = undefined;

    function prevUpdate(objectsGame) {
        console.info(">> Start game");
        
        canvas = document.getElementById(canvasId);
        context = canvas.getContext('2d');
        
        addPlayers(objectsGame.player);
        addSugars(objectsGame.sugar);
        
        
        console.info(">> Start gameLoop");    
        return window.requestAnimationFrame((timeStamp) => { gameLoop(timeStamp) });
    }

    function gameLoop(timeStamp) {

        let secondsPassed = (timeStamp - oldTimeStamp) / 1000;
        oldTimeStamp = timeStamp;

        clearCanvas();  

        playersScore();
        
        for (const idPlayer in gamePlayers){
            const player = gamePlayers[idPlayer]; 
            playerCollision(idPlayer)
            player.update(0.02);
            player.draw();
        }
        
        gameSugars.forEach((sugar) => {
            sugar.update(0.02);
            sugar.draw(secondsPassed);
        });

        window.requestAnimationFrame((timeStamp) => gameLoop(timeStamp));
    }

    // ? OBJ --> PLAYERS
    function setPlayer(getIdPlayer) {
        if (getIdPlayer) {
            localStorage.setItem('globalID', getIdPlayer);
            idPlayer = getIdPlayer;
        }
    }

    function addPlayers(objectsPlayers) {
        
        for (const idPlayer in objectsPlayers) {
            const player = objectsPlayers[idPlayer]
            gamePlayers[idPlayer] = new Player(player, canvasId)
        }
        
    }

    function removePlayer(idPlayer) {
        console.log(`Player removed: ${gamePlayers[idPlayer].name}`);
        if (idPlayer) {
            delete gamePlayers[idPlayer]
        }
    }

    function playersScore() {
        let points = document.getElementById('points');
        let score = [];


        points.innerHTML = `
            <tr>
                <th>Players</th>
                <th>Points</th>
            </tr>
        `

        for (const id in gamePlayers) {
            const player = {
                name: gamePlayers[id].name,
                score: gamePlayers[id].score
            }
            score.push(player)
        }

        for (let i = 0; i < score.length; i++) {
            points.innerHTML += `
            <tr>
                <td>${score[i].name}</td>
                <td>${score[i].score}</td>
            </tr>
            `
        }

    }

    function playerCollision(getIdPlayer) {
        if (getIdPlayer === idPlayer){
            let player = gamePlayers[getIdPlayer];
    
            gameSugars.forEach((sugar) => {
                sugar = {
                    ...sugar,
                    x: Math.round(sugar.posX),
                    y: Math.round(sugar.posY),
                }
    
                if (player.posX < sugar.x + sugar.width &&
                    player.posX + player.width + 10 > sugar.x &&
                    player.posY < sugar.y + sugar.height &&
                    player.posY + player.height > sugar.y) {
                        
                    player.score += 1;
                    
                    return removeSugar(sugar.id)
                }
            });
        }
        return false;
    }

    // ? OBJ --> SUGARs

    function addSugars(objectsSugars) { // * Add all sugars 
        console.log(`Added sugars ${objectsSugars}`);
        
        for (const idSugar in objectsSugars) {
            const sugar = objectsSugars[idSugar]
            gameSugars.push(new Sugar(sugar, canvasId))
        }
    }
    function addSugar(sugar) {
        if(sugar.id){
            gameSugars.push(new Sugar(sugar, canvasId))
        }
    }

    function removeSugar(idSugar) {
        if (idSugar) {
            let find = gameSugars.findIndex(element => element.id === idSugar)
            gameSugars.splice(find, 1);
        }
    }
    
    function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);        
    }

    return{
        GameSetup,
        prevUpdate,
        playerCollision,
        setPlayer,
        addPlayers,
        removePlayer,
        addSugar,
        addSugars,
        removeSugar,
        clearCanvas

    }

}

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
        
        addPlayers(objectsGame.gamePlayers);
        addSugar(objectsGame.gameSugars);

        setInterval(()=>{
            addSugarRandom()
        }, 2000)        
        
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
            player.update(secondsPassed);
            player.draw();
        }
        
        gameSugars.forEach((sugar) => {
            sugar.update(secondsPassed);
            sugar.draw();
        });

        window.requestAnimationFrame((timeStamp) => gameLoop(timeStamp));
    }

    // OBJ --> PLAYERS
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
                <th>Nome</th>
                <th>Pontos</th>
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

    // OBJ --> SUGARs
    function addSugar(objectsSugar) {

        for (const idSugar in objectsSugar) {
            const sugar = objectsSugar[idSugar]
            gameSugars.push(new Sugar(sugar, canvasId))
        }

    }

    function removeSugar(idSugar) {
        if (idSugar) {
            let find = gameSugars.findIndex(element => element.id === idSugar)
            gameSugars.splice(find, 1);
        }
    }

    function addSugarRandom() {
        if (gameSugars.length < 5) {
            let numberRandom = Math.ceil(Math.random() * 640)
            let randomX = numberRandom <= 600 ? numberRandom : numberRandom / 2;

            // console.log(`Add new sugar in x: ${randomX}`);
            gameSugars.push( new Sugar ({
                id: `${Math.ceil(Math.random() * 600)}`,
                position: {
                    x: randomX,
                    y: 0
                },
                tam: {
                    x: 24,
                    y: 24
                }
            }, canvasId));
            return;
        }
        // console.log('Hit max sugars');

        return 0;
    }

    //canvas
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
        removeSugar,
        addSugarRandom,
        clearCanvas

    }

}

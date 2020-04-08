module.exports = class CreateConfig {
    
    constructor(){
        this.gamePlayers = {}
        this.gameSugars = [];
    }
    
    addPlayer(namePlayer, socketId) {
    
        console.log(`Player added: ${namePlayer}`);
        return this.gamePlayers[socketId] = {
            id: socketId,
            name: namePlayer,
            score: 0,
            position: {
                x: Math.ceil(Math.random() * 600),
                y: 230
            },
            tam: {
                x: 30,
                y: 30
            }
        }             
    
    }

    removePlayer(idPlayer){
        delete this.gamePlayers[idPlayer];
    }
            
    

    addSugar(numberRandom) {

        let randomX = numberRandom <= 640 ? numberRandom : numberRandom / 2;

        let dados = {
            id: `${Math.ceil(Math.random() * 1024)}`,
            position: {
                x: randomX,
                y: 0
            },
            tam: {
                x: 24,
                y: 24
            }
        }
        
        this.gameSugars.push(dados);
        console.log(`Sugar: ${this.gameSugars.length}`);
        
        return dados;
    }

    removeSugar(idSugar){
        if (idSugar) {
            let find = gameSugars.findIndex(element => element.id === idSugar)
            gameSugars.splice(find, 1);
        }
    }

    addSugarRandom(){
        if (this.gameSugars.length <= 5){            

            let numberRandom = Math.ceil(Math.random() * 800);

            if(this.gameSugars.length != 0) {

                return this.addSugar(numberRandom);

            }else{
                this.gameSugars.forEach((sugar)=>{

                    if (sugar.position.x + sugar.tam.x === numberRandom + sugar.tam.x ){
                        console.log('Sugar in gameSugars');
                        numberRandom = numberRandom * Math.ceil(Math.random() * 5);
                    }

                });
                return this.addSugar(numberRandom);
                
            }
        }
        return false;
    }

}
module.exports = class CreateConfig {
    
    constructor(){
        this.gamePlayers = {}
        this.gameSugars = [];
    }
    
    addPlayer(namePlayer, socket) {
        
        console.log(`Player added: ${namePlayer}`);
        return this.gamePlayers[socket.id] = {
            id: socket.id,
            name: namePlayer,
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
            
    

    addSugar() {
        console.log(`Sugar added`);
        return this.gameSugars.push({
            id: `${Math.ceil(Math.random() * 1024)}`,
            position: {
                x: Math.ceil(Math.random() * 640),
                y: 0
            },
            tam: {
                x: 24,
                y: 24
            }
        })
    }

}
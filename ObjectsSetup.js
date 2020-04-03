class Players extends PlayersObject{
    constructor(players, canvasID){
        
        //View GameObjets.js
        super(players, canvasID);

        this.keys = {
            ArrowUp: false,
            ArrowLeft: false,
            ArrowRight: false
        }

        this.speed = 256;
    }
    
    draw(){
        if (this.id === "00"){
            this.context.fillStyle = "#CE2331";
            this.context.fillRect(Math.round(this.posX), Math.round(this.posY), this.width, this.height);

            this.context.beginPath();
            this.context.arc(Math.round(this.posX) + 30, Math.round(this.posY) + 10, 10, 3 * Math.PI / 2, Math.PI / 2);
            this.context.fill()
            
            this.context.fillStyle = "#fff";
            this.context.beginPath();
            this.context.arc(Math.round(this.posX) + 30, Math.round(this.posY) + 10, 5, 3 * Math.PI / 2, Math.PI / 2);
            this.context.fill();


        } else {
            this.context.fillStyle = "#333333";
            this.context.fillRect(Math.round(this.posX), Math.round(this.posY), this.width, this.height);

            this.context.beginPath();
            this.context.arc(Math.round(this.posX) + 30, Math.round(this.posY) + 10, 10, 3 * Math.PI / 2, Math.PI / 2);
            this.context.fill()

            this.context.fillStyle = "#fff";
            this.context.beginPath();
            this.context.arc(Math.round(this.posX) + 30, Math.round(this.posY) + 10, 5, 3 * Math.PI / 2, Math.PI / 2);
            this.context.fill();

        }
    }
    
    update(speedMoved){


        if (this.id === '00') this.keyListen(speedMoved);
    }

    keyListen(speedMoved){
        document.addEventListener("keydown", (event) => {
            return this.keys[event.key] = true
        });
        document.addEventListener("keyup", (event) => {
            return this.keys[event.key] = false
        });
        
        this.movePlayer(speedMoved);
    }

    movePlayer(speedMoved){

        if (this.keys.ArrowUp) {
            this.posY -= this.speed * speedMoved;
            setTimeout(() => {
                this.posY += this.speed * speedMoved;
            }, 100)
        }

        if (this.keys.ArrowLeft) {
            let mod = this.posX - (this.speed * speedMoved);
            this.posX = this.screenInfinite(this.screen.w, mod)
            mod = 0;
        }
        if (this.keys.ArrowRight) {
            let mod = this.posX + (this.speed * speedMoved)
            this.posX = this.screenInfinite(this.screen.w, mod);
            mod = 0;
        } 
    }

    screenInfinite(x, y){
        return ((y % x) + x) % x
    }
}

class Sugar extends SugarObject {
    constructor(sugar, canvasID){

        //View GameObjets.js
        super(sugar, canvasID);

        this.speed = 64;
    }

    draw() {
        this.context.fillStyle = "#F2ED6F";
        this.context.fillRect(Math.round(this.posX), Math.round(this.posY), 100, 100);        
    }

    update(time) {
        let calc = this.posY + (time * this.speed);
        this.posY = calc < this.screen.h ? calc : 0;
    }
}
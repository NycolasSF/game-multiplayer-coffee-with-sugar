class Player extends PlayerObject{
    constructor(players, canvasID){
        //View GameObjets.js
        super(players, canvasID);

        this.keys = {
            ArrowUp: false,
            ArrowLeft: false,
            ArrowRight: false
        }

        this.speed = 256;

        this.globalID = undefined;
        this.getElements();
    }
    getElements(){
        this.globalID = localStorage.getItem('globalID');
    }
    
    draw(){
        if (this.id === this.globalID){
              
            let img = new Image()
            img.src = './assets/coffee-skin.png';
            this.context.drawImage(img, Math.round(this.posX), Math.round(this.posY))


        } else {
            
            let img = new Image()
            img.src = './assets/coffee-skin-2.png';
            this.context.drawImage(img, Math.round(this.posX), Math.round(this.posY))

        }
    }
    
    update(speedMoved){
        if (this.id === this.globalID) this.keyListen(speedMoved);
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
        this.context.fillRect(this.posX,this.posY, this.width, this.height);        
    }

    update(time) {
        let calc = this.posY + (time * this.speed);
        this.posY = calc < this.screen.h ? calc : 0;
    }
}
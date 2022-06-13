function initCanvas(){
    const canvas = document.querySelector("canvas");
    var ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 600;
    const cw = canvas.width;
    const ch = canvas.height; 

    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.oImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;

    window.canvasData = {
        ctx: ctx, 
        cw: cw,
        ch: ch,
    }
}

window.onload = async function(){
    initCanvas();

    const game = new Game();
    game.init();
    game.preload();
    game.create();
    setInterval(()=> {game.update()}, 1000/60);
}


class Game {
    constructor(){
    }

    init(){
        this.ctx = window.canvasData.ctx;
        this.cw = window.canvasData.cw;
        this.ch = window.canvasData.ch;

        this.isPaused = false;
    }

    loadImage(path){
        this.img = new Image();
        this.img.src = path
        return this.img
    }

    preload(){
        this.bg = this.loadImage('./images/background.png');
        this.fl = this.loadImage('./images/floor.png');
        this.plr1 = this.loadImage('./images/spriteChar1.png');
        this.lostScr = this.loadImage('./images/lostScreen.png');
        this.repBut = this.loadImage('./images/replayButton.png');
        this.bullet = this.loadImage('./images/bullet.png');
    }

    create(){
        this.background = new Sprite(this, 0, 0, this.bg, 800, 600);
        this.floor = new Sprite(this, 0, 540, this.fl, 800, 60);
        this.lostScreen = new Sprite(this, 0, 0, this.lostScr, 800, 600);
        this.replayButton = new Button(this, this.cw/2, this.ch/2, this.repBut, 154, 154);

        this.player1 = new Character(this, 0, 300, this.plr1, 150, 20, 5, 2, "player", {
            x: 20,
            y: 20,
        });
        this.player2 = new Character(this, 200, 300, this.plr1, 150, 20, 5, 2, "bot", {
            x: 470,
            y: 20,
        });

        this.player1.create();
        this.player2.create();

        window.document.addEventListener("keydown", (e)=> {this.player1.keyListener(e)});
        window.document.addEventListener("keyup", (e)=> {this.player1.keyListener(e)});
        window.document.addEventListener("click", (e)=> this.restart(e));
    }

    draw(){
        this.background.draw();
        this.floor.draw();
        this.player1.draw();
        this.player2.draw();
    }

    updatePlayers() {
        [this.player1, this.player2].forEach(player => {
            player.update();
            this.playerGroundCollision(player)
            this.playerCollisionWalls(player)
        })
        this.updatePlayersFlip();
        this.player1.checkShootCollision(this.player2)
        this.player2.checkShootCollision(this.player1)
        this.player2Update();
    }

    update(){
        if(this.isPaused) return;
            this.draw();
            this.updatePlayers() 
    }

   



// *! /////////  PLAYER 1 /////////////////////////////////////////////////

    playerGroundCollision(player){
        if(player.isCollidingDown(this.floor)) {
            player.y = this.floor.y - player.h -40
            player.jumping = false;
        }
    }

    playerCollisionWalls(player){ 
        if(player.x + 160 <= 0)
            player.x = -160

        if(player.x >= this.cw - player.w - 50)
            player.x = this.cw - player.w - 50
    }

    updatePlayersFlip(){
        if(this.player1.x >= this.player2.x) {
            this.player1.flipX = true;
            this.player2.flipX = false;
        }else{
            this.player1.flipX = false;
            this.player2.flipX = true;
            }
        }

    handleAttack(attacker) {
        const opponent = (attacker.type === "player" ? this.player2 : this.player1)
    
            if(attacker.hasInAttackRange(opponent)){
            opponent.attacked(attacker.currentAttack.damage)
            } 
            if(!opponent.isAlive()){
                console.log(attacker +" win")
                this.lostMenu();
            }
    }
    
    lostMenu(){
        this.isPaused = true;
        this.lostScreen.draw();
        this.replayButton.draw();
    }
    
    restart(e){
        if(this.replayButton.onMouse(e))
        this.isPaused = false;
    }

    

    
    // *! //////////////////////////////// PLAYER2 (BOT) ////////////////////////////////////////

    player2Update(){
        this.player2letAttack()
        this.player2Move()
    }

    player2letAttack(){
        if(this.player2.hasInAttackRange(this.player1)){
            this.player2.attackEnemy();
        }
    }

    player2Move(){
        if(this.player2.x >= this.player1.x)
        this.player2.x -= 1
    }














}
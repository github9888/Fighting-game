class Character extends Sprite {
    constructor(scene, x, y, sprite, maxHealth, hitPower, shootPower, speed, type, healthBar){
        super(scene, x, y) 

        this.sprite = sprite;
        this.maxHealth = maxHealth;
        this.hitPower = hitPower;
        this.shootPower = shootPower;
        this.speed = speed;
        this.type = type;
        this.healthBar = healthBar;
        this.health = this.maxHealth;

        this.ctx = window.canvasData.ctx;

        this.jumping = true;
        this.velocityX = 0;
        this.velocityY = 0;

        this.moveLeft = false;
        this.moveRight = false;
        this.up = false;

        this.moves = true;
        this.checkShootHit = false;

        this.spriteWidth = 200;
        this.spriteHeight = 200;
        this._healthBarWidth = 300;
        this.healthBarWidth = this._healthBarWidth;

        this.w = this.spriteWidth;
        this.h =  this.spriteHeight;

       
        this.gameFrame = 0;
        this.DEFAULT_STAGGER_FRAMES = 5
        
        this.staggerFrames = this.DEFAULT_STAGGER_FRAMES;
        this.playerState = "idle"

        this.flipX = false;

        this.currentAttack = {}

        this.attacks = {
            attack1: {
                animation: "attack1",
                animationSpeed: 3,
                range: 50,
                damage: 20,
            },
            attack2: {
                animation: "attack2",
                animationSpeed: 3,
                range: 50,
                damage: 30,
            },
            attack3: {
                animation: "attack2",
                animationSpeed: 3,
                range: 50,
                damage: 5,
                isShoot: true
            }
        }
    }

    draw(){
        if(this.flipX){
         this.scene.ctx.save();
            this.scene.ctx.scale(-1,1);
            // this.scene.ctx.rotate(10*Math.PI/180); 
            // this.scene.ctx.drawImage(this.sprite, this.frameX, this.frameY, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth*1.2, this.spriteHeight*1.2);

            this.scene.ctx.drawImage(this.sprite, this.frameX, this.frameY, this.spriteWidth, this.spriteHeight, -this.x - this.spriteWidth - 200, this.y, this.spriteWidth*2, this.spriteHeight*2);
            this.scene.ctx.restore();
            // console.log("flip")
        }else{
            this.scene.ctx.drawImage(this.sprite, this.frameX, this.frameY, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth*2, this.spriteHeight*2);
        }
            //heal bar//
            this.drawHealthBar();
    }

    create(){
        this.setStates()
        this.setAnimation()
        this.bullets = [];
    }

    update(){
        this.gravity()
        this.staggerFrames = this.DEFAULT_STAGGER_FRAMES;
        this.move()
        this.updateFrames();
        this.bullets.forEach(e => e.draw());
        this.bullets.forEach(e => e.fly());
    }

    keyListener(e){
        this.key_state = (e.type == "keydown")?true:false;
        if(e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39) {
            this.playerState = "idle"
        }
        switch(e.keyCode) {
            case 37: // left key
            this.moveLeft = this.key_state;
            break;
            case 38:// up key
            this.up = this.key_state;
            break;
            case 39:// right key
            this.moveRight = this.key_state;
            break;
            case 65:
            this.attack(this.attacks.attack1)
            break;
            case 83:
            this.attack(this.attacks.attack2)
            break;
            case 68:
            this.attack(this.attacks.attack3)
            break;
        }
    }

 

    gravity(){
        this.velocityY += 1.5;// gravity
        this.x += this.velocityX;
        this.y += this.velocityY; 
        this.velocityX *= 0.9;// friction
        this.velocityY *= 0.9;// friction
    }

    jumpUp(){
        if(this.up && this.jumping == false){
            this.velocityY -= 25;
            this.playerState = "jump"
            this.jumping = true;
        }
    }

    turnLeft(){
        if(this.moveLeft){
            this.velocityX -= 0.8;
            this.playerState = "right"
        }
    }

    turnRight(){
        if(this.moveRight){
            this.velocityX += 0.8;
            this.playerState = "right"
        }
    }

    hasInAttackRange(player){
        // this.currentAttack.range
        return (player.x <= this.x + this.w && 
                player.x + player.w >= this.x)
    }

    getShootRange(player){
        return (player.x <= this.x + this.w && 
                player.x + player.w >= this.x)
    }

    isAttacking() {   
       return Object.values(this.attacks).some(attackData => attackData.animation === this.playerState);
    }

    attack(attackData){      
        if(this.isAttacking()) return
        this.gameFrame = 0
        this.currentAttack = attackData;

        this.playerState = attackData.animation
        this.staggerFrames = attackData.animationSpeed;
        this.moves = false;

        if(attackData.isShoot)
            this.shootBullet()
        
        if(!attackData.isShoot)
            this.scene.handleAttack(this);
    }

    attacked(damage){
        this.health -= damage;
        this.healthBarWidth = this.getHealthBarWidth();
        // play get dmg anim here
    }

    getHealthBarWidth() {
        let hpPercent = this.health/this.maxHealth;
        return this._healthBarWidth*hpPercent;
    }

    drawHealthBar(){
        this.scene.ctx.fillStyle = "black";
        this.scene.ctx.fillRect(this.healthBar.x, this.healthBar.y, 300, 40);
        this.scene.ctx.fillStyle = "red";
        this.scene.ctx.fillRect(this.healthBar.x, this.healthBar.y, this.healthBarWidth, 40);
    }

    isAlive(){
        return this.health >= 0
    }

    move(){
        if(!this.moves) return
        this.jumpUp();
        this.turnLeft();
        this.turnRight();
    }



     // *! ////////////////////////////////  Shoot  /////////////////////////////
    
     shootBullet(){
        const bullet = new Bullet(this, this.x + 200, this.y + 200, this.scene.bullet, 42, 13)

        if(this.flipX) bullet.flipX = true
        if(!this.flipX) bullet.flipX = false
            this.bullets.push(bullet);
    }

    checkShootCollision(opponent){
        this.bullets.forEach((bullet, i) => {
            if(bullet.checkCollision(opponent)) {
                this.bullets.splice(i,1)
                opponent.attacked(this.currentAttack.damage)
            }
            if(bullet.checkCollisionWalls(this.scene))
                this.bullets.splice(i,1)
        });
    }



    // *! ////////////////////////////////  BOT  ////////////////////////////////////

    attackEnemy(){
        const getChance = Math.random() * 100

        if(getChance <= 50)
        this.attack(this.attacks.attack1)

        else if(getChance >= 50 && getChance < 75 )
        this.attack(this.attacks.attack2)

        else 
        this.attack(this.attacks.attack3)
    }



    // *! ////////////////////////////////  Animation  ////////////////////////////////////

    updateFrames(){
        this.position = Math.floor(this.gameFrame/this.staggerFrames) % this.spriteAnimations[this.playerState].loc.length;
       // console.log(this.position)
        this.frameX = this.spriteWidth * this.position
        this.frameY = this.spriteAnimations[this.playerState].loc[this.position].y;
        this.gameFrame++;

        const isLastAnimFrame = this.position === this.spriteAnimations[this.playerState].loc.length -1

        if(isLastAnimFrame && !this.jumping) {
            this.moves = true;
            this.playerState = "idle"
        }
    }

    setStates(){
        this.spriteAnimations = [];
        this.animationStates = [
            {
                name:'right',
                frames: 8,
            },
            {
                name:'idle',
                frames: 8,
            },
            {
                name:'jump',
                frames: 2,
            },
            {
                name:'attack1',
                frames: 6,
            },
            {
                name:'attack2',
                frames: 6,
            }
        ];
    }

    setAnimation(){
        this.animationStates.forEach((state, index) => {
            this.frames = {
                loc: [],
            }
            for(let j=0; j<state.frames; j++){
                this.positionX = j * this.spriteWidth;
                this.positionY = index * this.spriteHeight;
                this.frames.loc.push({x: this.positionX, y: this.positionY})
            }
            this.spriteAnimations[state.name] = this.frames;
        });
    }

    

   
        


   

   
   






}
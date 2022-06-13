class Bullet extends Sprite {
    constructor(scene, x, y, image, w, h){
        super(scene, x, y, image, w, h)

        this.flipX = false;
    }

    draw(){
        if(this.flipX){
            this.scene.ctx.save();
            this.scene.ctx.scale(-1,1);
            // this.scene.ctx.rotate(10*Math.PI/180); 
            // this.scene.ctx.drawImage(this.sprite, this.frameX, this.frameY, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth*1.2, this.spriteHeight*1.2);

            // this.scene.ctx.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, -this.x - this.spriteWidth - 200, this.y, this.spriteWidth*2, this.spriteHeight*2);
            this.scene.ctx.drawImage(this.image, -this.x, this.y, this.w, this.h)
            this.scene.ctx.restore();

        }else{
            this.scene.ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
        }  
        // context.drawImage(img, 0, 0, img.width * -1, img.height);
    }
    
    
    ///////////////////////////////////////////////////////////////////////////////////

    fly(){
        if(this.flipX) this.x -= 5
        else this.x += 5
    }

    checkCollision(opponent){
        return (this.x + this.w >= opponent.x + 180 &&
                this.x <= opponent.x + opponent.w + 50 &&
                this.y + this.h >= opponent.y + 140 &&
                this.y <= opponent.y + opponent.h);
    }

    checkCollisionWalls(scene){
        return (this.x >= scene.cw || this.x <= 0)
    }

}
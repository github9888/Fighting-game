class Sprite {
    constructor(scene, x, y, image, w, h){

        this.scene = scene;
        this.image = image;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw(){
        this.scene.ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }

    isCollidingUp(sprite) {
        return (this.y <= sprite.y + sprite.h && 
               this.y >= sprite.y + sprite.h - 10 && 
               this.x + this.w >= sprite.x && 
               this.x <= sprite.x + sprite.w);
     }
 
     isCollidingDown(sprite) {
         return this.y + this.h >= sprite.y - 40
     }
 
     isCollidingLeft(sprite) {
         return (this.x <= sprite.x + sprite.w &&
                 this.x >= sprite.x + sprite.w - 10 &&
                 this.y + this.h >= sprite.y &&
                 this.y <= sprite.y + sprite.h);
     }
 
     isCollidingRight(sprite) {
         return (this.x + this.w >= sprite.x &&
                 this.x + this.w - 10 <= sprite.x &&
                 this.y + this.h >= sprite.y &&
                 this.y <= sprite.y + sprite.h);
     }


}
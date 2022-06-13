class Button {
    constructor(scene, x, y, image, w, h){

        this.scene = scene;
        this.image = image;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.frameX = 0;
        this.frameY = 0;

        this.flipX = false;
        
    }

    draw(){
        if(this.flipX){
            this.scene.ctx.save();
            this.scene.ctx.scale(-1,1);
            this.scene.ctx.drawImage(this.image, this.frameX, this.frameY, this.w, this.h, -this.x - this.w - 10, this.y, this.w, this.h);
            this.scene.ctx.restore();
           }else 
            this.scene.ctx.drawImage(this.image, this.x, this.y);
    }

    setFlipX(set){
        this.flipX = set;
    }

    onMouse(e){
        return (e.clientX >= this.x &&
                e.clientX <= this.x + this.w &&
                e.clientY >= this.y &&
                e.clientY <= this.y + this.h)
    }







};
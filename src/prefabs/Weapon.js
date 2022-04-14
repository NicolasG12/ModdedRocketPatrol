class Cannon extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, left, right, fire) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        this.isFiring = false;
        this.moveSpeed = 2;
        this.sfxRocket = scene.sound.add('sfx_rocket');
        this.leftKey = left;
        this.rightKey = right;
        this.fireKey = fire;
    }

    update() {
        //left/right movement
        if(!this.isFiring) {
            if(this.leftKey.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            }
            else if (this.rightKey.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }
        //fire button
        if(Phaser.Input.Keyboard.JustDown(this.fireKey) && !this.isFiring) {
            this.isFiring = true;
            //this.sfxRocket.play();
        }
        
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        //reset on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.isFiring = false;
            this.y = game.config.height - borderUISize - borderPadding;
        }
    }
    
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}

class Laser extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        this.moveSpeed = 2;
        this.firing = true;
    }

    update() {
        if(this.firing) {
            this.y -= this.moveSpeed;
        }
    }
}
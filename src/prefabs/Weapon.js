class Cannon extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        //this.isFiring = false;
        this.moveSpeed = 2;
        //this.sfxRocket = scene.sound.add('sfx_rocket');
    }

    update() {
        //left/right movement
        if(!this.isFiring) {
            if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            }
            else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }
        //fire button
        if(Phaser.Input.Keyboard.JustDown(keyF)) {
            this.laser = new Laser(this.scene, this.x, this.y, 'laser', 0).setOrigin(0.5, 0);
            this.laser.update();
            //this.sfxRocket.play();
        }
    }
        
        //reset on miss
    //     if(this.y <= borderUISize * 3 + borderPadding) {
    //         this.isFiring = false;
    //         this.y = game.config.height - borderUISize - borderPadding;
    //     }
    // }
    
    // reset() {
    //     this.isFiring = false;
    //     this.y = game.config.height - borderUISize - borderPadding;
    // }
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
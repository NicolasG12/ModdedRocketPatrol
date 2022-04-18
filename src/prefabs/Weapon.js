class DeathStar extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, left, right, fire) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        this.isFiring = false;
        this.moveSpeed = 2;
        this.sfxRocket = scene.sound.add('sfx_rocket');
        this.leftKey = left;
        this.rightKey = right;
        this.fireKey = fire;
        this.setTexture('deathstar');
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
            setTimeout(() => {
                this.y = laserY;
                this.setTexture('laser');
            }, 500);

            setTimeout(() => {
                this.reset();
            }, 1500);
            //this.sfxRocket.play();
        }
    }
    reset() {
        this.y = game.config.height - borderUISize*3;
        setTimeout(() => {
            this.setTexture('deathstar');
        })
        
    }
}

// class Laser extends Phaser.GameObjects.Sprite {
//     constructor(scene, x, y, texture, frame) {
//         super(scene, x, y, texture, frame)

//         scene.add.existing(this);
//     }
//     update() {
//         this.;
//     }

//     reset() {
//         this.alpha = 0;
//     }
// }
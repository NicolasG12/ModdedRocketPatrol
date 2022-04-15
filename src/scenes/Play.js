class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('laser', './assets/LaserBlast.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('ufo', './assets/UFO.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create () {
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        //green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        //add spaceships
        this.ship01 = new Spaceship(this,game.config.width + borderUISize*9, borderUISize*7 + borderPadding*6, 'spaceship', 0, 
                30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, 
                borderUISize*5 + borderPadding*2, 'spaceship',
                0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 
                + borderPadding*4, 'spaceship', 0, 
                10).setOrigin(0, 0);
        this.ship04 = new BonusSpaceShip(this,  game.config.width + borderUISize*6, borderUISize*4, 'ufo', 0, 50).setOrigin(0, 0);
        //white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        //add the keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        //initialize score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '12px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 130
        }
        this.p1Score = 0;
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, "Player 1: " + this.p1Score, scoreConfig);
        //add rocket 1
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.p1Rocket = new Cannon(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket', 0
                                    , keyLEFT, keyRIGHT, keyUP).setOrigin(0.5, 0);
        //add rocket 2
        if(game.settings.numPlayers == 2) {
            keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
            keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
            keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
            this.p2Rocket = new Cannon(this, game.config.width - borderUISize*6, game.config.height - borderUISize - borderPadding, 'rocket', 0, 
                                    keyA, keyD, keyW).setOrigin(0.5, 0);
            this.p2Score = 0;
            this.scoreRight = this.add.text(game.config.width - borderUISize*5, borderUISize + borderPadding*2, "Player 2: " + this.p2Score, scoreConfig);
        }
        //animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // GAME OVER flag
        this.gameOver = false;
        //60-second play clock
        scoreConfig.fixedWidth = 0;
        this.timer = this.add.text(game.config.width/2, borderUISize + borderPadding*2, game.settings.gameTimer / 1000, scoreConfig);
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        
    }

    update() {
        //update the timer
        this.remaining = this.clock.getRemainingSeconds();
        this.timer.text = Math.floor(this.remaining);
        //check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        this.starfield.tilePositionX -= 4;
        if(!this.gameOver) {
            this.p1Rocket.update();
            if(game.settings.numPlayers == 2) {
                this.p2Rocket.update();
            }
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }
        //check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03, this.p1Rocket);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02, this.p1Rocket);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01, this.p1Rocket);
        }
        if(this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04, this.p1Rocket);
        }
        //p2 rocket collision
        if(game.settings.numPlayers == 2) {
            if(this.checkCollision(this.p2Rocket, this.ship03)) {
                this.p2Rocket.reset();
                this.shipExplode(this.ship03, this.p2Rocket);
            }
            if(this.checkCollision(this.p2Rocket, this.ship02)) {
                this.p2Rocket.reset();
                this.shipExplode(this.ship02, this.p2Rocket);
            }
            if(this.checkCollision(this.p2Rocket, this.ship01)) {
                this.p2Rocket.reset();
                this.shipExplode(this.ship01, this.p2Rocket);
            }
            if(this.checkCollision(this.p2Rocket, this.ship04)) {
                this.p2Rocket.reset();
                this.shipExplode(this.ship04, this.p2Rocket);
            }
        }
    }

    checkCollision(rocket, ship) {
        if(rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
            }
        else {
            return false;
        }
    }

    shipExplode(ship, rocket) {
        //temporarily hide ship
        ship.alpha = 0;
        //create explosiona at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        if(rocket === this.p1Rocket){
        //score add and repaint
            this.p1Score += ship.points;
            this.scoreLeft.text = "Player 1: " + this.p1Score;
        }
        else {
            this.p2Score += ship.points;
            this.scoreRight.text = "Player 2: " + this.p2Score;
        }
        this.sound.play('sfx_explosion');
        //update timer
        this.clock.delay += 1500;
    }
}
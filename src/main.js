//Nicolas Guevara Modded Rocket Patrol
//Create a new spaceship (20)
//Implement a simultaneous two-player mode (30)
//Implement a new time/scoring mechanism that adds time to the clock (20)
//Create and implement a new weapon (20)
//Parallax scrolling (10)
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}
let game = new Phaser.Game(config);

//set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

//set the laser y value
let laserY = game.config.height - borderUISize*11.5;
//reserve keboard vars
let keyW, keyA, keyD, keyR, keyLEFT, keyRIGHT, keyUP;
let pointer;

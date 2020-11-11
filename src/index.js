import Sound from "./sounds.js"
import GAMEUI from "./game_ui.js"
import { createLevel, drawInGame, PIXEL_SIZE, BLOCK_COUNT } from "./create_level.js"
// import { level1 } from "./levels.js"
import Collision from "./collision_detection.js"
// here u can find sounds
// https://themushroomkingdom.net/media/smb/wav
// here u can find Mario levels
// https://nesmaps.com/maps/SuperMarioBrothers/SuperMarioBrothers.html


// https://developers.google.com/web/tools/chrome-devtools/rendering-tools
// https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count
// http://jsfiddle.net/duopixel/wzZ5R/
// https://css-tricks.com/get-value-of-css-rotation-through-javascript/
// https://stackoverflow.com/questions/5968227/get-the-value-of-webkit-transform-of-an-element-with-jquery


// create a level1
createLevel();

const IMAGE_FOLDER_PATH = "assets/images/"
const spritePath = {
    DEFAULT: IMAGE_FOLDER_PATH + "sprite_stay_right.png",
    STAY_RIGHT: IMAGE_FOLDER_PATH + "sprite_stay_right.png",
    STAY_LEFT: IMAGE_FOLDER_PATH + "sprite_stay_left.png",
    MOVE_RIGHT: IMAGE_FOLDER_PATH + "sprite_to_right.png",
    MOVE_LEFT: IMAGE_FOLDER_PATH + "sprite_to_left.png",
    JUMP_RIGHT: IMAGE_FOLDER_PATH + "jump_to_right.png",
    JUMP_LEFT: IMAGE_FOLDER_PATH + "jump_to_left.png",
    DIE: IMAGE_FOLDER_PATH + "die.png"
}

const keyCode = {
    SPACE: 32,
    RIGHT: 39,
    LEFT: 37
}

const ADDRESS_LENGTH = 22
let mario_sprite = document.getElementById("mario_sprite")
mario_sprite.src = spritePath.DEFAULT
mario_sprite.style.webkitAnimationPlayState = "paused"

let gravitySpeed = 20;
let mario = document.getElementById('mario');
// mario lives couns
let marioLives = 3;
let marioScore = 0;

let interval = null;

export let marioSpeed = 1;

//////////////////// sounds block
// init background music
let bg_sound = new Sound("../assets/music/bg_sound.mp3");
let gameover_sound = new Sound("../assets/music/gameover_sound.wav");
let small_jump_sound = new Sound("../assets/music/jump_small_sound.wav");

////////////////// Game UI
export let game_ui = new GAMEUI;

// mario death, stop sound, restard pos
export function marioDeath() {
    bg_sound.stop()
    gameover_sound.play()
    marioLives--
    mario_sprite.src = spritePath.DIE
    deleleteLevel() 
    game_ui.updateLives(marioLives)
    if (marioLives > 0) {
        // TO DO in-game menu
        alert("you lost 1 live")
    } else {
        // TO DO in-game menu
        alert("game over")
    }
    createLevel()
    collision = new Collision();

    curTransform = new WebKitCSSMatrix(window.getComputedStyle(mario).webkitTransform);
    // restart mario position
    map[37] = false;
    map[39] = false;
    map[32] = false;
    
    mario.style.transform = "translateX(10px) translateY(330px)"
    mario_sprite.src = spritePath.DEFAULT
    game_screen.scrollLeft = 0;
}

function deleleteLevel() {
    let img = document.querySelectorAll('.game_objects')
    img.forEach(el=> el.remove())
}

//////////////////// define game state
const GAMESTATE = {
    PAUSED: 0,
    RUNNING: 1,
    MENU: 2,
    DEATH: 3,
    GAMEOVER: 4,
    NEWLEVEL: 5
};

let gamestate = GAMESTATE.MENU

if (gamestate === GAMESTATE.GAMEOVER) {
    // alert("you died")
    // gameover_sound.play()
}

class Enemy {
    constructor(entity) {
        this.entity = entity
        this.leftMaxPos = entity.offsetLeft;
        this.rightMaxPos = entity.offsetLeft + 100;
        this.direction = 'left'
    }
    toLeft() {
        this.entity.style.left = this.entity.offsetLeft - 1 + "px"
    }

    toRight() {
        this.entity.style.left = this.entity.offsetLeft + 1 + "px"
    }

    Move() {
        if (this.entity.offsetLeft != this.rightMaxPos && this.direction === "right") {
            this.toRight()
        } else if (this.entity.offsetLeft != this.leftMaxPos && this.direction === "left") {
            this.toLeft()
        } else if (this.entity.offsetLeft === this.rightMaxPos) {
            this.direction = 'left'
            this.toLeft()
        } else if (this.entity.offsetLeft === this.leftMaxPos) {
            this.direction = 'right'
            this.toRight()
        }
    }


}

let enemies = []
let enemiesEntity = document.getElementsByClassName("enemy")

function initEnemies() {
    for (let i = 0; i < enemiesEntity.length; i++) {
        let enemy = new Enemy(enemiesEntity[i])
        enemies.push(enemy)
    }
}

function enemiesMove() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].Move()
    }
}



/////////////////////// start Mario movement block ///////////
// object that saves keys we press
let map = {};
// define Mario start pos
// mario.style.top = "330px"
// mario.style.left = "10px"

function clearPause() {
    document.getElementsByTagName('p')[0].remove()
    document.querySelectorAll('img').forEach( el => el.style.opacity = "1")
}

// onkeydown + onkeyup function
function keyHandler(e) {
    e = e || event;
    if (e.keyCode === 32) {
        if (!map[32] && collision.marioInAir) {
            return
        } else {
            map[e.keyCode] = e.type == 'keydown';
        }
    } else {
        map[e.keyCode] = e.type == 'keydown';
    }
}

onkeydown = (e) => {
    if (e.keyCode === 27) {
        if (gamestate === GAMESTATE.PAUSED) {
            gamestate = GAMESTATE.RUNNING
            requestAnimationFrame(Run)
            clearPause()
        } else {
            gamestate = GAMESTATE.PAUSED
            cancelAnimationFrame(Run)
            pauseGame()
        }
    }
    if (e.keyCode === 32 || e.keyCode === 37 || e.keyCode === 39) {
        e.preventDefault();
    }
    keyHandler(e)
}

onkeyup = (e) => {
    mario_sprite.style.webkitAnimationPlayState = "paused"
    if (e.keyCode === keyCode.RIGHT) {
        if (!collision.marioInAir) {
            mario_sprite.src = spritePath.STAY_RIGHT
        } else {
            mario_sprite.src = spritePath.JUMP_RIGHT

        }
    }
    if (e.keyCode === keyCode.LEFT) {
        if (!collision.marioInAir) {
            mario_sprite.src = spritePath.STAY_LEFT
        } else {
            mario_sprite.src = spritePath.JUMP_LEFT
        }
    }
    marioSpeed = 1
    keyHandler(e)
}

// i guess here should be something like start game

let game_screen = document.getElementById('gameScreen');
game_screen.style.marginLeft = "1px"

let collision = new Collision();

let curTransform = new WebKitCSSMatrix(window.getComputedStyle(mario).webkitTransform);

// function defines Mario movement
function moveMario() {
    // must be one of the first
    curTransform = new WebKitCSSMatrix(window.getComputedStyle(mario).webkitTransform);
    let collisionXY = collision.getCollision()
    if (!map[keyCode.SPACE] && !collisionXY.down) {
        marioDown()
    }

    // if we hold SPACE => mario is on Air
    if (!map[37] && !map[39]) {
        clearInterval(interval)
        interval = null
        marioSpeed = 1
    }

    if (map[32]) collision.marioInAir = true;
    // move Mario down if we dont hold "spacebar" && no block under us

    // move Mario up on "spacebar" and if mario under max jump height
    if (map[keyCode.SPACE] && curTransform.m42 >= collision.marioMaxJumpHeight) {
        if (collisionXY.up) {
            map[32] = false
        } else {
            if (mario_sprite.src === spritePath.STAY_LEFT) {
                mario_sprite.src = spritePath.JUMP_LEFT
            } else if (mario_sprite.src === spritePath.STAY_RIGHT) {
                mario_sprite.src = spritePath.JUMP_RIGHT
            }
            marioJump()
        }
    }

    // move Mario right on "ArrowRight"
    if (map[keyCode.RIGHT] && !collisionXY.right) {
        if (mario.offsetLeft < 6220) {
            // handle animation
            if (!collision.marioInAir) {
                mario_sprite.style.webkitAnimationPlayState = "running"
                mario_sprite.src = spritePath.MOVE_RIGHT
            } else {
                mario_sprite.src = spritePath.JUMP_RIGHT
                mario_sprite.style.webkitAnimationPlayState = "paused"
            }
            marioRight()
        }
    }
    // move Mario left on "ArrowLeft"
    if (map[keyCode.LEFT] && !collisionXY.left) {
        // cant move lefter than game screen
        if (curTransform.m41 > game_screen.scrollLeft) {
            // handle animation
            if (!collision.marioInAir) {
                mario_sprite.style.webkitAnimationPlayState = "running"
                mario_sprite.src = spritePath.MOVE_LEFT
            } else {
                mario_sprite.src = spritePath.JUMP_LEFT
                mario_sprite.style.webkitAnimationPlayState = "paused"
            }
            marioLeft()
        }
    }

    // music on ArrowUp
    // TEMPORARY
    if (map[38]) {
        bg_sound.play()
        bg_sound.loop = true;
    }
    // TO DO make it function
    // gameover sound
    if (curTransform.m42 > 600) {
        marioDeath()
    }

    if (!collision.marioInAir) {
        let spriteSrc = mario_sprite.src.slice(ADDRESS_LENGTH)
        if (spriteSrc === spritePath.JUMP_RIGHT) {
            mario_sprite.src = spritePath.STAY_RIGHT
        } else if (spriteSrc === spritePath.JUMP_LEFT) {
            mario_sprite.src = spritePath.STAY_LEFT
        }
    }

}

function speedUp() {

    if (marioSpeed === 3) {
        clearInterval(interval);
        interval = null
        return;
    }

    marioSpeed += 1
}


let count = 0

// move Mario right to 1px 1000/60 times in 1 sec
function marioRight() {

    curTransform = new WebKitCSSMatrix(window.getComputedStyle(mario).webkitTransform);
    mario.style.transform = "translateX(" + (curTransform.m41 + marioSpeed) + "px) translateY(" + curTransform.m42 + "px)";
    
    if (interval === null && marioSpeed === 1) {
        interval = setInterval(speedUp, 400)
    }


    if (curTransform.m41 >= game_screen.offsetLeft + 400 + game_screen.scrollLeft) {
        game_screen.scrollLeft+= marioSpeed
        if (Math.floor(game_screen.scrollLeft/(PIXEL_SIZE*BLOCK_COUNT))+1 === count || count === 0) {
            count++
            drawInGame((game_screen.offsetWidth-2)/PIXEL_SIZE+BLOCK_COUNT+Math.floor(game_screen.scrollLeft/PIXEL_SIZE))
            collision.img = document.querySelectorAll(".game_objects[opacity='1']")
            for (let i = 0; i < collision.img.length; i++) {
                if (collision.img[i].offsetLeft < game_screen.scrollLeft) {
                    collision.img[i].setAttribute("opacity", "0");
                }
            }
        }
        // moveScreen()
        // count++
    }

}

function moveScreen() {

    let game_objects = document.querySelectorAll('.game_objects');
    for (let i = 0; i < game_objects.length; i++) {
        game_objects[i].style.transform = "translateX(-"+count+"px)";
    }

}

// move Mario left to 1px 1000/60 times in 1 sec
function marioLeft() {

    curTransform = new WebKitCSSMatrix(window.getComputedStyle(mario).webkitTransform);
    mario.style.transform = "translateX(" + (curTransform.m41 - marioSpeed) + "px) translateY(" + curTransform.m42 + "px)";

    if (interval === null && marioSpeed === 1) {
        interval = setInterval(speedUp, 400)
    }

}

// move Mario up to 2px 1000/60 times in 1 sec
function marioJump() {
    curTransform = new WebKitCSSMatrix(window.getComputedStyle(mario).webkitTransform);
    // if on map max top pos
    if (curTransform.m42 <= 10) map[keyCode.SPACE] = false

    // if mario jumped to max jump height => mario should fall
    if (curTransform.m42 === collision.marioMaxJumpHeight) map[keyCode.SPACE] = false

    mario.style.transform = "translateX(" + curTransform.m41 + "px) translateY(" + (curTransform.m42 - 2) + "px)";

}

// move Mario down to 2px 1000/60 times in 1 sec
function marioDown() {

    curTransform = new WebKitCSSMatrix(window.getComputedStyle(mario).webkitTransform);
    mario.style.transform = "translateX(" + curTransform.m41 + "px) translateY(" + (curTransform.m42 + 2) + "px)";

}

function drawGameMenu() {
    let menu = document.createElement('div');
    menu.id = "game_menu";
    
    let startBtn = document.createElement('div');
    let restartBtn = document.createElement('div');
    startBtn.id = "start_btn";
    restartBtn.id = "restart_btn";

    startBtn.innerText = "START GAME";
    restartBtn.innerText = "RESTART GAME";

    startBtn.onclick = function() {
        requestAnimationFrame(Run)
        clearGameMenu()
        gamestate = GAMESTATE.RUNNING
    }
    restartBtn.onclick = function() {
        requestAnimationFrame(Run);
        clearGameMenu();
        game_ui.scoreboard = 0;
        game_ui.updateLives(3);
        gamestate = GAMESTATE.RUNNING;
    }


    menu.append(startBtn);
    menu.append(restartBtn);

    document.body.append(menu);
}

function clearGameMenu() {
    document.getElementById('game_menu').remove();
}

function pauseGame() {
    let pause = document.createElement('p');
    pause.innerHTML = "PAUSED<br><br>PRESS ESC TO UNPAUSE";
    game_screen.append(pause);
    let img = document.querySelectorAll('img');
    img.forEach( el => el.style.opacity = "0.5")
}

function Run() {
    moveMario()
    // enemiesMove()
    if (gamestate === GAMESTATE.RUNNING) {
        requestAnimationFrame(Run)
    }
    if (gamestate === GAMESTATE.MENU) {
        cancelAnimationFrame(Run)
        if (gamestate === GAMESTATE.MENU) drawGameMenu()
        // if (gamestate === GAMESTATE.PAUSED) pauseGame()
    }
}

// start animation
initEnemies()
requestAnimationFrame(Run)
// Run()
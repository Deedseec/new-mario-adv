import Sound from "./sounds.js"
import GAMEUI from "./game_ui.js"
import { createLevel, drawInGame, PIXEL_SIZE, BLOCK_COUNT } from "./create_level.js"
import { level1 } from "./create_level.js"
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

const IMAGE_FOLDER_PATH = "assets/images/";
const spritePath = {
    DEFAULT: IMAGE_FOLDER_PATH + "sprite_stay_right.png",
    STAY_RIGHT: IMAGE_FOLDER_PATH + "sprite_stay_right.png",
    STAY_LEFT: IMAGE_FOLDER_PATH + "sprite_stay_left.png",
    MOVE_RIGHT: IMAGE_FOLDER_PATH + "sprite_to_right.png",
    MOVE_LEFT: IMAGE_FOLDER_PATH + "sprite_to_left.png",
    JUMP_RIGHT: IMAGE_FOLDER_PATH + "jump_to_right.png",
    JUMP_LEFT: IMAGE_FOLDER_PATH + "jump_to_left.png",
    DIE: IMAGE_FOLDER_PATH + "die.png"
};

// adding names to key press
const keyCode = {
    SPACE: 32,
    RIGHT: 39,
    LEFT: 37
};

const ADDRESS_LENGTH = 22;

// define mario and its sprite
let mario = document.getElementById('mario');
let mario_sprite = document.getElementById("mario_sprite");
mario_sprite.src = spritePath.DEFAULT;
mario_sprite.style.webkitAnimationPlayState = "paused";
// mario lives count
let marioLives = 3;
let marioScore = 0;
// mario up and down speed
let gravitySpeed = 2;
// mario initial left and right speed
export let marioSpeed = 1;


let interval = null;

//////////////////// sounds block
// init background music
let bg_sound = new Sound("../assets/music/bg_sound.mp3");
// init mario die sound
let mario_die_sound = new Sound("../assets/music/smb_mariodie.wav");
// init game over sound
let gameover_sound = new Sound("../assets/music/gameover_sound.wav");
// init jump sound
let small_jump_sound = new Sound("../assets/music/jump_small_sound.wav");
// init break block sound
export let break_block_sound = new Sound("../assets/music/smb_breakblock.wav");
// init stage clear sound
let stage_clear_sound = new Sound("../assets/music/smb_stage_clear.wav");
// init pause sound
let pause_sound = new Sound("../assets/music/smb_pause.wav");
// init coin drop sound
let coin_sound = new Sound("../assets/music/smb_coin.wav");
// init timeout warning sound
let timeout_warning_sound = new Sound("../assets/music/smb_warning.wav");

////////////////// Game UI
export let game_ui = new GAMEUI;

// mario death, stop sound, restard pos
export const marioDeath = () => {

    // change sounds
    bg_sound.stop();

    // change mario lives and animate mario death
    marioLives--
    mario_sprite.src = spritePath.DIE;
    game_ui.updateLives(marioLives);

    // delete everything
    deleleteLevel();

    if (marioLives > 0) {
        // TO DO in-game menu
        mario_die_sound.play();
        alert("you lost 1 live");
    } else {
        // TO DO in-game menu
        gameover_sound.play();
        alert("game over");
        gamestate = GAMESTATE.MENU
    }

    // create level again
    createLevel();

    collision = new Collision();

    curTransform = new WebKitCSSMatrix(window.getComputedStyle(mario).webkitTransform);

    // empty all keys in map
    map[keyCode.LEFT] = false;
    map[keyCode.RIGHT] = false;
    map[keyCode.SPACE] = false;

    // restart mario position
    mario.style.transform = "translateX(10px) translateY(330px)";
    // mario defaul sprite
    mario_sprite.src = spritePath.DEFAULT;
    // initial game screen position
    game_screen.scrollLeft = 0;
    count = 0;
}

// delete all game objects
const deleleteLevel = () => {
    let img = document.querySelectorAll('.game_objects');
    img.forEach(el => el.remove());
}

//////////////////// define game state
const GAMESTATE = {
    PAUSED: 0,
    RUNNING: 1,
    MENU: 2,
    DEATH: 3,
    GAMEOVER: 4,
    NEWLEVEL: 5,
    WINNER: 6
};

let gamestate = GAMESTATE.MENU;

// if (gamestate === GAMESTATE.GAMEOVER) {
// alert("you died")
// gameover_sound.play()
// }

// class Enemy {
//     constructor(entity) {
//         this.entity = entity
//         this.leftMaxPos = entity.offsetLeft;
//         this.rightMaxPos = entity.offsetLeft + 100;
//         this.direction = 'left'
//     }
//     toLeft() {
//         this.entity.style.left = this.entity.offsetLeft - 1 + "px"
//     }

//     toRight() {
//         this.entity.style.left = this.entity.offsetLeft + 1 + "px"
//     }

//     Move() {
//         if (this.entity.offsetLeft != this.rightMaxPos && this.direction === "right") {
//             this.toRight()
//         } else if (this.entity.offsetLeft != this.leftMaxPos && this.direction === "left") {
//             this.toLeft()
//         } else if (this.entity.offsetLeft === this.rightMaxPos) {
//             this.direction = 'left'
//             this.toLeft()
//         } else if (this.entity.offsetLeft === this.leftMaxPos) {
//             this.direction = 'right'
//             this.toRight()
//         }
//     }


// }

// let enemies = []
// let enemiesEntity = document.getElementsByClassName("enemy")

// const initEnemies = () => {
//     for (let i = 0; i < enemiesEntity.length; i++) {
//         let enemy = new Enemy(enemiesEntity[i])
//         enemies.push(enemy)
//     }
// }

// const enemiesMove = () => {
//     for (let i = 0; i < enemies.length; i++) {
//         enemies[i].Move()
//     }
// }



/////////////////////// start Mario movement block ///////////

// object that saves keys we press
let map = {};

// clear pause menu
const clearPause = () => {
    let pauseMenu = document.getElementById('pauseMenu');
    pauseMenu.style.display = 'none';

    document.querySelectorAll('img').forEach(el => el.style.opacity === "0" ? el : el.style.opacity = "1");
}

// onkeydown + onkeyup function
const keyHandler = (e) => {
    e = e || event;
    if (e.keyCode === keyCode.SPACE) {
        if (!map[keyCode.SPACE] && collision.marioInAir) {
            return
        } else {
            map[e.keyCode] = e.type == 'keydown';
        }
    } else {
        map[e.keyCode] = e.type == 'keydown';
    }
}

onkeydown = (e) => {
    // if we press "ESC" button
    if (e.keyCode === 27 && gamestate !== GAMESTATE.WINNER) {
        if (gamestate === GAMESTATE.PAUSED) {
            gamestate = GAMESTATE.RUNNING;
            requestAnimationFrame(Run);
            clearPause();
        } else {
            pause_sound.play();
            gamestate = GAMESTATE.PAUSED;
            cancelAnimationFrame(Run);
            pauseGame();
        }
    }
    // prevent default press of space && left && right
    if (e.keyCode === keyCode.SPACE || e.keyCode === keyCode.LEFT || e.keyCode === keyCode.RIGHT) {
        e.preventDefault();
    }
    keyHandler(e)
}

onkeyup = (e) => {
    mario_sprite.style.webkitAnimationPlayState = "paused";
    if (e.keyCode === keyCode.RIGHT) {
        if (!collision.marioInAir) {
            mario_sprite.src = spritePath.STAY_RIGHT;
        } else {
            mario_sprite.src = spritePath.JUMP_RIGHT;

        }
    }
    if (e.keyCode === keyCode.LEFT) {
        if (!collision.marioInAir) {
            mario_sprite.src = spritePath.STAY_LEFT;
        } else {
            mario_sprite.src = spritePath.JUMP_LEFT;
        }
    }
    marioSpeed = 1;
    keyHandler(e);
}

// define game screen
let game_screen = document.getElementById('gameScreen');
game_screen.style.marginLeft = "1px";

// define collision
let collision = new Collision();
let collisionXY = collision.getCollision();

// define mario current position
let curTransform = new WebKitCSSMatrix(window.getComputedStyle(mario).webkitTransform);

// function defines Mario movement
const moveMario = () => {

    // refresh collision and mario pos every tick
    curTransform = new WebKitCSSMatrix(window.getComputedStyle(mario).webkitTransform);
    collisionXY = collision.getCollision();

    // move Mario down if we dont hold "spacebar" && no block under us
    if (!map[keyCode.SPACE] && !collisionXY.down) {
        marioDown();
    }

    // clear mario acceleration
    if (!map[keyCode.LEFT] && !map[keyCode.RIGHT]) {
        clearInterval(interval);
        interval = null;
        marioSpeed = 1;
    }

    // if we hold SPACE => mario is on Air
    if (map[keyCode.SPACE]) collision.marioInAir = true;

    // move Mario up on "spacebar" and if mario under max jump height
    if (map[keyCode.SPACE] && curTransform.m42 >= collision.marioMaxJumpHeight) {
        if (collisionXY.up) {
            map[keyCode.SPACE] = false;
        } else {
            if (mario_sprite.src === spritePath.STAY_LEFT) {
                mario_sprite.src = spritePath.JUMP_LEFT;
            } else if (mario_sprite.src === spritePath.STAY_RIGHT) {
                mario_sprite.src = spritePath.JUMP_RIGHT;
            }
            small_jump_sound.play();
            marioJump();
        }
    }

    // move Mario right on "ArrowRight"
    if (map[keyCode.RIGHT] && !collisionXY.right) {
        // handle animation
        if (!collision.marioInAir) {
            mario_sprite.style.webkitAnimationPlayState = "running";
            mario_sprite.src = spritePath.MOVE_RIGHT;
        } else {
            mario_sprite.src = spritePath.JUMP_RIGHT;
            mario_sprite.style.webkitAnimationPlayState = "paused";
        }
        marioRight()
    }
    // move Mario left on "ArrowLeft"
    if (map[keyCode.LEFT] && !collisionXY.left) {
        // cant move lefter than game screen
        if (curTransform.m41 > game_screen.scrollLeft) {
            // handle animation
            if (!collision.marioInAir) {
                mario_sprite.style.webkitAnimationPlayState = "running";
                mario_sprite.src = spritePath.MOVE_LEFT;
            } else {
                mario_sprite.src = spritePath.JUMP_LEFT;
                mario_sprite.style.webkitAnimationPlayState = "paused";
            }
            marioLeft();
        }
    }

    // music on ArrowUp
    // TEMPORARY
    if (map[38]) {
        bg_sound.play();
        bg_sound.loop = true;
    }

    // if we fall under map
    if (curTransform.m42 > 600) {
        marioDeath();
    }

    if (!collision.marioInAir) {
        let spriteSrc = mario_sprite.src.slice(ADDRESS_LENGTH);
        if (spriteSrc === spritePath.JUMP_RIGHT) {
            mario_sprite.src = spritePath.STAY_RIGHT;
        } else if (spriteSrc === spritePath.JUMP_LEFT) {
            mario_sprite.src = spritePath.STAY_LEFT;
        }
    }

}

// mario speed acceleration
const speedUp = () => {

    if (marioSpeed === 3) {
        clearInterval(interval);
        interval = null;
        return;
    }

    marioSpeed += 1;
}


let count = 0

// move Mario right to 1px 1000/60 times in 1 sec
const marioRight = () => {

    // we won!!!
    // 208 blocks with width 30
    if (curTransform.m41 > 206 * 30) {
        bg_sound.stop();
        stage_clear_sound.play();
        gamestate = GAMESTATE.WINNER;
    }

    // 208 blocks with width 30
    if (curTransform.m41 > 206 * 30) return

    curTransform = new WebKitCSSMatrix(window.getComputedStyle(mario).webkitTransform);
    mario.style.transform = "translateX(" + (curTransform.m41 + marioSpeed) + "px) translateY(" + curTransform.m42 + "px)";

    if (interval === null && marioSpeed === 1) {
        interval = setInterval(speedUp, 400);
    }

    if (curTransform.m41 >= game_screen.offsetLeft + 400 + game_screen.scrollLeft) {
        game_screen.scrollLeft += marioSpeed;
        if (Math.floor(game_screen.scrollLeft / (PIXEL_SIZE * BLOCK_COUNT)) + 1 === count || count === 0) {
            count++;
            drawInGame((game_screen.offsetWidth - 2) / PIXEL_SIZE + BLOCK_COUNT + Math.floor(game_screen.scrollLeft / PIXEL_SIZE));
            collision.img = document.querySelectorAll(".blocks[opacity='1']");
            for (let i = 0; i < collision.img.length; i++) {
                if (collision.img[i].offsetLeft < game_screen.scrollLeft) {
                    collision.img[i].setAttribute("opacity", "0");
                }
            }
        }
    }

}

// move Mario left to mario speed 1000/60 times in 1 sec
const marioLeft = () => {

    curTransform = new WebKitCSSMatrix(window.getComputedStyle(mario).webkitTransform);
    mario.style.transform = "translateX(" + (curTransform.m41 - marioSpeed) + "px) translateY(" + curTransform.m42 + "px)";

    if (interval === null && marioSpeed === 1) {
        interval = setInterval(speedUp, 400);
    }

}

// move Mario up to gravity speed 1000/60 times in 1 sec
const marioJump = () => {
    curTransform = new WebKitCSSMatrix(window.getComputedStyle(mario).webkitTransform);
    // if on map max top pos
    if (curTransform.m42 <= 10) map[keyCode.SPACE] = false;

    // if mario jumped to max jump height => mario should fall
    if (curTransform.m42 === collision.marioMaxJumpHeight) map[keyCode.SPACE] = false;

    mario.style.transform = "translateX(" + curTransform.m41 + "px) translateY(" + (curTransform.m42 - gravitySpeed) + "px)";

}

// move Mario down to 2px 1000/60 times in 1 sec
const marioDown = () => {

    curTransform = new WebKitCSSMatrix(window.getComputedStyle(mario).webkitTransform);
    mario.style.transform = "translateX(" + curTransform.m41 + "px) translateY(" + (curTransform.m42 + gravitySpeed) + "px)";

}


//////////// GAME MENUES

const drawWinnerMenu = () => {
    let winnerMenu = document.createElement("div");
    winnerMenu.id = "winnerMenu";
    // winnerMenu.appendChild(document.createElement("p").innerText = "YOU WON!!!");
    winnerMenu.innerHTML = "YOU WON!!!<br><br>Congrats!!!";
    winnerMenu.style.display = 'flex';
    document.querySelectorAll('img').forEach(el => el.style.opacity === "0" ? el : el.style.opacity = "0.5");

    let restartBtn = document.createElement('div');
    restartBtn.id = "restart_btn";
    restartBtn.innerText = "RESTART GAME";
    restartBtn.onclick = function() {
        timeout_f();

        mario_sprite.style.opacity = "1";

        // change sounds
        bg_sound.stop();
        // delete everything
        deleleteLevel();
        // create level again
        createLevel();

        collision = new Collision();
        curTransform = new WebKitCSSMatrix(window.getComputedStyle(mario).webkitTransform);

        // empty all keys in map
        map[keyCode.LEFT] = false;
        map[keyCode.RIGHT] = false;
        map[keyCode.SPACE] = false;

        // restart mario position
        mario.style.transform = "translateX(10px) translateY(330px)";
        // mario defaul sprite
        mario_sprite.src = spritePath.DEFAULT;
        // initial game screen position
        game_screen.scrollLeft = 0;

        marioLives = 3;
        game_ui.marioScore = 0;
        game_ui.scoreboard.innerText = 0;
        game_ui.updateLives(3);
        gamestate = GAMESTATE.RUNNING;

        count = 0;

        clearWinnerMenu();
        requestAnimationFrame(Run);
    }
    winnerMenu.append(restartBtn);
    game_screen.appendChild(winnerMenu);
}

const clearWinnerMenu = () => {
    document.getElementById('winnerMenu').remove();
}

const drawGameMenu = () => {
    let menu = document.createElement('div');
    menu.id = "game_menu";

    let startBtn = document.createElement('div');
    let restartBtn = document.createElement('div');
    startBtn.id = "start_btn";
    restartBtn.id = "restart_btn";

    startBtn.innerText = "START GAME";
    restartBtn.innerText = "RESTART GAME";

    startBtn.onclick = function() {
        timeout_f();
        requestAnimationFrame(Run);
        clearGameMenu();
        game_ui.marioScore = 0;
        game_ui.scoreboard.innerText = 0;
        game_ui.updateLives(3);
        marioLives = 3;
        gamestate = GAMESTATE.RUNNING;
    }
    restartBtn.onclick = function() {
        timeout_f();
        requestAnimationFrame(Run);
        clearGameMenu();
        game_ui.marioScore = 0;
        game_ui.scoreboard.innerText = 0;
        game_ui.updateLives(3);
        marioLives = 3;
        gamestate = GAMESTATE.RUNNING;
    }


    menu.append(startBtn);
    menu.append(restartBtn);

    document.body.append(menu);
}

const timeout_f = () => {
    // timeout warning 30 secs left
    setTimeout(() => {
        timeout_warning_sound.play();
    }, 270000);
    // timeout death
    setTimeout(() => {
        marioLives = 0;
        marioDeath();
    }, 300000);
}

const clearGameMenu = () => {
    document.getElementById('game_menu').remove();
}

const pauseGame = () => {
    let pauseMenu = document.getElementById('pauseMenu');
    pauseMenu.style.display = 'flex';

    document.querySelectorAll('img').forEach(el => el.style.opacity === "0" ? el : el.style.opacity = "0.5");
}

//////////////// enemy movement
const ENEMYSPEED = 2;

const moveEnemy = () => {

    let enemy = game_screen.querySelectorAll(".enemy[opacity='1']");

    for (let i = 0; i < enemy.length; i++) {

        let el = enemy[i];
        let curTransformEnemy = new WebKitCSSMatrix(window.getComputedStyle(el).webkitTransform);

        const collisionEnemy = (curTransformEnemy, el) => {
            // if mario and enemy in one Y-axis
            if (
                (curTransform.m41 + 30 >= curTransformEnemy.m41 &&
                    curTransform.m41 + 30 <= curTransformEnemy.m41 + 30) ||
                (curTransform.m41 <= curTransformEnemy.m41 + 30 &&
                    curTransform.m41 >= curTransformEnemy.m41)
            ) {
                if (curTransformEnemy.m42 === curTransform.m42 + mario.offsetHeight) {
                    // we hit enemy add score and remove enemy
                    el.setAttribute("opacity", "0");
                    el.style.opacity = 0;
                    game_ui.updateScore(100);
                }
            }
            // if enemy is outside left make it invisible
            if (curTransformEnemy.m41 < game_screen.scrollLeft - 30) el.setAttribute("opacity", "0");
            // if mario hits enemy death
            if (curTransform.m42 - 2 === curTransformEnemy.m42) {
                if (curTransformEnemy.m41 - 32 < curTransform.m41 && curTransformEnemy.m41 - 30 > curTransform.m41 ||
                    curTransformEnemy.m41 + 28 > curTransform.m41 && curTransformEnemy.m41 - 30 < curTransform.m41
                ) {
                    marioDeath();
                    return
                }
            }
            // enemy moves left till it collide to other block
            if (el.classList.contains("left")) {
                if ((level1[Math.floor(curTransformEnemy.m42 / 30)][Math.floor(curTransformEnemy.m41 / 30) - 1] === 0 ||
                        level1[Math.floor(curTransformEnemy.m42 / 30)][Math.floor(curTransformEnemy.m41 / 30) - 1] === 7) &&
                    level1[Math.floor(curTransformEnemy.m42 / 30) + 1][Math.floor(curTransformEnemy.m41 / 30)] !== 0
                ) {
                    return
                }
                el.classList.remove("left");
                return

            } else {
                if ((level1[Math.floor(curTransformEnemy.m42 / 30)][Math.floor(curTransformEnemy.m41 / 30) + 1] === 0 ||
                        level1[Math.floor(curTransformEnemy.m42 / 30)][Math.floor(curTransformEnemy.m41 / 30) + 1] === 7) &&
                    level1[Math.floor(curTransformEnemy.m42 / 30) + 1][Math.floor(curTransformEnemy.m41 / 30) + 1] !== 0) {
                    return
                }
                el.classList.add("left");
                return
            }
        };
        collisionEnemy(curTransformEnemy, el);
        if (el.classList.contains("left")) {
            el.style.transform = "translateX(" + (curTransformEnemy.m41 - ENEMYSPEED) + "px) translateY(" + curTransformEnemy.m42 + "px)";
        } else {
            el.style.transform = "translateX(" + (curTransformEnemy.m41 + ENEMYSPEED) + "px) translateY(" + curTransformEnemy.m42 + "px)";
        }
    }
}

const Run = () => {
    moveMario();
    moveEnemy();
    if (gamestate === GAMESTATE.RUNNING) {
        requestAnimationFrame(Run);
    }
    if (gamestate === GAMESTATE.MENU || gamestate === GAMESTATE.WINNER) {
        cancelAnimationFrame(Run);
        if (gamestate === GAMESTATE.MENU) drawGameMenu();
        // if (gamestate === GAMESTATE.PAUSED) pauseGame()
        if (gamestate === GAMESTATE.WINNER) drawWinnerMenu();
    }
}

// start animation
// initEnemies()
requestAnimationFrame(Run)
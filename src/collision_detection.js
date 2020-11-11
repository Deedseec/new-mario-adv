import { marioDeath } from "./index.js"
import { marioSpeed } from "./index.js"
import { game_ui } from "./index.js"


// accuracy of mario speed, to not enter the game objects
let accuracy = 1;

export default class Collision {
    constructor(marioScore) {
        this.mario = document.getElementById('mario');
        this.img = document.querySelectorAll(".game_objects[opacity='1']");
        // mario max jump height
        this.marioMaxJumpHeight = new WebKitCSSMatrix(window.getComputedStyle(mario).webkitTransform).m42 - 5 * mario.offsetHeight;
        // is mario on Air?
        this.marioInAir = false;
    }
    getCollision() {
        let curTransformMario = new WebKitCSSMatrix(window.getComputedStyle(mario).webkitTransform);
        // let curTransformGameObjects = new WebKitCSSMatrix(window.getComputedStyle(mario).webkitTransform);

        let collision = {
            right: false,
            left: false,
            up: false,
            down: false,
        }

        for (let i = 0; i < this.img.length; i++) {
            //      X AXIS
            // if block is beyond game screen
            if (this.img[i].getAttribute("opacity") === 0) continue
            // if block is righter than mario
            if (this.img[i].offsetLeft > curTransformMario.m41+60) continue            
            // if block is lefter than mario
            if (this.img[i].offsetLeft < curTransformMario.m41-90) continue
            // on one Y axis
            if (
                (curTransformMario.m42 + this.mario.offsetHeight > this.img[i].offsetTop &&
                    curTransformMario.m42 + this.mario.offsetHeight <= this.img[i].offsetTop + this.img[i].offsetHeight) ||
                (curTransformMario.m42 < this.img[i].offsetTop + this.img[i].offsetHeight &&
                    curTransformMario.m42 >= this.img[i].offsetTop)
            ) {
                // if right side of game element > left side of this.mario + this.mario speed
                if (this.img[i].offsetLeft + this.img[i].offsetWidth >= curTransformMario.m41 - marioSpeed - accuracy &&
                    this.img[i].offsetLeft + this.img[i].offsetWidth <= curTransformMario.m41 - marioSpeed + accuracy) {
                    // we hit enemy while moving, we dead
                    if (this.img[i].classList.contains("enemy")) {
                        marioDeath()
                    }
                    collision.left = true
                }

                // if left side of game element < left side of this.mario + this.mario width + this.mario speed
                if (this.img[i].offsetLeft <= curTransformMario.m41 + this.mario.offsetWidth + marioSpeed + accuracy &&
                    this.img[i].offsetLeft >= curTransformMario.m41 + this.mario.offsetWidth + marioSpeed - accuracy) {
                    // we hit enemy while moving, we dead
                    if (this.img[i].classList.contains("enemy")) {
                        marioDeath()
                    }
                    collision.right = true
                }
            }

            //     Y AXIS
            if (
                (curTransformMario.m41 + this.mario.offsetWidth >= this.img[i].offsetLeft &&
                    curTransformMario.m41 + this.mario.offsetWidth <= this.img[i].offsetLeft + this.img[i].offsetWidth) ||
                (curTransformMario.m41 <= this.img[i].offsetLeft + this.img[i].offsetWidth &&
                    curTransformMario.m41 >= this.img[i].offsetLeft)
            ) {
                // if bottom of game element = top of this.mario
                if (this.img[i].offsetTop + this.img[i].offsetHeight === curTransformMario.m42) {
                    collision.up = true
                }
                // if top of game element = bottom of this.mario
                if (this.img[i].offsetTop === curTransformMario.m42 + this.mario.offsetHeight) {
                    // we hit enemy add score and remove enemy
                    if (this.img[i].classList.contains("enemy")) {
                        game_ui.updateScore(100)
                        document.getElementById("gameScreenHidden").removeChild(this.img[i]);
                    }
                    // if this.mario is on block => make this.mario max jump height
                    this.marioMaxJumpHeight = curTransformMario.m42 - 5 * this.mario.offsetHeight;
                    // if this.mario on block => this.mario is not on air
                    this.marioInAir = false;
                    collision.down = true
                }
            }
        }

        return collision
    }

    // collisionXaxis() {
    //     let collisionX = {
    //         left: false,
    //         right: false
    //     }

    //     for (let i = 0; i < this.img.length; i++) {
    //         // on one Y axis
    //         if (
    //             (curTransformMario.m42 + this.mario.offsetHeight > this.img[i].offsetTop &&
    //                 curTransformMario.m42 + this.mario.offsetHeight <= this.img[i].offsetTop + this.img[i].offsetHeight) ||
    //             (curTransformMario.m42 < this.img[i].offsetTop + this.img[i].offsetHeight &&
    //                 curTransformMario.m42 >= this.img[i].offsetTop)
    //         ) {
    //             // if right side of game element > left side of this.mario + this.mario speed
    //             if (this.img[i].offsetLeft + this.img[i].offsetWidth >= curTransformMario.m41 - marioSpeed - accuracy &&
    //                 this.img[i].offsetLeft + this.img[i].offsetWidth <= curTransformMario.m41 - marioSpeed + accuracy) {
    //                 // we hit enemy while moving, we dead
    //                 if (this.img[i].classList.contains("enemy")) {
    //                     marioDeath()
    //                 }
    //                 collisionX.left = true
    //                     // return true
    //             }

    //             // if left side of game element < left side of this.mario + this.mario width + this.mario speed
    //             if (this.img[i].offsetLeft <= curTransformMario.m41 + this.mario.offsetWidth + marioSpeed + accuracy &&
    //                 this.img[i].offsetLeft >= curTransformMario.m41 + this.mario.offsetWidth + marioSpeed - accuracy) {
    //                 // we hit enemy while moving, we dead
    //                 if (this.img[i].classList.contains("enemy")) {
    //                     marioDeath()
    //                 }
    //                 collisionX.right = true
    //                     // return true
    //             }
    //             // }
    //         }
    //     }

    //     return collisionX
    // }
    // collisionYaxis() {
    //     let collisionY = {
    //         up: false,
    //         down: false
    //     }

    //     for (let i = 0; i < this.img.length; i++) {
    //         // on one element in X axis
    //         if (
    //             (curTransformMario.m41 + this.mario.offsetWidth >= this.img[i].offsetLeft &&
    //                 curTransformMario.m41 + this.mario.offsetWidth <= this.img[i].offsetLeft + this.img[i].offsetWidth) ||
    //             (curTransformMario.m41 <= this.img[i].offsetLeft + this.img[i].offsetWidth &&
    //                 curTransformMario.m41 >= this.img[i].offsetLeft)
    //         ) {
    //             // if bottom of game element = top of this.mario
    //             if (this.img[i].offsetTop + this.img[i].offsetHeight === curTransformMario.m42) {
    //                 collisionY.up = true
    //             }
    //             // if top of game element = bottom of this.mario
    //             if (this.img[i].offsetTop === curTransformMario.m42 + this.mario.offsetHeight) {
    //                 // we hit enemy add score and remove enemy
    //                 if (this.img[i].classList.contains("enemy")) {
    //                     this.marioScore += 100;
    //                     document.getElementById("gameScreenHidden").removeChild(this.img[i]);
    //                 }
    //                 // if this.mario is on block => make this.mario max jump height
    //                 this.marioMaxJumpHeight = curTransformMario.m42 - 5 * this.mario.offsetHeight;
    //                 // if this.mario on block => this.mario is not on air
    //                 this.marioInAir = false;
    //                 collisionY.down = true
    //             }
    //         }
    //     }
    //     return collisionY
    // }
}
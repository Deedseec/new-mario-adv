let enemy = document.getElementsByClassName("enemy")[0]
let left = enemy.offsetLeft;
let right = enemy.offsetLeft + 100;

export function enemyMovement() {
    if (enemy.offsetLeft === left) {
        requestAnimationFrame(enemyRight)
    } else  if (enemy.offsetLeft === right) {
        requestAnimationFrame(enemyLeft)
    }
    requestAnimationFrame(enemy)
}

function enemyLeft() {
    enemy.style.left = enemy.offsetLeft - 1 + "px"
    requestAnimationFrame(enemyLeft)
}

function enemyRight() {
    enemy.style.left = enemy.offsetLeft + 1 + "px"
    requestAnimationFrame(enemyRight)
}

// GAMEUI block
export default class GAMEUI {
    constructor() {
        // this.gameui = document.createElement('div');
        // this.gameui.id = "GAMEUI";
        this.gameui = document.getElementById('gameScreen');
        // scoreboard block
        this.scoreboard = document.createElement('div');
        this.scoreboard.id = "scoreboard";
        this.scoreboard.innerText = "Score: 0";
        // lives block
        this.lives = document.createElement('div');
        this.lives.id = "lives";
        this.lives.innerText = "Lives: 3";

        this.marioScore = 0;

        this.gameui.append(this.scoreboard);
        this.gameui.append(this.lives);

        // document.body.append(this.gameui);     
    }
    updateLives(marioLives) {
        this.lives.innerText = "Lives: " + marioLives;
    }
    updateScore(points) {
        this.marioScore += points;
        this.scoreboard.innerText = "Score: " + this.marioScore;
    }
}
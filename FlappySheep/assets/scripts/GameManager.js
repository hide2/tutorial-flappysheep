cc.Class({
    extends: cc.Component,
    properties: {
        gameOverMenu: cc.Node,
        scoreText: cc.Label
    },
    onLoad () {
        Global.gameManager = this;
        cc.director.getCollisionManager().enabled = true;
        this.gameOverMenu.active = false;
        this.score = 0;
        this.scoreText.string = this.score;
    },
    start () {
        Global.scroller.startMove();
        Global.pipeManager.startSpawn();
        Global.sheep.startRun();
    },
    gainScore () {
        this.score++;
        this.scoreText.string = this.score;
    },
    gameOver () {
        this.gameOverMenu.active = true;
        Global.scroller.stopMove();
        Global.pipeManager.stopSpawn();
        Global.sheep.stopRun();
    }
});
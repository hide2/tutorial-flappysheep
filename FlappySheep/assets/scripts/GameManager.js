var GameManager = cc.Class({
    extends: cc.Component,
    properties: {
        gameOverMenu: cc.Node,
    },
    onLoad () {
    	Global.gameManager = this;
    	this.gameOverMenu.active = false;
    },
    start () {
        Global.pipeManager.startSpawn();
    },
    gameOver () {
    	this.gameOverMenu.active = true;
    }
});
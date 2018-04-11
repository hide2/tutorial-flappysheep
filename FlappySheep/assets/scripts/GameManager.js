cc.Class({
    extends: cc.Component,
    properties: {
        gameOverMenu: cc.Node,
        scoreText: cc.Label,
        scoreMain: cc.Label,
        gameBgAudio: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        },
        dieAudio: {
            default: null,
            url: cc.AudioClip
        },
        gameOverAudio: {
            default: null,
            url: cc.AudioClip
        }
    },
    onLoad () {
        Global.gameManager = this;
        cc.director.getCollisionManager().enabled = true;
        this.gameOverMenu.active = false;
        this.score = 0;
        this.scoreText.string = this.score;
        this.scoreMain.string = this.score;
    },
    start () {
        Global.scroller.startMove();
        Global.pipeManager.startSpawn();
        Global.sheep.startRun();
        cc.audioEngine.playMusic(this.gameBgAudio);
    },
    gainScore () {
        this.score++;
        this.scoreText.string = this.score;
        this.scoreMain.string = this.score;
        cc.audioEngine.playEffect(this.scoreAudio);
    },
    gameOver () {
        this.gameOverMenu.active = true;
        Global.scroller.stopMove();
        Global.pipeManager.stopSpawn();
        Global.sheep.stopRun();
        cc.audioEngine.stopMusic(this.gameBgAudio);
        cc.audioEngine.playEffect(this.dieAudio);
        cc.audioEngine.playEffect(this.gameOverAudio);
    }
});
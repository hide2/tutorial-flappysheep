cc.Class({
    extends: cc.Component,
    properties: {
        maxY: 0,
        groundY: 0,
        gravity: 0,
        initJumpSpeed: 0
    },
    onLoad () {
        Global.sheep = this;
        this.currentSpeed = 0;
        this.anim = this.getComponent(cc.Animation);
    },
    changeState (state) {
        this.state = state;
        this.anim.stop();
        this.anim.play(state);
    },
    jump () {
        this.changeState('Jump');
        this.currentSpeed = this.initJumpSpeed;
    },
    startRun () {
        this.changeState('Run');
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                this.jump();
                return true;
            }.bind(this)
        }, this.node);
    },
    stopRun () {
        this.changeState('Dead');
        cc.eventManager.pauseTarget(this.node);
    },
    onCollisionEnter (other) {
        var group = cc.game.groupList[other.node.groupIndex];
        if (group === 'pipe') {
            Global.gameManager.gameOver();
        }
        else if (group === 'score') {
            Global.gameManager.gainScore();
        }
    },
    update (dt) {
        switch (this.state) {
            case 'Jump':
                if (this.currentSpeed < 0) {
                    this.changeState('Drop');
                }
                break;
            case 'Drop':
                if (this.node.y < this.groundY) {
                    this.node.y = this.groundY;
                    this.changeState('Run');
                }
                break;
            case 'Dead':
                return;
        }
        if (this.node.y > this.maxY) {
            this.node.y = this.maxY;
            this.changeState('Drop');
        }
        var flying = this.state === 'Jump' || this.node.y > this.groundY;
        if (flying) {
            this.currentSpeed -= dt * this.gravity;
            this.node.y += dt * this.currentSpeed;
        }
    },
});
# 7. 添加分数和音效

## 添加分数

- 层级管理器->Canvas，右键新建Sprite节点，命名scoreIcon，修改Position数值X=-450，Y=645，Scale数值X=-0.5，Y=0.5，将assets\sprites\sheep\sheep_run_01拖拽到SpriteFrame
![7-1](/7-1.png)
- 层级管理器->Canvas->scoreIcon，右键新建Lable子节点，命名为score，修改Position数值X=-171，Y=40，Scale数值X=-3，Y=3，将assets\fonts\flappybird字体文件拖拽到Font
![7-2](/7-2.png)
- 修改GameManager脚本，初始化和更新分数，并将scoreIcon->score拖拽到GameManager脚本属性面板的scoreMain节点
```js
cc.Class({
    extends: cc.Component,
    properties: {
        gameOverMenu: cc.Node,
        scoreText: cc.Label,
        scoreMain: cc.Label
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
    },
    gainScore () {
        this.score++;
        this.scoreText.string = this.score;
        this.scoreMain.string = this.score;
    },
    gameOver () {
        this.gameOverMenu.active = true;
        Global.scroller.stopMove();
        Global.pipeManager.stopSpawn();
        Global.sheep.stopRun();
    }
});
```
- 点击预览，在浏览器中实时查看主界面上得分数
![7-3](/7-3.png)

## 导入音效文件

- 选中资源管理器->assets，右键新建文件夹musics
- 将之前下载的美术资源assets\musics下的mp3文件拖拽到资源管理器->assets->musics文件夹下（这里的gameBg.mp3在手机上播放不出来，可以自己替换一个mp3文件）
![7-4](/7-4.png)

## 脚本控制播放音效
- 修改GameManager和Sheep脚本，增加音效属性和播放停止代码，并在属性面板里将音效资源拖拽到对应的audio-clip上
![7-5](/7-5.png)
- GameManager
```js
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
        cc.audioEngine.play(this.gameBgAudio);
    },
    gainScore () {
        this.score++;
        this.scoreText.string = this.score;
        this.scoreMain.string = this.score;
        cc.audioEngine.play(this.scoreAudio);
    },
    gameOver () {
        this.gameOverMenu.active = true;
        Global.scroller.stopMove();
        Global.pipeManager.stopSpawn();
        Global.sheep.stopRun();
        cc.audioEngine.stopAll();
        cc.audioEngine.play(this.dieAudio);
        cc.audioEngine.play(this.gameOverAudio);
    }
});
```
- Sheep
```js
cc.Class({
    extends: cc.Component,
    properties: {
        maxY: 0,
        groundY: 0,
        gravity: 0,
        initJumpSpeed: 0,
        jumpAudio: {
            default: null,
            url: cc.AudioClip
        }
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
        cc.audioEngine.play(this.jumpAudio);
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
```
- 点击预览，并打开音箱，边在浏览器中玩边听背景音乐和跳跃、得分、死亡、失败音效
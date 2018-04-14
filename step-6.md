# 6. 实现游戏循环

## 导入位图字体

- 资源管理器->assets文件夹，右键新建子文件夹fonts
- 将之前下载的美术资源assets\fonts下的png文件和fnt文件拖拽到资源管理器->assets->fonts文件夹下
![6-1](/6-1.png)

## 创建GameOver界面

- 资源管理器->assets->sprites文件夹，右键新建子文件夹ui
- 将之前下载的美术资源assets\sprites\ui下的png文件拖拽到资源管理器->assets->sprites->ui文件夹下
![6-2](/6-2.png)
- 层级管理器->Canvas，右键新建Sprite节点，命名gameover，修改Size数值W=505，H=361，将assets->sprites->ui->gameoverbg拖拽到SpriteFrame
![6-3](/6-3.png)
- 层级管理器->Canvas->gameover，右键新建Label子节点，命名gameoverTitle，修改Position数值Y=84，Color=#DA4525，String=Game Over，FontSize=80，LineHeight=80，将assets\fonts\flappybird字体文件拖拽到Font
![6-4](/6-4.png)
- 层级管理器->Canvas->gameover，右键新建Label子节点，命名scoreTitle，修改Position数值X=-7，Y=-16，Anchor数值X=1，String=score，FontSize=60，LineHeight=60，将assets\fonts\flappybird字体文件拖拽到Font
![6-5](/6-5.png)
- 层级管理器->Canvas->gameover，右键新建Label子节点，命名score，修改Position数值X=5，Y=-16，Anchor数值X=0，Color=#F3C319，String=999，FontSize=60，LineHeight=60，将assets\fonts\flappybird字体文件拖拽到Font
![6-6](/6-6.png)
- 层级管理器->Canvas->gameover，右键新建Button子节点，命名replay，删除replay的Label子节点，修改Position数值Y=-107，将assets->sprites->ui->button_play拖拽到SpriteFrame，Transition=SCALE
![6-7](/6-7.png)

## 编辑GameOver脚本

- 修改GameManager脚本，默认隐藏GameOver界面，并把gameover节点拖拽绑定到Game节点对应的GameManager脚本的Game Over Menu节点
```js
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
```
- 修改Sheep脚本，死亡显示GameOver界面
```js
onCollisionEnter: function (other) {
    var group = cc.game.groupList[other.node.groupIndex];
    if (group === 'pipe') {
        this.changeState('Dead');
        Global.gameManager.gameOver();
    }
    else if (group === 'score') {
        this.score = this.score || 0;
        this.score++;
        console.log(this.score);
    }
},
```
- 资源管理器->assets->scripts，右键新建JavaScript，命名GameOverMenu
```js
var GameOverMenu = cc.Class({
    extends: cc.Component,
    properties: {
        score: cc.Label
    },
    restart: function () {
        cc.director.loadScene('Game');
    },
});
```
- 选中层级管理器的gameover节点，将assets->scripts->GameOverMenu脚本拖拽到属性检查器面板，并将gameover->score子节点拖拽到脚本的Score节点绑定
![6-8](/6-8.png)
- 选中gameover->replay按钮节点，修改Click Events为1，拖拽gameover节点，选择GameOverMenu脚本，选择restart方法
![6-9](/6-9.png)

## 编辑GameManager脚本，实现游戏循环开始、过程、结束、重新开始

- 游戏开始，初始化积分、卷屏状态、管道状态、绵羊状态
- 游戏过程，更新积分
- 游戏结束，显示结算界面和积分、更新卷屏状态、更新管道状态、更新绵羊状态
- 重新开始，重新加载场景

完整的代码修改如下：

- Globals
```js
window.Global = {
    gameManager: null,
    scroller: null,
    pipeManager: null,
    sheep: null
};
```
- GameManager
```js
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
```
- Scroller
```js
cc.Class({
    extends: cc.Component,
    properties: {
        speed: 0,
        resetX: 0
    },
    onLoad () {
        Global.scroller = this;
    },
    startMove () {
        this.move = true;
    },
    stopMove () {
        this.move = false;
    },
    update (dt) {
        if (this.move) {
            var x = this.node.x;
            x += this.speed * dt;
            if (x <= this.resetX) {
                x -= this.resetX;
            }
            this.node.x = x;
        }
    }
});
```
- PipeGroupManager
```js
const PipeGroup = require('PipeGroup');

cc.Class({
    extends: cc.Component,
    properties: {
        pipePrefab: cc.Prefab,
        pipeLayer: cc.Node,
        initPipeX: 0,
        spawnInterval: 0
    },
    onLoad () {
        Global.pipeManager = this;
    },
    startSpawn () {
        this.move = true;
        this.spawnPipe();
        this.schedule(this.spawnPipe, this.spawnInterval);
    },
    stopSpawn () {
        this.move = false;
        this.unschedule(this.spawnPipe);
    },
    spawnPipe () {
        let pipeGroup = null;
        if (cc.pool.hasObject(PipeGroup)) {
            pipeGroup = cc.pool.getFromPool(PipeGroup);
        } else {
            pipeGroup = cc.instantiate(this.pipePrefab).getComponent(PipeGroup);
        }
        this.pipeLayer.addChild(pipeGroup.node);
        pipeGroup.node.active = true;
        pipeGroup.node.x = this.initPipeX;
    },
    destroyPipe (pipeGroup) {
        pipeGroup.node.removeFromParent();
        pipeGroup.node.active = false;
        cc.pool.putInPool(pipeGroup);
    }
});
```
- PipeGroup
```js
cc.Class({
    extends: cc.Component,
    properties: {
        speed: 0,
        botYRange: cc.p(0, 0),
        spacingRange: cc.p(0, 0),
        topPipe: cc.Node,
        botPipe: cc.Node
    },
    onEnable () {
        let botYPos = this.botYRange.x + Math.random() * (this.botYRange.y - this.botYRange.x);
        let space = this.spacingRange.x + Math.random() * (this.spacingRange.y - this.spacingRange.x);
        let topYPos = botYPos + space;
        this.topPipe.y = topYPos;
        this.botPipe.y = botYPos;
    },
    update (dt) {
        if (Global.pipeManager.move) {
            this.node.x += this.speed * dt;

            var disappear = this.node.getBoundingBoxToWorld().xMax < 0;
            if (disappear) {
                Global.pipeManager.destroyPipe(this);
            }
        }
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
```
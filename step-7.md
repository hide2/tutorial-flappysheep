# 7. 添加分数和音效

## 添加分数

- 层级管理器->Canvas，右键新建Sprite节点，命名scoreIcon，修改Position数值X=-450，Y=645，Scale数值X=-0.3，Y=0.3，将assets\sprites\sheep\sheep_run_01拖拽到SpriteFrame
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
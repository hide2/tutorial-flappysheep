# 6. 实现游戏循环

## 导入位图字体

- 资源管理器->assets文件夹，右键新建子文件夹fonts
- 将之前下载的美术资源assets\fonts下的png文件和fnt文件拖拽到资源管理器->assets->fonts文件夹下
![6-1](/6-1.png)

## 创建GameOver界面

- 资源管理器->assets->sprites文件夹，右键新建子文件夹ui
- 将之前下载的美术资源assets\sprites\ui下的png文件拖拽到assets\sprites\ui文件夹下
![6-2](/6-2.png)
- 层级管理器->Canvas，右键新建Sprite节点，命名gameover，修改Size数值W=505，H=361，将assets\sprites\ui\gameoverbg拖拽到SpriteFrame
![6-3](/6-3.png)
- 层级管理器->Canvas->gameover，右键新建Label子节点，命名gameoverTitle，修改Position数值Y=84，Color=#DA4525，String=Game Over，FontSize=80，LineHeight=80，将assets\fonts\flappybird字体文件拖拽到Font
![6-4](/6-4.png)
- 层级管理器->Canvas->gameover，右键新建Label子节点，命名scoreTitle，修改Position数值X=-7，Y=-16，Anchor数值X=1，String=score，FontSize=60，LineHeight=60，将assets\fonts\flappybird字体文件拖拽到Font
![6-5](/6-5.png)
- 层级管理器->Canvas->gameover，右键新建Label子节点，命名score，修改Position数值X=5，Y=-16，Anchor数值X=0，Color=#F3C319，String=999，FontSize=60，LineHeight=60，将assets\fonts\flappybird字体文件拖拽到Font
![6-6](/6-6.png)
- 层级管理器->Canvas->gameover，右键新建Button子节点，命名replay，删除replay的Label子节点，修改Position数值Y=-107，将assets\sprites\ui\button_play拖拽到SpriteFrame，Transition=SCALE
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

- 游戏开始，初始化游戏状态、积分、卷屏状态、管道状态、绵羊状态
- 游戏过程，更新积分
- 游戏结束，更新游戏状态、显示结算界面和积分、更新卷屏状态、更新管道状态、更新绵羊状态
- 重新开始，重新加载场景

完整的代码修改如下：

- GameManager

- Scroller

- PipeGroupManager

- Sheep
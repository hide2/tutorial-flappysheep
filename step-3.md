# 创建障碍物（初始化，移动，销毁）

## 创建pipeLayer节点

- 层级管理器，选中Canvas，右键创建空节点pipeLayer，用于稍后动态添加管道障碍物节点
![3-1](/3-1.png)

## 创建Game节点

- 层级管理器，选中Canvas，右键创建空节点Game，用于挂载脚本控制游戏
![3-2](/3-2.png)

## 创建Globals，PipeGroup，PipeGroupManager，GameManager脚本

- 资源管理器，选中scripts文件夹，右键新建JavaScript，命名为Globals，修改代码如下
```js
window.Global = {
    pipeManager: null,
};
```
- 资源管理器，选中scripts文件夹，右键新建JavaScript，命名为PipeGroup，修改代码如下
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
        this.node.x += this.speed * dt;

        var disappear = this.node.getBoundingBoxToWorld().xMax < 0;
        if (disappear) {
            Global.pipeManager.destroyPipe(this);
        }
    }
});
```
- 资源管理器，选中scripts文件夹，右键新建JavaScript，命名为PipeGroupManager，修改代码如下
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
        this.spawnPipe();
        this.schedule(this.spawnPipe, this.spawnInterval);
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
    destroyPipe (pipe) {
        pipe.node.removeFromParent();
        pipe.node.active = false;
        cc.pool.putInPool(pipe);
    },
    stop () {
        this.unschedule(this.spawnPipe);
    }
});
```
- 资源管理器，选中scripts文件夹，右键新建JavaScript，命名为GameManager，修改代码如下
```js
var GameManager = cc.Class({
    extends: cc.Component,
    properties: {
    },
    start () {
        Global.pipeManager.startSpawn();
    }
});
```
![3-3](/3-3.png)

## 制作管道prefab

- 调整一下层级管理器里节点的顺序，从上到下一依次为sky、bg、pipeLayer、ground、Game，这样才能确保地表ground遮盖住管道下沿pipeLayer
- 层级管理器，选中Canvas下的pipeLayer，右键创建空节点PipeGroup，并在PipeGroup节点下创建两个Sprite子节点pipeTop和pipeBottom
- 修改pipeTop和pipeBottom的Anchor数值Y=0，修改Size数值W=148，H=1024，修改pipeBottom的Scale数值Y=-1
- 将资源管理器->assets->sprites->background->pipe分别拖拽到pipeTop和pipeBottom的Sprite Frame
- 选中PipeGroup节点，将资源管理器->assets->scripts->PipeGroup拖拽到属性检查器面板，然后将pipeTop和pipeBottom子节点分别拖拽到属性检查器面板上的Top Pipe和Bot Pipe节点，修改数值Speed=-300，BotYRange数值X=-270，Y=-50，SpacingRange数值X=200，Y=375
![3-4](/3-4.png)
- 资源管理器，选中assets，右键新建文件夹prefabs，将层级管理器中的PipeGroup节点拖拽到assets->prefabs文件夹
- 选中层级管理器下的PipeGroup节点，右键删除节点
![3-5](/3-5.png)

## 挂载GameManager和PipeGroupManager脚本

- 双击打开资源管理器下的Game场景，选中层级管理器->Canvas下的Game，将资源管理器->assets->scripts->GameManager拖拽到属性检查器面板
- 选中层级管理器->Canvas下的Game，将资源管理器->assets->scripts->PipeGroupManager拖拽到属性检查器面板，然后将资源管理器->assets->prefabs->PipeGroup拖拽到属性检查器面板上的Pipe Prefab，将层级管理器->Canvas下的pipeLayer拖拽到Pipe Layer，修改数值InitPipeX=700, SpawnInterval=2
![3-5](/3-6.png)
- 点击预览箭头，在浏览器中预览我们创角好的Game场景和管道障碍物
![3-6](/3-7.png)
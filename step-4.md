# 4. 创建绵羊主角

## 导入图集资源

- 资源管理器->assets文件夹，右键新建子文件夹atlas
- 将之前下载的美术资源assets\atlas下的png文件和plist文件拖拽到资源管理器->assets->atlas文件夹下
![4-1](/4-1.png)

## 创建sheep节点

- 层级管理器，选中Canvas，右键创建Sprite节点sheep
- 选中sheep节点，将assets->atlas->actors->sheep_run_01拖拽到属性面板的Sprite Frame
- 选中sheep节点，修改Postion数值X=-281，Y=-352，修改Scale数值X=-1，修改Anchor数值Y=0，修改Size数值W=170，H=115
![4-2](/4-2.png)

## 创建绵羊奔跑动画

- 资源管理器->assets文件夹，右键新建子文件夹animations
- 选中assets->animations，右键新建Animation Clip，命名为Run
- 选中层级管理器中的sheep，属性面板点击添加组件->Animation，Clips改为1，将assets->animations->Run拖拽到Clips下
![4-3](/4-3.png)
- 打开动画编辑器，修改数值Sample=10，wrapMode=Loop，点击左上角图标编辑动画，属性列表里点击add property->cc.Sprite.spriteFrame，在0:00秒，0:01秒和0:03秒分别点击+号添加3帧，并将assets->atlas->actors->sheep_run_01，02和03拖拽到属性面板的Sprite Frame，点击播放按钮预览Run动画
![4-4](/4-4.png)

## 绵羊奔跑动画脚本

- 资源管理器，选中scripts文件夹，右键新建JavaScript，命名为Sheep，修改代码如下
```js
cc.Class({
    extends: cc.Component,

    properties: {
    },
    start () {
        this.anim = this.getComponent(cc.Animation);
        this.anim.play('Run');
    }
});
```
- 选中层级管理器->Canvas->sheep，将assets->scripts->Sheep拖拽到属性面板
![4-5](/4-5.png)

## 创建绵羊跳跃和落下动画

- 选中assets->animations，右键新建Animation Clip，命名为Jump和Drop
- 选中层级管理器中的sheep，属性面板Animation中的Clips改为3，将assets->animations->Jump和Drop拖拽到Clips下
- 打开动画编辑器，选择编辑Jump，修改数值Sample=10，wrapMode=Normal，属性列表里点击add property->cc.Sprite.spriteFrame，在0:00秒，0:01秒，0:03秒和0:05秒分别点击+号添加4帧，并将assets->atlas->actors->sheep_jump_02，01，02和03拖拽到属性面板的Sprite Frame，点击播放按钮预览Jump动画
- 打开动画编辑器，选择编辑Jump，修改数值Sample=10，wrapMode=Normal，属性列表里点击add property->cc.Sprite.spriteFrame，在0:00秒，0:02秒和0:04秒分别点击+号添加3帧，并将assets->atlas->actors->sheep_jump_03，04和05拖拽到属性面板的Sprite Frame，点击播放按钮预览Jump动画
![4-6](/4-6.png)

## 绵羊跳跃和落下动画脚本

- 修改assets->scripts->Sheep代码如下
```js
cc.Class({
    extends: cc.Component,

    properties: {
        maxY: 0,
        groundY: 0,
        gravity: 0,
        initJumpSpeed: 0,
    },
    changeState: function(state) {
        this.state = state;
        this.anim.stop();
        this.anim.play(state);
    },
    jump: function () {
        this.changeState('Jump');
        this.currentSpeed = this.initJumpSpeed;
    },
    start () {
        this.currentSpeed = 0;
        this.anim = this.getComponent(cc.Animation);
        this.changeState('Run');
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                this.jump();
                return true;
            }.bind(this)
        }, this.node);
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
- sheep节点的属性检查器里修改数值MaxY=620，GroundY=-352，Gravity=980，InitJumpSpeed=600
- 点击预览箭头，在浏览器中预览我们创角好的绵羊动画，并点击屏幕进行跳跃
![4-7](/4-7.png)
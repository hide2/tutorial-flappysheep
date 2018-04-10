# 5. 实现绵羊和管道碰撞

## 编辑分组

- 编辑器菜单项目->项目设置->分组管理，添加分组sheep，pipe，score
- 勾选允许碰撞的分组配对：sheep-score，sheep-pipe，保存
![5-1](/5-1.png)
- 选中层级管理器中的sheep节点，修改属性检查器中Group为sheep
- 双击打开assets->prefabs->PipeGroup，修改父节点PiepGroup的Group为score，子节点pipeTop和pipeBottom的Group为pipe
![5-2](/5-2.png)

## 创建碰撞组件

- 选中层级管理器中的sheep节点，属性检查器中点击添加组件->CircleCollider，修改Offset数值Y=50，Radius=60
![5-3](/5-3.png)
- 双击打开assets->prefabs->PipeGroup，属性检查器中点击添加组件->BoxCollider，修改Offset数值X=150，Size数值H=2048
![5-4](/5-4.png)
- 选中PipeGroup子节点pipeTop和pipeBottom，分别在属性检查器中点击添加组件->BoxCollider
![5-5](/5-5.png)

## 编辑碰撞代码

- 修改assets->scripts->Sheep代码，增加onCollisionEnter方法，代码如下
```js
start () {
        var cmanager = cc.director.getCollisionManager();
        cmanager.enabled = true;
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
    onCollisionEnter: function (other) {
        var group = cc.game.groupList[other.node.groupIndex];
        if (group === 'pipe') {
            console.log('dead');
        }
        else if (group === 'score') {
            this.score = this.score || 0;
            this.score++;
            console.log(this.score);
        }
    },
```
- 点击预览箭头，在浏览器中预览，并在控制台查看碰撞管道的打印和得分打印
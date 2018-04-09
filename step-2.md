# 创建Game场景和背景

## 导入美术资源

- 资源管理器，选中assets，右键新建文件夹sprites
- 选中sprites文件夹，右键新建子文件夹background
- 将之前下载的美术资源assets\sprites\background下的3个png文件拖拽到资源管理器->assets->sprites->background文件夹下
![2-1](/2-1.png)

## 创建Game场景
- 资源管理器，选中assets，右键新建文件夹scenes
- 选中scenes文件夹，右键新建Scene，命名为Game，双击打开Game场景
- 层级管理器，选中Canvas，修改属性检查器中Design Resolution数值W=1000，H=1366，勾选Fit Height
![2-2](/2-2.png)

## 创建背景、地面和天空
- 拖拽资源管理器->assets->sprites->bg到层级管理器->Canvas，修改Position数值Y=-97，修改Size数值W=1100
![2-3](/2-3.png)
- 拖拽资源管理器->assets->sprites->ground到层级管理器->Canvas，修改Position数值Y=-347，修改Anchor数值Y=1，修改Size数值W=1100，H=652，Type选择SLICED，编辑Sprite Frame数值Top=48，Bottom=17
![2-4](/2-4.png)
- 层级管理器->Canvas，右键创建节点->创建渲染节点->Sprite（单色），命名为sky，修改Color数值为#0098CE，修改Position数值Y=450，修改Size数值W=1100，H=600
![2-5](/2-5.png)

## 创建无限卷屏背景动画
- 层级管理器，选中Canvas->bg，右键复制节点，命名为bg-1，并将bg-1拖拽为bg的子节点，修改Position数值X=1100，Y=0
- 层级管理器，选中Canvas->ground，右键复制节点，命名为ground-1，并将bg-1拖拽为ground的子节点，修改Position数值X=1100，Y=0
![2-6](/2-6.png)
- 资源管理器，选中assets，右键新建文件夹scripts
- 选中scripts文件夹，右键新建JavaScript，命名为Scroller，修改代码如下
```js
cc.Class({
    extends: cc.Component,

    properties: {
        //-- 滚动的速度
        speed: 0,
        //-- X轴边缘
        resetX: 0
    },

    update (dt) {
        var x = this.node.x;
        x += this.speed * dt;
        if (x <= this.resetX) {
            x -= this.resetX;
        }
        this.node.x = x;
    }
});

```
- 选中层级管理器->Canvas下的bg，将资源管理器->assets->scripts->Scroller拖拽到属性检查器面板，修改数值Speed=-200，ResetX=-1100
- 选中层级管理器->Canvas下的ground，将资源管理器->assets->scripts->Scroller拖拽到属性检查器面板，修改数值Speed=-300，ResetX=-1100
![2-7](/2-7.png)
- 点击预览箭头，在浏览器中预览我们创角好的Game场景和卷屏背景动画
![2-8](/2-8.png)
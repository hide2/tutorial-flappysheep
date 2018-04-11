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
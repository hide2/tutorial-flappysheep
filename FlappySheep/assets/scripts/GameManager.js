var GameManager = cc.Class({
    extends: cc.Component,
    properties: {
    },
    start () {
        Global.pipeManager.startSpawn();
    }
});

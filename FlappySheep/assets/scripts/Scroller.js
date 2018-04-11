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
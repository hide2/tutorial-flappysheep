cc.Class({
    extends: cc.Component,

    properties: {
        speed: 0,
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
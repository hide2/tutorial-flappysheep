var GameOverMenu = cc.Class({
    extends: cc.Component,
    properties: {
        score: cc.Label
    },
    restart: function () {
        cc.director.loadScene('Game');
    },
});
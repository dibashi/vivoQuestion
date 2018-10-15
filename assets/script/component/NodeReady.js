const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class NodeReady extends cc.Component {

    @property(cc.Node)
    spr_bg = null;

    @property(cc.Node)
    node_spr = null;
    @property(cc.Node)
    node_tishi = null;
    @property(cc.Node)
    spr_close = null;

    _moveIdx = 0;
    _moveSpeed = 1500;
    _moveTime = 0.6;

    _clickBtn = false;

    onLoad() {
    }

    start() {
        this.scheduleOnce(this.callUserReady, 0);
    }

    showReady() {
        this.node.active = true;
        this._moveIdx = 0;
        this._moveTime = cc.dataMgr.canvasW / 2 / this._moveSpeed;

        this.spr_bg.active = true;
        this.node_tishi.active = false;

        //初始化位置
        for (let i = 0; i < this.node_spr.children.length; ++i) {
            let nodeN = this.node_spr.children[i];
            nodeN.active = true;
            nodeN.x = cc.dataMgr.canvasW / 2 + 250;
        }

        this.callReady();
        this.node.runAction(cc.repeat(cc.sequence(cc.delayTime(this._moveTime + 0.4), cc.callFunc(this.callReady, this)), this.node_spr.children.length));
        cc.audioMgr.playEffect("readygo");
    }

    callReady() {
        if (this._moveIdx < this.node_spr.children.length) {
            let nodeN = this.node_spr.children[this._moveIdx];
            nodeN.runAction(cc.sequence(cc.moveTo(this._moveTime, cc.v2(0, 0)), cc.delayTime(0.4), cc.moveTo(this._moveTime, cc.v2(-cc.dataMgr.canvasW / 2 - 250, 0))));
        }
        else {
            //播放完成，之后就开始游戏了
            this.node.active = false;
            let gameJs = cc.find("Canvas").getComponent("Game");
            if (gameJs)
                gameJs.beginGame();
        }
        ++this._moveIdx;
    }

    callUserReady() {
        if (!this._clickBtn && cc.dataMgr) {
            this._clickBtn = true;

            //this.node_tishi.active = false;
            this.spr_bg.active = false;

            //获取房间信息之后 设置ready
            if (cc.dataMgr.gameData.canReady)
                cc.dataMgr.ready();
            else
                cc.dataMgr.gameData.canReady = true;

        }
    }

    onClickBtn(event, customeData) {
        if (event.target) {
            let btnN = event.target.name;
            console.log("-- onClickBtn NodeReady --" + btnN);
            if (btnN == "spr_bg") {
                if (this.node_tishi.active) {
                    this.node_tishi.active = false;
                    this.callUserReady();
                }
            }
        }
    }

}
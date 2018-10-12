const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class NodeRed extends cc.Component {

    _cardNum = 0;
    _cardOwn = null;//my 或 other null 三个值
    _canChangeZIndex = true;//每次触摸只能改变一次 zIndex;

    _touchBegin = null;

    _posYMin = 210;
    _posYMax = 450;

    onLoad() {

    }

    start() {
        let self = this;
        this.node.on(cc.Node.EventType.TOUCH_START, function (touch) {
            if (cc.dataMgr.gameData.onGaming) {
                let uuid = self.node.uuid;
                //let str = "-- touch begin " + " X : " + touch.getLocation().x.toFixed(2) + " Y : " + touch.getLocation().y.toFixed(2) + " -- " + self.node.zIndex + " uuid : " + uuid;
                //console.log(str);
                // let touchPos = touch.getLocation();
                // console.log(touchPos);

                self._canChangeZIndex = true;
            }
            self._touchBegin = touch.getLocation();
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (touch) {
            let touchPos = touch.getLocation();
            if (self._touchBegin && self.node.y - self.node.height / 2 < self._posYMin && self._cardOwn != "other") {
                let disX = touchPos.x - self._touchBegin.x;
                let disY = touchPos.y - self._touchBegin.y;

                if (cc.dataMgr.gameData.onGaming && this._cardOwn != "other") {
                    self.node.setPosition(cc.v2(self.node.x + disX, self.node.y + disY));
                    //限制X
                    if (Math.abs(self.node.x) > 220)
                        self.node.x = self.node.x / Math.abs(self.node.x) * 220;
                    if (self.node.y + self.node.height / 2 >= self._posYMin)
                        self.node.y = self._posYMin - self.node.height / 2 - 1;
                    else if (self.node.y - self.node.height / 2 < -self._posYMax)
                        self.node.y = -self._posYMax + self.node.height / 2;
                    self.changeNodeZIndex();
                }
            }
            self._touchBegin = touchPos;
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_END, function (touch) {
            //console.log("-- end -- " + self.node.y + " -- " + cc.dataMgr.gameData.onGaming);
            if (cc.dataMgr.gameData.onGaming) {
                self.checkScore();
            }
            cc.audioMgr.playEffect("button");
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (touch) {
            //console.log("-- end -- " + self.node.y + " -- " + cc.dataMgr.gameData.onGaming);
            if (cc.dataMgr.gameData.onGaming) {
                self.checkScore();
            }
            cc.audioMgr.playEffect("button");
        }, this.node);
    }

    initRed(cardNum, cardId, cardOwn) {
        //console.log("-- initRed -- " + cardNum + " -- " + cardId + " -- " + cardOwn);
        this._cardNum = cardNum;
        this._cardId = cardId;
        this._cardOwn = cardOwn;

        let gameJs = cc.find("Canvas").getComponent("Game");
        if (gameJs) {
            this.node.getComponent(cc.Sprite).spriteFrame = gameJs.getGameFrame_sf("hongbao" + cardNum);
        }

        //x y  旋转角度
        let aimX = (Math.random() - 0.6) * 500;
        if (aimX - this.node.height / 2 < -300)
            aimX = this.node.height / 2 - 300;
        else if (aimX + this.node.height / 2 > 240)
            aimX = 240 - this.node.height / 2;
        this.node.x = aimX;

        let aimY = 0;
        if (cardOwn == "other") {
            aimY = this._posYMin + Math.random() * this._posYMin;// 范围 200 - 400
            //判断 约束 Y
            if (aimY - this.node.height / 2 < this._posYMin)
                aimY = this.node.height / 2 + this._posYMin;
            else if (aimY + this.node.height / 2 > this._posYMax)
                aimY = this._posYMax - this.node.height / 2;
            this.node.rotation = 0;
        }
        else {
            aimY = (Math.random() - 0.5) * 300;
            if (aimY - this.node.height / 2 < -160)
                aimY = this.node.height / 2 - 160;
            else if (aimY + this.node.height / 2 > 160)
                aimY = 160 - this.node.height / 2;

            //随机一个旋转角度
            let aimR = 0;
            let randN = Math.random();
            if (randN > 0.3)
                aimR = (randN - 0.3 - 0.35) * 90;
            else {
                aimR = (randN - 0.15) * 90 + 180;

                aimR -= 180;
            }
            this.node.rotation = aimR;
        }
        this.node.y = aimY;
        //console.log(cardOwn + " -- initRed -- " + this.node.y + " -- " + this.node.x + " -- " + this.node.height);
    }

    changeNodeZIndex() {
        if (this._canChangeZIndex) {
            this._canChangeZIndex = false;
            ++cc.dataMgr.gameData.countZIndex;
            this.node.zIndex = cc.dataMgr.gameData.countZIndex;
        }
    }

    //检查得分(暂时是通知分数)
    checkScore() {
        console.log("-- checkScore A -- " + this.node.y + " -- " + this._cardOwn + " -- " + cc.dataMgr.gameData.userMy.cardGet);
        if (this.node.y < -this._posYMin && !this._cardOwn) {
            this._cardOwn = "my";
            //注意顺序代表的值 (arr 中不能有字符串)
            let message = [
                true,
                this._cardId,
                this._cardNum
            ]
            cc.dataMgr.broadcast(message, 1);
        }
        else if (this.node.y > -this._posYMin && this._cardOwn == "my") {
            this._cardOwn = null;
            //注意顺序代表的值 (arr 中不能有字符串)
            let message = [
                false,
                this._cardId,
                this._cardNum
            ]
            cc.dataMgr.broadcast(message, 1);

            //如果对方答完 一小局结束
            
        }
        console.log("-- checkScore B -- " + this.node.y + " -- " + this._cardOwn + " -- " + cc.dataMgr.gameData.userMy.cardGet);
    }

    onClickBtn(event, customeData) {
        if (event.target) {
            let btnN = event.target.name;
            console.log("-- onClickBtn Game --" + btnN);
            if (btnN == "") {
            }
        }
    }
}
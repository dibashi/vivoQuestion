import DataMgr from 'DataMgr';
import AudioMgr from 'AudioMgr';

const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property(cc.Prefab)
    pre_red = null;

    @property(cc.SpriteAtlas)
    atlas_frame = null;

    //游戏中的提示
    @property(cc.Node)
    node_game = null;
    @property(cc.Node)
    root_red = null;
    @property(cc.Node)
    hint_other = null;
    @property(cc.Node)
    hint_my = null;

    //控件UI
    @property(cc.Node)
    node_my = null;
    @property(cc.Node)
    node_other = null;
    @property(cc.Node)
    node_time = null;
    @property(cc.Node)
    node_score = null;

    @property(cc.Node)
    node_ready = null;

    onLoad() {
        console.log("-- 实验区域 --");
        // let aa = {type:aimNum,aimNumArr:[18,18,14,11],time:1539237442447}

        // let str = "{\"message\":\"{type:aimNum,aimNumArr:[18,18,14,11],time:1539237442447}\",\"userId\":1000626}";
        // console.log(str);
        // console.log(JSON.parse("[9,1,2,3]"));
        // console.log(!"0");

        // let message = [18, 18, 14, 11];
        // let mesStr = JSON.stringify(message);
        // console.log(mesStr);
        // let param = {
        //     "message": mesStr,
        //     "userId": 1000626
        // }
        // let paramStr = JSON.stringify(param);
        // console.log(paramStr);
        // console.log(JSON.parse(paramStr));

        // let a = 0;
        // let cardNum = 1;
        // let messageArr = [
        //     true,
        //     ++a,
        //     cardNum
        // ];
        // console.log(messageArr);
    }

    start() {
        this.node_time.active = false;
        this.node_score.active = false;
        this.hint_my.active = false;
        this.hint_other.active = false;

        this.node_ready.active = true;
        this.node_ready.getChildByName("tishi").active = true;
        this.node_ready.getChildByName("spr_bg").active = true;

        this.initData();
    }

    initData() {
        console.log("-- loading initData --")
        if (!cc.dataMgr) {
            //let DataMgr = require("DataMgr");
            cc.dataMgr = new DataMgr();
            cc.dataMgr.initData();
        }
        if (!cc.audioMgr) {
            //let AudioMgr = require("AudioMgr");
            cc.audioMgr = new AudioMgr();
            cc.audioMgr.init();
        }
      

        cc.dataMgr.canvasW = cc.find("Canvas").width;
        cc.dataMgr.canvasH = cc.find("Canvas").height;
    }

    initGame() {
        console.log("-- initGame 且 随机 ainNum -- " + cc.dataMgr.gameData.countTime);
        console.log(cc.dataMgr.gameData);

        this.node_ready.active = true;
        this.node_ready.getComponent("NodeReady").showReady();

        //初始化自己信息 和 玩家信息
        this.node_my.getChildByName("node_mask").getChildByName("spr_icon").getComponent("NodeIcon").initIcon(cc.dataMgr.gameData.userMy.headUrl);
        this.node_my.getChildByName("tog_sex").getComponent(cc.Toggle).isChecked = (cc.dataMgr.gameData.userMy.sex != "f");
        this.node_my.getChildByName("pro_hp").getComponent(cc.ProgressBar).progress = (cc.dataMgr.gameData.userMy.hp / 4);

        this.node_other.getChildByName("node_mask").getChildByName("spr_icon").getComponent("NodeIcon").initIcon(cc.dataMgr.gameData.userOther.headUrl);
        this.node_other.getChildByName("tog_sex").getComponent(cc.Toggle).isChecked = (cc.dataMgr.gameData.userOther.sex != "f");
        this.node_other.getChildByName("pro_hp").getComponent(cc.ProgressBar).progress = (cc.dataMgr.gameData.userOther.hp / 4);

        //在这里要确定 四局的目标分值
        let aimNumArr = [];
        let time = Date.now();
        for (let i = 0; i < 4; ++i) {
            let aimNum = Math.floor(Math.random() * 20) + 1;
            aimNumArr.push(aimNum);
        }
        //注意顺序代表的值 (arr 中不能有字符串)
        let param = [
            1,//代表同步 arrNum
            aimNumArr,
            time
        ]
        cc.dataMgr.broadcast(param, 0);

        cc.dataMgr.setAimNumArr(time, aimNumArr);

        console.log(time + " -- " + cc.dataMgr.gameData.aimNumTime);
        console.log(aimNumArr);
    }

    beginGame() {
        cc.dataMgr.gameData.onGaming = true;

        //整理 和 初始化数据
        ++cc.dataMgr.gameData.countGame;
        cc.dataMgr.gameData.aimNum = 8;
        if (cc.dataMgr.gameData.countGame - 1 < cc.dataMgr.gameData.aimNumArr.length)
            cc.dataMgr.gameData.aimNum = cc.dataMgr.gameData.aimNumArr[cc.dataMgr.gameData.countGame - 1];
            
        cc.dataMgr.gameData.gameCardArr = cc.dataMgr.getOneCardArr_arr(cc.dataMgr.gameData.aimNum);
        cc.dataMgr.gameData.countTime = 5 + cc.dataMgr.gameData.gameCardArr.length;
        //个人数据清空
        cc.dataMgr.gameData.userMy.cardGet = 0;
        cc.dataMgr.gameData.userOther.cardGet = 0;

        cc.dataMgr.gameData.oneOverData = null;//清空小局信息

        console.log("-- 第 " + cc.dataMgr.gameData.countGame + " 小局 -- " + cc.dataMgr.gameData.aimNum + " -- " + cc.dataMgr.gameData.gameCardArr.length);

        //提示隐藏
        this.hint_my.active = false;
        this.hint_other.active = false;

        //倒计时 和 目标分值
        this.node_time.active = true;
        this.node_time.stopAllActions();
        this.node_time.runAction(cc.repeat(cc.sequence(cc.delayTime(1), cc.callFunc(this.callCountTime, this)), cc.dataMgr.gameData.countTime));
        this.node_score.active = true;
        this.node_time.getChildByName("lab_time").getComponent(cc.Label).string = cc.dataMgr.gameData.countTime;
        this.node_score.runAction(cc.moveTo(0.2, cc.v2(cc.dataMgr.canvasW / 2 - 60, this.node_score.y)));
        this.node_score.getChildByName("lab_score").getComponent(cc.Label).string = cc.dataMgr.gameData.aimNum;
        this.node_score.getChildByName("lab_scoreB").getComponent(cc.Label).string = cc.dataMgr.gameData.aimNum;

        this.node_my.getChildByName("pro_hp").getComponent(cc.ProgressBar).progress = (cc.dataMgr.gameData.userMy.hp / 4);
        this.node_other.getChildByName("pro_hp").getComponent(cc.ProgressBar).progress = (cc.dataMgr.gameData.userOther.hp / 4);

        //移除并 初始化红包
        for (let i = 0; i < this.root_red.children.length; ++i) {
            let nodeN = this.root_red.children[i];
            nodeN.position = cc.v2(0, 0);
            nodeN.active = false;
        }

        for (let i = 0; i < cc.dataMgr.gameData.gameCardArr.length; ++i) {
            ++cc.dataMgr.gameData.countBox;
            let cardNum = cc.dataMgr.gameData.gameCardArr[i];
            let nodeN = null;
            if (i < this.root_red.children.length)
                nodeN = this.root_red.children[i];
            else {
                nodeN = cc.instantiate(this.pre_red);
                this.root_red.addChild(nodeN);
            }
            nodeN.active = true;
            nodeN.getComponent("NodeRed").initRed(cardNum, cc.dataMgr.gameData.countBox, null);
        }

        //判断是否为机器人 如果是开始ai
        if (cc.dataMgr.gameData.userOther.type == 2)
            this.autoGetRed();
    }

    autoGetRed() {
        if (cc.dataMgr.gameData.onGaming && cc.dataMgr.gameData.userOther.hp > 0 && cc.dataMgr.gameData.userMy.hp > 0) {
            this.node_other.stopAllActions();
            let randTime = Math.random() * 3 + 1;
            this.node_other.runAction(cc.sequence(cc.delayTime(randTime), cc.callFunc(this.callGetCard, this)));
        }
    }

    callGetCard() {
        let cardNum = 1;
        if (cc.dataMgr.gameData.aimNum - cc.dataMgr.gameData.userOther.cardGet >= 5)
            cardNum = 5;
        else if (cc.dataMgr.gameData.aimNum - cc.dataMgr.gameData.userOther.cardGet >= 2)
            cardNum = 2;

        console.log("-- ai -- " + cardNum);
        //注意顺序代表的值 (arr 中不能有字符串)
        let message = [
            true,
            ++cc.dataMgr.gameData.countBox,
            cardNum
        ];
        let param = {
            "message": JSON.stringify(message),
            "userId": cc.dataMgr.gameData.userOther.userId
        }
        cc.dataMgr.onMessage(param);

        this.autoGetRed();
    }


    resultBtnClick(event, eventData) {

        if (eventData == cc.dataMgr.getCurrentCheckpointData().result) {
            console.log("答对了");
            //一，根据花费时间计算分数
            //2,播放答对动画，
            //3,查看对方是否答完，若答完直接显示，没答完阻塞
            cc.dataMgr.gameData.userMy.curScore += cc.dataMgr.getThisCPScore();
        } else {
            console.log("答错了");
        }


    }

    changeOtherCard(isAdd, cardId, cardNum) {
        console.log("-- 改变对面红包 -- " + isAdd + " -- " + cardId + " -- " + cardNum);
        if (isAdd) {
            ++cc.dataMgr.gameData.countBox
            let nodeN = null;
            for (let i = 0; i < this.root_red.children.length; ++i) {
                if (!this.root_red.children[i].active) {
                    nodeN = this.root_red.children[i];
                    break;
                }
            }
            if (!nodeN) {
                nodeN = cc.instantiate(this.pre_red);
                this.root_red.addChild(nodeN);
            }
            nodeN.active = true;
            nodeN.getComponent("NodeRed").initRed(cardNum, cardId, "other");

            cc.dataMgr.gameData.userOther.cardGet += cardNum;
            if (cc.dataMgr.gameData.userOther.cardGet == cc.dataMgr.gameData.aimNum)
                cc.dataMgr.broadcastOneSmallGmaeOver();
        }
        else {
            let cutCard = false;
            for (let i = 0; i < this.root_red.children.length; ++i) {
                let nodeN = this.root_red.children[i];
                let nodeNJs = nodeN.getComponent("NodeRed");
                if (nodeN.active && nodeNJs) {
                    if (nodeNJs._cardOwn == "other" && nodeNJs._cardId == cardId) {
                        nodeN.active = false;
                        cutCard = true;
                        break;
                    }
                }
            }
            if (cutCard)
                cc.dataMgr.gameData.userOther.cardGet -= cardNum;

        }
    }

    showOverHint() {
        let numMy = cc.dataMgr.gameData.userMy.cardGet;
        let numOther = cc.dataMgr.gameData.userOther.cardGet;

        this.hint_my.active = true;
        this.hint_my.getChildByName("spr_success").active = (numMy == cc.dataMgr.gameData.aimNum);
        this.hint_my.getChildByName("spr_faild").active = (numMy != cc.dataMgr.gameData.aimNum);
        this.hint_other.active = true;
        this.hint_other.getChildByName("spr_success").active = (numOther == cc.dataMgr.gameData.aimNum);
        this.hint_other.getChildByName("spr_faild").active = (numOther != cc.dataMgr.gameData.aimNum);

        this.node_my.getChildByName("pro_hp").getComponent(cc.ProgressBar).progress = (cc.dataMgr.gameData.userMy.hp / 4);
        this.node_other.getChildByName("pro_hp").getComponent(cc.ProgressBar).progress = (cc.dataMgr.gameData.userOther.hp / 4);

        this.node_score.runAction(cc.moveTo(0.2, cc.v2(cc.dataMgr.canvasW / 2 + 60, this.node_score.y)));
        this.node_time.active = false;

        if (numMy == cc.dataMgr.gameData.aimNum)
            cc.audioMgr.playEffect("success");
    }

    gameOver() {
        if (cc.dataMgr.gameData.onGaming) {
            console.log("-- 超时 游戏结束 --");
            cc.dataMgr.gameData.onGaming = false;
            cc.dataMgr.broadcastOneSmallGmaeOver();
        }
    }

    callCountTime() {
        --cc.dataMgr.gameData.countTime;
        if (cc.dataMgr.gameData.countTime <= 0) {
            this.gameOver();
            cc.dataMgr.gameData.countTime = 0;
        }
        this.node_time.getChildByName("lab_time").getComponent(cc.Label).string = cc.dataMgr.gameData.countTime;
    }

    getGameFrame_sf(name) {
        let sf = this.atlas_frame.getSpriteFrame(name);
        if (!sf) {
            console.log("--- 重大错误 missFrame ---" + name);
            sf = this.atlas_frame.getSpriteFrame("hongbao1");
        }
        return sf;
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
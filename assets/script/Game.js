import DataMgr from 'DataMgr';
import AudioMgr from 'AudioMgr';

const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    //控件UI
    @property(cc.Node)
    node_my = null;
    @property(cc.Node)
    node_other = null;
    @property(cc.Node)
    node_time = null;


    @property(cc.Node)
    node_ready = null;

    @property(cc.Label)
    label_results = [];
    @property(cc.Button)
    btn_results = [];
    @property(cc.Label)
    label_title = null;
    @property(cc.Node)
    node_game = null;

    @property(cc.Label)
    indexLabel = null;
    @property(cc.Sprite)
    indexSprite = null;

    @property(cc.Node)
    node_success = null;

    @property(cc.SpriteFrame)
    dijiti_SF = null;
    @property(cc.SpriteFrame)
    zuihouyiti_SF = null;
    

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

        this.node_ready.active = true;

        //this.node_ready.getChildByName("tishi").active = true;
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
        //其实已经ready过了，这里是onStart的回调。
        this.node_ready.getComponent("NodeReady").showReady();

        //初始化自己信息 和 玩家信息
        this.node_my.getChildByName("node_mask").getChildByName("spr_icon").getComponent("NodeIcon").initIcon(cc.dataMgr.gameData.userMy.headUrl);
        this.node_my.getChildByName("tog_sex").getComponent(cc.Toggle).isChecked = (cc.dataMgr.gameData.userMy.sex == "f");
        this.node_my.getChildByName("pro_hp").getComponent(cc.ProgressBar).progress = (cc.dataMgr.gameData.userMy.curScore / cc.dataMgr.gameData.totalScore);

        this.node_other.getChildByName("node_mask").getChildByName("spr_icon").getComponent("NodeIcon").initIcon(cc.dataMgr.gameData.userOther.headUrl);
        this.node_other.getChildByName("tog_sex").getComponent(cc.Toggle).isChecked = (cc.dataMgr.gameData.userOther.sex == "f");
        this.node_other.getChildByName("pro_hp").getComponent(cc.ProgressBar).progress = (cc.dataMgr.gameData.userOther.curScore / cc.dataMgr.gameData.totalScore);




        //在这里要确定 5局的关卡索引
        let checkPointIndexArr = [];
        let time = Date.now();
        for (let i = 0; i < cc.dataMgr.gameData.totalQuestion; ++i) {
            let checkPointIndex = Math.floor(Math.random() * questionLibs.length);
            checkPointIndexArr.push(checkPointIndex);
        }
        //注意顺序代表的值 (arr 中不能有字符串)
        let param = [
            1,//代表同步 arrNum
            checkPointIndexArr,
            time
        ];
        console.log(param);
        cc.dataMgr.broadcast(param, 0);

    }

    beginGame() {
        this.isAnswer = false; //标记用户还没有答题，若没打过，在超时时处理，若打过，超时不处理
        cc.dataMgr.gameData.onGaming = true;
        cc.dataMgr.gameData.countBegin = Date.now();

        cc.dataMgr.gameData.userOther.result = null;
        cc.dataMgr.gameData.userMy.result = null;
        //整理 和 初始化数据
        ++cc.dataMgr.gameData.countGame;
        //关卡数据条目
        this.cpData = questionLibs[cc.dataMgr.gameData.aimNumArr[cc.dataMgr.gameData.countGame - 1]];
        cc.dataMgr.gameData.result = this.cpData.result;

        cc.dataMgr.gameData.countTime = 10;

        cc.dataMgr.gameData.oneOverData = null;//清空小局信息

        console.log("-- 第 " + cc.dataMgr.gameData.countGame + " 小局 -- " + " -- " + cc.dataMgr.gameData.result);
        console.log(this.cpData);

        let indexString = "";
        this.indexSprite.spriteFrame = this.dijiti_SF;
        if (cc.dataMgr.gameData.countGame == 1) {
            indexString = "一";
        } else if (cc.dataMgr.gameData.countGame == 2) {
            indexString = "二";
        } else if (cc.dataMgr.gameData.countGame == 3) {
            indexString = "三";
        } else if (cc.dataMgr.gameData.countGame == 4) {
            indexString = "四";
        } else if (cc.dataMgr.gameData.countGame == 5) {
            indexString = "";
            this.indexSprite.spriteFrame = this.zuihouyiti_SF;
        }

        this.indexLabel.string = indexString;


        for (let bi = 0; bi < this.btn_results.length; bi++) {
            this.btn_results[bi].getComponent("BtnLogic").showNormal();
            this.btn_results[bi].interactable = true;
        }
        //倒计时 和 目标分值
        this.node_time.getChildByName("lab_time").getComponent(cc.Label).string = cc.dataMgr.gameData.countTime;
        this.node_time.active = true;
        // this.node_time.stopAllActions();
        // this.node_time.runAction(cc.repeat(cc.sequence(cc.delayTime(1), cc.callFunc(this.callCountTime, this)), cc.dataMgr.gameData.countTime));

        let beginRange = this.node_time.getChildByName("spr_bg").getComponent(cc.Sprite).fillRange;
        //this.node_time.getChildByName("spr_bg").runAction(cc.sequence(this.myCircleTo_act(0.5, 1, beginRange), this.myCircleTo_act(9.5, 0, 1)));




        //初始化 题目 答案 显示
        this.node_game.active = true;

        this.label_results[0].string = this.cpData.A;
        this.label_results[1].string = this.cpData.B;
        this.label_results[2].string = this.cpData.C;
        this.label_results[3].string = this.cpData.D;

        for(let i =0;i<this.label_results.length;i++) {
            this.label_results[i].node.color = new cc.Color(0, 0, 0, 255);
        }

        this.label_title.string = this.cpData.question;

        //判断是否为机器人 如果是开始ai
        if (cc.dataMgr.gameData.userOther.type == 2) {
            this.AILogic();
        }
        this.unschedule(this.timeOut_successOrFail);  
        this.scheduleOnce(this.timeOut_successOrFail,20);
    }

    timeOut_successOrFail() {
        if(cc.dataMgr.gameData.userOther.type == 2) {//如果是机器人，则直接判其负
            //cc.dataMgr.gameData.onGaming = false;
            console.log("对方是机器人，但玩家想缩放多长时间都可以")
            //GameSDK.gameOver(2);
        } else {//对方是人，但是没有重开下一小局，说明对面一直没有回来，则直接判当前玩家胜利。
            console.log("对方是人，但是没有重开下一小局，说明对面一直没有回来，则直接判当前玩家胜利。");
            this.node_success.active =true;
            this.scheduleOnce(this.goOver,1.5);
        }
    }

    goOver() {
        console.log("----------------显示完胜利提示，直接掉胜利接口-------------");
            GameSDK.finish(1);
    }

    AILogic() {

        this.node_other.stopAllActions();
        this.AIRandTime = Math.floor(Math.random() * 4) + 1;
        this.node_other.runAction(cc.sequence(cc.delayTime(this.AIRandTime), cc.callFunc(this.autoAnswer, this)));

    }

    autoAnswer() {
        let ri = Math.floor(Math.random() * 4) + 1;
        console.log("-- ai -- " + ri);
        let rA = "Z";
        if (ri == 1) {
            rA = "A";
        } else if (ri == 2) {
            rA = "B";
        } else if (ri == 3) {
            rA = "C";
        } else if (ri == 4) {
            rA = "D";
        }

        let score = 0;
        if (rA == this.cpData.result) {
            console.log("AI答对了");
            //一，根据花费时间计算分数
            //2,播放答对动画，
            //3,查看对方是否答完，若答完直接显示，没答完阻塞

            if (cc.dataMgr.gameData.countGame == cc.dataMgr.gameData.totalQuestion) {
                score = 2 * ((cc.dataMgr.gameData.perTime - this.AIRandTime) * 20);
            } else {
                score = (cc.dataMgr.gameData.perTime - this.AIRandTime) * 20;
            }
        } else {
            console.log("AI答错了");
        }

        let message = [
            3,
            score,
            ri
        ]
        console.log(message);

        let param = {
            "message": JSON.stringify(message),
            "userId": cc.dataMgr.gameData.userOther.userId
        }
        cc.dataMgr.onMessage(param);
    }


    resultBtnClick(event, eventData) {

        for (let bi = 0; bi < this.btn_results.length; bi++) {
            this.btn_results[bi].interactable = false;
        }
        cc.audioMgr.playEffect("button");
        this.isAnswer = true;
        let score = 0;
        if (eventData == this.cpData.result) {
            console.log("答对了");
            //一，根据花费时间计算分数
            //2,播放答对动画，
            //3,查看对方是否答完，若答完直接显示，没答完阻塞

            if (cc.dataMgr.gameData.countGame == cc.dataMgr.gameData.totalQuestion) {
                score = 2 * (cc.dataMgr.gameData.countTime * 20);
            } else {
                score = cc.dataMgr.gameData.countTime * 20;
            }
        } else {
            console.log("答错了");
        }

        let rd = 0;
        if (eventData == "A") {
            rd = 1;
        } else if (eventData == "B") {
            rd = 2;
        } else if (eventData == "C") {
            rd = 3;
        } else {
            rd = 4;
        }

        this.btn_results[rd - 1].getComponent(cc.Sprite).spriteFrame = this.btn_results[rd - 1].getComponent("BtnLogic").kuangSF;

        let message = [
            3,
            score,
            rd
        ];

        console.log(message);
        cc.dataMgr.broadcast(message, 1);

    }

    changeMyScore() {
        console.log("changeMyScore");
        this.node_my.getChildByName("scoreLabel").getComponent(cc.Label).string = cc.dataMgr.gameData.userMy.curScore;
        //this.node_my.getChildByName("pro_hp").getComponent(cc.ProgressBar).progress = cc.dataMgr.gameData.userMy.curScore/cc.dataMgr.gameData.totalScore;
        this.node_my.getChildByName("pro_hp").runAction(this.myProgressTo_act(1, cc.dataMgr.gameData.userMy.curScore / cc.dataMgr.gameData.totalScore, this.node_my.getChildByName("pro_hp").getComponent(cc.ProgressBar).progress));

    }

    changeOtherScore() {
        console.log("changeOtherScore");
        this.node_other.getChildByName("scoreLabel").getComponent(cc.Label).string = cc.dataMgr.gameData.userOther.curScore;
        //this.node_my.getChildByName("pro_hp").getComponent(cc.ProgressBar).progress = cc.dataMgr.gameData.userMy.curScore/cc.dataMgr.gameData.totalScore;
        this.node_other.getChildByName("pro_hp").runAction(this.myProgressTo_act(1, cc.dataMgr.gameData.userOther.curScore / cc.dataMgr.gameData.totalScore, this.node_other.getChildByName("pro_hp").getComponent(cc.ProgressBar).progress));

    }

    showOverHint() {

        if (cc.dataMgr.gameData.userMy.result == this.cpData.result) {
            cc.audioMgr.playEffect("success");
        } else {
            cc.audioMgr.playEffect("shibai");
        }
        console.log("单小局结束！！");

        for(let i =0;i<this.label_results.length;i++) {
            this.label_results[i].node.color = new cc.Color(255, 255, 255, 255);
        }

        let iR = this.convertABCDTo0123(this.cpData.result);
        let myR = this.convertABCDTo0123(cc.dataMgr.gameData.userMy.result);
        let otherR = this.convertABCDTo0123(cc.dataMgr.gameData.userOther.result);
        for (let bi = 0; bi < this.btn_results.length; bi++) {


            this.btn_results[bi].node.active = false;
        }
        if (iR != -1) {
            if (myR == iR) {
                if (otherR == iR) {
                    this.btn_results[iR].getComponent("BtnLogic").showResult(true, "green", true, false, true, false);
                } else {
                    this.btn_results[iR].getComponent("BtnLogic").showResult(true, "green", true, false, false, false);
                    if (otherR != -1) {
                        this.btn_results[otherR].getComponent("BtnLogic").showResult(true, "red", false, false, false, true);
                    }

                }
            } else {//我的答案和正确答案不一样
                if (otherR == iR) {
                    if (myR != -1) {
                        this.btn_results[myR].getComponent("BtnLogic").showResult(true, "red", false, true, false, false);
                    }

                    this.btn_results[iR].getComponent("BtnLogic").showResult(this, "green", false, false, true, false);
                } else {//两人答案与正确答案 都不一样，判断俩人答案是否一样
                    if (otherR == myR) {
                        if (myR != -1) {
                            this.btn_results[myR].getComponent("BtnLogic").showResult(true, "red", false, true, false, true);
                        }
                        this.btn_results[iR].getComponent("BtnLogic").showResult(true, "green", false, false, false, false);
                    } else {
                        if (myR != -1) {
                            this.btn_results[myR].getComponent("BtnLogic").showResult(true, "red", false, true, false, false);
                        }
                        if (otherR != -1) {
                            this.btn_results[otherR].getComponent("BtnLogic").showResult(true, "red", false, false, false, true);
                        }
                        this.btn_results[iR].getComponent("BtnLogic").showResult(true, "green", false, false, false, false);
                    }
                }
            }
        }
    }

    convertABCDTo0123(result) {
        if (result == "A") {
            return 0;
        } else if (result == "B") {
            return 1;
        } else if (result == "C") {
            return 2;
        } else if (result == "D") {
            return 3;
        } else {
            return -1;
        }
    }

    gameOver() {
        if (!this.isAnswer) {
            console.log("-- 超时 游戏结束 --");

            //cc.dataMgr.broadcastOneSmallGmaeOver();
            this.isAnswer = true;
            let message = [
                3,
                0,
                -1
            ];//超时 默认传-1,那边解析答案为"Z" 给0分
            console.log(message);
            cc.dataMgr.broadcast(message, 1);
        }
    }




    //圆形cd:总时间、百分比(0~1)
    myCircleTo_act(timeT, aimRange, beginRange) {
        let action = cc.delayTime(timeT);
        action.aimRange = aimRange;
        action.beginRange = beginRange;
        action.update = function (dt) {
            let node = action.getTarget();
            if (node) {
                node.getComponent(cc.Sprite).fillRange = this.beginRange + (this.aimRange - this.beginRange) * dt;
            }
        };
        return action;
    }

    myProgressTo_act(timeT, aimProgress, baseProgress) {
        let action = cc.delayTime(timeT);
        action.aimProgress = aimProgress;
        action.baseProgress = baseProgress;
        action.update = function (dt) {
            let node = action.getTarget();
            if (node && node.getComponent(cc.ProgressBar)) {
                node.getComponent(cc.ProgressBar).progress = baseProgress + dt * (this.aimProgress - this.baseProgress);
            }
        };
        return action;
    }



    getGameFrame_sf(name) {
        let sf = this.atlas_frame.getSpriteFrame(name);
        if (!sf) {
            console.log("--- 重大错误 missFrame ---" + name);
            sf = this.atlas_frame.getSpriteFrame("hongbao1");
        }
        return sf;
    }

    // callCountTime() {

    // }

    update(dt) {
        if (cc.dataMgr.gameData.onGaming) {

            let showNum = cc.dataMgr.gameData.countTime * 1000 - (cc.dataMgr.getTimeSecond_i() - cc.dataMgr.gameData.countBegin);
            if (showNum < 0) {
                this.node_time.getChildByName("lab_time").getComponent(cc.Label).string = 0;
                this.node_time.getChildByName("spr_bg").getComponent(cc.Sprite).fillRange = 0;
                cc.dataMgr.gameData.onGaming = false;
                this.gameOver();

            } else {
                this.node_time.getChildByName("lab_time").getComponent(cc.Label).string = Math.ceil(showNum / 1000);
                this.node_time.getChildByName("spr_bg").getComponent(cc.Sprite).fillRange = showNum / (cc.dataMgr.gameData.countTime * 1000);
            }
        }
    }


}
//import GameSDK from 'GameSDK';
const {
    ccclass,
    property
} = cc._decorator;
@ccclass
export default class DataMgr extends cc.Component {

    //!注意发布到手机上时 GameSDK 中一定要 inDebug = false
    canvasH = 1280;
    canvasW = 720;
    version = "20181011"; //不同的 version 版本会清空本地信息
    beginTime = 1538968259632;//最早是游戏发布的时间

    //用户相关需要储存的数据
    userData = {
    }

    //游戏中用到的数据
    gameData = {
        canReady: false,//玩家点击提示或 1.2秒之后才可以 ready

        onGaming: false,//游戏是否开始

        countZIndex: 0,
        countTime: 12,//游戏的倒计时
        countBox: 0,//记录box 的数量(用于确定 boxId)
        countGame: 0,//当前玩的是第几小局

        aimNum: 0,//目标分数
        aimNumArr: [1, 12, 2, 5],
        aimNumTime: 0,//确定这个时间 aimNumArr 的时间戳
        gameCardArr: [],//当前显示的 卡片

        oneOverData: null,//一小局结束的信息

        //房间数据 和 玩家数据
        "gameId": 0,
        "roomId": 1391,
        "roomKey": 1945465117,
        "userMy":
        {
            "headUrl": "http://www.jeekegame.com/api/upload/img/Headphoto/4777-1534841583.jpg",
            "nickName": "玩家EVVcnF",
            "sex": "f",
            "type": 1,
            "userId": 1000618,

            //添加的数据
            hp: 4,//初始值为4 输一局掉一滴血 先没血的输(平局 都扣血)
            isReady: false,//是否准备
            cardGet: 0,//属于当前玩家的卡片
        },
        "userOther": {
            "headUrl": "http://www.jeekegame.com/api/upload/ai_icon/128.jpg",
            "nickName": "涂鸦男孩",
            "sex": "f",
            "type": 2,//type:2 是机器人机器人要自动抓红包。
            "userId": 10002280,

            //添加的数据
            hp: 4,//初始值为4 输一局掉一滴血 先没血的输(平局 都扣血)
            isReady: false,//是否准备
            cardGet: 0,//属于当前玩家的卡片
        }

    }

    //------ SDK 相关数据 ------
    messageId = 0;

    gameID = 854584553;
    gameKey = "24d01f584f0e49a1b7cc37464510832e";
    gameSecret = "5d333807f8a4634e72b5fdcbca334760";

    initData() {
        //版本比较 是否重置数据
        let reset = false;
        let version = cc.sys.localStorage.getItem("version");
        if (version != this.version) {
            reset = true;
            cc.sys.localStorage.setItem("version", this.version);
            version = this.version;
            this.resetData();
        }
        console.log("--- initData ---" + version);

        //读取游戏进度
        // let userDataStr = cc.sys.localStorage.getItem("userData");
        // if (!userDataStr)
        //     cc.sys.localStorage.setItem("userData", JSON.stringify(this.userData));
        // else
        //     this.userData = JSON.parse(userDataStr);

        //加载图片资源
        // cc.loader.loadRes("cj01", cc.SpriteFrame, function (err, frame) {
        //     if (!err)
        //         cc.dataMgr.bgFrame["cj01"] = frame;
        // });
        // this.getUerOpenID();
        // this.getShowShare();
        // this.getShareReward();

        this.initSDK();
    }

    //重大改变之前 如扣钱口金币等 要保存数据 
    saveData() {
        cc.sys.localStorage.setItem("userData", JSON.stringify(this.userData));
    }

    //重置数据 可以部分充值
    resetData() {

    }

    //设置游戏的目标分值
    setAimNumArr(time, aimNumArr) {
        console.log("-- 确定目标分值 -- " + time);
        console.log(aimNumArr);
        if (time < cc.dataMgr.gameData.aimNumTime || cc.dataMgr.gameData.aimNumTime == 0) {
            cc.dataMgr.gameData.aimNumArr = aimNumArr;
            cc.dataMgr.gameData.aimNumTime = time;
        }
        else if (cc.dataMgr.gameData.aimNumTime == time) {
            if (aimNumArr.length == 4 && cc.dataMgr.gameData.aimNumArr.length == 4) {
                cc.dataMgr.gameData.aimNumArr[0] = parseInt((cc.dataMgr.gameData.aimNumArr[0] + aimNumArr[0]) / 2);
                cc.dataMgr.gameData.aimNumArr[1] = parseInt((cc.dataMgr.gameData.aimNumArr[1] + aimNumArr[1]) / 2);
                cc.dataMgr.gameData.aimNumArr[2] = parseInt((cc.dataMgr.gameData.aimNumArr[2] + aimNumArr[2]) / 2);
                cc.dataMgr.gameData.aimNumArr[3] = parseInt((cc.dataMgr.gameData.aimNumArr[3] + aimNumArr[3]) / 2);
            }
            else
                cc.dataMgr.gameData.aimNumArr = [6, 12, 2, 5];
        }
    }

    //获取一个 数组 TODO
    getOneCardArr_arr(aimNum) {
        return [1, 2, 5, 5, 5, 2, 2, 1, 2, 2, 1, 1];
    }

    getTimeSecond_i() {
        return parseInt(Date.now() / 1000);
    }

    //------ http 请求实验 ------

    sendHttpReq() {
        // console.log("-- 开始一个请求 --");
        // let data = {
        //     "version": 1,
        //     "gameId": this.gameID,
        //     "gameKey": this.gameKey,
        //     "gameSecret": this.gameSecret
        // }
        // cc.HTTP.data = data;
        // console.log(data);

        // let callBack = function (ret) {
        //     console.log("--- 请求返回了 ---");
        //     console.log(ret);
        // }
        // cc.HTTP.sendRequest("gameStart", callBack, true)
    }

    //------ sdk 相关内容 ------

    initSDK() {
        GameSDK.setOnInitCB(cc.dataMgr.onInit);
        GameSDK.setOnRoomInfoCB(cc.dataMgr.onRoomInfo);
        GameSDK.setOnReadyCB(cc.dataMgr.onReady);
        GameSDK.setOnStartCB(cc.dataMgr.onStart);
        GameSDK.setOnMessageCB(cc.dataMgr.onMessage);
        GameSDK.setOnFinishCB(cc.dataMgr.onFinish);

        GameSDK.init(1, this.gameID, this.gameKey, this.gameSecret);
    }

    getRoomInfo() {
        GameSDK.getRoomInfo();
    }

    ready() {
        GameSDK.ready("UserReadyData");
    }

    //广播消息
    broadcast(message, includeMe) {
        this.messageId++;
        if (typeof (message) == "object")
            GameSDK.broadcast(JSON.stringify(message), 1);
        else
            console.log("-- 重大错误 not object --" + message);
    }

    broadcastOneSmallGmaeOver() {
        cc.dataMgr.gameData.onGaming = false;

        let num = 3;
        //一小局结束 判断这一局谁赢了
        let numMy = cc.dataMgr.gameData.userMy.cardGet;
        let numOther = cc.dataMgr.gameData.userOther.cardGet;

        if (numMy == numOther)
            num = 3;
        else if (numMy == cc.dataMgr.gameData.aimNum)
            num = 1;
        else if (numOther == cc.dataMgr.gameData.aimNum)
            num = 2;

        let time = Date.now();
        let param = [
            2,//代表一小局结束
            num,
            cc.dataMgr.gameData.countGame, // 这是第几小局的结果
            time
        ]
        cc.dataMgr.broadcast(param, 1);
    }

    gameOver() {
        if (cc.dataMgr.gameData.userMy.hp <= 0 || cc.dataMgr.gameData.userOther.hp <= 0) {
            cc.dataMgr.gameData.onGaming = false;
            if (cc.dataMgr.gameData.userMy.hp == cc.dataMgr.gameData.userOther.hp)
                GameSDK.gameOver(3);
            else
                GameSDK.gameOver(cc.dataMgr.gameData.userMy.hp <= 0 ? 2 : 1);
        }
    }

    quit() {
        GameSDK.quit(1);
    }

    setScreenLandescape() {
        GameSDK.setOrientation(0);
    }

    setScreenPortrait() {
        GameSDK.setOrientation(1);
    }

    setAudioEnable() {
        GameSDK.setAudio(1, 100);
    }

    setAudioDisable() {
        GameSDK.setAudio(0, 0);
    }

    setMicEnable() {
        GameSDK.setMic(1, 100);
    }

    setMicDisable() {
        GameSDK.setMic(0, 0);
    }

    //------ 返回回调相关处理 ------

    onInit(param) {
        console.log("-- onInit 初始化成功 --");
        cc.dataMgr.getRoomInfo();
    }

    onRoomInfo(param) {
        console.log("-- onRoomInfo 获取房间信息 --");
        if (param && param.error === 0) {

            cc.dataMgr.gameData.gameId = param.gameId;
            cc.dataMgr.gameData.roomId = param.roomId;
            cc.dataMgr.gameData.roomKey = param.roomKey;

            if (param.users && param.users.length > 1) {
                let userD = param.users[0];
                cc.dataMgr.gameData.userMy.headUrl = userD.headUrl;
                cc.dataMgr.gameData.userMy.nickName = userD.nickName;
                cc.dataMgr.gameData.userMy.sex = userD.sex;
                cc.dataMgr.gameData.userMy.type = userD.type;
                cc.dataMgr.gameData.userMy.userId = userD.userId;

                if (userD.type == 2)
                    cc.dataMgr.gameData.userMy.ready = true;

                let otherD = param.users[1];
                cc.dataMgr.gameData.userOther.headUrl = otherD.headUrl;
                cc.dataMgr.gameData.userOther.nickName = otherD.nickName;
                cc.dataMgr.gameData.userOther.sex = otherD.sex;
                cc.dataMgr.gameData.userOther.type = otherD.type;
                cc.dataMgr.gameData.userOther.userId = otherD.userId;

                if (otherD.type == 2)
                    cc.dataMgr.gameData.userOther.ready = true;
            }
        }
        else
            cc.dataMgr.gameError("onRoomInfo no param");

        //获取房间信息之后 设置ready
        if (cc.dataMgr.gameData.canReady)
            cc.dataMgr.ready();
        else
            cc.dataMgr.gameData.canReady = true;
    }

    onReady(param) {
        console.log("-- OnReady 游戏准备 --");

        if (GameSDK.inDebug) {
            let gameJs = cc.find("Canvas").getComponent("Game");
            if (gameJs) {
                gameJs.initGame();
            }
        }
    }

    onStart() {
        console.log("-- OnStart 游戏开始了 --");
        let gameJs = cc.find("Canvas").getComponent("Game");
        if (gameJs) {
            gameJs.initGame();
        }
    }

    onMessage(param) {
        console.log("-- onMessage 收到消息 --");
        console.log(param);

        if (param && param.message) {
            let messageStr = param.message;
            console.log("-- message step A --");
            if (typeof (messageStr) == "string" && !cc.dataMgr.gameData.oneOverData) {
                console.log("-- message step B --" + messageStr);
                let messageArr = JSON.parse(messageStr);
                if (messageArr && messageArr.length > 0) {
                    if (typeof (messageArr[0]) == "boolean") {
                        //let message = [true,this._cardId,this._cardNum]
                        console.log("-- message step in add card -- " + cc.dataMgr.gameData.userMy.userId);
                        if (param.userId == cc.dataMgr.gameData.userMy.userId) {
                            if (messageArr[0])
                                cc.dataMgr.gameData.userMy.cardGet += messageArr[2];
                            else
                                cc.dataMgr.gameData.userMy.cardGet -= messageArr[2];

                            if (cc.dataMgr.gameData.userMy.cardGet == cc.dataMgr.gameData.aimNum)
                                cc.dataMgr.broadcastOneSmallGmaeOver();
                        }
                        else {
                            console.log("-- message step Other --");
                            let gameJs = cc.find("Canvas").getComponent("Game");
                            if (gameJs)
                                gameJs.changeOtherCard(messageArr[0], messageArr[1], messageArr[2]);
                        }
                    }
                    else if (messageArr[0] == 1) {
                        //let param = [1,//代表同步 arrNum aimNumArr,time]
                        cc.dataMgr.setAimNumArr(messageArr[2], messageArr[1]);
                    }
                    else if (messageArr[0] == 2) {
                        console.log("-- onMessage 一小局结束 --");
                        //let param = [ 2,//代表一小局结束 result//输赢,cc.dataMgr.gameData.countGame, // 这是第几小局的结果 time]
                        if (messageArr[2] == cc.dataMgr.gameData.countGame) {
                            cc.dataMgr.gameData.oneOverData = messageArr;
                            //这是是真的结果解析之后 再这里扣除血量
                            if (messageArr[1] == 1) {
                                if (param.userId == cc.dataMgr.gameData.userMy.userId) {
                                    cc.dataMgr.gameData.userOther.hp -= 1;
                                }
                                else {
                                    cc.dataMgr.gameData.userMy.hp -= 1;
                                }
                            }
                            else if (messageArr[1] == 2) {
                                if (param.userId == cc.dataMgr.gameData.userMy.userId) {
                                    cc.dataMgr.gameData.userMy.hp -= 1;
                                }
                                else {
                                    cc.dataMgr.gameData.userOther.hp -= 1;
                                }
                            }
                            else {
                                //平局两个都减
                                cc.dataMgr.gameData.userOther.hp -= 1;
                                cc.dataMgr.gameData.userMy.hp -= 1;
                            }

                            //显示是否凑齐牌
                            let gameJs = cc.find("Canvas").getComponent("Game");
                            if (gameJs)
                                gameJs.showOverHint();

                            if (cc.dataMgr.gameData.userOther.hp > 0 && cc.dataMgr.gameData.userMy.hp > 0) {
                                cc.dataMgr.scheduleOnce(function () {
                                    let gameJs = cc.find("Canvas").getComponent("Game");
                                    if (gameJs && cc.dataMgr.gameData.userOther.hp > 0 && cc.dataMgr.gameData.userMy.hp > 0)
                                        gameJs.beginGame();
                                }, 1.2);
                            }

                            cc.dataMgr.gameOver();
                        }
                        else
                            console.log("-- 警告 忽略消息 oneSmallOver --");
                    }
                }
            }
            else
                console.log("-- 警告 忽略消息!! --");
        }
    }

    onFinish(param) {
        console.log("-- onFinish 游戏结束 -- " + cc.dataMgr.gameData.userOther.hp + " -- " + cc.dataMgr.gameData.userMy.hp);
        //判断整体游戏的 是否结束
        let result = param.result;
        if (typeof (result) != "number")
            result = 3;

        cc.dataMgr.gameData.onGaming = false;
        cc.dataMgr.scheduleOnce(function () {
            if (cc.dataMgr.gameData.userMy.hp == cc.dataMgr.gameData.userOther.hp)
                GameSDK.finish(3);
            else
                GameSDK.finish(cc.dataMgr.gameData.userMy.hp <= 0 ? 2 : 1);
        }, 0.8);
    }

    //游戏数据出错 结束游戏
    gameError(posStr) {
        console.log("-- gameError 重大错误 提前结束游戏 -- " + posStr);
        GameSDK.finish(3);
    }
}
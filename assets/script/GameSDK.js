"use strict";

(function () {
    var GameSDK = window.GameSDK = {
        // CallBack
        onInitCB: null,
        onRoomInfoCB: null,
        onReadyCB: null,
        onStartCB: null,
        onMessageCB: null,
        onFinishCB: null,
        onAudioCB: null,

        inDebug: true,//调试模式 即是在电脑 浏览器中(伪造了返回函数)
        // Internal -- Call Native 
        callNative: function (cmd, param) {
            if (!this.inDebug) {
                if (param == null) {
                    param = "";
                } else {
                    param = JSON.stringify(param);
                }
                var str = "js://callNative?cmd=" + cmd + "&param=" + param;
                return prompt(str);
            }
            else {
                //自己添加的伪造返回可删除
                console.log(param);
                let data = {};
                if (cmd == "init") {
                    cmd = "onInit";
                    data = { "error": 0 };
                }
                else if (cmd == "getRoomInfo") {
                    cmd = "onRoomInfo";
                    data = {
                        "error": 0,
                        "gameId": 0,
                        "roomId": 1391,
                        "roomKey": 1945465117,
                        "users": [
                            {
                                "headUrl": "http://www.jeekegame.com/api/upload/img/Headphoto/4777-1534841583.jpg",
                                "nickName": "玩家EVVcnF",
                                "sex": "f",
                                "type": 1,
                                "userId": 1000618
                            },
                            {
                                "headUrl": "http://www.jeekegame.com/api/upload/ai_icon/128.jpg",
                                "nickName": "涂鸦男孩",
                                "sex": "f",
                                "type": 2,
                                "userId": 10002280
                            }
                        ]
                    }
                }
                else if (cmd == "ready") {
                    cmd = "onReady";
                    data = {
                        "userData": "UserReadyData",
                        "userId": 1000618
                    };
                }
                else if (cmd == "start") {
                    cmd = "onStart";
                    data = {};
                }
                else if (cmd == "broadcast") {
                    cmd = "onMessage";
                    data = {
                        "message": param.message,
                        "userId": 1000618
                    };
                }
                else if (cmd == "gameOver") {
                    cmd = "onFinish";
                    data = { "result": 1 };
                }
                this.nativeCallback(cmd, JSON.stringify(data));
            }
        },

        // Internal -- Native Callback
        nativeCallback: function (cmd, param) {
            if (cmd == "onInit" && this.onInitCB) {
                this.onInitCB(JSON.parse(param));
            } else if (cmd == "onRoomInfo" && this.onRoomInfoCB) {
                this.onRoomInfoCB(JSON.parse(param));
            } else if (cmd == "onReady" && this.onReadyCB) {
                this.onReadyCB(JSON.parse(param));
            } else if (cmd == "onStart" && this.onStartCB) {
                this.onStartCB();
            } else if (cmd == "onMessage" && this.onMessageCB) {
                this.onMessageCB(JSON.parse(param));
            } else if (cmd == "onFinish" && this.onFinishCB) {
                this.onFinishCB(JSON.parse(param));
            } else if (cmd == "onAudio" && this.onAudioCB) {
                this.onAudioCB(JSON.parse(param));
            }
        },

        // 设置回调函数
        setOnInitCB: function (func) {
            this.onInitCB = func;
        },

        setOnRoomInfoCB: function (func) {
            this.onRoomInfoCB = func;
        },

        setOnReadyCB: function (func) {
            this.onReadyCB = func;
        },

        setOnStartCB: function (func) {
            this.onStartCB = func;
        },

        setOnMessageCB: function (func) {
            this.onMessageCB = func;
        },

        setOnFinishCB: function (func) {
            this.onFinishCB = func;
        },

        setOnAudioCB: function (func) {
            this.onAudioCB = func;
        },

        // 初始化SDK
        // 参数:
        //   version: int SDK版本号
        //   gameId: int 游戏ID
        //   gameKey: string 游戏Key
        //   gameSecret: string 游戏Secret
        init: function (version, gameId, gameKey, gameSecret) {
            var param = {
                "version": version,
                "gameId": gameId,
                "gameKey": gameKey,
                "gameSecret": gameSecret
            };
            this.callNative("init", param);
        },

        // 退出游戏
        // 参数:
        //   reason: int 退出原因: 1 - 正常退出，2-异常退出
        quit: function (reason) {
            var param = {
                "reason": reason
            };
            this.callNative("quit", param);
        },


        // 获取游戏房间信息
        getRoomInfo: function () {
            this.callNative("getRoomInfo");
        },

        // 游戏终止
        // 参数:
        //   result: int 游戏结果: 1、胜，2、负，3、平 
        finish: function (result) {
            var param = {
                "result": result
            };
            this.callNative("finish", param);
        },

        // 设置屏幕朝向
        // 参数:
        //    orientation: int 屏幕朝向: 0、横屏，1、竖屏
        setOrientation: function (orientation) {
            var param = {
                "orientation": orientation
            };
            this.callNative("setOrientation", param);
        },

        // 设置声音
        // 参数:
        //   enable: int 是否开启: 0、关闭，1、开启
        //   volume: int 音量
        setAudio: function (enable, volume) {
            var param = {
                "enable": enable,
                "volume": volume
            };
            this.callNative("setAudio", param);
        },

        // 设置麦克风
        // 参数:
        //   enable: int 是否开启: 0、关闭，1、开启
        //   volume: int 音量
        setMic: function (enable, volume) {
            var param = {
                "enable": enable,
                "volume": volume
            };
            this.callNative("setMic", param);
        },

        // 游戏准备
        // 参数
        //   userData: string 用户数据
        ready: function (userData) {
            var param = {
                "userData": userData
            }
            this.callNative("ready", param);
        },

        // 游戏消息广播
        // 参数
        //  message: string 广播的消息
        //  includeMe: int 是否也广播给自己: 0、不包含，1、包含
        broadcast: function (message, includeMe) {
            if (includeMe == null) {
                includeMe = 0;
            }
            var param = {
                "message": message,
                "includeMe": includeMe
            }
            this.callNative("broadcast", param);
        },

        // 游戏结束
        // 参数
        //   result: int 游戏结果: 1、胜，2、负，3、平
        gameOver: function (result) {
            var param = {
                "result": result,
            }
            this.callNative("gameOver", param);
        }
    }
})()

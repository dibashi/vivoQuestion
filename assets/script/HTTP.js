var HTTP = cc.Class({
    extends: cc.Component,

    // URL: "http://test.jeekegame.com:18080/",
    // port: "18080",

    statics: {
        //url: "http://www.test.jeekegame.com:18080/jeekegame/battle/gameapi/",
        url: "http://www.jeekegame.com:18080/jeekegame/battle/gameapi/",
        reqtype: "POST",
        dataType: null || "JSON",
        data: null,
        asyncType: true,
        sendRequest: function (path, success, Authorization) {
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.timeout = 5000;

            var requestURL = HTTP.url + path;
            console.log("RequestURL:" + requestURL);


            var params = [];
            for (var key in HTTP.data) {
                params.push(key + '=' + HTTP.data[key]);
            }
            var dataStr = params.join('&');
            console.log("RequestData:" + dataStr);


            if (HTTP.reqtype === 'POST') {
                xhr.open("POST", requestURL, HTTP.asyncType);
                //是否原生APP
                if (cc.sys.isNative) {
                    xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
                }

                xhr.setRequestHeader("Authorization", Authorization);

                if (HTTP.dataType === "JSON") {
                    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
                    xhr.send(JSON.stringify(HTTP.data));
                } else {
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
                    xhr.send(dataStr);
                }
            } else {
                xhr.open("GET", requestURL + '?' + dataStr, HTTP.asyncType);
                //是否原生APP
                if (cc.sys.isNative) {
                    xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8", "Authorization:" + Authorization);
                }
                xhr.send(null);
            }

            xhr.onreadystatechange = function () {
                console.log("--- 未知返回 ---");
                if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                    console.log("http res(" + xhr.responseText.length + "):" + xhr.responseText);
                    try {
                        var ret = JSON.parse(xhr.responseText);
                        if (success !== null) {
                            success(ret);
                        } /* code */
                    } catch (e) {
                        console.log("err:" + e);
                        //success(null);
                    } finally {
                        if (cc.vv && cc.vv.wc) {
                            //       cc.vv.wc.hide();    
                        }
                    }
                }
            };
            return xhr;
        },
    },
});
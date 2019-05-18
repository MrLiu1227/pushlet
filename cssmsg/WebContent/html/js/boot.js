//引导连接服务器
function connectServer(){

}

//连接服务失败
function connectServerFailed(){

}


//用户登录
function loadDataByAction(){
    plugin.load();
    //var url = serverUrl + 'loadAppItem.action';
    //$.ajax({
    //    url: url,
    //    dataType: 'json',
    //    type: 'post',
    //    success: function (data) {
    //        loadcallback(0,data.msg,data.info);
    //    }
    //});
}
var dp = new DeskPanel();
function loadcallback(flag,deskJson,userJson){
    if(0 == flag){
        showMessageCenter();
        var deskData;
        if ('{}' == JSON.stringify(deskJson)){
            var defaultDataJson = '[{"desk":[{"panel":[]}],"background":"images/13.jpg","bottomApp":[],"openAppType":1}]';
            deskData = JSON.parse(defaultDataJson);
        }else{
            deskData = deskJson;
        }
       g_appJsonData = deskData;
       g_userJsonData = userJson;
	dp.initPanel(deskData);


            //WebSocket
            //判断当前浏览器是否支持WebSocket
            if ('WebSocket' in window) {
                var rootPath = serverUrl;
                var removedRootPath = rootPath.substr(rootPath.indexOf("://"));
                var websocketURL = "ws"+removedRootPath+"websocket";
                websocket = new WebSocket(websocketURL);
            } else {
                $css.tip("当前浏览器不支持收件提醒（IE10及以上）")
            }

            if(websocket != null){
                //连接发生错误的回调方法
                websocket.onerror = function () {}
                //连接成功建立的回调方法
                websocket.onopen = function () {
                    noticeInbox();
                }
                //连接关闭的回调方法
                websocket.onclose = function () {}
                //接收到消息的回调方法
                websocket.onmessage = function (event) {
                    var dataMsg = eval("(" + event.data + ")")
                    var info = dataMsg.msg;

                    addMessagecenterHtml(info)
                }
                //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
                window.onbeforeunload = function () {
                    closeWebSocket();
                }
                //关闭WebSocket连接
                function closeWebSocket() {
                    websocket.close();
                }
                //发送userId到WebSocket
                function noticeInbox(){
                    websocket.send('{"userId":'+ g_userJsonData.userid +'}');
                    //websocket.send('{"userId":aaaaa}');
                }
            }
            $("#hide_block").empty();
            var res = initPanelEdit(deskData);
            if(res){
                plugin.initmessage(userObj.userId);
            }

        $("#loginUser").text("欢迎您，" + userObj.userName);
    }
}

function sigleProcess(cmd){
    console.log(cmd);
}

//登陆成功载入桌面
function showMainPage(){

}






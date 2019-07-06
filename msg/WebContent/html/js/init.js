function desktopInit(){
	serverUrl = arguments[0];
    if( window.qt ){
        new QWebChannel(qt.webChannelTransport, function(channel) {
            window.plugin = channel.objects.plugin;
            if( window.plugin ){
                if( sigleProcess ){
                    window.plugin.jsInvoke.connect( sigleProcess );
                }
            }
        });
    }else{
    	window.plugin = {
    			login: function( username, password ){
    				debugger
    				logincallback(0,{},{userid:'',username:'luyao'})
    			},
    			
//    			load: function(){
//                    var data = '[{"desk":[{"panel":[{"appId":"1002","appUrl":"www.baidu.com","panelId":"panel_0","appType":"5","appVersion":1,"imageUrl":"http://10.13.11.6:8088/0/6fb6464f-a5d8-4a44-8b6d-db0a7b3ee29d.png","appName":"OA单机"},{"appId":"1001","appUrl":"127.0.0.1:8080/cecbase","panelId":"panel_0","appType":"5","appVersion":1,"imageUrl":"http://10.13.11.6:8088/0/823a1e49-9daa-4cf6-9f88-ae3ec985b739.png","appName":"综合办公应用平台"}]},{"panel":[]},{"panel":[]},{"panel":[]}],"background":"images/13.jpg","bottomApp":[{"appId":"1004","appUrl":"www.baidu.com","appVersion":1,"appType":"5","imageUrl":"http://10.13.11.6:8088/0/978b0c9c-b39b-4605-b79e-0ff81435705d.png","appName":"CECOA"}],"openAppType":1}]';
//                    var userData = '{"userId":"51cd16e9e13e458d9dbd6291333984f0"}';
//                    //var data = window.localStorage.getItem('usrinfo');
//    				if( loadcallback ){
//    					loadcallback(0, data,userData );
//    				}
//    			},
//    			
//    			save:function( data /*from page*/ ){
//                    //window.localStorage.setItem('usrinfo', data );
//    				if( savecallback ){
//    					savecallback( 0, data );
//    				}
//    			},
//    			
//    			install:function( appid, imgurl, paneindex, paneliconindex ){
//    				if( installcallback ){
//        				installcallback(0,{} );
//    				}
//    			}
    	}
    	
    }
}


function boot_connentserver(){

}

function boot_tologin(sul){
alert(sul);
    serverUrl = "http://"+sul+"/";
    loadDataByAction();
}

function boot_connentserverfailed(){
    alert('failed');
}

function boot_caload(uuid,token){
    var setting = {
        url: serverUrl + "deskcalogin.action",
        dataType: 'json',
        type: "POST",
        async: false,
        data: {
            "uuid": uuid,
            "token": token
        },
        beforeSend: function() {},
        success: function(msg) {
            resjson = msg;
            if (msg.result == '0') {
                loadDataByAction();
            } else if (msg.result == '1') {
                window.location.href="error.html";
            }
        },
        error: function(msg) {
            alert(msg);
            resjson = msg;
            window.location.href="error.html";
        }
    }
    $.ajax(setting);
}


(function(w){
    if( w.qt == undefined ){}
})(window)

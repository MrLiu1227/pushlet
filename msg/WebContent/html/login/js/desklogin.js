function cambiar_login() {
	$(".cont_ba_opcitiy").hide();
	$(".cont_form_login").show();
    document.querySelector('.cont_forms').className = "cont_forms cont_forms_active_login";
    document.querySelector('.cont_form_login').style.display = "block";
    document.querySelector('.cont_form_sign_up').style.opacity = "0";
    setTimeout(function() { document.querySelector('.cont_form_login').style.opacity = "1"; }, 400);
    setTimeout(function() {
        document.querySelector('.cont_form_sign_up').style.display = "none";
    }, 200);
}

function hidenMainDiv() {
    document.getElementById("mainDiv").style.display = "none"; //隐藏
}
	var storage=window.localStorage;
    storage.size; 
//登录逻辑
function desklogin() {
	debugger
    var name = $('#username').val().trim();
    var psw =md5( $('#password').val().trim());
    plugin.login(name,psw);
//    var resjson = '';
//    var setting = {
//        url: serverUrl + "desklogin.action",
//        dataType: 'json',
//        type: "POST",
//        async: false,
//        data: {
//            "username": name,
//            "password": psw
//        },
//        beforeSend: function() {
//            loginWating();
//        },
//        success: function(msg) {
//            resjson = msg;
//            if (msg.result == '0') {
//                hidedesktop();
//                loadDataByAction();
//                $("#mainDesk").show();
//                $("#loginDesk").hide();
//                $("#backgroundImg").hide();
//                $("#appStoreShow").hide();
//                $("#editPanel").hide();
//                $(".maskingOut").hide();
//                loginFlag = 1;
//            } else if (msg.result == '1') {
//            	msgFalse();
//            	
//            	 /*$("#msgview").html("登录失败");*/
//            }
//        },
//        error: function() {
//            resjson = msg;
//            $("#msgview").html("登录失败");
//        }
//    }
//    $.ajax(setting);
//    if (resjson.result == '0') {
//        //window.location = "main.html";
//        showMainPage();
//    } else if (resjson.result == '1') {
//        $("#msgview").html(msg.msg);
//    }
//    var demo=setInterval(function(){
//        if(storage.size==1){
//            $(".wrapper").find("div").css("font-size","18px");
//            $(".wrapper-middle").find("img").css("height","130px");
//            $(".wrapper-middle").find("img").css("width","130px");
//            $(".wrapper-middle").find(".tips").css("height","39px");
//            $(".wrapper-middle").find(".tips").css("width","39px");
//            $(".wrapper-middle").find(".tips").css("font-size","15px");
//            $(".wrapper-middle").find(".tips").css("line-height","39px");
//            $(".wrapper-middle").find(".tips").css("top","-120px");
//            $(".wrapper-middle").find(".tips").css("right","-29px");
//
//            $(".deskApp .pic-element").hover(function(){
//                $(this).css("width","140px");
//                $(this).css("height","140px");
//            },function(){
//                $(this).css("width","130px");
//                $(this).css("height","130px");
//            });
//            if($(".pic-element").width()==130){
//            	clearInterval(demo); 
//            }
//          }
//        if(storage.size==0){
//             $(".wrapper").find("div").css("font-size","14px");
//                $(".wrapper-middle").find("img").css("height","100px");
//                $(".wrapper-middle").find("img").css("width","100px");
//                $(".wrapper-middle").find(".tips").css("height","30px");
//                $(".wrapper-middle").find(".tips").css("width","30px");
//                $(".wrapper-middle").find(".tips").css("font-size","12px");
//                $(".wrapper-middle").find(".tips").css("line-height","30px");
//                $(".wrapper-middle").find(".tips").css("top","-105px");
//                $(".wrapper-middle").find(".tips").css("right","0px");
//
//                $(".deskApp .pic-element").hover(function(){
//                    $(this).css("width","110px");
//                    $(this).css("height","110px");
//                },function(){
//                    $(this).css("width","100px");
//                    $(this).css("height","100px");
//                });
//                if($(".pic-element").width()==100){
//                	clearInterval(demo);
//                 }
//           }
//    },30)
}
 function logincallback(result,data,userData,qtSettingUrl){
	// data=JSON.parse(data);
	 //userData=JSON.parse(userData);
	//g_userJsonData = userData;
	//g_appJsonData = data;
	 //storage.userLoginData=userData;
	 if (result == '0'){
         loadDataByAction();
         hidedesktop();
         showMainPage();
         $("#mainDesk").show();
         $("#loginDesk").hide();
         $(".top").show();
         $("#backgroundImg").hide();
         $("#appStoreShow").hide();
         $("#editPanel").hide();
         $(".maskingOut").hide();
         loginFlag = 1;
     } else if (result == '1') {
    	 msgFalse();
     }
	  var demo=setInterval(function(){
	        if(storage.size==1){
	            $(".wrapper").find("div").css("font-size","18px");
	            $(".wrapper-middle").find("img").css("height","130px");
	            $(".wrapper-middle").find("img").css("width","130px");
	            $(".wrapper-middle").find(".tips").css("height","39px");
	            $(".wrapper-middle").find(".tips").css("width","39px");
	            $(".wrapper-middle").find(".tips").css("font-size","15px");
	            $(".wrapper-middle").find(".tips").css("line-height","39px");
	            $(".wrapper-middle").find(".tips").css("top","-120px");
	            $(".wrapper-middle").find(".tips").css("right","-29px");

	            $(".deskApp .pic-element").hover(function(){
	                $(this).css("width","140px");
	                $(this).css("height","140px");
	            },function(){
	                $(this).css("width","130px");
	                $(this).css("height","130px");
	            });
	            if($(".pic-element").width()==130){
	            	clearInterval(demo); 
	            }
	          }
	        if(storage.size==0){
	        	
	             $(".wrapper").find("div").css("font-size","14px");
	                $(".wrapper-middle").find("img").css("height","100px");
	                $(".wrapper-middle").find("img").css("width","100px");
	                $(".wrapper-middle").find(".tips").css("height","30px");
	                $(".wrapper-middle").find(".tips").css("width","30px");
	                $(".wrapper-middle").find(".tips").css("font-size","12px");
	                $(".wrapper-middle").find(".tips").css("line-height","30px");
	                $(".wrapper-middle").find(".tips").css("top","-105px");
	                $(".wrapper-middle").find(".tips").css("right","0px");

	                $(".deskApp .pic-element").hover(function(){
	                    $(this).css("width","110px");
	                    $(this).css("height","110px");
	                },function(){
	                    $(this).css("width","100px");
	                    $(this).css("height","100px");
	                });
	                if($(".pic-element").width()==100){
	                	clearInterval(demo);
	                 }
	           }
	    },30)
 }
function deskquit() {
    var setting = {
        url: serverUrl + "deskquit.action",
        dataType: 'json',
        type: "POST",
        data: {},
        success: function(msg) {
            if (msg.result == '0') {
                window.location = "login.html";
            } else if (msg.result == '1') {
                $("#msgview").html(msg.msg);
            }
        },
        error: function() {

        }
    }
    $.ajax(setting);
}

//回车提交事件
function keyDownSearch(e) {
    // 兼容FF和IE和Opera 
    var theEvent = e || window.event;
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    if (code == 13) {
        desklogin(); //具体处理函数 
        return false;
    }
    return true;
}
//展示页面
function show() {
    $("#showDiv").show();
    $("#showDiv").addClass("from-below");
    setTimeout(function() {
        $("#showDiv").addClass("effeckt-show");
    }, 300);
}
//登陆成功后隐藏页面
function hidedesktop() {
    $("#showDiv").removeClass("effeckt-show");
}

function loginWating() {
    $("#msgview").html("正在登录");
}
// 1 登录失败
var lock=true;
function msgFalse(){
	if(!lock){
		return ;
	}
	lock=false;
	$(".msgInfo").show(500);
	$(".msgInfo").html("登录失败,用户名或密码错误");
	clearInterval(msgLogin);
	var msgLogin=setTimeout(function(){
		$(".msgInfo").hide(500);
		lock=true;
	},3000)
}
function userC(){
	debugger
	$(".login-username").find("i").css("color","#188DFB");
	$(".login-password").find("i").css("color","#a0a0a0");
}
function wordC(){
	$(".login-password").find("i").css("color","#188DFB");
	$(".login-username").find("i").css("color","#a0a0a0");
}

//创建右键菜单
var epMenu = {
	create: function (point, option) {
		var menuNode = document.getElementById('epMenu');
		if (!menuNode) {
			//没有菜单节点的时候创建一个
			menuNode = document.createElement("div");
			menuNode.setAttribute('class', 'epMenu');
			menuNode.setAttribute('id', 'epMenu');
		} else $(menuNode).html('');//清空里面的内容

		$(menuNode).css({left: point.left + 'px', top: point.top + 'px'});
		for (var x in option) {
			var tempNode = document.createElement("a");
			$(tempNode).text(option[x]['name']);
			$(tempNode).attr("onclick",option[x].action);
			$(tempNode).css("color","#101010");
			menuNode.appendChild(tempNode);
		}

		$("body").append(menuNode);
	},
	destory: function () {
		$(".epMenu").remove();
	}
};

// 添加App应用
function installApp() {
	alert("install");
	epMenu.destory();
}

//卸载应用
function uninstallApp() {
	alert("uninstallApp");
	epMenu.destory();
}
function hideSysMenu() {
	return false;
}

/*系统设置*/
function sysSettings() {
	alert("系统设置");
	epMenu.destroy();
}
/*var  mBackgroundImages=$("body").attr("background-image");*/
function openBackground(){
	$("#editPanel").hide();
	$("#deskstyle-desk").hide();
	$(".morphsearch").hide();
	$(".rightDiv").hide();
	$(".epMenu").remove();
	$("#backgroundImg").show();
	$(".maskingOut").show();
	$(".topRight span").eq(2).css("backgroundColor","rgba(200, 200, 200, 0.7)").siblings().css("backgroundColor","");
}
function closeBackground(){
	$("#backgroundImg").hide();
	$(".maskingOut").hide();
	$(".backgroundImg-K").hide();
	$(".messageOk").hide();
	$(".topRight span").eq(2).css("backgroundColor","");
	reflushInterface();
}
function openmessageOk(){
	$(".messageOk").show();
	$(".backgroundImg-K").show()
}
function closemessageOk(){
	$(".messageOk").hide();
	$(".backgroundImg-K").hide()
}

/*切换桌面背景图片*/
function changeBackGroundImg(e) {
	var deskMain=document.getElementById("deskMain");
		var curTarget = e.target;//获取当前点击的图片对象
		var imgUrl = curTarget.src;
		var startIndex = imgUrl.indexOf("images");
		imgUrl = imgUrl.substring(startIndex).replace('\"','').replace('\)','').replace('\(','');
		deskMain.style.background="url('" + imgUrl + "')";
}

/*隐藏系统菜单*/
function hideSysMenu(){
	return false;
}

/*保存背景图*/
function saveBackGroundImg() {
	var imgUrl = $("body").css("background-image");
	var startIndex = imgUrl.indexOf("images");
	imgUrl = imgUrl.substring(startIndex).replace('\"','').replace('\)','').replace('\(','');
	var appAllData = g_appJsonData;  // 桌面app
	appAllData[0].background = imgUrl;
	var appData = JSON.stringify(appAllData);

	dp.saveApp(appData);// 保存数据
	$(".maskingOut").hide();
	
	$("#backgroundImg").hide();
	$(".messageOk").hide();
	$(".topRight span").eq(2).css("backgroundColor","");
}

/*关闭背景图设置对话框*/
function closeBackGroundImgDialog() {
	$("#backgroundImg").hide();
	$(".maskingOut").hide();
}

/*打开app*/
function openApp(appUrl,appType,chooseApp){
	var $span;//appName显示对应的span元素
	var curappName;//appName备份
	if(undefined != chooseApp){
		var curElement = chooseApp;
		$span = $(curElement).next("span");
		if(0==$span.size()){
			$span = $(curElement).find("span");
		}
		curappName = $span.html();
		$span.html("正在打开...");
	}

	$(".web-context-menu").remove();
	var openUrl = "";
	if(appUrl.startsWith("http")){
		openUrl = appUrl;
	}else{
		openUrl = "http://"+appUrl;
	}
	try{
		plugin.openchrome(openUrl,2);//QT
	}catch(e){
		alert("调用QT打开应用插件异常！");
	}

	if(undefined != chooseApp) {
		$span.html(curappName);
	}
}
/*删除app,panelId不能删除，不用往后台传*/
function delApp(appId,panelId){
	if(typeof(panelId) == "undefined"){
		var $panelAppArea = $("#"+panelId);
		$("#"+appId, $panelAppArea).remove();
	}else{
		$("#"+appId).remove();
	}
	
	g_appJsonData[0].desk = getAllPanelApp();
	g_appJsonData[0].bottomApp = getBottomApp();
	$(".epMenu").hide(500);
}

/*刷新桌面*/
var currPanelIndex = 1;
function refreshDesk(){
	//$("#epMenu").remove();
	//window.location.reload();
	var $currPanel = $("#panelIndexbox .img-index .index");
	currPanelIndex = $currPanel.index() + 1;
	reflushInterface();

	var panelWidth = $(window).width();
	deskruning(-(currPanelIndex-1)*panelWidth);
}

// 设置app打开方式，1单击，2双击
function setAppOpenType(openType){
	if(!isnull(openType)){
		var panelId = getPanelIds();  // 获取所有面板id
		if(!isnull(panelId) && panelId.length > 0){
			for(var i = 0; i < panelId.length; i ++){
				var appArray = $("#"+panelId[i] + " li");// 获取面板的app
				if(!isnull(appArray) && appArray.length > 0){
					for(var j = 0; j < appArray.length - 1  > 0 ; j ++){
						//设置单击
						if(openType == "1"){
							appArray[j].removeAttribute("ondblclick");
							appArray[j].setAttribute("onclick", 'openApp("'+appArray[j].getAttribute("appUrl")+'", "'+appArray[j].getAttribute("appType")+ '")');
						}
						//设置双击
						if(openType == "2"){
							appArray[j].removeAttribute("onclick");
							appArray[j].setAttribute("ondblclick", 'openApp("'+appArray[j].getAttribute("appUrl")+'", "'+appArray[j].getAttribute("appType")+ '")');

						}
					}
				}
			}
		}
		//设置托盘
		var bottomAppArray = $("#bottomUl li");
		if(!isnull(bottomAppArray) && bottomAppArray.length > 0){
			for(var k =  0 ; k < bottomAppArray.length ; k ++ ){
				if(openType == "1"){
					bottomAppArray[k].removeAttribute("ondblclick");
					bottomAppArray[k].setAttribute("onclick", 'openApp("'+bottomAppArray[k].getAttribute("appUrl")+'", "'+bottomAppArray[k].getAttribute("appType")+ '")');
				}
				if(openType == "2"){
					bottomAppArray[k].removeAttribute("onclick");
					bottomAppArray[k].setAttribute("ondblclick", 'openApp("'+bottomAppArray[k].getAttribute("appUrl")+'", "'+bottomAppArray[k].getAttribute("appType")+ '")');
				}
			}
		}
		openAppType = openType;
		var appAllData = g_appJsonData;  // 桌面app
		appAllData[0].openAppType = openAppType;
		var appData = JSON.stringify(appAllData);
		dp.saveApp(appData); // 保存数据
	}

}




//桌面商店点击隐藏
$(function(){
	$(".deskstyle-close").on("click",function(){
		$("#deskstyle-desk").css("display","none");
		$("#left_control").css("display","block");
		$("#right_control").css("display","block");
		$(".maskingOut").hide();
	})
})
	

 



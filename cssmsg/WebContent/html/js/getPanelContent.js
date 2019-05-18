function isnull (str) {
	if (str == null || str == "" || str == "undefined")
		return true;
}
function compare(value1, value2) {
	   if (value1 < value2) {
	       return -1;
	   } else if (value1 > value2) {
	       return 1;
	   } else {
	       return 0;
	   }
	}
//	获取桌面app,不包含添加应用
	var getPanelApp = function (panelId) {
	 	var $appArray = $("#"+panelId).find("li"),
	 	apparraySize = $appArray.length;
	 	if(apparraySize > 0){
	 		var appinfo, appObj = {}, panelAppArr = []; 
	 		for(var i = 0; i< apparraySize - 1; i++){
	 			appinfo = $appArray[i];
	 			appObj = {};
	 			appObj.appId = $(appinfo)[0].id;
	 			appObj.appUrl = $(appinfo).attr("appUrl");
	 			appObj.panelId = panelId;
	 			appObj.appType = $(appinfo).attr("appType");
	 			appObj.appVersion = $(appinfo).attr("appVersion");
	 			appObj.imageUrl = $(appinfo).find("img").attr("src");
	 			appObj.appName = $(appinfo).find("span").contents().filter(function (index, content) {
					return content.nodeType === 3;
				}).text();
					//$(appinfo).find("span").text();
	 			panelAppArr.push(appObj);
	 		}
	 		return panelAppArr;
	 	}
	 }
	
	// 获取当前面板应用数
	 var getPanelAppSize = function (panelId) {
		var length =  $("#"+panelId).find("li").length;
		return length;
	 }
	
	 /**
	  * 获取所有面板app的信息，返回一个数组,不包含托盘
	  */
	var getAllPanelApp = function (){
		 //同步样式
		 var newDragElements = $(".wrapper-middle").find(".bottom-box");
		 newDragElements.removeClass("bottom-box");
		 newDragElements.addClass("deskApp");
		 var newDragElementNums = $(".wrapper-middle").find(".bot-tips");
		 newDragElementNums.removeClass("bot-tips");
		 newDragElementNums.addClass("tips");
		//同步数据
		 var panelIds = getPanelIds(),
		 panelAppArray = [],
		 panelLength = panelIds.length;
		 if(!isnull(panelIds) && panelLength > 0){
			 var panelObj = {};
			 for(var i = 0; i < panelLength; i ++){
				 panelObj = {};
				 panelObj.panel = getPanelApp(panelIds[i]);
				 panelAppArray.push(panelObj);
			 }
			 
		 }
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
             
           }
		 if(storage.size=="0"){
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
             
           }
		 
		 return panelAppArray;
	 }
	 
	 //清空桌面app
	var  clearPanelApp = function () {
	 	
	 }
	 //添加app到面板 ,appinfo为app json对象
	 var addAppToPanel = function (appInfo) {

	 	if(!isnull(appInfo)){
	 		var appDom = dp.appHtml(appInfo);
	 		var appStore = $("#"+appInfo.panelId).find("li").last();
	 		$(appStore).before($(appDom));
	 	}
	 }
	//更新app到面板 ,appinfo为app json对象
	 var updAppToPanel = function (appInfo) {
	 	if(!isnull(appInfo)){
	 		var appDom = dp.appHtml(appInfo);
	 		if(!isnull(appInfo.panelId)){
	 			var appStore = $("#"+appInfo.panelId).find("#"+appInfo.appId);
		 		$(appStore).after($(appDom));
		 		$(appStore).first().remove();
	 		}else{
	 			var appStore = $("#bottomUl").find("#"+appInfo.appId);
	 			$(appStore).after($(appDom));
		 		$(appStore).first().remove();
	 		}
	 	}
	 }
	 //卸载app更新版面或托盘
	 var onloadAppToPanel = function (panelId,appId) {
		
	 	if(!isnull(appId)){
	 		 if(!isnull(panelId)){
	 			$("#"+panelId).find("#"+appId).remove();
	 		 }else{
	 			$("#bottomUl").find("#"+appId).remove();
	 		 }
	 	}
	 }
	 
	 //获取面板，返回json数组
	var getPanelIds = function (){
		 var panelIds = [], 
		 $panelul = $(".wrapper-content .wrapper-middle ul"); 
		 for(var i = 0; i < $panelul.length; i++){
			 panelIds.push($panelul[i].id);
		 }
		 return panelIds;
		 
	 }
	//获取底部app,返回json数组
	 var getBottomApp = function (){
		//同步样式
		 var newDragElements = $("#bottomUl").find(".deskApp");
		 newDragElements.removeClass("deskApp");
		 newDragElements.addClass("bottom-box");
		 var newDragElementNums = $("#bottomUl").find(".tips");
		 newDragElementNums.removeClass("tips");
		 newDragElementNums.addClass("bot-tips");
		 //同步数据
		 var $bottomAppArr = $("#bottomUl").find("li"),
			 bottomAppArray = [];
		 if(!isnull($bottomAppArr)){
			 var appLength = $bottomAppArr.length, appInfo, appObj = {};
			 for(var i = 0; i < appLength; i ++){
			 	appObj = {};
			 	appinfo = $bottomAppArr[i];
	 			appObj.appId = $(appinfo)[0].id;
	 			appObj.appUrl = $(appinfo).attr("appUrl");
	 			appObj.appVersion = $(appinfo).attr("appVersion");
	 			appObj.appType = $(appinfo).attr("appType");
	 			appObj.imageUrl = $(appinfo).find("img").attr("src");
				appObj.appName = $(appinfo).find("span").contents().filter(function (index, content) {
					 return content.nodeType === 3;
				 }).text();
	 			bottomAppArray.push(appObj);
			 }
			 
		 }
		 if(storage.size=="1"){
		 $(".wrapper-footer").find("img").css({
        	 "width":"70px",
        	 "height":"70px"
        	 })
           $(".wrapper-footer").find("i").css({
        	   "width": "25px",
               "height": "25px",
               "font-size":"12px",
               "border-radius": "50%",
               "line-height": "25px",
               "top": "-70px",
               "right":"0"
        	 })
        	  $(".wrapper-footer").find("img").hover(function(){
                 $(this).css("width","75px");
                 $(this).css("height","75px");
             },function(){
                 $(this).css("width","70px");
                 $(this).css("height","70px");
             });
		 }
		 if(storage.size=="0"){
			 $(".wrapper-footer").find("img").css({
	        	 "width":"70px",
	        	 "height":"70px"
	        	 })
	           $(".wrapper-footer").find("i").css({
	        	   "width": "25px",
	               "height": "25px",
	               "border-radius": "50%",
	               "line-height": "25px",
	               "top": "-70px",
	               "right":"0"
	        	 })
	        	  $(".wrapper-footer").find("img").hover(function(){
	                 $(this).css("width","75px");
	                 $(this).css("height","75px");
	             },function(){
	                 $(this).css("width","70px");
	                 $(this).css("height","70px");
	             });
			 }
		 return bottomAppArray;
	 }	 

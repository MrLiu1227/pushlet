
if(loginFlag == "1"){
	$("#mainDesk").show();
	$("#loginDesk").hide();
	$("#backgroundImg").hide();
	$("#appStoreShow").hide();
	$("#editPanel").hide();
}else{
	$("#mainDesk").hide();
}

/* 搜索	 */
$(".icon").on("click",function(event){
	var searchFlaged=1;
	var inputValue=$(".inputValue").val();
	var classifyName = $('#deskBackGround').find('span').html();

	$(".main-middle").empty("div");

	$.ajax({
		url: serverUrl + "dirAppStore.action",
		dataType:'json',
		data:{ name:inputValue,
			searchFlag:searchFlaged,deskJsonData:JSON.stringify(g_appJsonData)
		},
		type: 'post',
		success: function (data){

			var titleIndex = classifyName;
			if(data.result==0){
				//var res=JSON.parse(data.msg)[titleIndex];
				var res=data.msg[titleIndex];
				for(var i=0;i<res.length;i++){
					if(res[i].state=="添加"){
						addAppHtml='<div class="my-details '+res[i].id+' ">'+
						'<img details="'+res[i].details+'"  src="'+res[i].imgLogo+'" onerror=logo_other(this)>'+
						'<a href="javascript:;">'+res[i].applyName+'</a>'+
						'<span>'+res[i].support+'</span>'+
						'<i class="addApp" appName="'+res[i].applyName+'" id="'+res[i].id+'" appURL="'+res[i].appURL+'" appModel="'+res[i].appModel+'" onclick=addAppFromStore(event)>'+res[i].state+'</i>'+
						/*'<b class="uninstallApp" id="'+res[i].id+'" appURL="'+res[i].appURL+'" appModel="'+res[i].appModel+'">卸载</b>'+*/
						'</div>';
						$(".main-middle").append(addAppHtml);
						
					}else if(res[i].state=="打开"){
						addAppHtml='<div class="my-details '+res[i].id+' ">'+
						'<img details="'+res[i].details+'"  src="'+res[i].imgLogo+'" onerror=logo_other(this)>'+
						'<a href="javascript:;">'+res[i].applyName+'</a>'+
						'<span>'+res[i].support+'</span>'+
						'<i class="openApp" appName="'+res[i].applyName+'" id="'+res[i].id+'" appURL="'+res[i].appURL+'" appModel="'+res[i].appModel+'" onclick=openApp("'+res[i].appURL+'","'+res[i].appModel+'")>'+
						res[i].state+'</i>'+
						'<b id="'+res[i].id+'" appURL="'+res[i].appURL+'" appModel="'+res[i].appModel+'" onclick=Dapp(event)>卸载</b>'+
						'</div>';
						$(".main-middle").append(addAppHtml);
					}
				}
			}
		}
	})
});

function appstoreSearchCallBack(data){
	var titleIndex = classifyName;
	if(data.result==0){
		//var res=JSON.parse(data.msg)[titleIndex];
		var res=data.msg[titleIndex];
		for(var i=0;i<res.length;i++){
			if(res[i].state=="添加"){
				addAppHtml='<div class="my-details '+res[i].id+' ">'+
				'<img details="'+res[i].details+'"  src="'+res[i].imgLogo+'" onerror=logo_other(this)>'+
				'<a href="javascript:;">'+res[i].applyName+'</a>'+
				'<span>'+res[i].support+'</span>'+
				'<i class="addApp" appName="'+res[i].applyName+'" id="'+res[i].id+'" appURL="'+res[i].appURL+'" appModel="'+res[i].appModel+'" onclick=addAppFromStore(event)>'+res[i].state+'</i>'+
				'</div>';
				$(".main-middle").append(addAppHtml);
				
			}else if(res[i].state=="打开"){
				addAppHtml='<div class="my-details '+res[i].id+' ">'+
				'<img details="'+res[i].details+'"  src="'+res[i].imgLogo+'" onerror=logo_other(this)>'+
				'<a href="javascript:;">'+res[i].applyName+'</a>'+
				'<span>'+res[i].support+'</span>'+
				'<i class="openApp" appName="'+res[i].applyName+'" id="'+res[i].id+'" appURL="'+res[i].appURL+'" appModel="'+res[i].appModel+'" onclick=openApp("'+res[i].appURL+'","'+res[i].appModel+'")>'+
				res[i].state+'</i>'+
				'<b id="'+res[i].id+'" appURL="'+res[i].appURL+'" appModel="'+res[i].appModel+'" onclick=Dapp(event)>卸载</b>'+
				'</div>';
				$(".main-middle").append(addAppHtml);
			}
		}
	}
}


//卸载
$(".uninstallApp").live("click",function(){
	var cuRappId =$(this).attr("id");
	var cuRappType =$(this).attr("appmodel");
	delApp(cuRappId,cuRappType);
	if($(".main-middle")){
		$(this).siblings('i').html('添加');
		$(this).siblings('i').attr('class','addApp');
		$(this).siblings('i').attr('onclick','addAppFromStore(event)');
		if($(".main-middle").length=="2"){
			var $applistI = $('.main-details.'+$(this).attr('id')).find('i');
			$applistI.html('添加');
			$applistI.attr('onclick','addAppFromStore(event)');
		}
		$(this).remove();
	}
	saveData();
});

var liveId='';
function Dapp(event){
	var deskstyledesk=document.getElementById("deskstyle-desk")
	var shopMessageOk=document.createElement("div");
		shopMessageOk.className="shopMessageOk";
		deskstyledesk.appendChild(shopMessageOk);
	var shopMessageOkText=document.createElement("div");
		shopMessageOkText.className="shopMessageOkText";
		shopMessageOkText.innerHTML="是否确认卸载";
		shopMessageOk.appendChild(shopMessageOkText);
	var shopMessageOkIf=document.createElement("div");
		shopMessageOkIf.className="shopMessageOkIf";
		shopMessageOk.appendChild(shopMessageOkIf);
	var span1=document.createElement("span");
	var span2=document.createElement("span");
		span1.setAttribute("onclick","shopOpenMessageOk(liveId)");
		span2.setAttribute("onclick","shopCloseMessageOk()");
		span1.innerHTML="是";
		span2.innerHTML="否";
		shopMessageOkIf.appendChild(span1);
		shopMessageOkIf.appendChild(span2);
		/*event.target.className="uninstallApp";*/
		liveId=event.target.id;
		$(".deskstyleKong").show();
}


// 弹出框的   是   逻辑
function shopOpenMessageOk(liveId){
	var allB;
	if($(".main-middle").length=="1"){
		allB=$(".my-details").find("b");
	}else {
		allB=$(".main-middle").find("b");
	}
	console.log(allB.length)
	for(var i=0;i<allB.length;i++){
		if(allB[i].getAttribute("id") == liveId){
			allB[i].className="uninstallApp";
			allB[i].removeAttribute("onclick");
		}
	}
    $(".uninstallApp").trigger("click");
    $(".shopMessageOk").remove();
    $(".deskstyleKong").hide();
	/*$(".backgroundImg-K").show()*/
}

//弹出框的   否   逻辑
function shopCloseMessageOk(){
	$(".shopMessageOk").remove();
}
/* 应用title右切换*/
var menu1Left=$("#menu1").position().left;

var menu0=$(".menu0").width(); // 包裹div的宽度
var lefts;
var last;
var menu1Left;
var Pmenu1Left;

$("#right").on("click",function(){
	var menu1Width=$(".menu1").width(); // ul的宽度
	if(menu1Left<0){
		Pmenu1Left=-menu1Left
	}else{
		Pmenu1Left=menu1Left
	}
	if(menu0+Pmenu1Left==menu1Width){
		last=menu1Left + "px";
		$("#menu1").css("left", last);
	}else{
		menu1Left-= 107;
		lefts=menu1Left + "px";
		$("#menu1").css("left", lefts);
	}
})
/* 应用title左切换*/
$("#left").on("click",function(){
	if(menu1Left<0){
		Pmenu1Left=-menu1Left
	}else{
		Pmenu1Left=menu1Left
	}
	var menu1Width=$(".menu1").width(); // ul的宽度
	if(menu1Left<0){
		menu1Left+= 107;
		lefts=menu1Left + "px";
		$("#menu1").css("left", lefts);
	}else{
		last=menu1Left + "px";
		$("#menu1").css("left", last);
	}
})


$(".inputValue").bind("keydown", function(e){
	if(e.which == 13){
		$(".icon").trigger("click");
		return false;
	}
});




function logo_other(obj){
	try{
		obj.onerror=null;
		obj.src='images/error_icon.png';
		obj.title='未上传';
	}catch(ex){}
}


/*保存数据*/
function saveData(){
	var panelApp = getAllPanelApp();
	/*获取底部托盘app*/
	var buttomApp = getBottomApp();
	/*桌面app*/
	var appAllData = g_appJsonData;
	appAllData[0].desk = panelApp;
	appAllData[0].bottomApp = buttomApp;
	var appData = JSON.stringify(appAllData);
	dp.saveApp(appData); //保存数据
}

//添加应用样式
function cssAddImg(storage){
	if(storage.size=="1"){
		$(".deskApp img").css({
			"height": "130px",
			"width": "130px"
		})
		$(".deskApp .pic-element").hover(function(){
			$(this).css("width","140px");
			$(this).css("height","140px");
		},function(){
			$(this).css("width","130px");
			$(this).css("height","130px");
		});
		$(".deskApp i").css({
			"height": "39px",
			"width": "39px",
			"font-size": "15px",
			"line-height": "39px",
			"top": "-120px",
			"right": "-29px"
		})
	}else{
		$(".deskApp img").css({
			"height": "100px",
			"width": "100px"
		})
		$(".deskApp .pic-element").hover(function(){
			$(this).css("width","110px");
			$(this).css("height","110px");
		},function(){
			$(this).css("width","100px");
			$(this).css("height","100px");
		});
		$(".deskApp i").css({
			"height": "30px",
			"width": "30px",
			"font-size": "12px",
			"line-height": "30px",
			"top": "-105px",
			"right": "0px"
		})
	}
}





//分类切换方法
function tabTitle(searchFlag,event){
	if(event){
		var tar=event.target;
		$(tar).parents(".desk-table").attr("id","deskBackGround").siblings().attr("id","")
	}
	$(".inputValue").val('');
	$(".main-middle").empty("div");
	var cur;
	if($("#deskBackGround")==[]){
		tagText="全部";
	}else{
		cur=$("#deskBackGround").find("span");
		tagText = cur.html();
	}
	$.ajax({
		url:serverUrl+"/dirAppStore.action",
		dataType:"json",
		type:"post",
		data:{searchFlag:searchFlag,deskJsonData:JSON.stringify(g_appJsonData)},
		success:dirAppStoreCallBack
	});
}


function dirAppStoreCallBack(data){
	var titleIndex = tagText;
	if(data.result==0){
		//var res=JSON.parse(data.msg)[titleIndex];
		var res=data.msg[titleIndex];
		var addAppHtml = "";
		for(var i=0;i<res.length;i++){
			var openUrl = res[i].appURL;
				if(res[i].state=="添加"){
					addAppHtml='<div class="my-details '+res[i].id+' ">'+
					'<img details="'+res[i].details+'"  src="'+res[i].imgLogo+'" onerror=logo_other(this)>'+
					'<a href="javascript:;">'+res[i].applyName+'</a>'+
					'<span>'+res[i].support+'</span>'+
					'<i class="addApp" appName="'+res[i].applyName+'" id="'+res[i].id+'" appURL="'+res[i].appURL+'" appModel="'+res[i].appModel+'" onclick=addAppFromStore(event)>'+res[i].state+'</i>'+
					'</div>';
					$(".main-middle").append(addAppHtml);
				}else if(res[i].state=="打开"){
					addAppHtml='<div class="my-details '+res[i].id+' ">'+
					'<img details="'+res[i].details+'"  src="'+res[i].imgLogo+'" onerror=logo_other(this)>'+
					'<a href="javascript:;">'+res[i].applyName+'</a>'+
					'<span>'+res[i].support+'</span>'+
					'<i class="openApp" appName="'+res[i].applyName+'" id="'+res[i].id+'" appURL="'+res[i].appURL+'" appModel="'+res[i].appModel+'" onclick=openApp("'+res[i].appURL+'","'+res[i].appModel+'")>'+
					res[i].state+'</i>'+
					'<b id="'+res[i].id+'" appURL="'+res[i].appURL+'" appModel="'+res[i].appModel+'" onclick=Dapp(event)>卸载</b>'+
					'</div>';
					$(".main-middle").append(addAppHtml);
				}
		}
		//详情  
		$(".main-middle img").live("click",function(){
			var $iDom = $(this).siblings('i');
			var $bDom = $(this).siblings('b');
			var addAppHtml='<div class="main-middle" id="appDetailDiv">'+
				'<div class="main-details-introduce">'+
				'<div class="main-details-img">'+
				'<img  src="'+$(this).attr('src')+'" onerror=logo_other(this) />'+
				'</div>'+
				'<div class="main-details-apellation">'+
				'<span>名称:'+$(this).siblings("a").html()+'</span>'+
				'<span>分类:'+$(this).siblings("span").html()+'</span>'+
				$iDom[0].outerHTML+
				($bDom.size()? $bDom[0].outerHTML:
					('添加'==$iDom.html()? '':
					'<b  appname="'+$iDom.attr('appName')+'" id="'+$iDom.attr('id')+'" appurl="'+$iDom.attr('appurl')+'" appmodel="'+$iDom.attr('appmodel')+'" onclick=Dapp(event)>卸载</b>'))+
				'<a onclick="closeAppDetail();" href="#"><span class="returnBack">返回</span></a>'+
				'</div>'+
				'<div class="main-details-introduceContent">'+
				'<i>详情:</i>'+
				'<div class="introduceContent">'+($(this).attr('details')?$(this).attr('details'):'')+'</div>'+
				'</div>'+
				'</div>'+
				'</div>';
			$(".main-middle").hide();
			$("#main0").append(addAppHtml);
		});
	}
}


//应用详情返回
function closeAppDetail(){
	$(".main-details-img img").remove();
	$('#appDetailDiv').remove();
	$(".main-middle").show();
	$(".main-middle").empty();
	tabTitle("1",event)
	
}


/*打开应用商店*/
function openAppStore(panelId) {
	$(".left").hide();
	$(".right").hide();
	var params = {};
	params.panelId = panelId;
	params.serverUrl = serverUrl;
	params.panelMaxApp = panelMaxApp;
	$("#deskstyle-desk").show();
	$(".maskingOut").show();

	$('#deskstyle-top-title span').removeClass('appstore-click-title-background');
	$("#deskstyle-top-title span").eq(0).addClass('appstore-click-title-background');

	$.ajax({
		url:serverUrl+"/dirAppStoreClassify.action",
		dataType:"json",
		type:"post",
		success:openAppStoreCallBack
	});
}

function openAppStoreCallBack(data){
	if(data.result==0){
		var type=data.msg.split(",");
		var  titleHTML="";
		var widths=type.length * 107 +"px";
		$(".menu1").css("width",widths)
		if($(".menu1").width()=="749"){
			$("#left").hide();
			$("#right").hide();
		}else{
			$("#left").show();
			$("#right").show();
		}
		for(var j=0 ;j<type.length;j++){
			type[j].idx=j;
			var htmladd=$("#menu1");
			titleHTML="<li onclick='tabTitle(1,event)' class='desk-table'>" +
				"<a class='desk-table-text' href='javascript:;'>" +
				"<span>"+type[j]+"</span>" +
				"</a>" +
				"</li>";
			htmladd.append(titleHTML)
		}
		$(".desk-table").eq(0).attr("id","deskBackGround").siblings().attr("id","")
		tabTitle("1");
		$("#menu1").css("left","0");
		Pmenu1Left=0;
	}
}




var clickDocument;
//添加应用
function addAppFromStore(event){
	debugger
	clickDocument = event.target;
	if($(clickDocument).siblings("b")){
		var deleteButton = '<b  id="'+$(clickDocument).attr('id')+'" appurl="'+$(clickDocument).attr('appurl')+'" appModel="'+$(clickDocument).attr('appmodel')+'"  onclick=Dapp(event)>卸载</b>';
		$(clickDocument).after(deleteButton);
		var $applistI = $('.my-details.'+$(clickDocument).attr('id')).find('i');
		$applistI.html('打开');
		$applistI.attr("class","openApp");
		$applistI.attr('onclick','openApp("'+$(clickDocument).attr('appurl')+'","'+$(clickDocument).attr('appmodel')+'")');
	}
	var appId = $(clickDocument).attr("id");
	var panelId = $(".currentPanel").children("ul").attr("id");
	var currentAppNum = getPanelAppSize(panelId);//当前面板数
	if(!isnull(appId)&&!isnull(panelMaxApp)&&!isnull(currentAppNum)&&currentAppNum<panelMaxApp){
		addAppFromStoreInlay(clickDocument);
		return false;
	}else{
		var maxNum = parseInt(panelMaxApp)-1;
		alert("最多为"+maxNum+"个");
	}
}

function installcallback(flag,imgpic,panelindex,paneliconindex){
	if(0==flag){
		addAppObj.imgUrl = addAppObj.appId;
	}
	addAppToPanel(addAppObj);
}

var addAppObj = {};
function addAppFromStoreInlay(clickDocument){
		// 刷新主桌面(更新面板应用)
		addAppObj.appId = $(clickDocument).attr("id");
		addAppObj.appName = $(clickDocument).attr('appName');
		addAppObj.appType = $(clickDocument).attr("appmodel");
		addAppObj.appUrl = $(clickDocument).attr("appurl");
		addAppObj.imageUrl = $(clickDocument).siblings('img').attr('src');
		addAppObj.panelId = $(".currentPanel").children("ul").attr("id");

		plugin.install( addAppObj.appId, addAppObj.imageUrl, addAppObj.panelId, 0);

		// 刷新主桌面(更新面板应用)

		$('.sortable').sortable({
			items : ':not(#lastItem)',
			connectWith : true
		});

		var panelApp = getAllPanelApp();  //获取桌面app
		g_appJsonData[0].desk = panelApp; //初始化桌面
		saveData();//保存刷新数据
}


//添加、更新后操作按钮切换
function updStoreButtonState(clickDocument) {
	$(clickDocument).html("打开");
	var onclickFunction = 'openApp("'+$(clickDocument).attr("appurl")+'","'+$(clickDocument).attr("appmodel")+'")';
	$(clickDocument).attr("onclick",onclickFunction);
}

//添加app到面板 ,appinfo为app json对象
function addAppToPanel(addAppObj) {
	var $addImgs=$(".currentPanel");
	var addHtml = dp.appHtml(addAppObj);
	$addImgs.find("li").last().before(addHtml);

	if(storage.size=="1"){
		$(".deskApp img").css({
			"height": "130px",
			"width": "130px"
		})
		$(".deskApp .pic-element").hover(function(){
			$(this).css("width","140px");
			$(this).css("height","140px");
		},function(){
			$(this).css("width","130px");
			$(this).css("height","130px");
		});
		$(".deskApp i").css({
			"height": "39px",
			"width": "39px",
			"font-size": "15px",
			"line-height": "39px",
			"top": "-120px",
			"right": "-29px"
		})

	}else{
		$(".deskApp img").css({
			"height": "100px",
			"width": "100px"
		})
		$(".deskApp .pic-element").hover(function(){
			$(this).css("width","110px");
			$(this).css("height","110px");
		},function(){
			$(this).css("width","100px");
			$(this).css("height","100px");
		});
		$(".deskApp i").css({
			"height": "30px",
			"width": "30px",
			"font-size": "14px",
			"line-height": "30px",
			"top": "-105px",
			"right": "0px"
		})
	}

	updStoreButtonState(clickDocument);//更改按钮样式
}



function updateAppImgSrc(appId,srcUrl,versionNum){
	$('#'+appId+'ImgId').attr('src',srcUrl);
	if($('#'+appId+'ImgId').attr('appVersion')){
		$('#'+appId+'ImgId').attr('appVersion',versionNum);
	}else{
		$('#'+appId+'ImgId').parents("li").attr('appVersion',versionNum);
	}
}



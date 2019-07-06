(function(win) {
	/* 初始化面板div */

	function deskpanel(data) {
		var data = data;
	}

	deskpanel.prototype.initPanel = function(data) {

		for (var i = 0; i < data.length; i++) {// 遍历desk桌面
			var panelArray = data[i].desk;
			openAppType = data[i].openAppType;
			for (var j = 0; j < panelArray.length; j++) {// 遍历panel桌面
				var appArray = panelArray[j].panel;
				var jdesk = addPanel(j); // 添加面板
				$(".wrapper-content").append(jdesk);
				loadAppData(appArray, j, openAppType); // 添加面板中的应用
			}
			if (currentIndex >0) {
				$(".wrapper-content").children(".wrapper-middle").eq(currentIndex).addClass('currentPanel');
			} else {
				$(".wrapper-content").children(".wrapper-middle:first-child").addClass('currentPanel');
			}

			loadBottomAppData(data[i].bottomApp, openAppType);
			// 初始化背景
			if (!!$("body").css("background-image")) {
				$("body").css('background-image',
					'url(' + data[i].background + ')');
			}
		}
		// 初始化panel索引lsd
		$(".img-index").delay(2000);
		if(panelArray.length-1<currentIndex)
		{
			currentIndex = 0;
		}
		for (var i = 1; i <= panelArray.length; i++) {
			if (currentIndex == i-1) {
				$(".img-index").append(
					"<li class='indexNum index'>" + i + "</li>");
			} else {
				$(".img-index").append("<li class='indexNum'>" + i + "</li>");
			}

		}

		$(".deskApp .pic-element").hover(function(){
			$(this).css("width","110px");
			$(this).css("height","110px");
		},function(){
			$(this).css("width","100px");
			$(this).css("height","100px");
		});

		//初始话右键App迁移的面板菜单lsd
		menuJsonApp = [].concat(menuJsonAppCopy);
		initPanelMenu(panelArray.length,"menuJsonApp3",menuJsonApp);
		dragfinish();
	};

	/* 获取penel数据 */
	deskpanel.prototype.getPanelData = function() {
		return this.data;
	};

	// 加载面板里的app
	var loadAppData = function(appData, panelId, openAppType) {
		var data = appData;
		var $desk = $('#panel_' + panelId);
		if (!isnull(data) && data.length > 0) {
			var appli = "";
			for (var i = 0; i < data.length; i++) {
				appli += addAppHtml(data[i], openAppType);
			}
			$desk.append($(appli));
		}
		// 应用商店打开图标
		var $lastLi = $('<li id="lastItem" class="lastItem" onclick=openAppStore("panel_'
			+ panelId
			+ '");><div><img src="images/appImages/btn_TJ_01.png" class="pic-element" id="Add-pic" /><span class="imgTitle">添加应用</span></div></li>');
		$desk.append($lastLi);
	};
	// 拼接apphtml
	function addAppHtml(appData, openAppType) {
		var appli = "";
		if (!isnull(appData)) {
			appli = '<li class="deskApp"';
			// 初始化数据，单击双击设置
			if (!isnull(openAppType)) {
				if (openAppType == "1") {
					appli += 'onclick =openApp("' + appData.appUrl + '","'
						+ appData.appType + '",'+'this) ';
				}
				if (openAppType == "2") {
					appli += 'ondblclick =openApp("' + appData.appUrl + '","'
						+ appData.appType + '",'+'this) ';
				}
			}
			appli += ' id="' + appData.appId + '" appType = "'
				+ appData.appType + '" panelId = "' + appData.panelId
				+ '" appUrl = "' + appData.appUrl + '" appVersion = "'
				+ appData.appVersion + '"><div><img id="'+appData.appId+'ImgId" src="'
				+ appData.imageUrl
				+ '" class="pic-element" onerror="logo_other(this)"/><span class="imgTitle">'
//				+'<i class="tips">1</i>'
				+ appData.appName + '</span></div></li>';
		}
		return appli;

	}

	deskpanel.prototype.appHtml = function(appData) {
		return addAppHtml(appData, openAppType);
	};

	// 加载底部托盘数据
	var loadBottomAppData = function(data, openAppType) {
		if (typeof data != 'undefined') {
			var $bottom = $('#bottomUl');
			var appHtml = "";
			for (var i = 0; i < data.length; i++) {
				appHtml = '<li class="bottom-box" id="' + data[i].appId + '"';
				if (!isnull(openAppType)) {
					if (openAppType == "1") {
						appHtml += 'onclick =openApp("' + data[i].appUrl
							+ '","' + data[i].appType + '") ';
					}
					if (openAppType == "2") {
						appHtml += 'ondblclick =openApp("' + data[i].appUrl
							+ '","' + data[i].appType + '") ';
					}
				}
				appHtml += ' appUrl = "' + data[i].appUrl + '" appType = "'
					+ data[i].appType + '" panelId = "' + data[i].panelId
					+ '" appVersion = "' + data[i].appVersion
					+ '"><div><img id="'+data[i].appId+'ImgId" src="' + data[i].imageUrl
					+ '" class="pic-element" onerror="logo_other(this)"/><span class="imgTitle">'
				//	+'<i class="bot-tips">99+</i>'
					+ data[i].appName + '</span></div></li>';
				$bottom.append(appHtml);
			}
		}
	}

	// 拖拽完成,保存数据
	var dragfinish = function() {
		var checkContainer = function(container, maxIcon) {
			var $li = container.children();
			if ($li.length >= maxIcon) {
				container.addClass("fulled");
			} else {
				container.removeClass("fulled");
			}
		}

		var check = function(panelId) {
			var deskIconMax = panelMaxApp, bottomIconMax = bottomMaxApp, $bottom = $("#bottomUl");
			checkContainer($("#" + panelId), deskIconMax);
			checkContainer($bottom, bottomIconMax);
		}
		var panelIds = getPanelIds();
		if (!isnull(panelIds) && panelIds.length > 0) {
			for (var i = 0; i < panelIds.length; i++) {
				check(panelIds[i]);
			}
		}
		$('.sortable').sortable({
			items : ':not(#lastItem)',
			connectWith : true
		});

		$('.sortable').on('dragend', function(event) {
			var panelId = event.currentTarget.id;
			check(panelId);
			// 验证，保存数据
			var panelApp = getAllPanelApp(); // 获取桌面app
			var	buttomApp = getBottomApp(); // 获取底部托盘app
			var appAllData = g_appJsonData; // 桌面app
			appAllData[0].desk = panelApp;
			appAllData[0].bottomApp = buttomApp;
			var appData = JSON.stringify(appAllData);
			saveApp(appData); //保存数据
		})
	};

	// 初始化面变
	var addPanel = function(panelId) {
		var panelDom = '<div class="wrapper-middle">' + '<ul id="panel_'
			+ panelId + '" class="sortable grid"></ul>' + '</div>';
		return panelDom;
	};

	// 保存桌面信息
	function saveApp(appData){
		if(!isnull(appData)){
		//	var jsonData = appData;
			//var url = serverUrl + "saveApp.action";
			plugin.save(appData);
			//$.post(url,{"appData":appData, "currentTime":new Date().getTime()},function (data) {
			//	if(data.result == 0){
				//	savecallback(0,jsonData);
			//	}
			//}, 'json');
		}
	}

	deskpanel.prototype.saveApp = function(appData) {
		saveApp(appData);
	};

	win.DeskPanel = deskpanel;
})(window);

function savecallback(flag,jsonData){
	if(flag == 0){
		g_appJsonData = jsonData;
	}else{
		return false;	
	}
}

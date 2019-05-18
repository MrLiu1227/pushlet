 //动态添加App迁移面板选项
function initPanelMenu(panelLength,parentId,menuArray){
    for(var i=1; i<=panelLength; i++){
        var panelObj = {};
        panelObj.name = "桌面" + i;
        panelObj.id = parentId+"Submenu"+i;
        panelObj.parent = parentId;
        panelObj.callback = function(event){//应用迁移的回调方法
            var ancestorNode = chooseApp;
            while (ancestorNode.tagName != "LI") {
                ancestorNode = ancestorNode.parentNode;
            }
            var appId = $(ancestorNode).attr("id");

            var panelIndex = event.target.textContent.replace(/[^0-9]/ig,"");
			panelIndex = panelIndex - 1;
            var appPanelid = $(ancestorNode).attr("panelid");
            var appPanelidArray =appPanelid.split('_');
            $(ancestorNode).attr("panelid",appPanelidArray[0]+'_'+panelIndex);

            var panelList = $(".wrapper-middle");
            var curPanel = panelList[parseInt(panelIndex)];
            var IndexPanelUl = $(curPanel).find("ul");
            IndexPanelUl.append($(ancestorNode));
            IndexPanelUl.append($(ancestorNode));
            var last = IndexPanelUl.find("#lastItem");
            IndexPanelUl.append(last);
            //更新数据
            var findAppJson;
            var fromDeskPanel = g_appJsonData[0].desk[appPanelidArray[1]].panel;
            for (var i=0;i<fromDeskPanel.length;i++){
                if(appId == fromDeskPanel[i].appId){
                    findAppJson = fromDeskPanel[i];
                    fromDeskPanel.splice(i,1);
                    break;
                }
            }
            if(JSON.stringify(findAppJson) != "{}"){
                g_appJsonData[0].desk[panelIndex].panel.push(findAppJson);
                dp.saveApp(JSON.stringify(g_appJsonData));
            }
        };
        menuArray.push(panelObj);
    }
}
var menuJsonBottomApp = [
                   {
                       name:"打开",
                       id:"menuJsonApp1",
                       callback: function() {
                           //js方式获取祖先“li”元素
                           var ancestorNode = chooseApp;
                           while(ancestorNode.tagName != "LI"){
                               ancestorNode = ancestorNode.parentNode;
                           }
                           var cuRappUrl = $(ancestorNode).attr("appurl");
                           var cuRappType = $(ancestorNode).attr("apptype");
                           openApp(cuRappUrl,cuRappType,chooseApp);

                       }
                   },
                   {
                       name:"卸载",
                       id:"menuJsonApp2",
                       callback: function(){
                           //js方式获取祖先“li”元素
                           var ancestorNode = chooseApp;
                           while(ancestorNode.tagName != "LI"){
                               ancestorNode = ancestorNode.parentNode;
                           }
                           var cuRappId = ancestorNode.getAttribute("id");
                           var cuRappType = ancestorNode.getAttribute("panelid");
                           delApp(cuRappId,cuRappType);

                       }
                   }
               ];

var menuJsonApp = [
    {
        name:"打开",
        id:"menuJsonApp1",
        callback: function() {
            //js方式获取祖先“li”元素
            var ancestorNode = chooseApp;
            while(ancestorNode.tagName != "LI"){
                ancestorNode = ancestorNode.parentNode;
            }
            var cuRappUrl = $(ancestorNode).attr("appurl");
            var cuRappType = $(ancestorNode).attr("apptype");
            openApp(cuRappUrl,cuRappType,chooseApp);

        }
    },
    {
        name:"卸载",
        id:"menuJsonApp2",
        callback: function(){
            //js方式获取祖先“li”元素
            var ancestorNode = chooseApp;
            while(ancestorNode.tagName != "LI"){
                ancestorNode = ancestorNode.parentNode;
            }
            var cuRappId = ancestorNode.getAttribute("id");
            var cuRappType = ancestorNode.getAttribute("panelid");
            delApp(cuRappId,cuRappType);

        }
    },
    {
        name:"移动到",
        id:"menuJsonApp3"
    }
    

];//app的菜单栏内容
var menuJsonAppCopy = [].concat(menuJsonApp);//app的菜单栏内容默认值进行备份


var menuJsonPanel = [
    {
        name:"刷新",
        id:"menuJsonPanel1",
        callback: function(ev) {
            reflushInterface();
        }
    },
    {
        name:"编辑面板",
        id:"menuJsonPanel2",
        callback: function(ev) {
            editPanel();
            $(".maskingOut").show();
        }
    },
    {
        name:"背景设置",
        id:"menuJsonPanel3",
        callback: function(ev) {
        	openBackground();
        }
    },
    {
        name:"单击打开应用",
        id:"menuJsonPanel4",
        callback: function(ev) {
        	storage.flag=false;
        	if(storage.flag=="false"){
	        	var memuIcon=$("#web-context-menu-1 b");
	        	memuIcon.eq(4).css("display","none");
	        	memuIcon.eq(3).css("display","block");
        	}
            setAppOpenType(1);
        }
    },
    {
        name:"双击打开应用",
        id:"menuJsonPanel5",
        callback: function(ev) {
        	storage.flag=true;
        	if(storage.flag=="true"){
	        	var memuIcon=$("#web-context-menu-1 b");
	        	memuIcon.eq(4).css("display","block");
	        	memuIcon.eq(3).css("display","none");
        	}
        	 setAppOpenType(2);
        }
    },
    {
        name:"字号设置",
        id:"menuJsonPanel6",
    },
    {
        name:"标准",
        id:"menuJsonPanel61",
        parent:"menuJsonPanel6",
        callback: function(ev) {
        	storage.size=0;
        	if(storage.size=="0"){
	        	var memuIcon=$("#web-context-menu-1 b");
	        	memuIcon.eq(6).css("display","block");
	        	memuIcon.eq(7).css("display","none");
        	}
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
    },
    {
        name:"较大",
        id:"menuJsonPanel62",
        parent:"menuJsonPanel6",
        callback: function(ev) {
        	storage.size=1;
        	if(storage.size=="1"){
	        	var memuIcon=$("#web-context-menu-1 b");
	        	memuIcon.eq(7).css("display","block");
	        	memuIcon.eq(6).css("display","none");
        	}
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
    },
];//面板的菜单栏内容



var chooseApp;//当前右键的App
var createMenuItem = function(id, name, callback) {
    // 创建菜单项
    var menuItem = document.createElement("div");
    menuItem.setAttribute("class", "web-context-menu-item");
    menuItem.setAttribute("id", id);
    // 菜单项中的span，菜单名
    var span = document.createElement("span");
    span.setAttribute("class", "menu-item-name");
    span.innerText = name;
    if (callback && typeof callback === 'function') {
        span.addEventListener("click", function(event){callback(event);});
    }
    // 创建小箭头
    var i = document.createElement("i");
    var b = document.createElement("b");
    b.setAttribute("class", "menu-item-name-icon");
    i.innerText = "▷";
    b.innerText = "√";
    span.appendChild(i);
    span.appendChild(b);
    // 创建下一层菜单的容器
    var subContainer = document.createElement("div");
    subContainer.setAttribute("class", "web-context-menu-items");

    menuItem.appendChild(span);
    menuItem.appendChild(subContainer);
    
    return menuItem;
};

// 创建菜单项之间的分隔线条
var createLine = function() {
    var line  = document.createElement("div");
    line.setAttribute("class", "menu-item-line");
    return line;
};

/**
 * 创建菜单
 */
var createMenu = function(index, menuArr) {
    // 创建菜单层
    var menu = document.createElement("div");
    menu.setAttribute("class", "web-context-menu");
    menu.setAttribute("id", "web-context-menu-" + index);
    document.querySelector("body").appendChild(menu);
    // 创建菜单项容器
    var menuItemsContainer = document.createElement("div");
    menuItemsContainer.setAttribute("class", "web-context-menu-items");
    menu.appendChild(menuItemsContainer);

    // 遍历菜单项
    for (var i = 0; i < menuArr.length; i++) {
        var menuItem = menuArr[i];
        var parent = menuItem.parent;
        // 创建菜单项
        var oneMenu = createMenuItem(menuItem.id, menuItem.name, menuItem.callback);
        if (!parent) {
            menuItemsContainer.appendChild(oneMenu);
            menuItemsContainer.appendChild(createLine());
        } else {
            var parentNode = document.querySelector("#" + parent + " .web-context-menu-items");
            parentNode.appendChild(oneMenu);
            parentNode.appendChild(createLine());
        }
    }
    // 遍历菜单项去掉没有子菜单的菜单项的小箭头
    var allContainer = menu.querySelectorAll(".web-context-menu-items");
    for (var i = 0; i < allContainer.length; i++) {
        var oneContainer = allContainer[i];
        if (!oneContainer.hasChildNodes()) {
            var iTag = oneContainer.parentElement.querySelector("i")
            iTag.parentElement.removeChild(iTag);
        }
    }
}

/**
 * 显示菜单
 */
storage.flag;  //判断用户单双击 false 单  true 双
var showMenu = function(event, menu) {
    menu.style.left = event.clientX + "px";
    menu.style.top = event.clientY + "px";
    menu.style.display = "block";
    if(storage.flag=="true"){
    	var memuIcon=$("#web-context-menu-1 b");
    	memuIcon.eq(4).css("display","block");
    	memuIcon.eq(3).css("display","none");
    }else{
    	var memuIcon=$("#web-context-menu-1 b");
    	memuIcon.eq(4).css("display","none");
    	memuIcon.eq(3).css("display","block");
    }
    if(storage.size=="0"){
    	var memuIcon=$("#web-context-menu-1 b");
    	memuIcon.eq(6).css("display","block");
    	memuIcon.eq(7).css("display","none");
    }else{
    	var memuIcon=$("#web-context-menu-1 b");
    	memuIcon.eq(6).css("display","none");
    	memuIcon.eq(7).css("display","block");
    }
};

/*右键时绑定显示菜单栏事件*/
setTimeout(function(){
    $(".wrapper").on("contextmenu",$(".wrapper-content"),function(event){
        $('.web-context-menu').css('display','none');
        var index = 1;
        //获取当前右键APP对象
        chooseApp = event.target;

        if(event.target.getAttribute('class') == "pic-element"){
            //js方式获取祖先“li”元素
            var ancestorNode = event.target;
            while(ancestorNode.tagName != "LI"){
                ancestorNode = ancestorNode.parentNode;
            }
            if(ancestorNode.getAttribute('class') == "lastItem"){
                index = 1;
            }else{
                index = 0;
            }
        }else{
            index = 1;
        }

        var dataMenuIndex = chooseApp.getAttribute("data-menu-index");
        // 获取obj绑定的菜单索引
        if (dataMenuIndex && index == dataMenuIndex) {
            index = dataMenuIndex;
        } else {
            chooseApp.setAttribute("data-menu-index", index); // 绑定索引
        }
        var menu = document.querySelector("#web-context-menu-" + index);
        if (!menu || menu.length < 1) {
            if(event.target.getAttribute('class') == "pic-element"){
                //js方式获取祖先“li”元素
                var ancestorNode = event.target;
                while(ancestorNode.tagName != "LI"){
                    ancestorNode = ancestorNode.parentNode;
                }
                if(ancestorNode.getAttribute('class') == "lastItem"){
                    createMenu(index, menuJsonPanel);
                }else if(ancestorNode.getAttribute('class') == "bottom-box"){
                	 createMenu(index, menuJsonBottomApp);
                }else{
                    createMenu(index, menuJsonApp);
                }
            }else{
                createMenu(index, menuJsonPanel);
            }
            menu = document.querySelector("#web-context-menu-" + index);
        }
        showMenu(event, menu);
        document.addEventListener("click", function(e) {
            menu.style.display = "none";
        });
        return false;
    });
},1000);


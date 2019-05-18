/*面板管理*/
//Load的action数据备份
var dataCopy;
//面板管理共有多少窗口面板
var lis=1;
//当前面板索引
var currentIndex = 0;
//面板集合的长度
var listIndex = 0;
//桌面的索引集合
var indexList;
//获取当前窗口宽度
var panelWidth = $(window).width();

var obj = {
    1: "value1",
    2: "value2",
    count: 3,
    object: { //对象结构JSON对象
        id: 2,
        msg: "对象里的对象"
    }
};

//        初始化面板编辑页面
function initPanelEdit(data){
    var addHtml = '';
    for(var i = 0;i < data.length;i++){//遍历deskTop
        var panelArray = data[i].desk;
        listIndex = panelArray.length-1;
        if(0 < panelArray.length){
            lis = Math.ceil((panelArray.length+1)/3);        }
        for(var j = 0;j < panelArray.length;j++){//遍历panel
            var appArray = panelArray[j].panel;
            addHtml += '<ul class="hideUl" style="background:rgba(18, 18, 71, 0.55);display: inline-block;margin: 10px;width: 275px;border-radius:5px;height: 180px;vertical-align: top;float:left;">';
            addHtml += '<li class="coverLi">';
            addHtml += '<div class="bannerIn">';
            if(0 >= appArray.length && j>0){
                addHtml += '<div class="txt"  style="margin-top: 40px;margin-left:-10px">'+'<div class="deleteImg"><img src="images/appImages/btn_close.png"></div>'+'</div>';
            }
            for(var k = 0; k<appArray.length; k++){//遍历app
                var apps = "";
                var info = "";
                addHtml += '<div class="txt">';
                info += ' appId="'+appArray[k].appId+'"';
                info += ' appType="'+appArray[k].appType+'"';
                info += ' appName="'+appArray[k].appName+'"';
                info += ' appVersion="'+appArray[k].appVersion+'"';
                info += ' appUrl="'+appArray[k].appUrl+'"';
                info += ' panelId="'+appArray[k].panelId+'"';
                apps += '<img id="'+appArray[k].appId+'ImgId" class="iconImg" ' +
                    ' src="'+appArray[k].imageUrl+'"'+info+'" ' +
                    'onerror="logo_other(this)" style="width: 27px;height: 27px;margin: 5.5px;position: inherit;float: left;">';
                addHtml += apps+'</div>';
            }
            addHtml += '</div>';
            addHtml += '</li>';
            addHtml += '</ul>';
        }
    }
    addHtml += '<ul id="addPanelUl" class="hideUl" style="background: rgba(18, 18, 71, 0.55);display: inline-block;margin: 10px;width: 275px;border-radius:5px;height: 180px;vertical-align: top;float:left;">';
    addHtml += '<li class="coverLi">';
    addHtml += '<div class="bannerIn">';
    addHtml += '<p>'+''+'</p>';
    addHtml += '<div class="txt">'+'<div id="clickImg" style="margin-top: 40px; margin-left:-10px;"><img src="images/appImages/btn_TJ.png"></div>'+'</div>';
    addHtml += '</div>';
    addHtml += '</li>';
    addHtml += '</ul>';

    $("#hide_block").html(addHtml);
    return true;
}

//切换panel索引方法
function switchIndex(index){
    $('.wrapper-middle').removeClass('currentPanel');
    $('#panel_'+index).parents(".wrapper-middle").addClass('currentPanel');

    indexList = $(".img-index").children("li");
    $(indexList).removeClass("index");
    $(indexList[index]).addClass("index");
}
//切換面板方法lsdu
function deskruning(length){
    //lsd
    $('.wrapper-content').css('transform', 'translate3d('+length+'px, 0px, 0px)');
}

//刷新方法lsd
function reflushInterface(){
    $(".img-index").empty();
    $("#bottomUl").empty();
    $(".wrapper-content").empty();
    $("#web-context-menu-0").remove();
    loadDataByAction();
    $('.wrapper-content').css('transform', 'translate3d('+-(currentIndex) * panelWidth+'px, 0px, 0px)');

    if(storage.size==1){
        var timer=setInterval(function(){
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
            if($(".wrapper-middle").find("img").width()=="130"){
                clearInterval(timer)
            }
        },30)
    }
}
//页面加载事件
$(function(){

    //模板索引click-lsd
    $(".img-index").on("click",".indexNum",function(){
        var panelList = $(".wrapper-content").children(".wrapper-middle");
        //lsd
        var clickIndex = $(this).html();
        deskruning(-(clickIndex-1)*panelWidth);
        switchIndex(clickIndex-1);
        currentIndex = clickIndex-1;
    });

    //面板切換lsd
    $(".left").click(function(){
        currentIndex--;
        
        if(0>currentIndex){
            currentIndex = listIndex;
            switchIndex(currentIndex);
            deskruning(-listIndex*panelWidth);
        }else{
            switchIndex(currentIndex);
            deskruning(-currentIndex*panelWidth);
        }
    });
    //右边箭头点击事件
    $(".right").click(function(){
        currentIndex++;
        if(currentIndex>listIndex){
            currentIndex = 0;
            switchIndex(currentIndex);
            deskruning(0);

        }else{
            switchIndex(currentIndex);
            deskruning(-currentIndex*panelWidth);
        }
        deskruning();
    });

// 绑定Add事件
    $(".banner_hide").on("click","#clickImg",function(){
        var addHtml = '';
        addHtml += '<ul class="hideUl" style="background:rgba(18, 18, 71, 0.55);display: inline-block;margin: 10px;width: 275px;border-radius:5px;height: 180px;vertical-align: top;float:left;">';
        addHtml += '<li class="coverLi">';
        addHtml += '<div class="bannerIn">';
        var apps = "";
        var info = "";
        addHtml += '<div class="txt">';
        addHtml += '<div class="txt">'+'<div class="deleteImg" style="margin-top: 40px"><img src="images/appImages/btn_close.png"></div></div>';
        addHtml += '</div>';
        addHtml += '</div>';
        addHtml += '</li>';
        addHtml += '</ul>';
        //$(".img-index").append("<li class='indexNum index'>"+(listIndex+1)+"</li>");
        $("#clickImg").parents("ul").before(addHtml);
        var ulLength = $("#hide_block").children("ul").length;
        if(1 == ulLength%3)
        {
            lis++;
           /* $(".btn_right").trigger("click");*/
        }
        $(".img-index").append("<li class='indexNum'>" + (parseInt($('.indexNum').size())+1) + "</li>");
    });

//        绑定drop事件
    $(".banner_hide").on("click",".deleteImg",function(){
        var $removeDom = $(this).parents("ul");
        var removeDomIndex = $('.hideUl').index($removeDom);
        var ulLength = $("#hide_block").children("ul").length;
        if(0 == ulLength%3)
        {
            lis--;
        }
        var currentPanelIdex = $('.wrapper-middle').index($('.currentPanel'));
        if(removeDomIndex == currentPanelIdex){
            $(".left").trigger("click");
            //currentIndex = currentIndex-1;
        }

        $removeDom.remove();
        if($('.indexNum').last().is('.index')){
            $('.indexNum').eq(-2).addClass('index');
            currentIndex = currentIndex-1;
        }
        $('.indexNum').last().remove();
        //$(indexList[indexList]).remove();
    });

//关闭编辑面板弹窗
    $(".banner_titleIcon").on("click",function(e){
        $(".maskingOut").hide();
        //$("#editPanel").hide();
        $(".maskingOut").hide();
        $("#editPanel").hide();
        $(".topRight span").eq(1).css("backgroundColor","");
        panelFlag = false;
        savePanelEdit();
    })


    var byId = function (id) { return document.getElementById(id); },
        console = window.console;
    if (!console.log) {
        console.log = function () {
            alert([].join.apply(arguments, ' '));
        };
    }

    //编辑面板拖拽
    Sortable.create(byId('hide_block'), {
        group: "words",
        animation: 150,
        store: {
            get: function (sortable) {
                var order = localStorage.getItem(sortable.options.group);
                return order ? order.split('|') : [];
            },
            set: function (sortable) {
                var order = sortable.toArray();
                localStorage.setItem(sortable.options.group, order.join('|'));
            }
        },
        onAdd: function (evt){ console.log('onAdd.hide_block:', [evt.item, evt.from]); },
        onUpdate: function (evt){ console.log('onUpdate.hide_block:', [evt.item, evt.from]); },
        onRemove: function (evt){ console.log('onRemove.hide_block:', [evt.item, evt.from]); },

        onStart:function(evt){
            var parent = document.getElementById("hide_block");
            var child = document.getElementById("addPanelUl");
            child.remove();
            console.log('onStart.hide_block:', [evt.item, evt.from]);
        },

        onSort:function(evt){ console.log('onStart.hide_block:', [evt.item, evt.from]);},
        onEnd: function(evt){
            var addHtml = '';
            addHtml += '<ul id="addPanelUl" class="hideUl" style="background: rgba(18, 18, 71, 0.55);display: inline-block;margin: 10px;width: 275px;border-radius:5px;height: 180px;vertical-align: top;float:left;">';
            addHtml += '<li class="coverLi">';
            addHtml += '<div class="bannerIn">';
            addHtml += '<p>'+''+'</p>';
            addHtml += '<div class="txt">'+'<div id="clickImg" style="margin-top: 40px; margin-left:-10px;"><img src="images/appImages/btn_TJ.png"></div>'+'</div>';
            addHtml += '</div>';
            addHtml += '</li>';
            addHtml += '</ul>';
            $("#hide_block").append(addHtml);
            console.log('onEnd.hide_block:', [evt.item, evt.from]);
        }
    });

    /*********数据分组 start *********/
    //创建空数组
    var add1 = [];
    var add2 = [];
    var lens = $(".banner_hide").find("li").length;
    var $ul = '<ul class="bannerUl"></ul>';

    for(var i=0;i < lens;i++){
        add1.push(i)
    }
    //分割数组
    for(var i = 0 ,len =add1.length ;i < len ;i+=3){
        add2.push(add1.slice(i,i+3));
    }
    /*********数据分组 end *********/

    /*********有缝轮播 start *********/
    /*
     *banner 存放数据的容器
     *bannerUl 容器下子级元素
     *btnl,btnR 分别是左、右按钮
     *num  显示数据的个数
     */
    function runing(banner,bannerUl,btnl,btnR,num){
        var h = 0;
        var bannerulSize = $("."+bannerUl).first().find("li").length;
//            var liwid = $("."+bannerUl).first().width();
        var liwid = 275;
        //计算marginRight的距离，因为有间隙
//            var marginR = parseInt($("."+bannerUl).css("marginRight"));
        var marginR = 20;
        //如果num==3,数据是分过组的，是例2的情况;否则是数组没分组，是例1的情况
        var str = [];
        var liWidt = liwid*num + marginR*(num) ;

        var banul = $( "." + bannerUl );
        for(var i = 0 ;i < banul.length ;i += num){
            str.push(banul.slice(i,i+num));
        }

        //左边箭头点击事件
        //点击事件节流
        var timer=null;
        $("."+btnl).click(function(){
        	clearTimeout(timer);
        	timer=setTimeout(function(){},2000)
            h--;
            runing();
        });
        //右边箭头点击事件
        $("."+btnR).click(function(){
        	clearTimeout(timer);
        	timer=setTimeout(function(){},2000)
            h++;
            runing();
        });

        function runing(){
            if(h == lis){
                $("#"+banner).animate({ "left": 0},1000).stop(true);
                h = 0;
            }
            if(h == -1){
                $("#"+banner).animate({ "left": -(lis - 1) * liWidt },1000).stop(true);
                h = lis-1;
            }
            var moveSize = h * liWidt;
            $("#"+banner).animate({ "left": -h * liWidt },800);
        }
    }
    // 例1调用
    runing("hide_block","hideUl","btn_left","btn_right",3);
});

var panelFlag = false;//初始化隐藏panel
/*面板管理开启和关闭*/
function panelManager(){
	$(".rightDiv").hide();
	$("#deskstyle-desk").hide();
	$("#backgroundImg").hide();
	$(".morphsearch").hide();
	if(!panelFlag){
		$(".maskingOut").show();
		$("#editPanel").show();
		$("#hide_block").empty();
		$(".topRight span").eq(1).css("backgroundColor","rgba(200, 200, 200, 0.7)").siblings().css("backgroundColor","");
		 initPanelEdit(g_appJsonData);
		 panelFlag =true;
	}else if(panelFlag){
		$(".topRight span").eq(1).css("backgroundColor","");
		$(".maskingOut").hide();
		$("#editPanel").hide();
		savePanelEdit();
		panelFlag =false;
	}
}


//保存编辑后的面板编辑页
function savePanelEdit(){
    var hashMap = [];
    var deskObject = {};
    var deskArray = [];
    var panelShow = $(".hideUl ");
    for (var i = 0; i < panelShow.length-1; i++) {
        var panelArray = [];
        var appShow = $(panelShow[i]).find(".iconImg");
        for(var j = 0; j<appShow.length; j++){
            var appObject = {};
            appObject.panelId= appShow[j].getAttribute("panelId");
            appObject.appId= appShow[j].getAttribute("appId");
            appObject.appName = appShow[j].getAttribute("appName");
            appObject.appVersion = appShow[j].getAttribute("appVersion");
            appObject.appType = appShow[j].getAttribute("appType");
            appObject.imageUrl = appShow[j].getAttribute("src");
            appObject.appUrl = appShow[j].getAttribute("appUrl");
            panelArray[j] = appObject;
        }
        var panelObject = {};
        panelObject.panel = panelArray;
        deskArray[i] = panelObject;
    }
    dataCopy = g_appJsonData;
    dataCopy[0].desk  = deskArray;
    var appData = JSON.stringify(dataCopy);
	
	dp.saveApp(appData); // 保存数据
	g_appJsonData = dataCopy;
}

//右键显示编辑面板
function editPanel(){
    $(".rightDiv").hide();
    
    $("#hide_block").empty();
    initPanelEdit(g_appJsonData);
    panelFlag = true;
    $("#editPanel").show();
    $(".epMenu").hide();
}

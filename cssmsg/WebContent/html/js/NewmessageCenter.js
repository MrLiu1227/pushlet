window.onload=function(){
    //设置消息列表的高度（用于出现滚动条）
/*    $("#messageList").css("height",$(window).height()*0.9);
    $("#showMessage").css("height",$(window).height()*0.808);*/
    //默认隐藏消息中心
    $(".rightDiv").hide();
    //消息展示按钮绑定click事件
    $("#messageButton").on("click",".messageSwitch",function(){
        $sortTypeObject = $(this);
        showMessageCenter($(this).attr("id"));
        //renewalMessageShow($sortTypeObject,messageJsonPool);
    });

    //消息条目移入移出
    $(".messageBox").live({
        mouseenter:function(){
            $(this).css("background","rgba(18, 18, 71, 0.55)");
            $(this).find(".deleteMessage").append('<img class="deleteBotton" src="images/appImages/btn_close03.png">');
        },
        mouseleave:function(){
            $(this).css("background","rgba(18, 18, 71, 0)");
            $(this).find(".deleteMessage").find("img").remove();
        }
    });
    //绑定删除条目事件
    $(".deleteBotton").live("click",function(event){
        var parentLi = $(this).parents("li");
        deleteMessage(parentLi);
    });

    //消息点击事件
    $(".messageBox").live("click",function(){
    	openApp($(this).attr('url'));
        deleteMessage($(this));
    });
}

function deleteMessage(parentLi){
    $("#messageTopNum").html( parseInt($("#messageTopNum").html(),10)-1);
    if(parseInt($("#messageTopNum").html(),10)<0){
        $("#messageTopNum").html(0);
    }
    var arrayIndex = parentLi.attr("index");
    var url = serverUrl+'delMessagecenter.action';
    var messageId = parentLi.attr("messageId");

    $.ajax({
        url: url,
        data: {messagecenterAdvicesId:messageId},
        dataType: 'json',
        type: 'post',
        success: function (data) {
            if('0'==data.result){
                parentLi.remove();
                delete messageJsonPool[arrayIndex];
            }else if('1'==data.result){
                alert(data.msg);
            }
        }
    });
    event.stopPropagation();
    return false;
}



function showMessageCenter(sortType){
//alert(serverUrl);
    $("#messageTopNum").html(0);
    var url = serverUrl+'dirMessagecenterByUserId.action';
    $.ajax({
        url: url,
        data: {sortType:sortType},
        dataType: 'json',
        type: 'post',
        success: function (data) {
            setMessageFromQT(JSON.parse(data.msg));
        }
    });
}

var messageJsonPool = [];
var $sortTypeObject = $("#byTime");
var messageJson ={"url":"aaaa","title":"test1","content":"aaaaaa","day":"123"};//当前最新的那条消息

//QT调用该方法传递最新消息
function setMessageFromQT(curMessage){
    messageJson = curMessage;
    $("#showMessage").empty();
    renewalMessageShow($sortTypeObject,curMessage);
}
//添加消息中心展示数据
function renewalMessageShow(sortTypeObject,messageJson){
    messageJsonPool=messageJson;
    //数组内元素指定属性排序
    function compare(propertyName){
        return function(property1,property2){
            var value1 = property1[propertyName];
            var value2 = property2[propertyName];
            return value1.localeCompare(value2);
        };
    }
    $("#showMessage").html();

    for(var i = 0; i<messageJsonPool.length; i++){
        if(undefined == messageJsonPool[i]){
            break;
        }
        addMessagecenterHtml(messageJsonPool[i]);
    }

    $(".messageSwitch").css("background","rgba(18, 18, 71, 0.55)");
    sortTypeObject.css("background","rgba(200, 200, 200, 0.8)");
    return true;
}


function addMessagecenterHtml(message){
    $("#messageTopNum").html( parseInt($("#messageTopNum").html(),10)+1);
    var addHtml = "";
    addHtml +='<li class="messageBox" url="'+message.linkUrl+'" index="'+i+'" messageId="'+message.uuid+'">';
    addHtml +=' <div style="position: relative; padding: 11px 0;">';
    addHtml +='<div style="position: absolute; float: left">';
    addHtml +='<img src="images/appImages/btn_TS01.png" style="width: 50px;height: 50px;margin: 4px 5px 4px 28px; float: left">';
    addHtml +='</div>';
    addHtml +='<div class="messageTextArea">';
    addHtml +='<span class="messageTextArea-title">'+message.title+'</span>';
    addHtml +='<br>';
    addHtml +='<span class="messageContent" style="color:#ffffff;">'+message.content+'</span>';
    addHtml +='</div>';
    addHtml +='<div class="deleteMessage">';
    addHtml +='<span style="color: #ffffff;">'+message.createTime+'</span>';
    addHtml +='</div>';
    addHtml +='</div>';
    addHtml +='</li>';
    $("#showMessage").append(addHtml);
    
}


var messageFlag = false;//初始化隐藏消息中心
/*消息中心开启和关闭*/
function messageCenter(){
	debugger
	panelFlag = false;
	$("#showMessage").scrollTop(0);
	 $(".maskingOut").hide();
	 $("#editPanel").hide();
	$("#deskstyle-desk").hide();
	$("#backgroundImg").hide();
	$("#morphsearch").hide();
    if(messageFlag){
        $(".rightDiv").slideToggle(function(){
        	if($(this).is(":visible")){
        		$(".topRight span").eq(0).css("backgroundColor","rgba(200, 200, 200, 0.7)").siblings().css("backgroundColor","");
        	}else{
        		 $(".topRight span").eq(0).css("backgroundColor","");
        	}
        });
       
        messageFlag = false;
    }else{
        //显示时触发点击"按时间排序"
    	$(".rightDiv").slideToggle(function(){
        	if($(this).is(":visible")){
        		$(".topRight span").eq(0).css("backgroundColor","rgba(200, 200, 200, 0.7)").siblings().css("backgroundColor","");
        	}else{
        		 $(".topRight span").eq(0).css("backgroundColor","");
        	}
        if(undefined != messageJson){
            $("#byTime").trigger("click");
        }
        
        messageFlag = true;
        
        });
    }
}

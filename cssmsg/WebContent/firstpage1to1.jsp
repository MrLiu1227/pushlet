<%@ page import="nl.justobjects.pushlet.core.Session" %>
<%@ page import="nl.justobjects.pushlet.core.SessionManager " %>
<%@ page language="java" pageEncoding="utf-8"
		 contentType="text/html; charset=utf-8"%>
<%@ taglib prefix="ww" uri="webwork"%>
<heade>
	<style type="text/css">

		/*右下角弹出*/
		.dingwe{ position:relative;}
		.tipfloat{display:none;z-index:999;border:1px #8e9cde solid; position:absolute; bottom:0px; right:17px;width:388px;height:268px; background:#fff}
		.tipfloat_bt{ height:49px; line-height:49px;background:#8e9cde; padding:0px 20px; font-size:18px; color:#fff; }
		.xx_nrong{font-size:18px; color:#333; text-align:center; padding:30px 0; line-height:26px; }

	</style>

</heade>
<body>

<div class="content">
	<div class="box box-primary with-border">
		<div class="box-header">
			<b>系统快捷入口</b>
		</div>
		<!-- /.box-header -->
		<div class="box-body">
			<!-- timeline控件 -->
			<div class="content">
				<!-- row      自定义-->
				<div class="row">
					<div class="col-md-12 col-ie" ie-size="20" ie-cols="12">
						<!-- The time line -->
						<ul class="timeline">
							<div id="msgUuid">
								<div class="timeline-before"></div>
									<!-- 月份  ，用if去判断要还是不要 -->
									<ww:iterator value="personalMsgList"  status="data">
										<div id="view<ww:property value="uuid"/>">
											<li class="time-label">
												<span class="bg-red"><ww:property value="new java.text.SimpleDateFormat('yyyy-MM-dd').format(receiveTime)"/></span>
											</li>
											<li>
												<div class="timeline-icon">
													<i class="fa fa-envelope bg-blue"></i>
												</div>

												<div class="timeline-item">
													<div class="timeline-header">
														<h3 class="pull-left">
															<a><ww:property value="sender"/></a> 的消息
														</h3>
														<span class="time"> <i class="fa fa-clock-o"></i> <ww:property value="new java.text.SimpleDateFormat('HH:mm').format(receiveTime)"/>
													</span>
														<div class="clear-fix"></div>
													</div>

													<div class="timeline-body"><ww:property value="msgContent"/></div>
													<div class="timeline-footer">
														<a class="btn btn-primary btn-xs" target="cssTab"  rel="<ww:property value='uuid'/>" title="<ww:property value="msgName"/>" href="personal/getPersonalMsg.action?uuid=<ww:property value='uuid'/>" >Read more</a>
														<%--<a class="btn btn-danger btn-xs" onclick="delMsgMain('<ww:property value="uuid"/>')">Delete</a>--%>
													</div>
												</div>
											</li>
										</div>
									</ww:iterator>
								</div>
							<li>
								<div class="timeline-icon">
                                    <i class="fa fa-clock-o bg-gray"></i>
								</div>
								<div class="timeline-blank"></div>
							</li>							
						</ul>
					</div>
					<!-- /.col -->
				</div>

				<div class="clear-fix" style="margin-bottom: 10px;"></div>
				<!-- /.box -->
				<div class="clear-fix"></div>
			</div>
		</div>
	</div>
</div>
<div style="background:#CCC">
	<!--弹出信息 右下角-->
	<div class="tipfloat" data-num="3">
		<p class="tipfloat_bt">
			<span class="fl">消息</span>
			<span class="fr close" style="float: right"><img src="personmsg/images/guanbi.png"></span>
		</p>
		<div class="ranklist">
			<div class="xx_nrong">
				aaaaa
			</div>
		</div>
	</div>
</div>
</body>

<script type="text/javascript" src="personmsg/js/ajax-pushlet-client.js"></script>
<script type="text/javascript">
    <%--弹窗--%>
    $(function(){
        $(".close").click(function(){
            $(".tipfloat").animate({height:"hide"},800);
        });
    })

    function tankuan(msg){
		$(".tipfloat").animate({height:"show"},800);
		//文本输出可删除
		$(".xx_nrong").html(msg);
		setTimeout(function() {
            $(".close").click();
        }, 3000);
    }
    <%--弹窗--%>



    <%--pushlet--%>
    var subscriptionId = null;
    onInit();
    window.onbeforeunload = onUnsubscribe;
   // window.onunload = onUnsubscribe();
   // 获取长度为len的随机字符串
   function _getRandomString(len) {
      var len = len || 32;
      var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';
      var maxPos = chars.length;
      var pwd = '';
      for (i = 0; i < len; i++) {
          pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
   }
   // 页面加载完，初始化请求、监听
   function onInit() {
      PL.mySessionId = _getRandomString(32);
	  var userId = '<ww:property value="#session.sUser.realName" />';
       /*  var len = "_"+_getRandomString(32);
        PL.mySessionId = userId+len;
        PL.userId = userId; //直接用userId不好使
        PL._init();
        PL.joinListen("/msgNum");*/
      var aSubject = userId;          //主题名
      var httpRequest   = getXMLHttpRequest();
      if (httpRequest) {
          httpRequest.onreadystatechange = function() {
              if (httpRequest.readyState == 4) {
                  if (httpRequest.status == 200) {

                      // 请求成功，起pushlet监听
                      PL._init();
                      PL.joinListen(PL.mySessionId );
                  } else {
                      alert("实时请求失败!\n" + httpRequest.statusText);
                  }
              }
          }
          url = '<%=request.getContextPath()%>' + '/TestServlet'
              + '?subject=' + aSubject + '&thisSessionId=' +   PL.mySessionId ;
          httpRequest.open("POST", url, true);
          httpRequest.send(null);
      }
   }

   // 监听后台返回的数据信息，更新页面
   function onData(event) {
      // 保存订阅编号，用于页面关闭时进行退订
      subscriptionId = event.get('p_sid');
       console.log(subscriptionId+"=============================================")
      console.log(event.get("who") +"    "+ event.get("num")  +"    "+ event.get("date"));
       //tankuan(decodeURIComponent(event.get("key1")));
	   var num = event.get( PL.mySessionId);
	   if(num > 0){
           tankuan("<a title='消息查看'  target=\"cssTab\" href='personal/dirPersonalMsg.action'>您收到" + num + "条新消息，点击进入列表查看</a>");
	   }
  }
    // 页面关闭时,取消订阅
    function onUnsubscribe() {
         debugger;
        if (subscriptionId != null) {
            PL.unsubscribe(subscriptionId);
        } else {
            //什么时候需要这个方法呢，就是比如我设置了五秒一刷新，user登录了不足五秒马上退出，此时线程还在休眠中，根本还没有生成事件，还没有给前台subscriptionid不能取消订阅，此时直接关闭session
            $.ajax({
                type:'POST',
				async:false,
                url:'personal/delPushLetSession.action?id='+ PL.mySessionId,
                dataType:"json",
                cache: false,
                success : function(data) {

                },
            });
		}
    }
   // 获取http请求
   function getXMLHttpRequest() {
      req = false;
      //本地XMLHttpRequest对象
      if (window.XMLHttpRequest) {
          try {
              req = new XMLHttpRequest();
          } catch (e) {
              req = false;
          }
          //IE/Windows ActiveX版本
      } else if (window.ActiveXObject) {
          try {
              req = new ActiveXObject("Msxml2.XMLHTTP");
          } catch (e) {
              try {
                  req = new ActiveXObject("Microsoft.XMLHTTP");
              } catch (e) {
                  req = false;
              }
          }
      }
      return req;
   }
   <%--pushlet--%>

	function delMsgMain(index) {
        $css.confirm("是否确认删除该消息？", function() {
            $.ajax({
                type:'POST',
                url:'personal/delPersonalMsg.action?ids='+index,
                dataType:"json",
                cache: false,
                success : function(data) {
                    //删除成功返回后，隐藏div
                    $("#view"+index).hide();
                    $css.alert("删除成功");
                },
                error : function(data) {
                    $css.alert("删除成功")
                },
            });
        })
    }

    $(".timeline-body").each(function () {
		var len = $(this).text().length;
		if(len > 30){
		    var str = "";
		    str =  $(this).text().substring(0, 50) + "......";
            $(this).html(str);
		}
    })


</script>
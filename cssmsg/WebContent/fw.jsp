<%@page import="com.css.core.configuration.Environment"%>
<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@ taglib prefix="ww" uri="webwork"%>
<ww:bean name="'com.css.apps.base.dict.service.DictMan'" id="dictID" />
<%
	if (session.getAttribute(Environment.SESSION_LOGIN_KEY) == null) {
		response.sendRedirect("login.jsp");
	}
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>消息中心</title>
<link rel="stylesheet" href="cssui/layout/font-awesome.min.css" />
<link class="current" rel="stylesheet" href="<ww:property value="#dictID.getDictType('d_para_g','17').name"/>input.css" />
<link class="current" rel="stylesheet" href="<ww:property value="#dictID.getDictType('d_para_g','17').name"/>main_new.css" />
<link rel="stylesheet" href="cssui/plugins/jqdialog/jqdialog.css" />
	<style>

		.tab-pane-left{margin-left: 20px;}
		.jqsplit{padding-left: 20px;background: white;}
			.sidebar_top{height:96px;background:#232429;}
		.sidebar_top i{font-size:50px;color:white;display:block;float:left;width:55px;margin-left:20px;
		line-height:98px;font-weight:700;}
		.sidebar_top span{color:white;font-size:28px;line-height:100px;float:left;text-indent:20px;}
		
		@font-face {font-family: "iconfont";
  src: url('iconfont.eot?t=1550644887477'); /* IE9 */
  src: url('iconfont.eot?t=1550644887477#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2'),
  url('iconfont.woff?t=1550644887477') format('woff'),
  url('iconfont.ttf?t=1550644887477') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('iconfont.svg?t=1550644887477#iconfont') format('svg'); /* iOS 4.1- */
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.icon-fasongwenjianfawen1300:before {
  content: "\e64e";
}

	</style>
<!--[if lt IE 9]>
  <script type="text/javascript" src="cssui/js/ie/html5shiv.min.js"></script>
  <script type="text/javascript" src="cssui/js/ie/respond.min.js"></script>
<![endif]-->
<!--[if lt IE 8]>
<link rel="stylesheet" href="cssui/awesome/css/font-awesome-ie7.min.css">
<![endif]-->
</head>
<body>
	<div class="wrapper">
		<div class="wrapper-content"> 	
			<div class="wrapper-middle">
				<div class="wrapper-body-2">
					<div class="body-container">
						<div class="tabMenu" id="tab-01">
							<div class="tabMenu-middle">
								<div class="tabMenu-body">
									<ul class="nav nav-pills tabMenu-ul " context-menu="tabMenu">
										<li id="myTablihome" class="active"><a tabid="home" href="#home" data-href="dirFileMain.action" style="text-align: center">发文起草</a></li>
									</ul>
								</div>
							</div>
						

							<div class="tabMenu-right tabMenu-more">
								<a href="javascript:;" data-toggle="dropdown" class="dropdown-toggle more"> <i class="fa fa-reorder"></i>
								</a>
								<ul class="dropdown-menu dropdown-menu-right">
								</ul>
							</div>
							<ul class="dropdown-menu" id="tabMenu">
								<li><a rel="reload" href="javascript:;">刷新标签页</a></li>
								<li><a rel="close" href="javascript:;">关闭标签页</a></li>
								<li><a rel="closeOther" href="javascript:;">关闭其他标签页</a></li>
								<li><a rel="closeAll" href="javascript:;">关闭全部标签页</a></li>
							</ul>
							
						</div>
					</div>
					<div class="body-container">
						<section id="tab-content" class="tab-content layoutBox">
							<div class="tab-pane active" id="home"></div>
						</section>
					</div>

				</div>
			</div>
			<div class="wrapper-left">
				<div class="sidebar l-autoscroll" scrollSize="-41" unselectable="on" onselectstart="return false;">
					<div class=sidebar_top>
					<i class="icon iconfont">&#xe64e;</i>
					<span>消息盒子</span>
					</div>	
					<ul class="sidebar-menu">
						<%--<li><a href="javascript:;" rel="bbca678b9d7045158c2606afff4c1bed" title="个人网盘" refresh="true"><i class="fa fa-fw fa-folder colorbg bg-lime"></i> <span>个人网盘</span><span class="pull-right-container"> <i class="fa fa-angle-left pull-right"></i></span></a>--%>
							<ul class="treeview-menu">
								<li class="active"><a href="javascript:$navTab.openTabById('home')" rel="home" id="fpTab" title="消息查看"><i class="fa fa-fw fa-pencil"></i> <span>消息查看</span></a></li>
							</ul>
						<%--</li>--%>
					</ul>
				</div>
				<div class="sidebarFloatMenu" id="sidebarFloatMenu" style="display: none"></div>
			</div>
		</div>
		<!-- <div class="wrapper-footer">footer</div> -->
	</div>
	<script type="text/javascript" src="cssui/plugins/jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="cssui/js/urlloader2.js"></script>

	<script type="text/javascript" src="cssui/plugins/cssbootstrap/src/dropdown.js"></script>
	<script type="text/javascript" src="cssui/plugins/cssbootstrap/src/tab.js"></script>
	<script type="text/javascript" src="cssui/plugins/cssbootstrap/src/jqtab.js"></script>
	<script type="text/javascript" src="cssui/plugins/jqztree/jqztree.js"></script>
	<script type="text/javascript" src="cssui/plugins/jqztree/jqdropdownztree.js"></script>
	<script type="text/javascript" src="cssui/plugins/jqsplit/jqsplit.js"></script>
	<script type="text/javascript" src="cssui/plugins/jqsplittable/jqsplittable.js"></script>
	<script type="text/javascript" src="cssui/plugins/jqdialog/jqdialog.js"></script>
	<script type="text/javascript" src="cssui/plugins/slimScroll/jquery.slimscroll.js"></script>


	<!-- <script type="text/javascript" src="cssui/plugins/cssbootstrap/cssbootstrap.min.js"></script> -->
	<script type="text/javascript" src="cssui/plugins/jquery.cookie.min.js"></script>
	<script type="text/javascript" src="cssui/plugins/jquery.validate.js"></script>
	<script type="text/javascript" src="cssui/plugins/jquery.blockui.min.js"></script>
	<script type="text/javascript" src="cssui/plugins/My97DatePicker/WdatePicker.js"></script>

	<link rel="stylesheet" href="cssui/plugins/jqupload/jqupload.css" />
	<script type="text/javascript" src="cssui/plugins/jqupload/src/crop.js"></script>
	<script type="text/javascript" src="cssui/plugins/jqupload/src/ieupload.js"></script>
	<script type="text/javascript" src="cssui/plugins/jqupload/src/method.js"></script>
	<script type="text/javascript" src="cssui/plugins/jqupload/src/upload.js"></script>
	<script type="text/javascript" src="cssui/plugins/cssreview/cssreview.js"></script>

	<!-- <script type="text/javascript" src="cssui/plugins/lhgdialog/lhgdialog.min.js?skin=add"></script> -->
	<!-- <script type="text/javascript" src="cssui/js/cssui.min.js"></script> -->
	<script type="text/javascript" src="cssui/js/file.js"></script>
	<script type="text/javascript" src="cssui/js/common.js"></script>
	<script type="text/javascript" src="cssui/js/css.core.js"></script>
	<script type="text/javascript" src="cssui/js/contextmenu.js"></script>
	<script type="text/javascript" src="cssui/js/table.js"></script>
	<script type="text/javascript" src="cssui/js/navtab.js"></script>
	<script type="text/javascript" src="cssui/js/action.js"></script>
	<script type="text/javascript" src="cssui/js/myapp.js"></script>
	
	
	<script type="text/javascript" charset="utf-8" src="cssui/plugins/ueditor/ueditor.config.js?t=1221"> </script>
	<script type="text/javascript" charset="utf-8" src="cssui/plugins/ueditor/ueditor.all.js?2023"> </script>
	<script type="text/javascript" charset="utf-8" src="cssui/plugins/ueditor/lang/zh-cn/zh-cn.js?2023"></script>
	
	
	<script type="text/javascript" src="cssui/js/jqdict.js"></script>
	
	<script type="text/javascript" src="cssui/plugins/jqupload/jqupload.js"></script>
	<script type="text/javascript" src="cssui/plugins/jqupload/newsjqupload.js"></script>
	<script type="text/javascript" src="cssui/plugins/kindeditor-4.1.2/kindeditor-min.js"></script>
	<script type="text/javascript" src="cssui/plugins/kindeditor-4.1.2/lang/zh_CN.js"></script>
	<script type="text/javascript" src="cssui/plugins/kindeditor-4.1.2/plugins/code/sh/sh.js"></script>
	
	<script type="text/javascript">
		g_rel='<%=request.getParameter("r")==null?"":request.getParameter("r")%>';
		g_url='<%=request.getParameter("u")==null?"":request.getParameter("u")%>';
		/**
		 * 两种对话框：jqdialogFun, lhgdialogFun
		 */
		$css = $.extend($css, jqdialogFun);
		g_user = {
			id : '<ww:property value="#session.sUser.userId" />',
			name : '<ww:property value="#session.sUser.realName" />'
		};
		var global_sider = 'siderBar';
		$(function() {
			$('body').off();
			$('body').on('click', '[target=cssDialog]', function() {
				return $css.openDialog($(this));
			});
			$sidebar.init('.sidebar');
			$box.activate();
			var home = new tabModel();
			home.id = 'home';
			home.title = '消息查看';
			home.url = 'personal/dirPersonalMsg.action';
			$navTab.init('#tab-01', {
				homeTab : home,
				shownCallback : $css.navTabInit,
				sidebarCallback : $sidebar.activeByTabId
			});
			$jqsplit.callback = $ieFix.resize;
			
			$newTable.event();
			setTimeout(function() {		
				initLayout();
				//$navTab.openTab(home);
				$navTab.refreshTab('home');
				
				$('#scroll_home').height()
			}, 10);
		
			 $('.treeview').click(function(){
				initLayout2()
				
			}) 

			var resizeTimer = null;
			$(window).bind('resize', function() {
				if (resizeTimer)
					clearTimeout(resizeTimer);
				resizeTimer = setTimeout(function() {
					initLayout();
				}, 50);
			});
	    	setTimeout(function(){
	    		if(g_rel!='') {
	    	    	$('.sidebar-menu a[rel="'+g_rel+'"]').get(0).click();
	    	    }
	    		if(g_url!='') {
	                $navTab.openTab({
	                    id:Math.round(Math.random() * 10000),
	                    title:'查看',
	                    url:g_url
	                });
	    		}
	    	},200);
		});
	</script>
</body>
</html>

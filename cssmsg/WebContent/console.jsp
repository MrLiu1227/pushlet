<%@page import="com.css.core.configuration.Environment"%>
<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@ taglib prefix="ww" uri="webwork"%>
<ww:bean name="'com.css.apps.base.dict.service.DictMan'" id="dictID" />
<ww:bean name="'com.css.app.personalmsg.service.GetPersonalMsgService'" id="getMsgNum" />

<%
	if (session.getAttribute(Environment.SESSION_LOGIN_KEY) == null) {
		response.sendRedirect("login.jsp");
	}
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<title>消息中心系统</title>
<link rel="stylesheet" href="cssui/layout/font-awesome.min.css" />
<link rel="stylesheet" href="cssui/main/input.css" />
<link rel="stylesheet" href="cssui/main/main.css" />
<link rel="stylesheet" href="cssui/plugins/jqdialog/jqdialog.css" />
<link href='cssui/plugins/fullcalendar/fullcalendar.css'  rel='stylesheet' />
<link href='cssui/plugins/fullcalendar/fullcalendar.print.css' rel='stylesheet' media='print' />


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
		<div class="wrapper-header">
			<div class="logo">
				<span class="logo-lg">
					<i class="fa fa fa-envelope"></i>&nbsp;&nbsp;消息中心
				</span>
			</div>
			<nav class="navbar navbar-static-top">
				<div class="navbar-custom-menu pull-right">
					<ul class="nav navbar-nav">
						<!-- Messages: style can be found in dropdown.less-->
						<li class="dropdown messages-menu"><a href="javascript:$navTab.openTabById('home')"> <i class="fa fa-envelope-o"></i> <span class="label label-success"><ww:property value="#getMsgNum.getMsgNumForHome()" /></span>
						</a></li>
						<!-- <li><a href="#" data-toggle="control-sidebar"> <i class="fa fa-gears"></i> -->
						</a></li>
						<!-- User Account: style can be found in dropdown.less -->
						<li><a href="#"> <span class="hidden-xs">
									欢迎您，
									<ww:property value="#session.sUser.realName" />
								</span>
						</a></li>
						<!-- Control Sidebar Toggle Button -->
						<!-- <li><a href="dirThemeChange.action" title="主题" target="cssDialog"><i class="fa fa-object-group"></i> 主题 </a></li> -->
						<li><a title="退出" href="<ww:property value="#session[@com.css.apps.base.user.action.login.SSO@CONST_SSO_LOGOUT]" default="quit.action"/>"> <i class="fa fa-power-off"></i> 退出
						</a></li>

					</ul>
				</div>
			</nav>
		</div>

		<div class="wrapper-content">
			<div class="wrapper-middle">
				<div class="wrapper-body-2">
					<div class="body-container">

						<div class="tabMenu" id="tab-01" unselectable="on" onselectstart="return false;">
							<div class="tabMenu-middle">
								<div class="tabMenu-body">
									<ul class="nav nav-pills tabMenu-ul " context-menu="tabMenu">
										<li id="myTablihome" class="active"><a tabid="home" href="#home" data-href="firstpage.jsp" style="text-align: center"><i class="fa fa-home text-red"></i> 首&nbsp;页&nbsp;&nbsp;</a></li>
									</ul>
								</div>
							</div>
							<div class="tabMenu-left tabMenu-more two">
								<a href="javascript:;" class="toggleSidebar" onclick="$sidebar.toggle();"> <i class="fa fa-gg"></i>
								</a>
								<div class="clear"></div>
								<a href="javascript:;" data-toggle="dropdown" class="dropdown-toggle more"> <i class="fa fa-reorder"></i>
								</a>
								<ul class="dropdown-menu">
								</ul>
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
					<ul class="sidebar-menu">
						<ww:bean name="'com.css.apps.base.menu.service.Menu'" id="menuID" />
						<ww:property value="#menuID.getMenu(#session.sUser.userId)" />
					</ul>
				</div>
				<div class="sidebarFloatMenu" id="sidebarFloatMenu" style="display: none"></div>
			</div>
			
		</div>
	</div>
	<script type="text/javascript" src="cssui/plugins/jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="cssui/js/urlloader.js"></script>
	<script type="text/javascript" src="cssui/plugins/cssbootstrap/cssbootstrap.min.js"></script>
	<script type="text/javascript" src="cssui/plugins/slimScroll/jquery.slimscroll.min.js"></script>
	<script type="text/javascript" src="cssui/plugins/jquery.cookie.min.js"></script>
	<script type="text/javascript" src="cssui/plugins/jquery.validate.js"></script>
	<script type="text/javascript" src="cssui/plugins/jquery.blockui.min.js"></script>
	<script type="text/javascript" src="cssui/plugins/My97DatePicker/WdatePicker.js"></script>
	<script type="text/javascript" src='cssui/plugins/fullcalendar/lib/jquery-ui-1.10.4.custom.min.js'></script>
	<script type="text/javascript" src='cssui/plugins/fullcalendar/fullcalendar.js' ></script>
	<script type="text/javascript" src="cssui/js/cssui.js"></script>
	<script type="text/javascript" src="cssui/js/slwui.min.js"></script>
	<script type="text/javascript" src="cssui/plugins/echarts/echartsIE8.js"></script>
	<script type="text/javascript">
        /**
		 * 两种对话框：jqdialogFun, lhgdialogFun
		 */
		$css = $.extend($css, jqdialogFun);
		g_user = {
			id : '<ww:property value="#session.sUser.userId" />',
			name : '<ww:property value="#session.sUser.realName" />'
		};

		$(function() {
			
			$('body').off();
			$('body').on('click', '[target=cssDialog]', function() {
				return $css.openDialog($(this));
			})
			$sidebar.init('.sidebar', '75', true);//样式48,样式75; true,false:是否展开
			$box.activate();
			var home = new tabModel();
			home.id = 'home';
			home.title = '首&nbsp;&nbsp;&nbsp;&nbsp;页';
			home.url = 'dirFirstPage.action';
			
			$navTab.init('#tab-01', {
				homeTab : home,
				shownCallback : $css.navTabInit,
				sidebarCallback : $sidebar.activeByTabId
			});
			
			// sidebar demo: addLabel, removeLabel 
			$sidebar.addLabel('DemoMulti', '16+', 'bg-green', 'top').click(function() {
				$(this).hide(800);
			});
			$sidebar.addLabel('DemoDemoTree', 'new', 'bg-blue', 'middle').delay(5000).hide(0);
			$sidebar.addLabel('Code_Man', '10秒', 'bg-red', 'bottom').delay(10000).hide(800);
			$sidebar.addLabel('M_portal', '15', 'bg-fuchsia', 'middle');
			$sidebar.addLabel('m006', '6', 'bg-yellow', 'middle');
			$sidebar.addLabel('m006-2', '8', 'bg-fuchsia', 'middle');
			
			setTimeout(function() {
				$sidebar.removeLabel('M_portal');
			}, 15000)
			// sidebar demo end
			
			$jqsplit.callback = $ieFix.resize;
			$newTable.event();
			<ww:if test="type==1">
			var tab = new tabModel();
			tab.id = '<ww:property value="id" />';
			tab.title = '<ww:property value="title" />';
			tab.url = '<ww:property value="url" />';
			$navTab.openTab(tab);
			</ww:if>
			<ww:elseif test="type==2">
			<ww:property value="url" />;
			</ww:elseif>
			<ww:else>
			$navTab.openTab(home);
			</ww:else>

			var resizeTimer = null;
			$(window).bind('resize', function() {
				if (resizeTimer) clearTimeout(resizeTimer);
				resizeTimer = setTimeout(function() {
					initLayout();
				}, 50);
			});
		});
	</script>
</body>
</html>

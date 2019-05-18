<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="ww" uri="webwork"%>
<%@page import="com.css.core.configuration.Environment"%>
<%
	if (session.getAttribute(Environment.SESSION_LOGIN_KEY) != null)
		response.sendRedirect("console.jsp");
%>
<!DOCTYPE html>
<html>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
<title>消息中心</title>
<link rel="stylesheet" href="cssui/main/login.css" />
</head>

<body onload="loginReady();">
	<div class="login-wrapper">
		<div class="login-content">
			<div class="login-middle">
				<div class="middle-body">
					<form id="login-form" action="login.action" method="post" onsubmit="return validateCallback(this,loginCallback)">
						<br />
						<br />
						<div class="btn">
							<div class="title">消息中心</div>
							<div class="wel_txt">请登录</div>
							<p class="account">
								<span class="type"></span>
								<input type="text" class="required csspwd" title="账号必填！" name="loginName" id="loginName" value="msgadmin" />
								<i class=""></i>
							</p>
							<p class="password">
								<span class="type"></span>
								<input type="password" class="required csspwd" title="密码必填！" name="password" id="password" value="123456" />
								<i class=""></i>
							</p>
							<div class="btn">
								<a href="#" class="submit" onclick="$(this).parents('form').submit();">登 录</a> <a herf="#" class="reset" onclick='loginReset();'>取 消</a>
							</div>
						</div>
					</form>

				</div>
			</div>
			<div class="login-left">
				<div class="left-body"></div>
			</div>
			<div class="clear-fix"></div>
		</div>
		<div class="help"></div>
	</div>
	<script type="text/javascript" src="cssui/plugins/jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="cssui/plugins/jquery.validate.min.js"></script>
	<script type="text/javascript" src="cssui/plugins/encrypt/md5.js"></script>
	<script type="text/javascript" src="custom/default/login.js"></script>
</body>
</html>
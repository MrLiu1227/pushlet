<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@page import="com.css.core.configuration.Environment"%>
<%@page import="org.slw.sso.config.SsoConfig"%>
<%@ taglib prefix="ww" uri="webwork"%>
<%
	Integer messageLevel = (Integer) session.getAttribute("messageLevel");
	if (messageLevel == null || messageLevel >= slw.constant.MessageLevel.SSO) {
		String toUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() + "/toUrl.action";
		Object usr = session.getAttribute(Environment.SESSION_LOGIN_KEY);
		if (usr == null) {
			if (SsoConfig.getInstance().isSsoOpen())
				out.print("<script>top.location='" + SsoConfig.getInstance().getSsoServer() + SsoConfig.getInstance().getSsoCheckAciton() + toUrl + "';</script>");
			else
				out.print("<script>top.location='login.jsp';</script>");
		}
	}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
<title>信息提示</title>

<style type="text/css">
* {
	padding: 0px;
	margin: 0px;
}

body {
	background-color: #f8f8f8;
}

#content {
	margin: 0 auto;
	position: relative;
	width: 100%;
	padding-top: 220px;
}

#content #mod {
	padding-left: 0px;
}

#content .licon {
	float: left;
	background-image: url(cssui/images/error_icon.png);
	width: 80px;
	height: 80px;
	margin-right: 15px;
}

#content .txt {
	float: left;
	font-family: "Microsoft YaHei";
	font-size: 16px;
	color: #317caf;
	margin-top: 10px;
}

#content .txt .title {
	font-size: 26px;
	padding-bottom: 5px;
}

.modal-body #content {
	padding-top: 20px;
}
table .sub #content {
	padding: 30px;
} 
</style>
</head>
<body>
	<div id="content">
		<div id="mod">
			<div class="licon"></div>
			<div class="txt">
				<div class="title">抱歉，您访问的页面出错了！</div>
				<div class="info">
					<ww:if test="#session.message!=null && !#session.message.equals(\"\")">
						<ww:property value="#session.message" />
					</ww:if>
					<ww:else>网络或系统异常，请联系系统管理员！</ww:else>
				</div>
			</div>
		</div>
	</div>
</body>
</html>

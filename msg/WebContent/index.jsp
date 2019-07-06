<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@page import="org.slw.sso.config.SsoConfig"%>
<%@ taglib prefix="ww" uri="webwork"%>
<%
	String toUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() + "/" + SsoConfig.getInstance().getSsoToUrl();
	if (SsoConfig.getInstance().isSsoOpen())
		out.print("<script>top.location='" + SsoConfig.getInstance().getSsoServer() + SsoConfig.getInstance().getSsoCheckAciton() + toUrl + "';</script>");
	else
		out.print("<script>top.location='login.jsp';</script>");
%>



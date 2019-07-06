package com.css.apps.base.user.login;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slw.framework.annotation.RequestMapping;
import org.slw.framework.annotation.SlwController;
import org.slw.framework.context.SlwContext;
import org.slw.framework.view.JsonView;
import org.slw.framework.view.JspView;
import org.slw.framework.view.View;
import org.slw.framework.view.XmlView;
import org.slw.mvc.view.action.ActionChain;
import org.slw.sso.client.SsoClient;
import org.slw.sso.user.SsoUser;

import com.css.apps.base.user.common.SelectUserList;

@SlwController
public class LoginController {

	@RequestMapping(caption = "请求跳转")
	public JspView toUrl() {
		ActionChain.excuteAction(ToUrl.class);
		return new JspView("console.jsp");
	}

	@RequestMapping(caption = "退出")
	public JspView quit() {
		ActionChain.excuteAction(Quit.class);
		return new JspView("msgclient.jsp");
	}

	@RequestMapping(caption = "登录", requestIntercepter = "nonLogonStack")
	public JsonView login() {
		ActionChain.excuteAction(LoginAction.class);
		return new JsonView();
	}

	@RequestMapping(caption = "获取用户列表")
	public View selectUserList() {
		ActionChain.excuteAction(SelectUserList.class);
		return new JspView("/base/user/selectuserlist.jsp");
	}

	/**
	 * 测试返回
	 */

	@RequestMapping(caption = "获取用户列表Json")
	public JsonView getUserJson() {
		HttpServletRequest request = SlwContext.request();
		HttpServletResponse response = SlwContext.response();
		SsoUser ssoUser = SsoClient.getSsoUser(request, response);
		SlwContext.result().setData(ssoUser);
		return new JsonView();
	}

	@RequestMapping(caption = "获取用户列表XML")
	public XmlView getUserXml() {
		HttpServletRequest request = SlwContext.request();
		HttpServletResponse response = SlwContext.response();
		SsoUser ssoUser = SsoClient.getSsoUser(request, response);
		SlwContext.result().setData(ssoUser);
		return new XmlView();
	}
	
	
	@RequestMapping(caption = "请求跳转")
	public JspView dirFirstPage() {
		ActionChain.excuteAction(DirFirstPage.class);
		return new JspView("firstpage.jsp");
	}
}

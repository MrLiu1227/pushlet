package com.css.core.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slw.common.utils.Messages;
import org.slw.framework.context.SlwContext;
import org.slw.framework.interceptor.Interceptor;
import org.slw.sso.client.SsoClient;
import org.slw.sso.config.SsoConfig;
import org.slw.sso.user.SsoUser;

import com.css.apps.base.user.model.SUser;
import com.css.core.configuration.Environment;
import com.css.core.exception.CssException;
import com.css.db.query.QueryCache;

import slw.constant.MessageLevel;

public class CssSSOInterceptor extends Interceptor {
	@Override
	public void doBefore() {
		if (SsoConfig.getInstance().isSsoOpen())
			checkSso();
		else {
			SUser user = (SUser) SlwContext.getSession(Environment.SESSION_LOGIN_KEY);
			if (user == null)
				doError();
		}
	}

	/**
	 * 当开启SSO时
	 */
	private void checkSso() {
		HttpServletRequest request = SlwContext.request();
		HttpServletResponse response = SlwContext.response();
		SsoUser ssoUser = SsoClient.getSsoUser(request, response);
		if (ssoUser == null)
			doError();
		else {
			SUser user = (SUser) SlwContext.getSession(Environment.SESSION_LOGIN_KEY);
			if (user == null || !ssoUser.getUserId().equals(user.getUuid())) {
				user = QueryCache.get(SUser.class, ssoUser.getUserId());
				if (user != null)
					SlwContext.setSession(Environment.SESSION_LOGIN_KEY, user);
				else
					throw new CssException(Messages.getString("systemMsg.readError"));
			}
		}
	}

	private void doError() {
		SlwContext.removeSession(Environment.SESSION_LOGIN_KEY);
		SlwContext.setSession("messageLevel", MessageLevel.SSO);
		throw new CssException(Messages.getString("systemMsg.sessionInvalid"));
	}
}

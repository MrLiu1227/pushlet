package com.css.apps.base.user.login;

import org.slw.framework.context.SlwContext;
import org.slw.sso.client.SsoClient;
import org.slw.sso.config.SsoConfig;

import com.css.core.action.CssAction;

public class Quit extends CssAction {
	public void execute() {
		if (SsoConfig.getInstance().isSsoOpen())
			SsoClient.quitSso(SlwContext.request());
		SlwContext.clearSession();
	}
}

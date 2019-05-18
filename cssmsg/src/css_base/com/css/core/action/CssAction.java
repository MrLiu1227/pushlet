package com.css.core.action;

import org.slw.framework.context.SlwContext;
import org.slw.mvc.annotation.SetIgnoredField;
import org.slw.mvc.view.action.Action;

import com.css.apps.base.user.model.SUser;
import com.css.core.configuration.Environment;
import com.css.util.UuidUtil;

/**
 * Action抽象类
 * 
 * @author CSS. WeidongWang
 * @since 2018-6-10
 * @version 1.0
 */
public abstract class CssAction extends Action {
	@SetIgnoredField
	public SUser sUser = (SUser) SlwContext.getSession(Environment.SESSION_LOGIN_KEY);
	@SetIgnoredField
	public String slwId = UuidUtil.getUuid();
}

package com.css.apps.base.user.login;

import org.slw.common.helper.StringHelper;

import com.css.core.action.CssAction;

public class ToUrl extends CssAction {
	public Integer type = null; // 1 url 2 function null 默认首页
	public String id = null, url = null, title = null;

	public void execute() {
		if (StringHelper.isNotEmpty(url)) {
			type = 1;
			if (url.indexOf("javascript:") == 0) {
				type = 2;
				url = url.substring(11);
			}
		}
	}
}

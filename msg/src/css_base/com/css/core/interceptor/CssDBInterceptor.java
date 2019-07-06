package com.css.core.interceptor;

import org.slw.framework.interceptor.Interceptor;

import com.css.db.hibernate.HibernateUtil;

public class CssDBInterceptor extends Interceptor {
	@Override
	public void doBefore() {
		HibernateUtil.closeAll();
	}
}

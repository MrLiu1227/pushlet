package com.css.core.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slw.common.utils.Messages;
import org.slw.framework.context.SlwContext;
import org.slw.framework.interceptor.Interceptor;
import org.slw.mvc.view.tag.utils.TokenHelper;

import com.css.core.exception.CssException;
import com.css.webbase.tags.CssTokenTag;

/**
 * CssToken拦截器，重复提交处理,错误返回 {result:9999, msg:tokenId}
 * 
 * @author CSS. Wang Weidong
 * @since 2017-11-21
 * @version 1.0
 */
public class CssTokenInterceptor extends Interceptor {
	String tokenName = CssTokenTag.CSS_TOKEN_NAME;
	@Override
	public void doBefore() {
		HttpServletRequest request = SlwContext.request();
		synchronized (request.getSession()) {
			if (!validToken(request))
				throw new CssException(Messages.getString("systemMsg.tokenInvalid"));
		}
	}

	public boolean validToken(HttpServletRequest request) {
		String token2=(String)SlwContext.getData(tokenName);
		String token = TokenHelper.getToken(tokenName, request);
		if (token == null)
			return false;
		HttpSession session = request.getSession(true);
		String sessionToken = (String) session.getAttribute(tokenName);
		if (!token.equals(sessionToken))
			return false;
		session.removeAttribute(tokenName);
		return true;
	}

}

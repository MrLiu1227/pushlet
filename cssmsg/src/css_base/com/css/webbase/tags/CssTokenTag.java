package com.css.webbase.tags;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.JspTagException;

import org.slw.framework.context.SlwContext;
import org.slw.mvc.view.tag.WebWorkBodyTagSupport;
import org.slw.mvc.view.tag.utils.TokenHelper;

/**
 * CssToken标签类，防止重复提交,目前无法session漂移
 * <input type="hidden" name="css.tokenId" id="css.tokenId" value="">
 * 
 * @author CSS. Wang Weidong
 * @since 2017-11-21
 * @version 1.0
 */
public class CssTokenTag extends WebWorkBodyTagSupport {
	private static final long serialVersionUID = 1L;
	public static final String CSS_TOKEN_NAME = "css.tokenId";
	public int doStartTag() throws JspTagException {
		try {
			HttpServletRequest request = SlwContext.request();
			String token = TokenHelper.setToken(CssTokenTag.CSS_TOKEN_NAME, request);
			String buf = "<input type=\"hidden\" name=\"" + CssTokenTag.CSS_TOKEN_NAME + "\" id=\""
					+ CssTokenTag.CSS_TOKEN_NAME + "\" value=\"" + token + " /\">";
			pageContext.getOut().print(buf);
		} catch (Exception e) {
			throw new JspTagException("Error: " + e.getMessage());
		}
		return SKIP_BODY;
	}
}

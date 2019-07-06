package com.css.webbase.tags;

import javax.servlet.jsp.JspTagException;

import org.slw.common.helper.StringHelper;
import org.slw.mvc.view.tag.utils.OgnlStack;

/**
 * 命令按钮
 * 
 * @author User
 */
public class ButtonTag extends CssUISupport {
	static final long serialVersionUID = 1L;
	// 响应单击事件
	private String onclick = null;
	// 权限编码
	private String funcode = null;
	// 类型 submit | reset
	private String type = "button";
	// title
	private String title = null;

	public String getOnclick() {
		return onclick;
	}

	public void setOnclick(String onclick) {
		this.onclick = onclick;
	}

	public String getFuncode() {
		return funcode;
	}

	public void setFuncode(String funcode) {
		this.funcode = funcode;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getTitle() {
		if (StringHelper.isEmpty(title))
			return "";
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	protected String getHtmlContent() throws JspTagException {
		String prop = super.getName();
		OgnlStack stack = getStack();

		StringBuffer html = new StringBuffer();
		html.append("<button type=\"").append(type != null ? type : "button").append("\" ");
		if (StringHelper.isNotEmpty(prop))
			html.append(" name=\"").append(prop).append("\" id=\"").append(prop).append("\"");
		// 默认样式
		if (StringHelper.isEmpty(getCss()))
			super.setCss("cssBtn");
		html.append(" class=\"").append(this.getCss().trim()).append("\"");

		if (StringHelper.isNotEmpty(this.getStyle()))
			html.append(" style=\"").append(this.getStyle().trim()).append("\"");

		String titleVal = translateVariables(this.getTitle(), stack);
		if (StringHelper.isNotEmpty(titleVal))
			html.append(" title=\"").append(titleVal.trim()).append("\"");

		if (StringHelper.isNotEmpty(onclick)) {
			// 表达式计算出来的地址
			String click = translateVariables(onclick.trim(), stack);
			if (StringHelper.isNotEmpty(click)) {
				html.append(" onclick=\"").append(click.trim()).append("\"");
			}
		}
		if (StringHelper.isNotEmpty(getAttributes()))
			html.append(" ").append(getAttributes());
		// 加上数据校验
		html.append(">");
		html.append(getCaption());
		html.append("</button>");
		return html.toString();
	}

}
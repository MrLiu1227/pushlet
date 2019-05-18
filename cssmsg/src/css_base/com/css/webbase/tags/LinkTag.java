package com.css.webbase.tags;

import javax.servlet.jsp.JspTagException;

import org.slw.common.helper.StringHelper;
import org.slw.mvc.view.tag.utils.OgnlStack;

/**
 * 链接A控件
 */
public class LinkTag extends ButtonTag {
	static final long serialVersionUID = 1L;
	// 权限编码
	private String href = null;
	private String rel = null;
	private String target = null;

	public String getRel() {
		return rel;
	}

	public void setRel(String rel) {
		this.rel = rel;
	}

	public String getTarget() {
		return target;
	}

	public void setTarget(String target) {
		this.target = target;
	}

	public String getHref() {
		return href;
	}

	public void setHref(String href) {
		this.href = href;
	}

	@Override
	protected String getHtmlContent() throws JspTagException {
		String prop = super.getName();
		OgnlStack stack = getStack();

		StringBuffer html = new StringBuffer();
		html.append("<a ");
		if (StringHelper.isNotEmpty(prop))
			html.append(" name=\"").append(prop).append("\" id=\"").append(prop).append("\"");

		if (StringHelper.isNotEmpty(href)) {
			// 表达式计算出来的地址
			href = translateVariables(href.trim(),stack);
			if (StringHelper.isNotEmpty(href)) {
				html.append(" href=\"").append(href).append("\"");
			}
		}
		if (StringHelper.isNotEmpty(this.getCss()))
			html.append(" class=\"").append(this.getCss().trim()).append("\"");

		if (StringHelper.isNotEmpty(this.getStyle()))
			html.append(" style=\"").append(this.getStyle().trim()).append("\"");

		String val = translateVariables(this.getTitle(), stack);
		if (StringHelper.isNotEmpty(val))
			html.append(" title=\"").append(val.trim()).append("\"");

		String click = super.getOnclick();
		if (StringHelper.isNotEmpty(click)) {
			// 表达式计算出来的地址
			click = translateVariables(click.trim(), stack);
			if (StringHelper.isNotEmpty(click)) {
				html.append(" onclick=\"").append(click.trim()).append("\"");
			}
		}

		val = translateVariables(this.getRel(), stack);
		if (StringHelper.isNotEmpty(val))
			html.append(" rel=\"").append(val.trim()).append("\" ");

		val = translateVariables(this.getTarget(), stack);
		if (StringHelper.isNotEmpty(val))
			html.append(" target=\"").append(val.trim()).append("\" ");

		if (StringHelper.isNotEmpty(getAttributes()))
			html.append(" ").append(getAttributes());
		html.append(">");
		html.append(translateVariables(getCaption(), stack)).append("</a>");
		return html.toString();
	}

}
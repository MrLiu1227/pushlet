package com.css.webbase.tags;

import javax.servlet.jsp.JspTagException;

import org.slw.mvc.view.tag.WebWorkBodyTagSupport;

import com.opensymphony.util.BeanUtils;

public class SelectTag extends WebWorkBodyTagSupport {
	private static final long serialVersionUID = 1L;
	private String value;
	private String id;
	private String name;
	private String list;
	private String listKey;
	private String listValue;
	private String hint;
	private String attributes;

	// ~ Methods
	// ////////////////////////////////////////////////////////////////
	public void setList(String list) {
		this.list = list;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public void setId(String id) {
		this.id = id;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setListKey(String listKey) {
		this.listKey = listKey;
	}

	public void setListValue(String listValue) {
		this.listValue = listValue;
	}

	public String getHint() {
		return hint;
	}

	public void setHint(String hint) {
		this.hint = hint;
	}

	public String getAttributes() {
		return attributes;
	}

	public void setAttributes(String attributes) {
		this.attributes = attributes;
	}

	public int doStartTag() throws JspTagException {
		try {
			name = name.replaceAll("'", "");

			if (this.attributes == null)
				this.attributes = "";
			StringBuffer buf = new StringBuffer("<select id=\"").append(id).append("\" name=\"").append(name).append("\" ").append(this.attributes).append(" >");
			if (hint != null && !hint.trim().equals("")) {
				buf.append("<option value=\"\">").append(hint).append("</option>");
			}
			Object objVal = getStack().findValue(value);
			String curVal = (objVal == null ? "" : objVal.toString());
			Object lst = getStack().findValue(list);
			if (lst != null) {
				java.util.Collection lstArr = null;
				if (lst.getClass().isArray()) {
					lstArr = java.util.Arrays.asList((Object[]) lst);
				} else if (lst instanceof java.util.Collection) {
					lstArr = (java.util.Collection) lst;
				}
				java.util.Iterator ito = lstArr.iterator();
				while (ito.hasNext()) {
					Object obj = ito.next();
					Object id = BeanUtils.getValue(obj, listKey);
					Object val = BeanUtils.getValue(obj, listValue);
					id = (id == null ? "" : id.toString());
					val = (val == null ? "" : val.toString());
					buf.append("<option value=\"").append(id).append("\"");
					buf.append(id.equals(curVal) ? " selected " : "");
					buf.append(">").append(val).append("</option>");
				}
			}
			buf.append("</select>");
			pageContext.getOut().print(buf.toString());
		} catch (Exception e) {
			throw new JspTagException("Error: " + e.getMessage());
		}
		return SKIP_BODY;
	}
}

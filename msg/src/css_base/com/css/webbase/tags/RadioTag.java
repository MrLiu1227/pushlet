package com.css.webbase.tags;

import javax.servlet.jsp.JspTagException;

import org.slw.mvc.view.tag.WebWorkBodyTagSupport;

import com.opensymphony.util.BeanUtils;

public class RadioTag extends WebWorkBodyTagSupport {
	private static final long serialVersionUID = 1L;
	private String value;
	private String id;
	private String name;
	private String list;
	private String listKey;
	private String listValue;

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

	public int doStartTag() throws JspTagException {
		try {
			name = name.replaceAll("'", "");

			StringBuffer buf = new StringBuffer();
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
					Object key = BeanUtils.getValue(obj, listKey);
					Object val = BeanUtils.getValue(obj, listValue);
					key = (key == null ? "" : key.toString());
					val = (val == null ? "" : val.toString());
					buf.append("<input type=\"radio\" id=\"").append(id).append("\" name=\"").append(name).append("\" value=\"").append(key).append("\"");
					buf.append(key.equals(curVal) ? " checked=\"checked\"" : "");
					buf.append(">").append(val).append(" ");
				}
			}
			pageContext.getOut().print(buf.toString());
		} catch (Exception e) {
			throw new JspTagException("Error: " + e.getMessage());
		}
		return SKIP_BODY;
	}
}

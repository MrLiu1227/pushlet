package com.css.util;

/**
 * 生成Html代码工具类 
 * @since 1.0
 * @author paladin
 */
public class HtmlConverter {
	/**
	 * 生成Html代码，形如:<br/>
	 * &lt;span class="log_title">title：&lt;/span>
	 * value<br/>
	 * @param title  描述
	 * @param value  值
	 * @return
	 */
	public static String appendHtml(String title, Object value) {
		String str = "";
		if (value != null && StringHelper.isNotEmpty(value.toString()))
			str = "<span class=log_title>" + title + "：</span>" + value + "<br/>";
		return str;
	}
	/**
	 * 生成Html代码，形如:<br/>
	 * &lt;span class="log_title">备注：&lt;/span>
	 * &lt;span class="log_value">备注内容&lt;/span><br/>
	 * @param title  描述
	 * @param value  值
	 * @return
	 */
	public static String appendHtmlNameField(String title, Object value) {
		String str = "";
		if (value != null && StringHelper.isNotEmpty(value.toString()))
			str = "<span class=\"log_title\">" + title + "：</span>" + "<span class=\"log_value\">" + value + "</span><br/>";
		return str;
	}

	/**
	 * 生成html代码，形如:<br/>
	 * &lt;name>&lt;![CDATA[content]]>&lt;/name>
	 * @param o html元素内容
	 * @param name html元素
	 * @return
	 */
	public static String append(Object o, String name) {
		return append(o, name, false);
	}
	
	/**
	 * 生成html代码，形如:<br/>
	 * &lt;name>&lt;![CDATA[content]]>&lt;/name>
	 * @param o html元素内容
	 * @param name html元素
	 * @param html 是否转换为html
	 * @return
	 */
	public static String append(Object o, String name, boolean html) {
		if (o != null) {
			String str = o.toString();
			if (StringHelper.isEmpty(str))
				return "";
			if (html)
				str = "<![CDATA[" + str + "]]>";
			return "<" + name + ">" + str + "</" + name + ">";
		}
		return "";
	}
	/**
	 * 将日期对象生成html代码，形如:<br/>
	 * &lt;name>&lt;![CDATA[content]]>&lt;/name>
	 * @param o html元素内容
	 * @param name html元素
	 * @param html 是否转换为html
	 * @return
	 */	
	public static String appendDate(Object o, String name) {
		if (o != null) {
			String str = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS Z", java.util.Locale.ENGLISH)
					.format(o);
			return "<" + name + ">" + str + "</" + name + ">";
		}
		return "";
	}
}

package com.css.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
 /**
  * 正则表达式匹配校验工具类
  * @author paladin
  * @since 1.0
  */
public class RegexCheck {
	/**
	 * 格式化字符串
	 * @param sSource
	 * @return
	 */
	public static String imgCheck(String sSource) {
		Pattern p = null; 
		Matcher m = null;  
		String s = null, sTmp = null;
		StringBuffer sb = null;
		p = Pattern.compile("((<|</)(form|script)|^\\son)", Pattern.CASE_INSENSITIVE);
		m = p.matcher(sSource);
		sb = new StringBuffer();
		while (m.find()) {
			sTmp = m.group().toLowerCase();
			if (sTmp.substring(0, 1).equals("<"))
				s = "&lt;" + m.group().substring(1);
			else
				s = " &#111n";
			m.appendReplacement(sb, s);
		}
		m.appendTail(sb);
		return sb.toString();
	}
	/**
	 * 替换特殊符号，使内容能正常在页面上显示</br>
	 * 如：在有table的页面上显示带有“换行”、“<”和“>”的内容时，能够正常显示
	 * @param sSource  需要替换的内容
	 * @return
	 */
	public static String TagReverse(String sSource) {
		if (StringHelper.isEmpty(sSource))
			return "";
		Pattern p = null;
		Matcher m = null;  
		String s = null, sTmp = null;
		StringBuffer sb = null;
		p = Pattern.compile("(<br/>|\\&lt;|\\&gt;)", Pattern.CASE_INSENSITIVE);
		m = p.matcher(sSource);
		sb = new StringBuffer();
		while (m.find()) {
			sTmp = m.group().toLowerCase();
			if (sTmp.equals("<br/>"))
				s = "\n";
			else if (sTmp.equals("&lt;"))
				s = "<";
			else if (sTmp.equals("&gt;"))
				s = ">";
			m.appendReplacement(sb, s);
		}
		m.appendTail(sb);
		return sb.toString();
	}
	
	public static String TagReplace(String sSource) {
		if (StringHelper.isEmpty(sSource))
			return "";
		Pattern p = null; 
		Matcher m = null;
		String s = null, sTmp = null;
		StringBuffer sb = null;
		p = Pattern.compile("(\\n|\\r|<|>)", Pattern.CASE_INSENSITIVE);
		m = p.matcher(sSource);
		sb = new StringBuffer();
		while (m.find()) {
			sTmp = m.group().toLowerCase();
			if (sTmp.equals("\n"))
				s = "<br/>";
			else if (sTmp.equals("\r"))
				s = "";
			else if (sTmp.equals("<"))
				s = "&lt;";
			else if (sTmp.equals(">"))
				s = "&gt;";
			m.appendReplacement(sb, s);
		}
		m.appendTail(sb);
		return sb.toString();
	}
	public static String textArea(String sSource) {
		if (StringHelper.isEmpty(sSource))
			return "";
		Pattern p = null; 
		Matcher m = null;
		String s = null, sTmp = null;
		StringBuffer sb = null;
		p = Pattern.compile("(<|>)", Pattern.CASE_INSENSITIVE);
		m = p.matcher(sSource);
		sb = new StringBuffer();
		while (m.find()) {
			sTmp = m.group().toLowerCase();
			if (sTmp.equals("<"))
				s = "&lt;";
			else if (sTmp.equals(">"))
				s = "&gt;";
			m.appendReplacement(sb, s);
		}
		m.appendTail(sb);
		return sb.toString();
	}
}
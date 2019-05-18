package com.css.util;

import java.io.UnsupportedEncodingException;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.StringTokenizer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class StringHelper {
	private static final int ALIAS_TRUNCATE_LENGTH = 10;
	private final static String operators = "><=(),\"\\{\\}";
	private final static String[] replaceFalg = { "{", "}" };
	private final static String regex1 = "[\"].*?[^\\\\]\"";
	private final static String regex2 = "\\\\n|\\\\t|\\\\r";
	private final static String regex3 = "\\s+";
	private final static String regex4 = "(\\s[" + operators + "]+\\s)|(\\s[" + operators + "]+)|([" + operators
			+ "]+\\s)";
	private final static String regex5 = "\\" + replaceFalg[0] + ".*?" + "\\" + replaceFalg[1];
	private final static String regex6 = "(?!([#\\s]{2,}))#.+?#";
	private final static String regex7 = "(?!(@{2,}))@[\\u4e00-\\u9fa5A-Za-z0-9_]+?([\\s@]|\\b)";

	private StringHelper() { /* static methods only - hide constructor */
	}

	public static boolean equals(String s1, String s2) {
		if (s1 == null)
			return s2 == null;
		return s1.equals(s2);
	}

	/**
	 * 注意： 1.由于使用MessageFormat格式化字符串，字符串中不能出现“{”或者“}”
	 * 
	 * @param str
	 * @return
	 */
	public static String trimSentence(String str) {
		List<String> replaced = new ArrayList<String>();
		Pattern p = Pattern.compile(regex1, Pattern.CASE_INSENSITIVE);
		Matcher m = p.matcher(str);
		// 1.将字符串用replaceFalg取代
		int i = 0;
		String replaceStr1 = str;
		while (m.find()) {
			replaced.add(i, m.group());
			replaceStr1 = m.replaceFirst(replaceFalg[0] + i + replaceFalg[1]);
			i++;
		}
		// System.out.println("1.将字符串用\"{n}\"取代：\n" + replaceStr1);
		// 2.替换多余空白符（空格，tab，回车等）
		replaceStr1 = replaceStr1.replaceAll(regex2, " ");
		// System.out.println("2.替换多余空白符（空格，tab，回车等）:\n" + replaceStr1);
		// 3.两个单词数字之间的多个空白符变成1个空格
		replaceStr1 = replaceStr1.replaceAll(regex3, " ");
		// System.out.println("3.两个单词数字之间的多个空白符变成1个空格：\n" + replaceStr1);
		// 4.单词与符号之间的空白符去掉
		p = Pattern.compile(regex4, Pattern.CASE_INSENSITIVE);
		m = p.matcher(replaceStr1);
		while (m.find()) {
			if (m.group() != null) {
				replaceStr1 = replaceStr1.replace(m.group(), m.group().trim());
			}
		}
		// System.out.println("4.单词与符号之间的空白符去掉:\n" + replaceStr1);
		// 5.将被replaceFalg取代的字符串还原
		// System.out.println(MessageFormat.format(replaceStr1,
		// replaced.toArray()));
		return MessageFormat.format(replaceStr1, replaced.toArray());
	}

	/**
	 * 将字符串转换成“{”和“}”
	 * 
	 * @return
	 */
	public static String replaceString(String str, List<String> replaced) {
		Pattern p = Pattern.compile(regex6);
		Matcher m = p.matcher(str);
		// 1.将字符串用replaceFalg取代
		int i = 0;
		StringBuffer replaceStr1 = new StringBuffer();
		while (m.find()) {
			replaced.add(i, m.group().trim());
			m.appendReplacement(replaceStr1, replaceFalg[0] + i + replaceFalg[1]);
			i++;
		}
		return replaceStr1.toString();
	}

	/**
	 * 将提到的人添加超链接
	 * 
	 * @return
	 */
	public static String checkString(String str) {
		Pattern pattern = Pattern.compile(regex7);
		Matcher matcher = pattern.matcher(str);
		StringBuffer sbr = new StringBuffer();
		while (matcher.find()) {
			matcher.appendReplacement(sbr, "Java");
		}
		matcher.appendTail(sbr);
		return "";
	}

	public static String formatArticle(String s) {
		if (StringHelper.isEmpty(s))
			return "";
		s = "<br/>" + s + "<br/>";
		s = s.replaceAll("\t", " ");
		s = s.replaceAll("　", "");
		s = s.replaceAll("  ", "　");
		s = s.replaceAll("　", "");
		s = s.replaceAll("<br/> ", "<br/>");
		int s_index = -1;
		while (true) {
			s_index = s.indexOf("<br/><br/>");
			if (s_index >= 0) {
				s = s.replaceAll("<br/><br/>", "<br/>");
			} else
				break;
		}
		s = s.replaceAll("<br/>", "<br/><br/>　　");
		return s.substring("<br/><br/>".length(), s.length() - "<br/><br/>　　".length());
	}

	public static char getChar(String a) {
		char ch = a.charAt(0);
		return (char) ('A' + ch - '1');
	}

	public static String getSubString(String sOurce, int len) {
		if (StringHelper.isEmpty(sOurce))
			return "";
		if (sOurce.length() <= len)
			return sOurce;
		else
			return sOurce.substring(0, len);
	}

	public static String getAnwStr(String str) {
		String strTmp = "";
		char ch;
		String arr[] = str.toUpperCase().split(",");
		if (arr == null)
			return "";
		for (int i = 0; i < arr.length; i++) {
			if (StringHelper.isNotEmpty(arr[i])) {
				ch = getChar(arr[i]);
				strTmp += String.valueOf(ch) + ",";
			}
		}
		strTmp = strTmp.substring(0, strTmp.length() - 1);
		return strTmp;
	}

	public static String jiequ(String str, String ch, int n) {
		try {
			String tmp = "";
			for (int i = 0; i < n; i++) {
				int index = str.indexOf(ch);
				tmp += str.substring(0, index + 1);
				str = str.substring(index + 1);
			}
			tmp = tmp.substring(0, tmp.length() - 1);
			return tmp;
		} catch (Exception ex) {
			return "";
		}
	}

	public static String digitToString(String a) {
		String digit[] = { "零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖" };
		String weight[] = { "", "", "拾", "佰", "仟", "万", "拾", "佰", "仟", "亿", "拾", "佰", "仟" };
		String jg = new String();
		String tmp = a;
		String zs = new String();
		String xs = new String();
		int dot = tmp.indexOf(".");
		if (dot > 0) {
			zs = tmp.substring(0, dot);
			xs = tmp.substring(dot + 1);
		} else
			zs = tmp.substring(0);
		int w = 0;
		boolean flag = false;
		for (int i = 0; i < zs.length(); i++) {
			w = Integer.parseInt(zs.substring(i, i + 1));
			if (w == 0) {
				if ((zs.length() - i) == 5)
					jg = jg + "万";
				if ((zs.length() - i) == 9)
					jg = jg + "亿";
				flag = true;
			} else {
				if (flag) {
					jg = jg + "零";
					flag = false;
				}
				jg = jg + digit[w];
				jg = jg + weight[zs.length() - i];
			}
		}
		if (dot > 0) {
			jg = jg + "点";
			for (int i = 0; i < xs.length(); i++) {
				w = Integer.parseInt(xs.substring(i, i + 1));
				jg = jg + digit[w];
			}
		}
		return jg;
	}

	public static boolean findStr(String sSource, String sFind) {
		Pattern p = null;
		Matcher m = null;
		p = Pattern.compile("(" + sFind + ")", Pattern.CASE_INSENSITIVE);
		m = p.matcher(sSource);
		return m.find();
	}

	public static String getCharStr(int i) {
		char ch = (char) ('A' + i);
		return String.valueOf(ch);
	}

	public static String getKeyword(String sOurce, int len, String highlightWord) {
		String keyword = getByteString(sOurce, len);
		if (isNotEmpty(highlightWord))
			keyword = replaceString(keyword, highlightWord, "<span class=highlightCls>" + highlightWord + "</span>");
		return keyword;
	}

	public static String getByteString(String sOurce, int len) {
		try {
			byte[] hanzi;
			hanzi = sOurce.getBytes("gb2312");
			if (hanzi.length <= len)
				return sOurce;
			String tmp;
			int lenTmp = 0, i;
			for (i = 0; i < 2 * len; i++) {
				tmp = sOurce.substring(i, i + 1);
				lenTmp += tmp.getBytes("gb2312").length;
				if (lenTmp > len)
					break;
			}
			return tmp = sOurce.substring(0, i) + "...";
		} catch (Exception ex) {
			return "";
		}
	}

	public static int getByteLen(String sOurce) {
		try {
			byte[] hanzi = sOurce.getBytes("gb2312");
			return hanzi.length;
		} catch (Exception ex) {
			return 0;
		}
	}

	public static int getContByteLen(String sOurce) {
		sOurce = sOurce.replaceAll("<br/>", "a");
		int length = sOurce.replaceAll("<br/>", "a").length();
		try {
			Pattern pattern = Pattern.compile("[\u4e00-\u9fa5]+");
			Matcher matcher = pattern.matcher(sOurce);
			while (matcher.find()) {
				length += matcher.group().length();
			}
		} catch (Exception ex) {
		}
		return length;
	}

	public static List formatText(String s) {
		if (StringHelper.isEmpty(s))
			return null;
		s = s.replaceAll("\t", " ");
		s = s.replaceAll("\r\n", "\n");
		s = s.replaceAll("　", " ");
		while (true) {
			s = s.replaceAll("  ", " ");
			if (s.indexOf("  ") < 0)
				break;
		}
		String str[] = s.split("\n");
		List lst = new ArrayList();
		for (int i = 0; i < str.length; i++) {
			String tmp = str[i].trim();
			if (StringHelper.isNotEmpty(tmp))
				lst.add(str[i]);
		}
		return lst;
	}

	public static List chopWordSub(String s, int len) {
		List resLst = new ArrayList();
		while (true) {
			String tmp = StringHelper.getByteString(s, len);
			resLst.add(tmp);
			if (tmp.equals(s))
				break;
			s = s.substring(tmp.length());
		}
		return resLst;
	}

	public static List chopWord(String s, int len) {
		try {
			// String str = FileUtils.readFileToString(new File("c:/1.txt"),
			// "gb2312");
			List lst = formatText(s);
			if (lst == null || lst.size() < 1)
				return null;
			List resLst = new ArrayList();
			int i = 0;
			String tmp = "";
			String str = "";
			tmp = (String) lst.get(i++);
			while (true) {
				if (StringHelper.getByteLen(str + "\n" + tmp) <= len) {
					str += StringHelper.isEmpty(str) ? tmp : "\n" + tmp;
					if (i >= lst.size()) {
						resLst.add(str);
						break;
					}
					tmp = (String) lst.get(i++);
				} else {
					if (StringHelper.isEmpty(str)) {
						resLst.addAll(chopWordSub(tmp, len));
						if (i >= lst.size())
							break;
						tmp = (String) lst.get(i++);
					} else {
						resLst.add(str);
						str = "";
					}
				}
			}
			return resLst;
		} catch (Exception ex) {
			return null;
		}
	}

	/**
	 * 拼接字符串
	 * 
	 * @return
	 */
	public static String join(String seperator, String[] strings) {
		int length = strings.length;
		if (length == 0)
			return "";
		StringBuffer buf = new StringBuffer(length * strings[0].length()).append(strings[0]);
		for (int i = 1; i < length; i++) {
			buf.append(seperator).append(strings[i]);
		}
		return buf.toString();
	}

	/**
	 * 拼接字符串
	 * 
	 * @return
	 */
	public static String join(String seperator, Iterator objects) {
		StringBuffer buf = new StringBuffer();
		if (objects.hasNext())
			buf.append(objects.next());
		while (objects.hasNext()) {
			buf.append(seperator).append(objects.next());
		}
		return buf.toString();
	}

	public static String[] add(String[] x, String sep, String[] y) {
		String[] result = new String[x.length];
		for (int i = 0; i < x.length; i++) {
			result[i] = x[i] + sep + y[i];
		}
		return result;
	}

	public static String repeat(String string, int times) {
		StringBuffer buf = new StringBuffer(string.length() * times);
		for (int i = 0; i < times; i++)
			buf.append(string);
		return buf.toString();
	}

	public static String replace(String template, String placeholder, String replacement) {
		return replace(template, placeholder, replacement, false);
	}

	/**
	 * 重写字符串，用第三个参数代替前两个参数重复部分
	 * 
	 * @return
	 */
	public static String replace(String template, String placeholder, String replacement, boolean wholeWords) {
		int loc = template.indexOf(placeholder);
		if (loc < 0) {
			return template;
		} else {
			final boolean actuallyReplace = !wholeWords || loc + placeholder.length() == template.length()
					|| !Character.isJavaIdentifierPart(template.charAt(loc + placeholder.length()));
			String actualReplacement = actuallyReplace ? replacement : placeholder;
			return new StringBuffer(template.substring(0, loc)).append(actualReplacement)
					.append(replace(template.substring(loc + placeholder.length()), placeholder, replacement, wholeWords))
					.toString();
		}
	}

	/**
	 * 重写字符串，用第三个参数代替前两个参数重复部分 注：此方法只替换第一次出现的重复部分，后边再有重复部分不进行替换
	 * 
	 * @return
	 */
	public static String replaceOnce(String template, String placeholder, String replacement) {
		int loc = template.indexOf(placeholder);
		if (loc < 0) {
			return template;
		} else {
			return new StringBuffer(template.substring(0, loc)).append(replacement)
					.append(template.substring(loc + placeholder.length())).toString();
		}
	}

	public static String[] split(String seperators, String list) {
		return split(seperators, list, false);
	}

	public static String[] split(String seperators, String list, boolean include) {
		StringTokenizer tokens = new StringTokenizer(list, seperators, include);
		String[] result = new String[tokens.countTokens()];
		int i = 0;
		while (tokens.hasMoreTokens()) {
			result[i++] = tokens.nextToken();
		}
		return result;
	}

	public static String unqualify(String qualifiedName) {
		return qualifiedName.substring(qualifiedName.lastIndexOf(".") + 1);
	}

	public static String qualifier(String qualifiedName) {
		int loc = qualifiedName.lastIndexOf(".");
		return (loc < 0) ? "" : qualifiedName.substring(0, loc);
	}

	public static String[] suffix(String[] columns, String suffix) {
		if (suffix == null)
			return columns;
		String[] qualified = new String[columns.length];
		for (int i = 0; i < columns.length; i++) {
			qualified[i] = suffix(columns[i], suffix);
		}
		return qualified;
	}

	private static String suffix(String name, String suffix) {
		return (suffix == null) ? name : name + suffix;
	}

	public static String root(String qualifiedName) {
		int loc = qualifiedName.indexOf(".");
		return (loc < 0) ? qualifiedName : qualifiedName.substring(0, loc);
	}

	public static String unroot(String qualifiedName) {
		int loc = qualifiedName.indexOf(".");
		return (loc < 0) ? qualifiedName : qualifiedName.substring(loc + 1, qualifiedName.length());
	}

	public static boolean booleanValue(String tfString) {
		String trimmed = tfString.trim().toLowerCase();
		return trimmed.equals("true") || trimmed.equals("t");
	}

	public static String toString(Object[] array) {
		int len = array.length;
		if (len == 0)
			return "";
		StringBuffer buf = new StringBuffer(len * 12);
		for (int i = 0; i < len - 1; i++) {
			buf.append(array[i]).append(", ");
		}
		return buf.append(array[len - 1]).toString();
	}

	public static String[] multiply(String string, Iterator placeholders, Iterator replacements) {
		String[] result = new String[] { string };
		while (placeholders.hasNext()) {
			result = multiply(result, (String) placeholders.next(), (String[]) replacements.next());
		}
		return result;
	}

	private static String[] multiply(String[] strings, String placeholder, String[] replacements) {
		String[] results = new String[replacements.length * strings.length];
		int n = 0;
		for (int i = 0; i < replacements.length; i++) {
			for (int j = 0; j < strings.length; j++) {
				results[n++] = replaceOnce(strings[j], placeholder, replacements[i]);
			}
		}
		return results;
	}

	public static int countUnquoted(String string, char character) {
		if ('\'' == character) {
			throw new IllegalArgumentException("Unquoted count of quotes is invalid");
		}
		if (string == null)
			return 0;
		// Impl note: takes advantage of the fact that an escpaed single quote
		// embedded within a quote-block can really be handled as two seperate
		// quote-blocks for the purposes of this method...
		int count = 0;
		int stringLength = string.length();
		boolean inQuote = false;
		for (int indx = 0; indx < stringLength; indx++) {
			char c = string.charAt(indx);
			if (inQuote) {
				if ('\'' == c) {
					inQuote = false;
				}
			} else if ('\'' == c) {
				inQuote = true;
			} else if (c == character) {
				count++;
			}
		}
		return count;
	}

	/**
	 * 字符串是否不为null或者也非空串
	 * 
	 * @param string
	 * @return
	 */
	public static boolean isNotEmpty(String string) {
		return string != null && string.length() > 0;
	}

	/**
	 * 字符串是否不为null，也非全由空格构成
	 * 
	 * @param string
	 * @return
	 */
	public static boolean isNotEmptyByTrim(String string) {
		return string != null && string.length() > 0 && string.trim().length() > 0;
	}

	/**
	 * 字符串为null或者空串
	 * 
	 * @param string
	 *           输入的字符串
	 * @return
	 */
	public static boolean isEmpty(String string) {
		return string == null || string.length() == 0;
	}

	/**
	 * 字符串为null或者由空格构成
	 * 
	 * @param string
	 *           输入的字符串
	 * @return
	 */
	public static boolean isEmptyByTrim(String string) {
		return string == null || string.length() == 0 || string.trim().length() == 0;
	}

	/**
	 * 是否任意字符串参数为空
	 * 
	 * @param args
	 *           参数数组
	 * @return
	 */
	public static boolean isAnyEmpty(String... args) {
		for (String str : args) {
			if (isEmpty(str)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 是否任意字符串参数非空
	 * 
	 * @param args
	 *           字符串参数数组
	 * @return
	 */
	public static boolean isNotAnyEmpty(String... args) {
		return !isAnyEmpty(args);
	}

	public static String qualify(String prefix, String name) {
		if (name == null || prefix == null) {
			throw new NullPointerException();
		}
		return new StringBuffer(prefix.length() + name.length() + 1).append(prefix).append('.').append(name).toString();
	}

	public static String[] qualify(String prefix, String[] names) {
		if (prefix == null)
			return names;
		int len = names.length;
		String[] qualified = new String[len];
		for (int i = 0; i < len; i++) {
			qualified[i] = qualify(prefix, names[i]);
		}
		return qualified;
	}

	public static int firstIndexOfChar(String sqlString, String string, int startindex) {
		int matchAt = -1;
		for (int i = 0; i < string.length(); i++) {
			int curMatch = sqlString.indexOf(string.charAt(i), startindex);
			if (curMatch >= 0) {
				if (matchAt == -1) { // first time we find match!
					matchAt = curMatch;
				} else {
					matchAt = Math.min(matchAt, curMatch);
				}
			}
		}
		return matchAt;
	}

	public static String truncate(String string, int length) {
		if (string.length() <= length) {
			return string;
		} else {
			return string.substring(0, length);
		}
	}

	/**
	 * Generate a nice alias for the given class name or collection role name and
	 * unique integer. Subclasses of Loader do <em>not</em> have to use aliases
	 * of this form.
	 * 
	 * @return an alias of the form <tt>foo1_</tt>
	 */
	public static String generateAlias(String description, int unique) {
		return generateAliasRoot(description) + Integer.toString(unique) + '_';
	}

	private static String generateAliasRoot(String description) {
		final String result = truncate(unqualify(description), ALIAS_TRUNCATE_LENGTH).toLowerCase().replace('$', '_'); // classname
		// may
		// be
		// an
		// inner
		// class
		if (Character.isDigit(result.charAt(result.length() - 1))) {
			return result + "x"; // ick!
		} else {
			return result;
		}
	}

	public static String generateAlias(String description) {
		return generateAliasRoot(description) + '_';
	}

	/**
	 * 将字符串字母转换成大写字母
	 * 
	 * @return
	 */
	public static String toUpperCase(String str) {
		return str == null ? null : str.toUpperCase();
	}

	/**
	 * 将字符串字母转换成小写字母
	 * 
	 * @return
	 */
	public static String toLowerCase(String str) {
		return str == null ? null : str.toLowerCase();
	}

	/**
	 * 去除字符串中的空格
	 * 
	 * @return
	 */
	public static String dealNull(String str) {
		return str == null ? "" : str.trim();
	}

	public static Object dealNull(Object str) {
		return str == null ? "" : str;
	}

	public static String replaceString(String str, String str1, String str2) {
		int s_index;
		String outstr = "";
		if (StringHelper.isEmpty(str))
			return "";
		if (StringHelper.isEmpty(str1))
			return str;
		while (true) {
			s_index = str.indexOf(str1);
			if (s_index >= 0) {
				outstr += str.substring(0, s_index) + str2;
				str = str.substring(s_index + str1.length());
			} else {
				outstr += str;
				break;
			}
		}
		return outstr;
	}

	/**
	 * 获取文件后缀名
	 * 
	 * @return
	 */
	/**
	 * 获取文件后缀名
	 * 
	 * @return
	 */
	public static String getFileExt(String fileName) {
		int iIndex = fileName.lastIndexOf(".");
		if (iIndex < 0)
			return "";
		return fileName.substring(iIndex + 1).toLowerCase();
	}

	public static String getHttpFileExt(String imgName) {
		String str = "";
		String p = "(.jpg|.JPG|.gif|.GIF|.png|.PNG|.bmp|.BMP).*$";
		Pattern pattern = Pattern.compile(p);
		Matcher matcher = pattern.matcher(imgName);
		if (matcher.find()) {
			str = matcher.group();
		}
		return str;
	}

	public static boolean checkValue(String scd, String dcd) {
		if (StringHelper.isEmpty(dcd) || StringHelper.isEmpty(scd))
			return false;
		return dcd.equals(dcd);
	}

	public static String getLikeStr(String field) {
		return "%" + field + "%";
	}

	public static String getStrRomovedot(String field) {
		String str = field;
		if (StringHelper.isNotEmpty(field) && field.indexOf(".") > 0) {
			String str1 = field.substring(field.indexOf(".") + 1, field.indexOf(".") + 2);
			if (str1.equals("0")) {
				str = field.substring(0, field.indexOf("."));
			}
		}
		return str;
	}

	/**
	 * 以逗号为分隔符，将字符串转换为String[]
	 * 
	 * @param str
	 * @return 返回字符串数组
	 */
	public static String[] strToArr(String str) {
		if (StringHelper.isNotEmpty(str)) {
			return str.split(",");
		}
		return null;
	}

	public static String[] trim(String[] strs) {
		if (strs != null) {
			for (int i = 0; i < strs.length; i++)
				strs[i] = strs[i].trim();
			return strs;
		}
		return null;
	}

	/**
	 * 以逗号为分隔符，将字符串转换为List
	 * 
	 * @param str
	 * @return 返回字符串列表
	 */
	public static List<String> strToList(String str) {
		if (StringHelper.isNotEmpty(str)) {
			return Arrays.asList(str.split(","));
		}
		return null;
	}

	public static String getStrRemoveHtmlTag(String str) {
		String result = str.replaceAll("\\&[a-zA-Z]{1,10};", "").replaceAll("<[^>]*>", "");
		result = result.replaceAll("[(/>)<]", "");
		return result;
	}

	public static String getStrRemoveEscapeStr(String str) {
		return str.replaceAll("\r", "").replaceAll("\n", "").replaceAll("\t", " ").replaceAll("\b", "").replaceAll("\f",
				"");
	}

	/**
	 * 将英文的单引号替换成中文的单引号
	 * 
	 * @param oldStr
	 *           源字符串
	 * @return 返回替换后的字符串
	 */
	public static String replaceQuotes(String oldStr) {
		return oldStr.replace("'", "’");
	}

	/**
	 * 过滤input字符串中的html格式
	 * 
	 * @param input
	 * @param length
	 * @return 返回过滤所有HTML元素后的内容
	 */
	public static String splitAndFilterString(String input) {
		if (input == null || input.trim().equals("")) {
			return "";
		}
		// 去掉所有html元素,
		String str = input.replaceAll("\\&[a-zA-Z]{1,10};", "").replaceAll("<[^>]*>", "");
		str = str.replaceAll("[(/>)<]", "");
		int len = str.length();
		return str;
	}

	/**
	 * 去除最后一个字符
	 * 
	 * @param str
	 * @return 返回去除字符串最后一个字符后的字符串
	 */
	public static String removeLast(String str) {
		if (StringHelper.isNotEmpty(str)) {
			str = str.substring(0, str.length() - 1);
		}
		return str;
	}

	/**
	 * 去除字符串
	 * 
	 * @param str
	 * @param lastStr
	 *           需要去除的字符
	 * @return 返回去除最后一个指定字符串的结果
	 */
	public static String removeLast(String str, String lastStr) {
		if (StringHelper.isNotAnyEmpty(str, lastStr)) {
			int lastStrStart = str.lastIndexOf(lastStr);
			if (lastStrStart == str.length() - 1) {
				str = str.substring(0, lastStrStart);
			}
		}
		return str;
	}

	/**
	 * 根据数字和位数进行补位，位数不足补0
	 * 
	 * @param num
	 *           原始数字
	 * @param ws
	 *           需要生成的位数
	 * @return 返回格式化结果
	 */
	public static String fillzero(int num, int ws) {
		String formatstr = "";
		for (int i = 0; i < ws; i++) {
			formatstr += "0";
		}
		java.text.DecimalFormat df = new java.text.DecimalFormat(formatstr);
		return df.format(num);
	}

	public static String safeStr(String str) {
		return isEmpty(str) ? "" : str.toString();
	}

	public static void main(String[] args) throws UnsupportedEncodingException {
		String s = "<span style=\"font-size:12px;\"> </span><p><span style=\"font-family:\" calibri\",\"sans-serif\";font-size:12pt;\"=\"\"><span style=\"font-family:宋体;font-size:12px;\">阿苏豆腐干<b><span style=\"font-size:12px;\">和健</span></b>康个人人体育</span><span style=\"font-family:\" calibri\",\"sans-serif\";font-size:12px;\"=\"\">I </span></span></p>";
		System.out.println(splitAndFilterString(s));
		// System.out.println(StringHelper.isEmpty(s));
		// System.out.println(getContByteLen("大家家大家,\"()*&&^%$%"));
		// System.out.println(getByteLen("大家好11111你是谁啊</br>"));
		// String content="大</br>";
		// Pattern pattern = Pattern.compile("[\u4e00-\u9fa5]+");
		// Matcher matcher = pattern.matcher(content);
		// while(matcher.find()){
		// System.out.println(matcher.group());
		// }
		// var a = b.match(/[^\x00-\x80]/g);
		// return b.length + (a ? a.length: 0)
	}
}

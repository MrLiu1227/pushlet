/*
 *  HTML_Utils.java
 *  
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Library General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 *  
 *  Author: Winter Lau
 *  http://dlog4j.sourceforge.net
 *  2006-8-17
 */
package com.css.util;

import org.apache.commons.lang.StringUtils;
import org.htmlparser.Node;
import org.htmlparser.NodeFilter;
import org.htmlparser.Parser;
import org.htmlparser.PrototypicalNodeFactory;
import org.htmlparser.nodes.TagNode;
import org.htmlparser.nodes.TextNode;
import org.htmlparser.tags.CompositeTag;
import org.htmlparser.util.NodeList;
import org.htmlparser.util.ParserException;

/**
 * 用于格式化HTML的工具类
 * 
 * @author liudong
 */
public class HtmlUtils {
	/**
	 * @param args
	 */
	private static void demo() {
		try {
		} catch (Exception ex) {
		}
	}
	public static void main(String[] args) {
		String html = "<FONT CLASS=\"FrameItemFont\"><A HREF=\"org/htmlparser/lexer/package-frame.html\" target=\"packageFrame\">org.htmlparser.lexer</A></FONT><BR><FONT CLASS=\"FrameItemFont\"><A HREF=\"org/htmlparser/lexerapplications/tabby/package-frame.html\" target=\"packageFrame\">org.htmlparser.lexerapplications.tabby</A></FONT><BR><FONT CLASS=\"FrameItemFont\"><A HREF=\"org/htmlparser/lexerapplications/thumbelina/package-frame.html\" target=\"packageFrame\">org.htmlparser.lexerapplications.thumbelina</A></FONT><BR><FONT CLASS=\"FrameItemFont\"><A HREF=\"org/htmlparser/nodes/package-frame.html\" target=\"packageFrame\">org.htmlparser.nodes</A></FONT>";
		html = "<p><div><span><FONT CLASS=\"FrameItemFont\"><STRONG><table><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr><tr><td>你好</td></tr></table>&nbsp;&nbsp;&nbsp; §3.2&nbsp;&nbsp; 经典测量理论(CTT)</STRONG></P><P>&nbsp;&nbsp;&nbsp; <img src=\"htmlparser/lexerapplications/tabby/package-frame.jpg\">经典的真分数理论，<b>其测验编制的指导思想与策略，抛开内容结构与题型运用不说，就是全卷试题难度，采用宽全距的正态分布格局。</b>这里有一个必备前提，即被试考生的真实水平分布确实是正态的。实际工作的操作则是，通过多次</b></font></span></div>";
		int pre_length = 200;
		String preview = preview(html, pre_length);
		System.out.println(html);
		System.out.println(html.substring(0, pre_length));
		System.out.println(preview);
	}
	private final static NodeFilter nfilter = new NodeFilter() {
		public boolean accept(Node arg0) {
			return true;
		}
	};
	/**
	 * 生成预览内容
	 * 
	 * @param html
	 * @param max_count
	 * @return
	 */
	public static String preview(String html, int max_count) {
		if (html.length() <= max_count * 1.1)
			return html;
		Parser parser = new Parser();
		StringBuffer prvContent = new StringBuffer();
		try {
			parser.setInputHTML(html);
			PrototypicalNodeFactory factory = new PrototypicalNodeFactory();
			factory.registerTag(new FontTag());
			factory.registerTag(new BoldTag());
			parser.setNodeFactory(factory);
			NodeList nodes = parser.extractAllNodesThatMatch(nfilter);
			Node node = null;
			for (int i = 0; i < nodes.size(); i++) {
				if (prvContent.length() >= max_count) {
					if (node instanceof TagNode) {
						TagNode tmp_node = (TagNode) node;
						boolean isEnd = tmp_node.isEndTag();
						if (!isEnd) {
							prvContent.setLength(prvContent.length() - tmp_node.getText().length() - 2);
						}
					}
					// 补齐所有未关闭的标签
					Node parent = node;
					// System.out.println("current node is .
					// "+parent.getText());
					do {
						// System.out.println(parent.getClass().getName()+":"+parent.getText());
						parent = parent.getParent();
						// System.out.println("parent = "+parent);
						if (parent == null)
							break;
						if (!(parent instanceof TagNode))
							continue;
						// System.out.println("Parent node is no ended.
						// "+parent.getText());
						prvContent.append(((TagNode) parent).getEndTag().toHtml());
					} while (true);
					break;
				}
				node = nodes.elementAt(i);
				if (node instanceof TagNode) {
					TagNode tag = (TagNode) node;
					prvContent.append('<');
					prvContent.append(tag.getText());
					prvContent.append('>');
					// System.out.println("TAG: " + '<'+tag.getText()+'>');
				} else if (node instanceof TextNode) {
					int space = max_count - prvContent.length();
					if (space > 10) {
						TextNode text = (TextNode) node;
						if (text.getText().length() < 10)
							prvContent.append(text.getText());
						else
							prvContent.append(StringUtils.abbreviate(text.getText(), max_count - prvContent.length()));
						// System.out.println("TEXT: " + text.getText());
					}
				}
			}
			return prvContent.toString();
		} catch (ParserException e) {
			e.printStackTrace();
		} finally {
			parser = null;
		}
		return html;
	}
	/**
	 * 字体标签
	 * 
	 * @author liudong
	 */
	public static class FontTag extends CompositeTag {
		private static final String[] mIds = new String[] { "FONT" };
		private static final String[] mEndTagEnders = new String[] {};
		public String[] getIds() {
			return (mIds);
		}
		public String[] getEnders() {
			return (mIds);
		}
		public String[] getEndTagEnders() {
			return (mEndTagEnders);
		}
	}
	/**
	 * 字体标签
	 * 
	 * @author liudong
	 */
	public static class BoldTag extends CompositeTag {
		private static final String[] mIds = new String[] { "B", "I", "U", "STRONG" };
		private static final String[] mEndTagEnders = new String[] {};
		public String[] getIds() {
			return (mIds);
		}
		public String[] getEnders() {
			return (mIds);
		}
		public String[] getEndTagEnders() {
			return (mEndTagEnders);
		}
	}
}

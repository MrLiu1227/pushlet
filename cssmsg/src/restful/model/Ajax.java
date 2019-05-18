/*
 * Created on 2006-8-19
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package model;

import com.css.util.Json;

import net.sf.json.JSONObject;

/**
 * Ajax返回结果辅助工具类
 * @author paladin
 * @since 1.0
 */
public class Ajax {
	/**
	 * XML内容数据头
	 */
	public static String xmlHead = "<?xml version=\"1.0\" encoding=\"utf-8\"?><data>";
	/**
	 * XML内容头
	 */
	public static String wsHead =  "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
	/**
	 * XML内容数据结束标识
	 */
	public static String xmlFoot = "</data>";
	/**
	 * 返回xml响应结果，形如:<br/>
	 * <?xml version=\"1.0\" encoding=\"utf-8\"?><br/>
	 * &lt;data><br/>
	 * 	  &lt;code>0&lt;/code><br/>
	 *    &lt;desc>&lt;![CDATA[操作成功!]]>&lt;/desc><br/>
	 * &lt;/data><br/>
	 * @param code  结果代码
	 * @param description  结果描述
	 * @return
	 */
 	public static String xmlResult(int code, String description) {
		return xmlResult(code, description, "");
	}

	/**
	 * 返回xml响应结果，形如:<br/>
	 * <?xml version=\"1.0\" encoding=\"utf-8\"?><br/>
	 * &lt;data><br/>
	 * 	&lt;code>0&lt;/code><br/>
	 *  &lt;desc>&lt;![CDATA[操作成功!]]>&lt;/desc><br/>
	 *  &lt;content>其它xml内容&lt;/content><br/>
	 * &lt;/data><br/>
	 * @param code  结果代码
	 * @param description  结果描述
	 * @param content  附加xml内容
	 * @return
	 */
	public static String xmlResult(int code, String description, String content) {
		StringBuffer sb = new StringBuffer();
		sb.append(xmlHead);
		sb.append("<code>")
		.append( code)
		.append("</code>")
		.append("<desc><![CDATA[")
		.append(description)
		.append("]]></desc>");
		sb.append(content);
		sb.append(xmlFoot);
		return sb.toString();
	}   
	
	/**
	 * 返回json响应结果，形如：<br/>
	 * {"result":0,"msg":"操作成功!"}<br/>
	 * @param code  状态码
	 * @param description  状态描述
	 * @return
	 */
	public static String JSONResult(int code, String description) {
		return JSONResult(code, description, null);
	}
	
	/**
	 * 返回json响应结果：<br/>
	 * 若info的值为字符串，则返回结果形如：<br/>
	 * {"result":0,"msg":"操作成功!","info":"xxx"}<br/>
	 * 若info的值为Map对象，则返回结果形如：<br/>
	 * {"result":0,"msg":"操作成功!","info":{"name":"paladin","age":23}}<br/>
	 * 即只要info参数有值，则会转换成为符合json规范的值
	 * @param code 状态码
	 * @param description 状态描述
	 * @param info 其它信息，可以是任何类型的对象
	 * @return
	 */
	
	
	public static String JSONResult(int code, String description, Object info) {
		return new JSONObject().element("result", code).element("msg", description).element("info", info).toString();
	}
	@Deprecated
	public static String JSONResult(int code, String description,String info,boolean isJson) {
		StringBuffer buf=new StringBuffer();
		buf.append("{\"result\":")
		.append(code);
		if(description!=null)
			{
				buf.append(",\"msg\":\"").append(Json.string2json(description)).append("\"");
			}
		if(info!=null){
			if(isJson)
				buf.append(",\"info\":").append(info);
			else
				buf.append(",\"info\":\"").append(Json.string2json(info)).append("\"");				
		}
		buf.append("}");
		return buf.toString();
	}
}
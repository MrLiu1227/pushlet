package org.slw.common.helper;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.dom4j.Element;
import org.slw.common.utils.XmlUtil;

/**
 * 获取配置文件属性
 */
public class Xwork2ControllerHelper {
	private static final Element XML_ELEMENT = XmlUtil.loadXml("xwork.xml");
	private static final String INCLUDE = "include";
	private static final String FILE = "file";
	private static final String PATH = "d:/ctrl/";

	public static void main(String[] args) {
		Xwork2ControllerHelper x2c = new Xwork2ControllerHelper();
		x2c.parseXwork();
	}

	/**
	 * 解析xwork
	 * 
	 */
	private void parseXwork() {
		List<Element> includes = XmlUtil.children(XML_ELEMENT, INCLUDE);
		for (Element ele : includes) {
			String file = ele.attributeValue(FILE);
			controller(file);
		}
		System.out.println("--------finished---------");
	}

	/**
	 * 生成Controller文件
	 * 
	 */
	private void controller(String file) {

		StringBuffer sb = new StringBuffer();
		
		int l = file.lastIndexOf("/");
		String path = file.substring(0, l);
		String xmlName = file.substring(l + 1);
		String packageName = path.replaceAll("/", ".");

		l = xmlName.lastIndexOf("_");
		l = l < 0 ? 0 : l + 1;
		String actionName = xmlName.substring(l, xmlName.length() - 4) + "Controller";

		sb.append("package " + packageName + ";\n\n");
		sb.append("import org.slw.framework.action.ActionChain;\n");
		sb.append("import org.slw.framework.annotation.Controller;\n");
		sb.append("import org.slw.framework.annotation.RequestMapping;\n");
		sb.append("import org.slw.framework.view.JsonView;\n");
		sb.append("import org.slw.framework.view.JspView;\n\n");
		sb.append("@SlwController\n");
		sb.append("public class " + actionName + " {\n");

		Element root = XmlUtil.loadXml(file);
		Element packages = XmlUtil.child(root, "package");

		List<Element> actions = XmlUtil.children(packages, "action");
		for (Element action : actions) {
			XworkAction xa = parseAction(action);
			sb.append(CreateMethod(xa));
		}
		sb.append("}\n");

		String outFolder = PATH + path;
		File dir = new File(outFolder);
		if (!dir.exists())
			dir.mkdirs();
		String filename = dir.getAbsolutePath() + File.separator + actionName + ".java";
		System.out.println(filename);
		try {
			FileUtils.writeStringToFile(new File(filename), sb.toString());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private String CreateMethod(XworkAction xa) {
		StringBuffer sb = new StringBuffer();
		sb.append("@RequestMapping(caption = \"" + xa.caption + "\")\n");
		sb.append("public " + xa.view + " " + xa.name + "() {\n");
		sb.append("ActionChain.excuteAction(" + xa.methodName + ".class);\n");
		sb.append("return new " + xa.view + "(");
		if ("JspView".equals(xa.view))
			sb.append("\"" + xa.location + "\"");
		sb.append(");\n");
		sb.append("}\n\n");
		return sb.toString();
	}

	private XworkAction parseAction(Element action) {
		XworkAction xa = new XworkAction();
		xa.name = action.attributeValue("name");
		xa.clazz = action.attributeValue("class");
		xa.caption = action.attributeValue("caption");
		xa.init(action);
		return xa;
	}
}

class XworkAction {
	String name;
	String clazz;
	String caption;
	String methodName;
	String view = "JspView";
	String location;

	void init(Element action) {
		int l = this.clazz.lastIndexOf(".");
		methodName = this.clazz.substring(l + 1);
		List<Element> results = XmlUtil.children(action, "result");
		for (Element result : results) {
			String sRet = result.attributeValue("name");
			if ("success".equals(sRet)) {
				Element param = XmlUtil.child(result, "param");
				location = param.getStringValue();
				if (location.indexOf("/") == 0)
					location = location.substring(1);
				if ("resultjson.jsp".equalsIgnoreCase(location))
					this.view = "JsonView";
			}
		}
	}
}

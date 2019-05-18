/**
 * 
 */
package com.css.util;

import java.net.MalformedURLException;
import java.net.URL;

public class ClassUtil {
	public static URL getClassPathUrl() {
		String resName = ClassUtil.class.getName().replace('.', '/') + ".class";
		String loc = ClassUtil.class.getClassLoader().getResource(resName).toExternalForm();
		URL cp;
		try {
			cp = new URL(loc.substring(0, loc.length() - resName.length()));
		} catch (MalformedURLException e) {
			throw new RuntimeException(e);
		}
		return cp;
	}
	public static String getClassPath() {
		String resName = ClassUtil.class.getName().replace('.', '/') + ".class";
		String loc = ClassUtil.class.getClassLoader().getResource(resName).toExternalForm();
		return loc.substring(0, loc.length() - resName.length());
	}
}

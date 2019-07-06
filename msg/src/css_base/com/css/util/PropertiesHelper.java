//$Id: PropertiesHelper.java 1075 2016-05-11 14:25:33Z wwd $
package com.css.util;

import java.util.Properties;
/**
 * Properties帮助工具类，提供获取properties文件中的值的方法
 * @author paladin
 * @since 1.0
 */
public final class PropertiesHelper {
	
	/**
	 * 获取properties文件中的boolean值对象
	 * @param property properties文件中的key
	 * @param properties properties文件
	 * @return
	 */
	public static boolean getBoolean(String property, Properties properties) {
		return Boolean.valueOf(properties.getProperty(property)).booleanValue();
	}
	/**
	 * 获取properties文件中的boolean值
	 * @param property properties文件中的key
	 * @param properties properties文件
	 * @param defaultValue boolean值为空时的默认值
	 * @return
	 */
	public static boolean getBoolean(String property, Properties properties,
			boolean defaultValue) {
		String setting = properties.getProperty(property);
		return (setting == null) ? defaultValue : Boolean.valueOf(setting)
				.booleanValue();
	}
	/**
	 * 获取properties文件中的int值
	 * @param property properties文件中的key
	 * @param properties properties文件
	 * @param defaultValue int值为空时的默认值
	 * @return
	 */
	public static int getInt(String property, Properties properties,
			int defaultValue) {
		String propValue = properties.getProperty(property);
		return (propValue == null) ? defaultValue : Integer.parseInt(propValue);
	}
	/**
	 * 获取properties文件中的long值
	 * @param property properties文件中的key
	 * @param properties properties文件
	 * @param defaultValue long值为空时的默认值
	 * @return
	 */
	public static long getLong(String property, Properties properties,
			long defaultValue) {
		String propValue = properties.getProperty(property);
		return (propValue == null) ? defaultValue : Long.parseLong(propValue);
	}
	/**
	 * 获取properties文件中的String值
	 * @param property properties文件中的key
	 * @param properties properties文件
	 * @param defaultValue String值为空时的默认值
	 * @return
	 */
	public static String getString(String property, Properties properties,
			String defaultValue) {
		String propValue = properties.getProperty(property);
		return (propValue == null) ? defaultValue : propValue;
	}
	/**
	 * 获取properties文件中的Integer值
	 * @param property properties文件中的key
	 * @param properties properties文件
	 * @return
	 */
	public static Integer getInteger(String property, Properties properties) {
		String propValue = properties.getProperty(property);
		return (propValue == null) ? null : Integer.valueOf(propValue);
	}
	private PropertiesHelper() {
	}
}

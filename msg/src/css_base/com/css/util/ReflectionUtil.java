/**
 * Copyright (c) Css Team
 * All rights reserved.
 *
 * This file ReflectionUtil.java creation date: [Jan 23, 2014 2:49:56 PM] by liuzhb
 * http://www.css.com.cn
 */
package com.css.util;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

/**
 * <descption>function infomation</descption>
 * 
 * @since 1.1
 * @author liuzhb
 * @version Jan 23, 2014 2:49:56 PM
 */
public class ReflectionUtil {
	/**
	 * 取得参数对象中的公共属性
	 * 
	 * @param obj
	 * @param fieldname
	 * @return
	 * @throws Exception
	 */
	public Object getProperty(Object obj, String fieldname) throws Exception {
		Object result = null;
		Class objClass = obj.getClass();
		Field field = objClass.getField(fieldname);
		result = field.get(obj);
		return result;
	}
	/**
	 * 获得某类的静态属性
	 * 
	 * @param className
	 * @param fieldName
	 * @return
	 * @throws Exception
	 */
	public Object getStaticProperty(String className, String fieldName) throws Exception {
		Class cls = Class.forName(className);
		Field field = cls.getField(fieldName);
		Object provalue = field.get(cls);
		return provalue;
	}
	/**
	 * 获取参数对象的属性值
	 * 
	 * @param obj
	 * @param propertyName
	 * @return
	 * @throws Exception
	 */
	public Object getPrivatePropertyValue(Object obj, String propertyName) throws Exception {
		Class cls = obj.getClass();
		Field field = cls.getDeclaredField(propertyName);
		field.setAccessible(true);
		Object retvalue = field.get(obj);
		return retvalue;
	}
	/**
	 * 执行某对象方法
	 * 
	 * @param owner 对象
	 * @param methodName 方法名
	 * @param args 参数
	 * @return 方法返回值
	 * @throws Exception
	 */
	public Object invokeMethod2(Object owner, String methodName, Object... args) throws Exception {
		Class ownerClass = owner.getClass();
		Class[] argsClass = new Class[args.length];
		for (int i = 0, j = args.length; i < j; i++) {
			argsClass[i] = args[i].getClass();
		}
		Method method = ownerClass.getMethod(methodName, argsClass);
		return method.invoke(owner, args);
	}
	/**
	 * 执行某对象的方法
	 * 
	 * @param owner
	 * @param methodName
	 * @param args
	 * @return
	 * @throws Exception
	 */
	public static Object invokeMethod(Object owner, String methodName, Object[] args) throws Exception {
		Class cls = owner.getClass();
		Class[] argclass = new Class[args.length];
		for (int i = 0, j = argclass.length; i < j; i++) {
			argclass[i] = args[i].getClass();
		}
		Method method = cls.getMethod(methodName, argclass);
		return method.invoke(owner, args);
	}
	/**
	 * 执行静态类的方法
	 * 
	 * @param className
	 * @param methodName
	 * @param args
	 * @return
	 * @throws Exception
	 */
	public Object invokeStaticMethod(String className, String methodName, Object[] args) throws Exception {
		Class cls = Class.forName(className);
		Class[] argclass = new Class[args.length];
		for (int i = 0, j = argclass.length; i < j; i++) {
			argclass[i] = args[i].getClass();
		}
		Method method = cls.getMethod(methodName, argclass);
		return method.invoke(null, args);
	}
	/**
	 * 通过指定的类名和构造参数构建新的实例对象
	 * 
	 * @param className 类名
	 * @param args 构造参数
	 * @return
	 * @throws Exception
	 */
	public Object newInstance(String className, Object[] args) throws Exception {
		Class clss = Class.forName(className);
		Class[] argclass = new Class[args.length];
		for (int i = 0, j = argclass.length; i < j; i++) {
			argclass[i] = args[i].getClass();
		}
		java.lang.reflect.Constructor cons = clss.getConstructor(argclass);
		return cons.newInstance();
	}
	/**
	 * 新建实例
	 * 
	 * @param class 类
	 * @param args 构造函数的参数
	 * @return 新建的实例
	 * @throws Exception
	 */
	public Object newInstance(Class newoneClass, Object... args) throws Exception {
		if (args.length == 1) {
			Object obj = args[0];
			Class cls = obj.getClass();
			try {
				Field f = cls.getDeclaredField("TYPE");
				if (f != null)
					return args[0];
			} catch (Exception e) {
			}
		}
		if (args == null)
			return newoneClass.newInstance();
		Class[] argsClass = new Class[args.length];
		for (int i = 0, j = args.length; i < j; i++) {
			argsClass[i] = args[i].getClass();
		}
		Constructor cons = newoneClass.getConstructor(argsClass);
		return cons.newInstance(args);
	}
	/**
	 * 是不是某个类的实例
	 * 
	 * @param obj 实例
	 * @param cls 类
	 * @return 如果 obj 是此类的实例，则返回 true
	 */
	public boolean isInstance(Object obj, Class cls) {
		return cls.isInstance(obj);
	}
}

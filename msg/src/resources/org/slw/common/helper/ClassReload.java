package org.slw.common.helper;

import org.slw.framework.core.ServiceReloader;

/**
 * 用于自动生成slw-service.xml配置文件
 */
public class ClassReload {
	public static void main(String[] args) {
		ServiceReloader reload = new ServiceReloader();
		reload.reload("resources/slw-service.xml");
	}
}

package com.css.util;

import java.util.UUID;
 /**
  * UUID工具类
  * @author paladin
  * @since 1.0
  */
public class UuidUtil {
	/**
	 * 获取小写的32位的UUID字符串
	 * @return
	 */
	public static final String getUuid() {
		String uuid = UUID.randomUUID().toString();
		return uuid.replaceAll("-", "");
	}
	
	public static void main(String[] args){
		System.out.println(UuidUtil.getUuid());
	}
}

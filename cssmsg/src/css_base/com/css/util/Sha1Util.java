package com.css.util;

import java.security.MessageDigest;
/**
 * SHA-1算法工具类 
 * @author paladin
 * @since 1.0
 */
public class Sha1Util {
	/**
	 * 采用SHA-1算法获取消息摘要
	 * @param sourceString  待计算的消息内容
	 * @return
	 */
	public static String SHA1Encode(String sourceString) {
		String resultString = null;
		try {
			resultString = new String(sourceString);
			MessageDigest md = MessageDigest.getInstance("SHA-1");
			resultString = byte2hexString(md.digest(resultString.getBytes()));
		} catch (Exception ex) {
		}
		return resultString;
	}
	
	/**
	 * 将字节数组转化为十六进制字符串
	 * @param bytes
	 * @return
	 */
	public static final String byte2hexString(byte[] bytes) {
		StringBuffer buf = new StringBuffer(bytes.length * 2);
		for (int i = 0; i < bytes.length; i++) {
			if (((int) bytes[i] & 0xff) < 0x10) {
				buf.append("0");
			}
			buf.append(Long.toString((int) bytes[i] & 0xff, 16));
		}
		return buf.toString().toUpperCase();
	}
 
}

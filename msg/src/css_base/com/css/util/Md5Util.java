package com.css.util;

import java.io.File;
import java.io.FileInputStream;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.security.MessageDigest;
import java.util.Locale;

/**
 * 内容摘要工具类
 * 
 * @since 1.0
 * @author paladin
 */
public class Md5Util {

	/**
	 * 生成MD5摘要信息
	 * 
	 * @param sourceString
	 * @return
	 */
	public static String MD5Encode(String sourceString) {
		String resultString = null;
		try {
			resultString = new String(sourceString);
			MessageDigest md = MessageDigest.getInstance("MD5");
			resultString = byte2hexString(md.digest(resultString.getBytes()));
		} catch (Exception ex) {
		}
		return resultString;
	}

	/**
	 * 以字符串形式显示字节数组内容
	 * 
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
		return buf.toString();
	}

	 public static byte[] hexStringToByte(String src){  
       src = src.trim().replace(" ", "").toUpperCase(Locale.US);  
       //处理值初始化  
       int m=0,n=0;  
       int iLen=src.length()/2; //计算长度  
       byte[] ret = new byte[iLen]; //分配存储空间  
         
       for (int i = 0; i < iLen; i++){  
           m=i*2+1;  
           n=m+1;  
           ret[i] = (byte)(Integer.decode("0x"+ src.substring(i*2, m) + src.substring(m,n)) & 0xFF);  
       }  
       return ret;  
   }  
	/**
	 * 对文件全文生成MD5摘要
	 * 
	 * @param file
	 *           要加密的文件
	 * @return MD5摘要码
	 */
	public static String getMD5(File file) throws Exception {
		FileInputStream in = new FileInputStream(file);
		FileChannel ch = in.getChannel();
		MappedByteBuffer byteBuffer = ch.map(FileChannel.MapMode.READ_ONLY, 0, file.length());
		MessageDigest md = MessageDigest.getInstance("MD5");
		md.update(byteBuffer);
		return byte2hexString(md.digest());
	}

	/**
	 * 对一段String生成MD5加密信息
	 * 
	 * @param message
	 *           要加密的String
	 * @return 生成的MD5信息
	 */
	public static String getMD5(String s) throws Exception {
		if (s == null)
			return "";
		return getMD5(s.getBytes());
	}

	/**
	 * 对byte生成MD5加密信息
	 * 
	 * @param bytes
	 * @return
	 */
	public static String getMD5(byte[] bytes) throws Exception {
		if (bytes == null)
			return "";
		MessageDigest md = MessageDigest.getInstance("MD5");
		md.update(bytes);
		return byte2hexString(md.digest());
	}
}

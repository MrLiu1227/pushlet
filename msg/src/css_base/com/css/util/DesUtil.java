/**
 * $RCSfile: CheckCode.java,v $
 * $Revision: 1.1 $
 * $Date: 2008/02/13 02:40:31 $
 *
 * New Jive  from Jdon.com.
 *
 * This software is the proprietary information of CoolServlets, Inc.
 * Use is subject to license terms.
 */
package com.css.util;
import java.security.SecureRandom;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;
 /**
  * 数据加密工具类
  * @author paladin
  * @since 1.0
  */
public class DesUtil {
	private static final String PASSWORD_CRYPT_KEY = "EDCioui1234";
	private final static String DES = "DES";
	/**
	 * 
	 * 数据加密
	 * @param src  待加密的数据
	 * @param key 密钥，长度必须是8的倍数
	 * @return 返回加密后的数据
	 * @throws Exception
	 */
	public static byte[] encrypt(byte[] src, byte[] key) throws Exception {
		// DES算法要求有一个可信任的随机数源
		SecureRandom sr = new SecureRandom();
		// 从原始密匙数据创建DESKeySpec对象
		DESKeySpec dks = new DESKeySpec(key);
		// 创建一个密匙工厂，然后用它把DESKeySpec转换成
		// 一个SecretKey对象
		SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(DES);
		SecretKey securekey = keyFactory.generateSecret(dks);
		// Cipher对象实际完成加密操作
		Cipher cipher = Cipher.getInstance(DES);
		// 用密匙初始化Cipher对象
		cipher.init(Cipher.ENCRYPT_MODE, securekey, sr);
		// 现在，获取数据并加密
		// 正式执行加密操作
		return cipher.doFinal(src);
	}
	/**
	 * 
	 * 数据解密
	 * 
	 * @param src  待解密数据
	 * @param key  密钥，长度必须是8的倍数
	 * @return 返回解密后的原始数据
	 * @throws Exception
	 * 
	 */
	public static byte[] decrypt(byte[] src, byte[] key) throws Exception {
		// DES算法要求有一个可信任的随机数源
		SecureRandom sr = new SecureRandom();
		// 从原始密匙数据创建一个DESKeySpec对象
		DESKeySpec dks = new DESKeySpec(key);
		// 创建一个密匙工厂，然后用它把DESKeySpec对象转换成
		// 一个SecretKey对象
		SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(DES);
		SecretKey securekey = keyFactory.generateSecret(dks);
		// Cipher对象实际完成解密操作
		Cipher cipher = Cipher.getInstance(DES);
		// 用密匙初始化Cipher对象
		cipher.init(Cipher.DECRYPT_MODE, securekey, sr);
		// 现在，获取数据并解密
		// 正式执行解密操作
		return cipher.doFinal(src);
	}
	/**
	 * 
	 * 使用默认密钥进行数据解密
	 * 
	 * @param data 待解密数据
	 * @return
	 * @throws Exception
	 * 
	 */
	public final static String decrypt(String data) throws Exception{
			return new String(decrypt(hex2byte(data.getBytes()), PASSWORD_CRYPT_KEY.getBytes()));
	}
	
	/**
	 * 
	 * 使用密钥进行数据解密
	 * 
	 * @param data 待解密数据
	 * @param pwd 密钥
	 * @return
	 * @throws Exception
	 * 
	 */	
	public final static String decrypt(String data,String pwd) throws Exception{
		if(pwd==null)
			pwd=PASSWORD_CRYPT_KEY;
		return new String(decrypt(hex2byte(data.getBytes()), pwd.getBytes()));
}
	/**
	 * 
	 * 使用默认密钥进行数据加密
	 * @param content 待加密数据
	 * @return
	 * @throws Exception
	 * 
	 */
	public final static String encrypt(String content) {
		try {
			return byte2hex(encrypt(content.getBytes(), PASSWORD_CRYPT_KEY.getBytes()));
		} catch (Exception e) {
		}
		return null;
	}
	/**
	 * 
	 * 使用密钥进行数据加密
	 * @param content 待加密数据
	 * @param pwd 密钥
	 * @return
	 * @throws Exception
	 * 
	 */	
	public final static String encrypt(String content,String pwd) {
		if(pwd==null) 
			pwd = PASSWORD_CRYPT_KEY;
		try {
			return byte2hex(encrypt(content.getBytes(), pwd.getBytes()));
		} catch (Exception e) {
		}
		return null;
	}
	/**
	 * 
	 * 二进制转十六进制字符串
	 * @param b
	 * @return
	 * 
	 */
	public static String byte2hex(byte[] b) {
		String hs = "";
		String stmp = "";
		for (int n = 0; n < b.length; n++) {
			stmp = (java.lang.Integer.toHexString(b[n] & 0XFF));
			if (stmp.length() == 1)
				hs = hs + "0" + stmp;
			else
				hs = hs + stmp;
		}
		return hs.toUpperCase();
	}

	/**
	 * 十六进制字符串转字节数组
	 * @param s 十六进制字符串
	 * @return
	 */
	public static byte[] hex2byte(String s) {
		if ((s.length() % 2) != 0)
			throw new IllegalArgumentException("长度不是偶数");
		byte[] b2 = new byte[s.length() / 2];
		for (int n = 0; n < s.length(); n += 2) {
			String item = s.substring(n, n+2);
			b2[n / 2] = (byte) Integer.parseInt(item, 16);
		}
		return b2;
	}
	
	public static byte[] hex2byte(byte[] b) {
		if ((b.length % 2) != 0)
			throw new IllegalArgumentException("长度不是偶数");
		byte[] b2 = new byte[b.length / 2];
		for (int n = 0; n < b.length; n += 2) {
			String item = new String(b, n, 2);
			b2[n / 2] = (byte) Integer.parseInt(item, 16);
		}
		return b2;
	}
}
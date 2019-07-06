package com.css.util;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Locale;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

/**
 * SHA-1算法工具类
 * 
 * @author paladin
 * @since 1.0
 */
public class ShaWithSalt {
	public static void main(String[] args) throws Exception {
		String pwd = "zhrg中国";
		System.out.println(ShaWithSalt.getHash(pwd));
		String hashed="6ec2eafa18979793ab59680994717ed71330310d5e92edd028a65db08c3fc5df435b29f27209985d";
		System.out.println(ShaWithSalt.compare(pwd,hashed));
	}

	public static String getHash(String password) throws NoSuchAlgorithmException, InvalidKeySpecException {
		return byte2hexString(createHash(password));
	}

	public static boolean compare(String password, String HashedPassword) throws NoSuchAlgorithmException, InvalidKeySpecException {
		String saltStr=HashedPassword.substring(0,16);
		byte[] salt =hexStringToByte(saltStr);
		byte[] pwd=createHashBySalt(password,salt);
		return HashedPassword.equals(byte2hexString(pwd));
	}

	private static byte[] createHash(String password) throws NoSuchAlgorithmException, InvalidKeySpecException {
		SecureRandom random = SecureRandom.getInstance("SHA1PRNG");
		byte[] salt = new byte[8];
		random.nextBytes(salt);
		return createHashBySalt(password,salt);
	}
	private static byte[] createHashBySalt(String password,byte[] salt) throws NoSuchAlgorithmException, InvalidKeySpecException {
		char[] pwdChar = password.toCharArray();
		int iterCount = 50000;
		PBEKeySpec spec = new PBEKeySpec(pwdChar, salt, iterCount, 256);
		// PBKDF2WithHmacSHA256 is supportted from JDK1.8
		SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
		byte[] hashed = skf.generateSecret(spec).getEncoded();
		byte[] pwd = new byte[hashed.length + salt.length];
		System.arraycopy(salt, 0, pwd, 0, salt.length);
		System.arraycopy(hashed, 0, pwd, salt.length, hashed.length);
		return pwd;
	}

	/**
	 * 将字节数组转化为十六进制字符串
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

	/**
	 * 十六进制字符串转化为字节数组
	 * 
	 * @param bytes
	 * @return
	 */
	public static byte[] hexStringToByte(String src) {
		src = src.trim().replace(" ", "").toUpperCase(Locale.US);
		// 处理值初始化
		int m = 0, n = 0;
		int iLen = src.length() / 2; // 计算长度
		byte[] ret = new byte[iLen]; // 分配存储空间

		for (int i = 0; i < iLen; i++) {
			m = i * 2 + 1;
			n = m + 1;
			ret[i] = (byte) (Integer.decode("0x" + src.substring(i * 2, m) + src.substring(m, n)) & 0xFF);
		}
		return ret;
	}
}

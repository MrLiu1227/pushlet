package com.css.msgcenter.server.demo;

import com.css.util.Md5Util;

public class MkMD5 {

	
	public static void main(String[] args) {
		
		mkMD5();
		
	}
	
	public static void mkMD5(){
		try {
//			System.out.println(Md5Util.getMD5(""+Constants.EMAIL));
//			System.out.println(Md5Util.getMD5(""+Constants.IM));
//			System.out.println(Md5Util.getMD5(""+Constants.PHONE));
//			System.out.println(Md5Util.getMD5(""+Constants.LETTER));
			System.out.println(Md5Util.getMD5("cssoa"));
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
	}
	
	
}

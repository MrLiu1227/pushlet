package com.css.util;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GBUtil {

	private static final String[] codes = {"0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","O","P","Q","R","S","T","U","V","W","X","Y","Z"};
	private static final String[] values = {"0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35"};
	private	static Map<String,String> map = new HashMap<String,String>();
	static{
		for (int i = 0; i < codes.length; i++) {
			map.put(codes[i], values[i]);
		}
	}
	
	/**
	 * @throws Exception 
	 * @Describe 生成组织结构代码<br>
	 * 
	 *  标准:GB11714-1995
	 *  如：机构编码为40000219，则校验码为5
	 * @since fangwq
	 */
	public static String getOrgCode(String str) throws Exception {
		if(StringHelper.isEmpty(str)){throw new Exception("str is null or empty.");}
		Pattern pat = Pattern.compile("^[0-9A-Z]{8}$");
		Matcher matcher = pat.matcher(str);
		if (!matcher.matches()) {
			throw new Exception("str is format error.");
		}
		final int[] wi = { 3, 7, 9, 10, 5, 8, 4, 2 };
		final char[] values = str.toCharArray();
		int parity = 0;
		for (int i = 0; i < values.length; i++) {
			final String val = Character.toString(values[i]);
			parity += wi[i] * Integer.parseInt(map.get(val).toString());
		}
		String check = (11 - parity % 11) == 10 ? "X" : Integer.toString((11 - parity % 11));
		return check;
	}
	
	/**
	 * @throws Exception 
	 * @Describe 检验组织结构代码是否合法<br>
	 * 
	 *  标准:GB11714-1995
	 *  如400002195、40000219-5
	 * @since fangwq
	 */
	public static boolean cheakOrgCode(String str) throws Exception {
		if(StringHelper.isEmpty(str)){return false;}
		Pattern pat = Pattern.compile("^[0-9A-Z]{8}-?[0-9X]$");
		Matcher matcher = pat.matcher(str);
		if (!matcher.matches()) {
			System.out.println("11111");
			return false;
		}
		String all = null;
		String code = "";
		if(str.indexOf("-")!=-1){
			String[] strs = str.split("-");
			all = strs[0];
			code = strs[1];
		}else{
			int length = str.length();
			all = str.substring(0,length-1);
			code = str.substring(length-1);
		}
		String check = getOrgCode(all);
		return check.equals(code);
	}
	
	/**
	 * @throws Exception 
	 * @Describe 生成ISO/IEC7064 MOD37,36校验码<br>
	 * 
	 *  标准:GB/T17710-2008
	 * @since fangwq
	 */
	public static String getMod3736Code(String str) throws Exception {
		if(StringHelper.isEmpty(str)){throw new Exception("str is null or empty.");}
		final char[] values = str.toCharArray();
		int mod = 36;
		int start = mod;
		for(int i=0;i<values.length;i++){
			final String val = Character.toString(values[i]);
			start += Integer.parseInt(map.get(val).toString());
			start = getDoubleSpit(start,mod)*2;
			start = getSingleSpit(start,mod);
		}
		return getModOneCode(start,mod);
	}
	/**
	 * @throws Exception 
	 * @Describe 校验ISO/IEC7064 MOD37,36校验码是否合法<br>
	 * 
	 *  标准:GB/T17710-2008
	 * @since fangwq
	 */
	public static boolean CheckMod3736Code(String str) throws Exception {
		if(StringHelper.isEmpty(str)){throw new Exception("str is null or empty.");}
		int length = str.length();
		String all = str.substring(0,length-1);
		String code = str.substring(length-1);
		String check = getMod3736Code(all);
		return check.equals(code);
		
	}
	
	public static int getDoubleSpit(int s,int mod) throws Exception{
		int left = s%mod;
		if(left==0)return mod;
		return left;
	}
	public static int getSingleSpit(int s,int mod) throws Exception{
		int left = s%(mod+1);
		return left;
	}
	public static String getModOneCode(int value,int mod) throws Exception{
		//if(value%mod==1)return "X";
		return codes[(mod+1-value%mod)%mod-1];
	}
	
	public static void main(String[] args) throws Exception {
		String orgStr = "40000219";
		System.out.println(getOrgCode(orgStr));
		System.out.println(cheakOrgCode("40000219-5"));
		System.out.println(getMod3736Code("400002195C012004A100001"));
		System.out.println(CheckMod3736Code("400002195C012004A100001R"));
	}

}

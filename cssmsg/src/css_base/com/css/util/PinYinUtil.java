package com.css.util;

import net.sourceforge.pinyin4j.PinyinHelper;
import net.sourceforge.pinyin4j.format.HanyuPinyinCaseType;
import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;
import net.sourceforge.pinyin4j.format.HanyuPinyinToneType;
import net.sourceforge.pinyin4j.format.HanyuPinyinVCharType;
import net.sourceforge.pinyin4j.format.exception.BadHanyuPinyinOutputFormatCombination;

public class PinYinUtil {

	public static String getPinYin(String inputString,String sp) {
		if(StringHelper.isEmpty(sp)){
			sp = "";
		}
		HanyuPinyinOutputFormat format = new HanyuPinyinOutputFormat();
		format.setCaseType(HanyuPinyinCaseType.LOWERCASE);
		format.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
		format.setVCharType(HanyuPinyinVCharType.WITH_U_UNICODE);

		char[] input = inputString.trim().toCharArray();
		StringBuffer output = new StringBuffer("");

		try {
			for (int i = 0; i < input.length; i++) {
				if (Character.toString(input[i]).matches("[\\u4E00-\\u9FA5]+")) {
					String[] temp = PinyinHelper.toHanyuPinyinStringArray(input[i], format);
					if (temp != null && temp.length > 0) {
						output.append(formatFirstUpperCase(temp[0]));
						output.append(sp);
					}
				} 
				else if (Character.toString(input[i]).matches("[a-zA-Z]+")) {
					output.append(formatFirstUpperCase(Character.toString(input[i])));
				} 
//				else{
//					output.append(Character.toString(input[i]));
//				}
			}
		} catch (BadHanyuPinyinOutputFormatCombination e) {
			e.printStackTrace();
		}
		return output.toString();
	}
	
	public static String formatFirstUpperCase(String tempStr){
		tempStr = tempStr.substring(0,1).toUpperCase() + tempStr.substring(1);
		return tempStr;
	}

	public static void main(String[] args) {
		String chs = " 1ab我 是中国人! I'm Chinese!";
		System.out.println(chs);
		System.out.println(getPinYin(chs,null));
	}

}
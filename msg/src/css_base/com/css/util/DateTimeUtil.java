package com.css.util;
import java.text.SimpleDateFormat;
import java.util.Calendar;
/**
 * 日期时间工具类
 * @author paladin
 * @since 1.0
 */
public class DateTimeUtil
{
	/**
	 * 将当前日期时间转换为符合pattern格式的字符串
	 * @param pattern  合法的日期时间格式
	 * @return
	 */
   public static String getDateTimeString(String pattern) {
    SimpleDateFormat df = new SimpleDateFormat(pattern);
    java.util.Date date = new java.util.Date();
    String DateTimeString = df.format(date);
    return DateTimeString;
  }
  
   /**
    * 根据特定日期时间格式，格式化当前日期days天之后的日期时间(若days&lt;0，则表示|days|天之前的日期)<br/>
    * @param days
    * @param pattern
    * @return
    */
   public static String getDateTimeString(int days,String pattern) {
	    SimpleDateFormat df = new SimpleDateFormat(pattern);
	    Calendar ca=Calendar.getInstance();
	    ca.add(Calendar.DAY_OF_MONTH,days);	    
	    String DateTimeString = df.format(ca.getTime());
	    return DateTimeString;
	  }
   
   /**
    * 返回系统当前日期时间，形式如: 2013-04-03 11:22:33
    * @return
    */
   public static String getDateTimeString() {
	    SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	    java.util.Date date = new java.util.Date();
	    String DateTimeString = df.format(date);
	    return DateTimeString;
  }
   
   /**
    * 获取当前数据日期版本，形如 : V20140204
    * @return
    */
   public static String getDateVersionString() {
	    SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
	    java.util.Date date = new java.util.Date();
	    String DateTimeString = df.format(date);
	    return "V"+DateTimeString;
 }
   
   /**
    * 获取当前包含分钟级的数据版本,形如;V201403122209
    * @return
    */
   public static String getDateTimeVersionString() {
	    SimpleDateFormat df = new SimpleDateFormat("yyyyMMddhhmm");
	    java.util.Date date = new java.util.Date();
	    String DateTimeString = df.format(date);
	    return "V"+DateTimeString;
}
   /**
    * 将指定的日期对象格式化为日期字符串("yyyy-MM-dd")，结果形如:2013-09-09
    * @param date 待格式化的日期对象
    * @return
    */
  public static String getDateString(java.util.Date date ) {
	    SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
	     if(date==null)date = new java.util.Date();
	    String DateTimeString = df.format(date);
	    return DateTimeString;
}

  /**
   * 将指定的日期对象格式化为日期时间字符串("yyyy-MM-dd HH:mm:ss")，结果形如:2013-09-09 11:23:33
   * @param date 待格式化的日期对象
   * @return
   */
public static String getDateTimeString(java.util.Date date ) {
   if(date==null)
    {
	   date = java.util.Calendar.getInstance().getTime();
    }
    SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
  
    return  df.format(date);
}

/**
 * 获取当前日志时间格式"yyyyMMddHHmmss"，形如：20140908230909
 * @return
 */
  public static String getLogDateTimeString() {
	    SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
	    java.util.Date date = new java.util.Date();
	    String DateTimeString = df.format(date);
	    return DateTimeString;
}
  /**
   * 获取当前日志日期格式"yyyyMMdd"，形如:20140908
   * @return
   */
  public static String getLogDateString() {
	    SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
	    java.util.Date date = new java.util.Date();
	    String DateTimeString = df.format(date);
	    return DateTimeString;
}
 
  /**
   * 将日期对象转换为特定格式的字符串
   * @param date 日期对象
   * @param format 日期格式
   * @return
   */
  public static String getDateString(java.util.Date date, String format) {
	  if(date == null || format == null){
		  return null;
	  }
	  SimpleDateFormat sdf = new  SimpleDateFormat(format);
	  String result = sdf.format(date);
	  return result;
  }
 
  /**
   * 将符合特定格式的日期字符串转换为日期对象<br/>
   * 如果日期字符串与格式不符则返回空日期对象
   * @param str  日期字符串
   * @param format 日期格式
   * @return
   */
  public static java.util.Date stringToUtilDate(String str,String format) {
      if (str==null||format==null) {
          return null;
      }
      SimpleDateFormat sdf = new  SimpleDateFormat(format);
      java.util.Date date = null;
      try
      {
          date = sdf.parse(str);
      }
      catch(Exception e)
      {
      }
      return date;
  }
  
  /**
   * 将符合"yyyy-MM-dd HH:mm:ss"格式的日期字符串转换为日期对象<br/>
   * 如果日期字符串与格式不符则返回空日期对象
   * @param str  日期字符串
   * @return
   */
  public static java.util.Date stringToUtilDate(String str) {
      return stringToUtilDate(str,"yyyy-MM-dd HH:mm:ss");
  }
}
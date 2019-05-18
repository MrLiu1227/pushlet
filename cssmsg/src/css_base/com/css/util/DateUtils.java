package com.css.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * @author:Neptune Description:DateUtil 提供一些常用的时间转换的方法
 */
public class DateUtils {
	// 日期时间类型格式
	private static String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
	// 日期类型格式
	private static String DATE_FORMAT = "yyyy-MM-dd";
	// 时间类型的格式
	private static String TIME_FORMAT = "HH:mm:ss";
	// 注意SimpleDateFormat不是线程安全的
	private static ThreadLocal<SimpleDateFormat> ThreadDateTime = new ThreadLocal<SimpleDateFormat>();
	private static ThreadLocal<SimpleDateFormat> ThreadDate = new ThreadLocal<SimpleDateFormat>();
	private static ThreadLocal<SimpleDateFormat> ThreadTime = new ThreadLocal<SimpleDateFormat>();
	private static SimpleDateFormat dateTimeInstance() {
		SimpleDateFormat df = ThreadDateTime.get();
		if (df == null) {
			df = new SimpleDateFormat(DATETIME_FORMAT);
			ThreadDateTime.set(df);
		}
		return df;
	}
	private static SimpleDateFormat dateInstance() {
		SimpleDateFormat df = ThreadDate.get();
		if (df == null) {
			df = new SimpleDateFormat(DATE_FORMAT);
			ThreadDate.set(df);
		}
		return df;
	}
	private static SimpleDateFormat timeInstance() {
		SimpleDateFormat df = ThreadTime.get();
		if (df == null) {
			df = new SimpleDateFormat(TIME_FORMAT);
			ThreadTime.set(df);
		}
		return df;
	}
	/**
	 * 获取当前日期时间
	 * 
	 * @return 返回当前时间的字符串值
	 */
	public static String dateTime2string() {
		return dateTimeInstance().format(new Date());
	}
	/**
	 * 将指定的时间格式化成出返回
	 * 
	 * @param date
	 * @return
	 */
	public static String dateTime2string(Date date) {
		if(date==null) return "";
		return dateTimeInstance().format(date);
	}
	/**
	 * 将指定的字符串解析为时间类型
	 * 
	 * @param datestr
	 * @return
	 * @throws ParseException
	 */
	public static Date string2dateTime(String datestr) throws ParseException {
		return dateTimeInstance().parse(datestr);
	}
	/**
	 * 将指定的字符串解析为时间类型
	 * 
	 * @param format
	 * @param datestr
	 * @return
	 * @throws ParseException
	 * @return
	 */
	public static Date string2dateTime(String format, String datestr) throws ParseException {
		SimpleDateFormat df = new SimpleDateFormat(format);
		return df.parse(datestr);
	}
	/**
	 * 获取当前的日期
	 * 
	 * @return
	 */
	public static String date2string() {
		return dateInstance().format(new Date());
	}
	/**
	 * 将指定的时间格式化成出返回
	 * 
	 * @param date
	 * @return
	 */
	public static String date2string(Date date) {
		if(date==null) return "";
		return dateInstance().format(date);
	}
	/**
	 * 将时间按指定的format样式格式化返回
	 * 
	 * @param format
	 * @param date
	 * @return
	 */
	public static String date2formatString(String format, Date date) {
		SimpleDateFormat df = new SimpleDateFormat(format);
		return df.format(date);
	}
	public static String date2formatString(String format) {
		SimpleDateFormat df = new SimpleDateFormat(format);
		return df.format(new Date());
	}
	/**
	 * 将指定的字符串解析为时间类型
	 * 
	 * @param dateStr
	 * @return
	 * @throws ParseException
	 */
	public static Date string2date(String dateStr) throws ParseException {
		return dateInstance().parse(dateStr);
	}
	/**
	 * 获取当前的时间
	 * 
	 * @return
	 */
	public static String time2string() {
		return timeInstance().format(new Date());
	}
	/**
	 * 讲指定的时间格式化成出返回
	 * 
	 * @param date
	 * @return
	 */
	public static String time2string(Date date) {
		if(date==null) return "";
		return timeInstance().format(date);
	}
	/**
	 * 将指定的字符串解析为时间类型
	 * 
	 * @param dateStr
	 * @return
	 * @throws ParseException
	 */
	public static Date string2time(String dateStr) throws ParseException {
		return timeInstance().parse(dateStr);
	}
	/**
	 * 在当前时间的基础上加或减去year年
	 * 
	 * @param year
	 * @return
	 */
	public static Date addYear(int year) {
		java.util.Calendar Cal = java.util.Calendar.getInstance();
		Cal.setTime(new Date());
		Cal.add(Calendar.YEAR, year);
		return Cal.getTime();
	}
	/**
	 * 在指定的时间上加或减去几年
	 * 
	 * @param date
	 * @param year
	 * @return
	 */
	public static Date addYear(Date date, int year) {
		java.util.Calendar Cal = java.util.Calendar.getInstance();
		Cal.setTime(date);
		Cal.add(java.util.Calendar.YEAR, year);
		return Cal.getTime();
	}
	/**
	 * 在当前时间的基础上加或减去几月
	 * 
	 * @param month
	 * @return
	 */
	public static Date addMonth(int month) {
		java.util.Calendar Cal = java.util.Calendar.getInstance();
		Cal.setTime(new Date());
		Cal.add(Calendar.MONTH, month);
		return Cal.getTime();
	}
	/**
	 * 在指定的时间上加或减去几月
	 * 
	 * @param date
	 * @param month
	 * @return
	 */
	public static Date addMonth(Date date, int month) {
		java.util.Calendar Cal = java.util.Calendar.getInstance();
		Cal.setTime(date);
		Cal.add(java.util.Calendar.MONTH, month);
		return Cal.getTime();
	}
	/**
	 * 在当前时间的基础上加或减去几天
	 * 
	 * @param day
	 * @return
	 */
	public static Date addDay(int day) {
		java.util.Calendar Cal = java.util.Calendar.getInstance();
		Cal.setTime(new Date());
		Cal.add(Calendar.DAY_OF_YEAR, day);
		return Cal.getTime();
	}
	/**
	 * 在指定的时间上加或减去几天
	 * 
	 * @param date
	 * @param day
	 * @return
	 */
	public static Date addDay(Date date, int day) {
		java.util.Calendar Cal = java.util.Calendar.getInstance();
		Cal.setTime(date);
		Cal.add(java.util.Calendar.DAY_OF_YEAR, day);
		return Cal.getTime();
	}
	/**
	 * 在当前时间的基础上加或减去几小时-支持浮点数
	 * 
	 * @param hour
	 * @return
	 */
	public static Date addHour(float hour) {
		java.util.Calendar Cal = java.util.Calendar.getInstance();
		Cal.setTime(new Date());
		Cal.add(java.util.Calendar.MINUTE, (int) (hour * 60));
		return Cal.getTime();
	}
	/**
	 * 在制定的时间上加或减去几小时-支持浮点数
	 * 
	 * @param date
	 * @param hour
	 * @return
	 */
	public static Date addHour(Date date, float hour) {
		java.util.Calendar Cal = java.util.Calendar.getInstance();
		Cal.setTime(date);
		Cal.add(java.util.Calendar.MINUTE, (int) (hour * 60));
		return Cal.getTime();
	}
	/**
	 * 在当前时间的基础上加或减去几分钟
	 * 
	 * @param minute
	 * @return
	 */
	public static Date addMinute(int minute) {
		java.util.Calendar Cal = java.util.Calendar.getInstance();
		Cal.setTime(new Date());
		Cal.add(java.util.Calendar.MINUTE, minute);
		return Cal.getTime();
	}
	/**
	 * 在制定的时间上加或减去几分钟
	 * 
	 * @param date
	 * @param minute
	 * @return
	 */
	public static Date addMinute(Date date, int minute) {
		java.util.Calendar Cal = java.util.Calendar.getInstance();
		Cal.setTime(date);
		Cal.add(java.util.Calendar.MINUTE, minute);
		return Cal.getTime();
	}
	/**
	 * 判断字符串是否为日期字符串
	 * 
	 * @param date 日期字符串
	 * @return true or false
	 */
	public static boolean isDate(String date) {
		try {
			dateTimeInstance().parse(date);
			return true;
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return false;
	}
	/**
	 * 时间date1和date2的时间差-单位秒
	 * 
	 * @param date1
	 * @param date2
	 * @return 秒
	 */
	public static long subSecond(Date date1, Date date2) {
		return (date2.getTime() - date1.getTime()) / 1000;
	}
	/**
	 * 时间date1和date2的时间差-单位秒
	 * 
	 * @param date1
	 * @param date2
	 * @return 秒
	 */
	public static long subSecond(String date1, String date2) {
		long rs = 0;
		try {
			Date start = dateTimeInstance().parse(date1);
			Date end = dateTimeInstance().parse(date2);
			rs = subSecond(start, end);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return rs;
	}
	/**
	 * 时间date1和date2的时间差 -单位分钟
	 * 
	 * @param date1
	 * @param date2
	 * @return 分钟
	 */
	public static int subMinute(String date1, String date2) {
		int rs = 0;
		try {
			Date start = dateTimeInstance().parse(date1);
			Date end = dateTimeInstance().parse(date2);
			rs = subMinute(start, end);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return rs;
	}
	/**
	 * 时间date1和date2的时间差-单位分钟
	 * 
	 * @param date1
	 * @param date2
	 * @return 分钟
	 */
	public static int subMinute(Date date1, Date date2) {
		long cha = date2.getTime() - date1.getTime();
		return (int) cha / (1000 * 60);
	}
	/**
	 * 时间date1和date2的时间差-单位小时
	 * 
	 * @param date1
	 * @param date2
	 * @return 小时
	 */
	public static int subHour(Date date1, Date date2) {
		long cha = (date2.getTime() - date1.getTime()) / 1000;
		return (int) cha / (60 * 60);
	}
	/**
	 * 时间date1和date2的时间差-单位小时
	 * 
	 * @param date1
	 * @param date2
	 * @return 小时
	 */
	public static int subHour(String date1, String date2) {
		int rs = 0;
		try {
			Date start = dateTimeInstance().parse(date1);
			Date end = dateTimeInstance().parse(date2);
			rs = subHour(start, end);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return rs;
	}
	/**
	 * 时间date1和date2的时间差-单位月
	 * 
	 * @param date1
	 * @param date2
	 * @return 月
	 */
	public static int subMonth(String date1, String date2) {
		int result;
		Calendar c1 = Calendar.getInstance();
		Calendar c2 = Calendar.getInstance();
		try {
			c1.setTime(dateInstance().parse(date1));
			c2.setTime(dateInstance().parse(date2));
			int year1 = c1.get(Calendar.YEAR);
			int month1 = c1.get(Calendar.MONTH);
			int year2 = c2.get(Calendar.YEAR);
			int month2 = c2.get(Calendar.MONTH);
			if (year1 == year2) {
				result = month2 - month1;
			} else {
				result = 12 * (year2 - year1) + month2 - month1;
			}
		} catch (ParseException e) {
			e.printStackTrace();
			result = -1;
		}
		return result;
	}
	/**
	 * 时间date1和date2的时间差-单位月
	 * 
	 * @param date1
	 * @param date2
	 * @return 月
	 */
	public static int subMonth(Date date1, Date date2) {
		int result;
		Calendar c1 = Calendar.getInstance();
		Calendar c2 = Calendar.getInstance();
		c1.setTime(date1);
		c2.setTime(date2);
		int year1 = c1.get(Calendar.YEAR);
		int month1 = c1.get(Calendar.MONTH);
		int year2 = c2.get(Calendar.YEAR);
		int month2 = c2.get(Calendar.MONTH);
		if (year1 == year2) {
			result = month2 - month1;
		} else {
			result = 12 * (year2 - year1) + month2 - month1;
		}
		return result;
	}
	/**
	 * 时间date1和date2的时间差-单位年
	 * 
	 * @param date1
	 * @param date2
	 * @return 年
	 */
	public static int subYear(String date1, String date2) {
		int result;
		Calendar c1 = Calendar.getInstance();
		Calendar c2 = Calendar.getInstance();
		try {
			c1.setTime(dateInstance().parse(date1));
			c2.setTime(dateInstance().parse(date2));
			int year1 = c1.get(Calendar.YEAR);
			int year2 = c2.get(Calendar.YEAR);
			result = year2 - year1;
		} catch (ParseException e) {
			e.printStackTrace();
			result = -1;
		}
		return result;
	}
	/**
	 * 时间date1和date2的时间差-单位年
	 * 
	 * @param date1
	 * @param date2
	 * @return 年
	 */
	public static int subYear(Date date1, Date date2) {
		int result;
		Calendar c1 = Calendar.getInstance();
		Calendar c2 = Calendar.getInstance();
		c1.setTime(date1);
		c2.setTime(date2);
		int year1 = c1.get(Calendar.YEAR);
		int year2 = c2.get(Calendar.YEAR);
		result = year2 - year1;
		return result;
	}
	/**
	 * 获取俩个时间的查结果用时秒表示
	 * 
	 * @param date1
	 * @param date2
	 * @return 几小时:几分钟:几秒钟
	 * @Summary:此处可以讲计算结果包装成一个结构体返回便于格式化
	 */
	public static String subTime(Date start, Date end) {
		long sss = (end.getTime() - start.getTime()) / 1000;
		int hh = (int) sss / (60 * 60);
		int mm = (int) (sss - hh * 60 * 60) / (60);
		int ss = (int) (sss - hh * 60 * 60 - mm * 60);
		return hh + ":" + mm + ":" + ss;
	}
	public static String subTime(String date1, String date2) {
		String result = "";
		try {
			Date start = dateTimeInstance().parse(date1);
			Date end = dateTimeInstance().parse(date2);
			result = subTime(start, end);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return result;
	}
	/**
	 * 获取俩个时间的查结果用时秒表示
	 * 
	 * @param date1
	 * @param date2
	 * @return 几天-几小时:几分钟:几秒钟
	 * @Summary:此处可以讲计算结果包装成一个结构体返回便于格式化
	 */
	public static String subDate(Date start, Date end) {
		long sss = (end.getTime() - start.getTime()) / 1000;
		int dd = (int) sss / (60 * 60 * 24);
		int hh = (int) (sss - dd * 60 * 60 * 24) / (60 * 60);
		int mm = (int) (sss - dd * 60 * 60 * 24 - hh * 60 * 60) / (60);
		int ss = (int) (sss - dd * 60 * 60 * 24 - hh * 60 * 60 - mm * 60);
		return dd + "-" + hh + ":" + mm + ":" + ss;
	}
	public static String subDate(String date1, String date2) {
		String result = "";
		try {
			Date start = dateTimeInstance().parse(date1);
			Date end = dateTimeInstance().parse(date2);
			result = subDate(start, end);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return result;
	}
	/**
	 * 获取俩个时间之前的相隔的天数
	 * 
	 * @param date1
	 * @param date2
	 * @return
	 * @throws ParseException
	 */
	public static int subDay(Date date1, Date date2) {
		long cha = (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24);
		return (int) cha;
	}
	/**
	 * 获取俩个时间之前的相隔的天数
	 * 
	 * @param date1
	 * @param date2
	 * @return
	 * @throws ParseException
	 */
	public static long subDay(String date1, String date2) {
		long rs = 0;
		try {
			Date start = dateTimeInstance().parse(date1);
			Date end = dateTimeInstance().parse(date2);
			rs = subDay(start, end);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return rs;
	}
	 /** 
     * 将UTC时间转换为东八区时间 
     * @param UTCTime 
     * @return 
     */  
    public static String getLocalTimeFromUTC(String format,String UTCTime){  
        java.util.Date UTCDate = null ;  
        String localTimeStr = null ;  
        try {  
        	SimpleDateFormat df = new SimpleDateFormat(format) ;
            UTCDate = df.parse(UTCTime);  
           // format.setTimeZone(TimeZone.getTimeZone("GMT-8")) ;  
            localTimeStr = df.format(UTCDate) ;  
        } catch (ParseException e) {  
            e.printStackTrace();  
        }  
           
        return localTimeStr ;  
    }  
	private static void main(String[] args) throws ParseException {
		System.out.println("--------------date2formatString-------------------");
		System.out.println(DateUtils.date2formatString("yyyy年M月d日 HH:mm:ss"));
		System.out.println("--------------string2dateTime-------------------");
		System.out.println(DateUtils.string2dateTime("yyyy年M月d日 HH:mm:ss", "2016年5月1日 17:21:43"));
		System.out.println(DateUtils.string2dateTime("yyyy年M月d日 HH:mm:ss", "2016年5月1日 17:21:43"));
		System.out.println(DateUtils.string2dateTime("yyyy-MM-dd HH:mm:ss", "2016-05-01 11:03:40.631 UTC"));
		
		
		
		System.out.println("--------------date2string-------------------");
		System.out.println(DateUtils.date2string());
		System.out.println("--------------dateTime2string-------------------");
		System.out.println(DateUtils.dateTime2string());
		System.out.println("--------------time2string-------------------");
		System.out.println(DateUtils.time2string());
		System.out.println("--------------addDay-------------------");
		System.out.println(DateUtils.dateTime2string(DateUtils.addDay(3)));
		System.out.println(DateUtils.dateTime2string(DateUtils.addDay(-3)));
		System.out.println(DateUtils.dateTime2string(DateUtils.addDay(DateUtils.string2date("2015-04-01"), 3)));
		System.out.println("--------------addHour-------------------");
		System.out.println(DateUtils.dateTime2string(DateUtils.addHour(3)));
		System.out.println(DateUtils.dateTime2string(DateUtils.addHour(-3)));
		System.out.println(DateUtils.dateTime2string(DateUtils.addHour(DateUtils.string2date("2015-04-01"), 3)));
		System.out.println("--------------addMinute-------------------");
		System.out.println(DateUtils.dateTime2string(DateUtils.addMinute(3)));
		System.out.println(DateUtils.dateTime2string(DateUtils.addMinute(-3)));
		System.out.println(DateUtils.dateTime2string(DateUtils.addMinute(DateUtils.string2date("2015-04-01"), 3)));
		System.out.println("--------------addYear-------------------");
		System.out.println(DateUtils.dateTime2string(DateUtils.addYear(3)));
		System.out.println(DateUtils.dateTime2string(DateUtils.addYear(-3)));
		System.out.println(DateUtils.dateTime2string(DateUtils.addYear(DateUtils.string2date("2015-04-01"), 3)));
		System.out.println("--------------subSecond-------------------");
		System.out.println(DateUtils.subSecond(addDay(0), addDay(-100)));
		System.out.println("--------------subMinute-------------------");
		System.out.println(DateUtils.subMinute(addDay(0), addDay(1)));
		System.out.println("--------------subDay-------------------");
		System.out.println(DateUtils.subDay(addDay(0), addDay(5)));
		System.out.println("--------------subMonth-------------------");
		System.out.println(DateUtils.subMonth(addDay(0), addDay(61)));
		System.out.println("--------------subYear-------------------");
		System.out.println(DateUtils.subYear(addDay(0), addDay(360)));
		System.out.println("--------------subDate-------------------");
		System.out.println(DateUtils.subDate(addDay(0), addDay(1)));
		System.out.println("--------------subTime-------------------");
		System.out.println(DateUtils.subTime(addDay(0), addDay(1)));
	}
}

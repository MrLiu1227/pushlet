/*
 * Created on 2006-7-12
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package com.css.util;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
 /**
  * 日期工具类
  * @author paladin
  * @since 1.0
  */
public class DateUtil {
	
	/**
	 * 获取两个日期之间相隔的天数
	 * @param fromDate
	 * @param toDate
	 * @return
	 */
	public static final long daysInterval(Date fromDate, Date toDate) {
		return (toDate.getTime() - fromDate.getTime()) / 86400000;
	}
	/**
	 * 获取指定日期与系统日期之间相隔的天数
	 * @param fromDate
	 * @return
	 */
	public static final long daysInterval(Date fromDate) {
		if (fromDate == null)
			return 0;
		Date toDate = new Date();
		return daysInterval(fromDate, toDate);
	}
	
	/**
	 * 获取两个日期之间相隔的年数
	 * @param fromDate
	 * @param toDate
	 * @return
	 */
	public static final int yearsInterval(Date fromDate, Date toDate) {
		if (fromDate == null || toDate == null)
			return 0;
		return toDate.getYear() - fromDate.getYear();
	}
	
	
	public static final String leftDays(Date fromDate) {
		Date toDate = new Date();
		long l = daysInterval(fromDate, toDate);
		l = l * (-1) + 1;
		if (l <= 0)
			return "到期";
		return String.valueOf(l);
	}
	
	/**
	 * 获取指定日期与系统日期之间相隔的年数
	 * @param fromDate
	 * @return
	 */
	public static final int yearsInterval(Date fromDate) {
		if (fromDate == null)
			return 0;
		Date toDate = new Date();
		return yearsInterval(fromDate, toDate);
	}
	
	 /**
	  * 日期对象是否同一天
	  * @param d1
	  * @param d2
	  * @return
	  */
	public static boolean compareDate(Date d1, Date d2) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		return sdf.format(d1).equals(sdf.format(d2));
	}
	
	/**
	 * 获取特定分钟前的系统时间串，格式为"yyyy-MM-dd HH:mm"
	 * @param minutes 分钟数
	 * @return
	 */
	public static String getMinu(int minutes) {
		GregorianCalendar calTmp = new GregorianCalendar();
		calTmp.add(GregorianCalendar.MINUTE, -1 * minutes);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		return sdf.format(calTmp.getTime());
	}
	
	/**
	 * 获取特定小时前的系统时间串，格式为"yyyy-MM-dd HH:mm:ss"
	 * @param hours 小时数
	 * @return
	 */
	public static String getHour(int hours) {
		GregorianCalendar calTmp = new GregorianCalendar();
		calTmp.add(GregorianCalendar.HOUR, -1 * hours);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return sdf.format(calTmp.getTime());
	}
	
	/**
	 * 获取指定数量的天前的系统日期串，格式为"yyyy-MM-dd"
	 * @param days 天数数
	 * @return
	 */
	public static String getDate(int days) {
		GregorianCalendar calTmp = new GregorianCalendar();
		calTmp.add(GregorianCalendar.DATE, -1 * days);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		return sdf.format(calTmp.getTime());
	}
	
	public static Date getFirstWeek(Date d) {
		Calendar cal = new GregorianCalendar();
		cal.setTime(d);
		int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
		cal.add(Calendar.DATE, cal.getActualMinimum(Calendar.DAY_OF_WEEK) - dayOfWeek + 1);
		return cal.getTime();
	}
	public static Date getLastWeek(Date d) {
		Calendar cal = new GregorianCalendar();
		cal.setTime(d);
		int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
		cal.add(Calendar.DATE, cal.getActualMaximum(Calendar.DAY_OF_WEEK) - dayOfWeek + 1);
		return cal.getTime();
	}
	public static Date getFirstMonth(Date d) {
		Calendar cal = new GregorianCalendar();
		cal.setTime(d);
		int dayOfWeek = cal.get(Calendar.DAY_OF_MONTH);
		cal.add(Calendar.DATE, cal.getActualMinimum(Calendar.DAY_OF_MONTH) - dayOfWeek);
		return cal.getTime();
	}
	public static Date getLastMonth(Date d) {
		Calendar cal = new GregorianCalendar();
		cal.setTime(d);
		int dayOfWeek = cal.get(Calendar.DAY_OF_MONTH);
		cal.add(Calendar.DATE, cal.getActualMaximum(Calendar.DAY_OF_MONTH) - dayOfWeek);
		return cal.getTime();
	}
	public static Date getFirstYear(Date d) {
		Calendar cal = new GregorianCalendar();
		cal.setTime(d);
		int dayOfWeek = cal.get(Calendar.DAY_OF_YEAR);
		cal.add(Calendar.DATE, cal.getActualMinimum(Calendar.DAY_OF_YEAR) - dayOfWeek);
		return cal.getTime();
	}
	public static Date getLastYear(Date d) {
		Calendar cal = new GregorianCalendar();
		cal.setTime(d);
		int dayOfWeek = cal.get(Calendar.DAY_OF_YEAR);
		cal.add(Calendar.DATE, cal.getActualMaximum(Calendar.DAY_OF_YEAR) - dayOfWeek);
		return cal.getTime();
	}
	/**
	 *返回指定格式的字符串，默认为当前时间，格式为yyyy-MM-dd
	 */
	public static String getDateStr(Date date, String pattern){
		String p = pattern==null?"yyyy-MM-dd":pattern;
		SimpleDateFormat sdf = new SimpleDateFormat(p);
		Date d = date==null?new Date():date;
		return sdf.format(d);
	}
	public static Date getDate(String dateStr, String pattern){
		String p = pattern==null?"yyyy-MM-dd":pattern;
		SimpleDateFormat sdf = new SimpleDateFormat(p);
		Date d = null;
		try{
			d = sdf.parse(dateStr);
		}catch(Exception e){
		}
		return d;
	}
	public static Date addDate(Date date, int days){
		Date d = null;  
	    d = new Date(date.getTime() + days * 24 * 60 * 60 * 1000L);  
	    return d;  
	}
}

package com.css.msgcenter.common;

public class Constants {
	
//	msg_d_msgstatus 消息任务执行结果
//	任务状态:
//	0、无效
//	1、等待发送
//	2、发送中
//	3、发送成功
//	4、发送失败
	public static final String TASK_INVALID = "0";
	public static final String TASK_WAITING = "1";
	public static final String TASK_SENDING = "2";
	public static final String TASK_SUCCESS = "3";
	public static final String TASK_FAILED = "4";
	
//	1、已接收
//	2、已完成
	public static final String MAIN_ACCEPT = "1";
	public static final String MAIN_FINISH = "2";
	
	public static final int RES_SUCCESS = 0; 
	public static final int RES_ERROR = 1; 
	
	public static final String TYPE_EMAIL = "1";
	public static final String TYPE_IM= "2";
	public static final String TYPE_PHONE = "3";
	public static final String TYPE_LETTER = "4";
	public static final String TYPE_WX = "5";
	public static final String TYPE_MQ= "6";

//	最大发送次数
	public static final int TRY_COUNT = 3;
//	任务在队列中的最长停留时间（minute）
	public static final int MAX_TIME = 5;
	
	
}

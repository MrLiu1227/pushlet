package com.css.core.configuration;

/**
 * 系统环境常量
 * 
 * @author paladin
 * @since 1.0
 */
public final class Environment {
	/** 用户类型	 */
	public static String USERTYPE_NORMAL = "1";
	public static String USERTYPE_ADMIN = "2";
	public static String USERTYPE_SECURITY = "3";
	public static String USERTYPE_AUDITOR = "4";
	
	/** 角色类型	 */
	public static String ROLETYPE_NORMAL = "1";
	public static String ROLETYPE_ADMIN = "2";
	
	/** 功能类型	 */
	public static String FUNCTYPE_NORMAL = "1";
	public static String FUNCTYPE_ADMIN = "2";
	/**
	 * 返回成功标识
	 */
	public final static int RESULT_CODE_SUCCESS = 0;
	/**
	 * 返回失败标识
	 */
	public final static int RESULT_CODE_ERROR = 1;
	/**
	 * 返回失败标识
	 */
	public final static int RESULT_TOKEN_ERROR = 9999;
	/**
	 * 未删除常量标识
	 */
	public final static String UN_DELETE_STATE = "2";
	/**
	 * 已删除常量标识
	 */
	public final static String DELETE_STATE = "1";
	/**
	 * 当前系统标识
	 */
	public static final String CURRENT_SYSTEM_ID = "1001";
	/**
	 * 系统SessionID
	 */
	public static final String System_SessionID = "SystemSessionID_Donne";
	/**
	 * cookie中存储的用户ID
	 */
	public static final String Cookie_UserID = "cssbase_cookie";
	/**
	 * 当前登录用户对象
	 */
	public static final String SESSION_LOGIN_KEY = "sUser";
	/**
	 * 系统名称
	 */
	public static final String SYSTEM_NAME = "eclipse-cecsns-WWD";
	/**
	 * 默认加密密钥
	 */
	public static final String DEFAULT_PASSWORD = "888888";
	/**
	 * 默认失败次数
	 */
	public static final Integer DEFAULT_FAILED_COUNT = 10;
	/**
	 * 默认系统ID
	 */
	public static final String DEFAULT_SYS = "1001";
	/**
	 * 管理员标识
	 */
	public static final int SUPERADMIN = 1;
	/**
	 * 普通用户标识
	 */
	public static final int NORMALUSER = 2;
	/**
	 * 表单加密标识
	 */
	public static final String FORM_ENCRYPT_MARK = "form.encrypt";
	/**
	 * 会话加密密钥属性名
	 */
	public static final String FORM_DES_CRYPTO_KEY = "form.crypto.des.key";
	/**
	 * 默认表单加密密钥
	 */
	public static final String FORM_DES_DEF_SECRET = "EDCioui1234";
	/** 是否标识 1-是 2-否 */
	public static String TRUE = "1";
	public static String FALSE = "2";
}
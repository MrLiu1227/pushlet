package service;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


public class CSSDirectoryConfig {
	private java.util.Properties props = new java.util.Properties();
	private static CSSDirectoryConfig instance= null;
	private static Log log = LogFactory.getLog(CSSDirectoryConfig.class);
	
	public static synchronized CSSDirectoryConfig getConfigurationManager(){
		if (instance == null) {
			instance = new CSSDirectoryConfig();
			instance.init();
		}
		return instance;
	}
	
	private void init() {
		// 先装载exBaseConfig.properties文件
		try {
			props.load(CSSDirectoryConfig.class.getResourceAsStream("/cssdirectoryconfig.properties"));
		} catch (Exception e) {
			log.error("装载系统配置文件【cssdirectoryconfig.properties】失败", e);
		}
	}

	/**
	 * 获取配置参数
	 */
	public String getString(String key) {
		return props.getProperty(key);
	}
	/**
	 * 获取baseurl
	 */
	public static String getUrl() {
		return CSSDirectoryConfig.getConfigurationManager().getString("cssBaseUrl");
	}
	/**
	 * 获取sysId
	 */
	public static String getSysId() {
		return CSSDirectoryConfig.getConfigurationManager().getString("sysId");
	}
}

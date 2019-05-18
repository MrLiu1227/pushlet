package com.css.msgcenter.server;

import java.util.ResourceBundle;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class BizLog {
	private static final String on = ResourceBundle.getBundle("appconfig").getString("msgcenter.log");
	private Log log;
	
	public BizLog(Class clazz) {
		this.log = LogFactory.getLog(clazz);
	}

	public void info(String str){
		if(on.equals("on"))
			log.info(str);
	}
	public void error(String str, Exception e){
		if(on.equals("on"))
			log.error(str, e);
	}
	public void error(String str){
		if(on.equals("on"))
			log.error(str);
	}
	
}

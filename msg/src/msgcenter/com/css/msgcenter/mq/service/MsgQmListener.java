package com.css.msgcenter.mq.service;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.css.msgcenter.mq.MsgMqRecv;

public class MsgQmListener implements ServletContextListener {
	

	private static final Log log = LogFactory.getLog(MsgQmListener.class);

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		try{	
			MsgMqRecv  mmr = new MsgMqRecv();
			mmr.start();
		}catch(Exception e){			
			throw new RuntimeException(e.getMessage());	
		}
		log.info(" PluginFactory initialized ...");
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		log.info(" PluginFactory destroyed ...");
	}

	
}

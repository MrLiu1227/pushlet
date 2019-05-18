package com.css.msgcenter.client;

import java.util.ResourceBundle;

import com.caucho.hessian.client.HessianProxyFactory;
import com.css.msgcenter.common.Constants;
import com.css.msgcenter.common.Message;
import com.css.msgcenter.common.Results;
import com.css.msgcenter.server.IMessageServer;

public class MessageClient {
	private static final ResourceBundle bundle = ResourceBundle.getBundle("msgcenter");
	public static final String PUSH = bundle.getString("msgcenter.push");
	public static final String SERVER = bundle.getString("msgcenter.server");
	public static final String SYSCODE = bundle.getString("msgcenter.sysCode");
	public static final String SYSNAME = bundle.getString("msgcenter.sysName");
	public static final String SYSURL = bundle.getString("msgcenter.sysUrl");
	
	public static void push( Message message)
	{
		try {
			if(message == null)
				return;
			
			final String URL = SERVER;
			HessianProxyFactory factory = new HessianProxyFactory();
			IMessageServer mc = (IMessageServer) factory.create(IMessageServer.class, URL);
			Results res = mc.push(message);
			if (res.getStatus() == Constants.RES_SUCCESS) {
				System.out.println("==Push Success: "+URL+"=="+(res.getInfo()!=null?res.getInfo().toString():""));
			} else {
				System.out.println("==Push Failed: "+URL+"=="+(res.getInfo()!=null?res.getInfo().toString():""));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}

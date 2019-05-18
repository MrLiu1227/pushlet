package com.css.msgcenter.server.imp;

import java.util.Random;
import java.util.ResourceBundle;

import com.caucho.hessian.client.HessianProxyFactory;
import com.css.msgcenter.common.Constants;
import com.css.msgcenter.common.Results;
import com.css.msgcenter.server.BizLog;
import com.css.msgcenter.server.IAMServlet;
import com.css.msgcenter.server.IPusher;
import com.css.msgcenter.server.model.MsgMain;
import com.css.msgcenter.server.model.MsgTask;

import net.sf.json.JSONObject;

public class TestPusher implements IPusher{
	private static BizLog log = new BizLog(TestPusher.class);
	private static final String IMSERVER = ResourceBundle.getBundle("appconfig").getString("msgcenter.imserver");
	
	private MsgTask task;
	private MsgMain main;
	
	public TestPusher(MsgTask task, MsgMain main) {
		this.task = task;
		this.main = main;
	}
	@Override
	public Results send() {
		try {
//			发送
			final String URL = IMSERVER;
//			HessianProxyFactory factory = new HessianProxyFactory();
//			IAMServlet servlet = (IAMServlet) factory.create(IAMServlet.class, URL);
//			int res = servlet.push(task.toJson().toString(), main.toJson().toString());
			int res = new Random().nextInt(10) % 2;
			if (res == Constants.RES_SUCCESS) {
				log.info("==Push Success: "+URL);
			} else {
				log.info("==Push Failed: "+URL);
			}
			JSONObject resj = new JSONObject().element("receiverId", task.getReceiverId()).element("url", URL);
			return new Results(res, resj);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return new Results(Constants.RES_ERROR, new JSONObject().element("info", "exception"));
		}
	} 
	
	
	
	public static void main(String[] args){
		for(int i=0; i<10; i++) {
			System.out.println(new Random().nextInt(10));
			System.out.println(new Random().nextInt(10)% 2);
		}
	}

}

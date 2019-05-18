package com.css.msgcenter.server.imp;

import java.util.ResourceBundle;

import com.caucho.hessian.client.HessianProxyFactory;
import com.css.msgcenter.common.Constants;
import com.css.msgcenter.common.Results;
import com.css.msgcenter.server.BizLog;
import com.css.msgcenter.server.IMSendPushMessageInterface;
import com.css.msgcenter.server.IPusher;
import com.css.msgcenter.server.model.MsgMain;
import com.css.msgcenter.server.model.MsgTask;

import net.sf.json.JSONObject;

public class WxPusher implements IPusher{
	private static BizLog log = new BizLog(WxPusher.class);
	private static final String WXSERVER = ResourceBundle.getBundle("appconfig").getString("msgcenter.wxserver");
	
	private MsgTask task;
	private MsgMain main;
	
	public WxPusher(MsgTask task, MsgMain main) {
		this.task = task;
		this.main = main;
	}
	@Override
	public Results send() {
		try {
//			发送
			final String URL = WXSERVER;
			HessianProxyFactory factory = new HessianProxyFactory();
			IMSendPushMessageInterface servlet = (IMSendPushMessageInterface) factory.create(IMSendPushMessageInterface.class, URL);
			int res = servlet.sendMessage(task.toJson(), main.toJson());
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

}

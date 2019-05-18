package com.css.msgcenter.server;

import java.util.List;

import com.caucho.hessian.server.HessianServlet;
import com.caucho.services.server.ServiceContext;
import com.css.msgcenter.common.Constants;
import com.css.msgcenter.common.Message;
import com.css.msgcenter.common.Results;
import com.css.msgcenter.server.model.MsgApp;
import com.css.msgcenter.server.model.MsgAppIp;
import com.css.util.Md5Util;

import net.sf.json.JSONObject;

public class MessageServer extends HessianServlet implements IMessageServer{
	private static BizLog log = new BizLog(MessageServer.class);
	
	@Override
	public Results push(Message message) {
		try {
			if(message==null) {
				log.error("systemMsg.fieldEmpty");
				return new Results(Constants.RES_ERROR, new JSONObject().element("info", "fieldEmpty"));
			}
			
//			第三方应用合法性检验 
			Boolean appok = false; 
			MsgApp app = QueryMsg.get(MsgApp.class, Md5Util.getMD5(message.getSenderAppCode()));
			if(app != null && app.getOpenFlag().equals("1")) {
				if(!app.getCheckIp().equals("1")) {
					appok = true;
				} else {
					String ip = ServiceContext.getContextRequest().getRemoteAddr();
					List<MsgAppIp> lst = (List<MsgAppIp>) QueryMsg.idToObj(MsgAppIp.class, 
							new QueryMsg("select a.uuid from MsgAppIp a where a.appId=:appId")
							.setParameter("appId", app.getUuid()).listCache());
					if(lst != null) {
						for(MsgAppIp obj : lst) {
							if(obj.getAppSysIp().equals(ip)) {
								appok = true;
								break;
							}
						}
					}
				}
			}
			if(appok == false) {
				log.error("systemMsg.parameterError");
				return new Results(Constants.RES_ERROR, new JSONObject().element("info", "parameterError"));
			}
			
			Results res = MessageCenter.push(message);
			log.info("systemMsg.success");
			return new Results(Constants.RES_SUCCESS, new JSONObject().element("info", "success"));
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return new Results(Constants.RES_ERROR, new JSONObject().element("info", "excepttion"));
		}
	}
	
	
}

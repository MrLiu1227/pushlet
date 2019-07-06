package com.css.msgcenter.mq.service;

import com.css.app.MsgEnvironment;
import com.css.app.personalmsg.model.PersonalMsg;
import com.css.db.query.QueryCache;
import com.css.db.query.TransactionCache;
import com.css.msgcenter.common.Constants;
import com.css.msgcenter.common.Results;
import com.css.msgcenter.server.BizLog;
import com.css.msgcenter.server.MessageCenter;
import com.css.util.StringHelper;
import com.css.util.UuidUtil;
import net.sf.json.JSONObject;

import javax.jms.TextMessage;
import java.util.*;

public class MsgSaveService {
	private static BizLog log = new BizLog(MessageCenter.class);

	public static Results saveMsg(PersonalMsg message){

		TransactionCache tx = null;
		try{
			JSONObject  json =   JSONObject.fromObject(message);
			//JSONArray addrlist =   JSONArray.fromObject(json.getString("addrlist"));
			//List<Address>  addr = JSONArray.toList(addrlist, Address.class);
			PersonalMsg msg = (PersonalMsg) JSONObject.toBean(json, PersonalMsg.class);
			if(StringHelper.isEmpty(msg.getReadFlag())) {
				msg.setReadFlag(MsgEnvironment.READ_FLAG_NO);
			}
			if(StringHelper.isEmpty(msg.getDelStatus())) {
				msg.setDelStatus(MsgEnvironment.DEL_STATUS_NO);
			}
			msg.setReceiveTime(new Date());
			msg.setUuid(UuidUtil.getUuid());
			tx = new QueryCache().getTransaction();
			tx.save(msg);
			tx.commit();
			return new Results(Constants.RES_SUCCESS, new JSONObject().element("itemId", msg.getUuid()));
		} catch(Exception ex){
			ex.printStackTrace();
			if (tx != null) {
				tx.rollback();
			}
			log.error(ex.getMessage(), ex);
			return new Results(Constants.RES_ERROR, new JSONObject().element("info", "exception"));
		} 
	}
	
	

	
}

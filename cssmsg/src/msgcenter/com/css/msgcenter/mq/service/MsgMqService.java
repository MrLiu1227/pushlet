package com.css.msgcenter.mq.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import com.css.db.query.TransactionCache;
import com.css.msgcenter.common.Address;
import com.css.msgcenter.common.Constants;
import com.css.msgcenter.common.Message;
import com.css.msgcenter.common.Results;
import com.css.msgcenter.server.BizLog;
import com.css.msgcenter.server.MessageCenter;
import com.css.msgcenter.server.PushFactory;
import com.css.msgcenter.server.QueryMsg;
import com.css.msgcenter.server.model.MsgApp;
import com.css.msgcenter.server.model.MsgMain;
import com.css.msgcenter.server.model.MsgTask;
import com.css.msgcenter.server.model.MsgTaskLog;
import com.css.util.Md5Util;
import com.css.util.Messages;
import com.css.util.StringHelper;
import com.css.util.UuidUtil;

import net.sf.json.JSONObject;

public class MsgMqService {
	private static BizLog log = new BizLog(MessageCenter.class);
	public static Results push( Message message){

		TransactionCache tx = null;
		try{
			if(StringHelper.isEmpty(message.getTitle())
					||StringHelper.isEmpty(message.getSenderAppCode())
					||message.getAddrlist() == null
					||message.getAddrlist().size() < 1) {
				log.error(Messages.getString("systemMsg.parameterError"));
				return new Results(Constants.RES_ERROR, new JSONObject().element("info", "parameterError"));
			}
//			准备数据
			MsgMain item = new MsgMain();
			item.setUuid(UuidUtil.getUuid());
			item.setSender(message.getSender());
			item.setReceiver(makeReceiverNames(message));
			item.setMsgType(makeMsgTypes(message));
			item.setMsgTopic(message.getTitle());
			item.setMsgContent(message.getMessagebody());
			MsgApp app = QueryMsg.get(MsgApp.class, Md5Util.getMD5(message.getSenderAppCode()));
			item.setAppId(app.getUuid());
			Date cur = (Date) new QueryMsg("select sysdate from dual", true).uniqueResult();
			item.setFinishTime(cur);
			item.setMsgStatus(Constants.MAIN_ACCEPT);
			item.setTaskFail(0);
			item.setTaskInvalid(0);
			item.setTaskSuccess(0);
			item.setTaskSum(message.getAddrlist().size());
			
			List<MsgTask> lst = new ArrayList<MsgTask>();
			for(Address o : message.getAddrlist()) {
				MsgTask ttask = new MsgTask();
				ttask.setMsgId(item.getUuid());
				ttask.setReceiverName(o.getUesrName());
				ttask.setCreateTime(cur);
				ttask.setMsgStatus(Constants.TASK_WAITING);
				ttask.setFailCount(0);
				ttask.setUuid(UuidUtil.getUuid());
				ttask.setReceiverId(o.getAddressDetail());
				ttask.setMsgType(o.getAddressType());
				lst.add(ttask);
			}
			
			tx = new QueryMsg().getTransaction();
			tx.save(item);
			tx.save(lst);
			tx.commit();
			//执行
			for(MsgTask  task :  lst){
				send(task);
			}
			
			
			JSONObject resj = new JSONObject().element("itemId", item.getUuid());
			return new Results(Constants.RES_SUCCESS, new JSONObject().element("itemId", item.getUuid()));
		} catch(Exception ex){
			ex.printStackTrace();
			if (tx != null) {
				tx.rollback();
			}
			log.error(ex.getMessage(), ex);
			return new Results(Constants.RES_ERROR, new JSONObject().element("info", "exception"));
		} 
	}
	
	
	public static void send( MsgTask tt){
		TransactionCache tx = null;
		try{
			MsgMain mm = QueryMsg.get(MsgMain.class, tt.getMsgId());
			tx = new QueryMsg().getTransaction();
//			发送
			Results pushRes = PushFactory.create(tt, mm).send();
			Date end = (Date) new QueryMsg("select sysdate from dual", true).uniqueResult();

//			记日志
			MsgTaskLog tl = new MsgTaskLog();
			tl.setUuid(UuidUtil.getUuid());
			tl.setTaskId(tt.getUuid());
			tl.setSender(mm.getSender());
			tl.setMsgType(tt.getMsgType());
			tl.setReceiver(tt.getReceiverName());
			tl.setServerIp(java.net.InetAddress.getLocalHost().getHostAddress());
			tl.setMsgStatus(pushRes.getStatus()==Constants.RES_SUCCESS?Constants.TASK_SUCCESS:Constants.TASK_FAILED);
			tl.setMsgStatusInfo(pushRes.getInfo()!=null?pushRes.getInfo().toString():"");
			tl.setCreateTime(end);
			tx.save(tl);
			
//			处理结果
			if(pushRes.getStatus()==Constants.RES_SUCCESS) {
				tt.setFinishTime(end);
				tt.setMsgStatus(Constants.TASK_SUCCESS);
				mm.setTaskSuccess(mm.getTaskSuccess()+1);
			} else {
				tt.setFailCount(tt.getFailCount()+1);
				if(tt.getFailCount() < Constants.TRY_COUNT) {
					tt.setMsgStatus(Constants.TASK_WAITING);
				} else {
					tt.setFinishTime(end);
					tt.setMsgStatus(Constants.TASK_FAILED);
					mm.setTaskFail(mm.getTaskFail()+1);
				}
			}
			if(mm.getTaskSuccess() + mm.getTaskFail() + mm.getTaskInvalid()>= mm.getTaskSum()) {
				mm.setLastExecTime(end);
				mm.setMsgStatus(Constants.MAIN_FINISH);
			}
				
			tx.update(tt);
			tx.update(mm);
			tx.commit();
			
		} catch(Exception ex){
			if (tx != null) {
				tx.rollback();
			}
			log.error(ex.getMessage(), ex);
		}
		
	}
	
	private static String makeMsgTypes(Message message) {
		Set m = new HashSet();
		for(Address o : message.getAddrlist()) {
			if(!m.contains(o.getAddressType()))
				m.add(o.getAddressType());
		}
		Iterator ite = m.iterator();
		String str = "";
		while(ite.hasNext()){
			str += ite.next() + (ite.hasNext()?",":"");
		}
		return str;
	}

	private static String makeReceiverNames(Message message) {
		Set m = new HashSet();
		for(Address o : message.getAddrlist()) {
			if(!m.contains(o.getUesrName()))
				m.add(o.getUesrName());
		}
		Iterator ite = m.iterator();
		String str = "";
		int n = 0;
		while(ite.hasNext()){
			str += ite.next();
			if(++n>3){
				str+="...";
				break;
			}		
			str += ite.hasNext()?",":"";
		}
		return str;
	}
	
}

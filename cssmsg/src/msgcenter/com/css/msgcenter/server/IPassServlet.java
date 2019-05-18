package com.css.msgcenter.server;


import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import com.css.app.MsgEnvironment;
import com.css.app.personalmsg.model.PersonalMsg;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.caucho.hessian.server.HessianServlet;
import com.css.db.query.TransactionCache;
import com.css.msgcenter.server.model.MsgMain;
import com.css.msgcenter.server.model.MsgTask;
import com.css.util.StringHelper;
import com.css.util.UuidUtil;
import net.sf.json.JSONObject;

public class IPassServlet extends HessianServlet implements PassServlet {

	private static final long serialVersionUID = 8432249209707733179L;
	private static Log log = LogFactory.getLog(IPassServlet.class);

	@Override
	public int push(String task, String main) {
		try {/*
			List<MessagecenterAdvices> messagecenterAdvicesList = new ArrayList<MessagecenterAdvices>();
			JSONObject tj = JSONObject.fromObject(task);
			JSONObject mj = JSONObject.fromObject(main);
			//String content = mj.getString("msgContent").split("@@")[0];
			//String url = mj.getString("msgContent").split("@@")[1];
			//String contentType =mj.getString("msgContent").split("@@")[2];
			MsgTask msgTask = (MsgTask) JSONObject.toBean(tj,
					MsgTask.class);
			MsgMain msgMain = (MsgMain) JSONObject.toBean(mj,
					MsgMain.class);
			*//*MessagecenterAdvices messagecenterAdvices=new MessagecenterAdvices();
			messagecenterAdvices.setUuid(UuidUtil.getUuid());
			messagecenterAdvices.setTitle(msgMain.getMsgTopic());
			messagecenterAdvices.setContent(msgMain.getMsgContent());
			messagecenterAdvices.setContent(content);
			messagecenterAdvices.setCreateTime(msgTask.getCreateTime());
			messagecenterAdvices.setPublisherName(msgMain.getSender());
			messagecenterAdvices.setPublisherId("");
			messagecenterAdvices.setType(msgMain.getMsgType());
			messagecenterAdvices.setType(contentType);
			messagecenterAdvices.setReceiverId(msgTask.getReceiverId());
			messagecenterAdvices.setLinkUrl(url);
			messagecenterAdvices.setAppId(msgMain.getAppId());
			messagecenterAdvices.setValidUntil(msgMain.getFinishTime());*//*
			String[] msgContents = msgMain.getMsgContent().split("@@");
	        MessagecenterAdvices messagecenterAdvices = new MessagecenterAdvices();
	        messagecenterAdvices.setAppId(msgMain.getAppId());
	        messagecenterAdvices.setContent(msgContents[0]);
	        messagecenterAdvices.setCreateTime(new Date());
	        messagecenterAdvices.setLinkUrl(msgContents[1]);
	        messagecenterAdvices.setPublisherId("");
	        messagecenterAdvices.setPublisherName(msgMain.getSender());
	        messagecenterAdvices.setReceiverId(msgTask.getReceiverId());
	        messagecenterAdvices.setTitle(msgMain.getMsgTopic());
	        messagecenterAdvices.setType("2");//消息类型(公共消息：1；私人消息：2)
	        messagecenterAdvices.setValidUntil(msgMain.getFinishTime());
			
			 //若生成时间没有默认今天
            if (null==messagecenterAdvices.getCreateTime()){
                messagecenterAdvices.setCreateTime(new Date());
            }

            //公共消息处理：对应每位用户创建一条记录；
            if ("1".equals(messagecenterAdvices.getType())&& StringHelper.isEmpty(messagecenterAdvices.getReceiverId())){
                //有效期默认六个月
                if (null==messagecenterAdvices.getValidUntil()){
                    Calendar cal = Calendar.getInstance();
                    cal.setTime(messagecenterAdvices.getCreateTime());//设置起时间
                    //cal.add(Calendar.YEAR, 1);//增加一年
                    //cal.add(Calendar.DATE, 1);//增加一天
                    //cal.add(Calendar.DATE, -10);//减10天
                    cal.add(Calendar.MONTH, 6);//增加一个月
                    messagecenterAdvices.setValidUntil(cal.getTime());
                }
               *//* List<String> userIdList = IdsUser.getAllSUserIds();
                for (String userId : userIdList){
                    MessagecenterAdvices messagecenterAdvicesNew = copyMessagecenterAdvices( messagecenterAdvices, userId);
                    messagecenterAdvicesList.add(messagecenterAdvicesNew);
                    String messageClientStr = extractClientMessage(messagecenterAdvicesNew);
                    sendMessageTOClient(messageClientStr, userId);
                }*//*
            }else if ("2".equals(messagecenterAdvices.getType())&& StringHelper.isNotEmpty(messagecenterAdvices.getReceiverId())){
                messagecenterAdvices.setUuid(UuidUtil.getUuid());
                messagecenterAdvicesList.add(messagecenterAdvices);
              *//*  String messageClientStr = extractClientMessage(messagecenterAdvices);
                sendMessageTOClient(messageClientStr, messagecenterAdvices.getReceiverId());*//*
            }
//        }*/


		JSONObject mj = JSONObject.fromObject(main);
		//String content = mj.getString("messagebody");
		//String sender = mj.getString("sender");
		//String senderAppCode = mj.getString("appId");
		//String targetUser = mj.getString("receiver");
		//String title = mj.getString("title");
		//String type = mj.getString("msgType");
		String sender = mj.getString("sender");
		String senderAppCode = mj.getString("senderAppCode");
		String targetUser = mj.getString("targetUser");
		String title = mj.getString("title");
		String type = mj.getString("type");
		String content = mj.getString("msgContent").split("@@")[0];
		String url = mj.getString("msgContent").split("@@")[1];
		//String contentType =mj.getString("msgContent").split("@@")[2];
		PersonalMsg msg = new PersonalMsg();
		msg.setReceiveTime(new Date());
		msg.setDelStatus(MsgEnvironment.DEL_STATUS_NO);
		msg.setSender(sender);
		msg.setReceiver(targetUser);
		msg.setMsgType(type);
		msg.setMsgContent(content);
		msg.setMsgName(title);
		msg.setMsgUrl(url);
        TransactionCache tx = null;
        tx = new TransactionCache();
        tx.save(msg);
        tx.commit();
		return 0;
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getMessage());
			return 0;
		}
	}
}

package com.css.app.personalmsg.action;

import com.css.apps.base.user.model.SUser;
import org.slw.mvc.annotation.ModelField;

import com.css.app.MsgEnvironment;
import com.css.app.personalmsg.model.PersonalMsg;
import com.css.core.action.CssAction;
import com.css.db.page.Page;
import com.css.db.query.QueryCache;
import com.css.util.StringHelper;

import java.util.Date;

public class DirPersonalMsg extends CssAction{

	@ModelField
	private PersonalMsg item = null;
	@ModelField
	private Page page;

	private Date receiveBeginTime = null;

	private Date receiveEndTime = null;

	public DirPersonalMsg() {
		page = new Page();
		page.setCountField("a.uuid");
	}
	
	public void execute() {
			if(StringHelper.isEmpty(item.getReadFlag()))
				item.setReadFlag(MsgEnvironment.READ_FLAG_NO);
			QueryCache qc = new QueryCache("select a.uuid from PersonalMsg a " + getWhere() + getOrder());
			setWhere(qc);
			page = qc.page(page);
			page.setResults(QueryCache.idToObj(PersonalMsg.class, page.getResults()));
	}
	public String getWhere() {
		StringBuffer sb = new StringBuffer(" where 1=1");
		sb.append(" and a.delStatus =:delStatus");
		sb.append(" and a.readFlag =:readFlag");
		sb.append(" and a.receiver =:receiver");
		if (receiveBeginTime != null)
			sb.append(" and a.receiveTime >=:createBeginTime");
		if (receiveEndTime != null)
			sb.append(" and a.receiveTime <=:createEndTime");
		if (StringHelper.isNotEmpty(item.getMsgName()))
			sb.append(" and a.msgName like :msgName");
		if (StringHelper.isNotEmpty(item.getMsgKeyWord()))
			sb.append(" and a.msgKeyWord like :msgKeyWord");
		if (StringHelper.isNotEmpty(item.getSender()))
			sb.append(" and a.sender like :sender");
		if (item.getReceiveTime()!=null)
			sb.append(" and a.receiveTime = :receiveTime");
		return sb.toString();
	}
	public void setWhere(QueryCache qc) {
		qc.setParameter("delStatus", MsgEnvironment.DEL_STATUS_NO);
		qc.setParameter("readFlag", item.getReadFlag());
		qc.setParameter("receiver", sUser.getLoginName());
		if (receiveBeginTime != null)
			qc.setParameter("createBeginTime", receiveBeginTime);
		if (receiveEndTime != null)
			qc.setParameter("createEndTime", receiveEndTime);
		if (StringHelper.isNotEmpty(item.getMsgName()))
			qc.setParameter("msgName", "%" + item.getMsgName().trim() + "%");
		if (StringHelper.isNotEmpty(item.getMsgKeyWord()))
			qc.setParameter("msgKeyWord", "%" + item.getMsgKeyWord().trim() + "%");
		if (StringHelper.isNotEmpty(item.getSender()))
			qc.setParameter("sender", "%" + item.getSender().trim() + "%");
		if (item.getReceiveTime()!=null)
			qc.setParameter("receiveTime", item.getReceiveTime());
	}
	public String getOrder() {
		return StringHelper.isNotEmpty(page.getOrderByString()) ? page.getOrderByString() : " order by a.uuid";
	}
}

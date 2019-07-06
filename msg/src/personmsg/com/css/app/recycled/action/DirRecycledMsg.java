package com.css.app.recycled.action;

import org.slw.mvc.annotation.ModelField;

import com.css.app.MsgEnvironment;
import com.css.app.personalmsg.model.PersonalMsg;
import com.css.core.action.CssAction;
import com.css.db.page.Page;
import com.css.db.query.QueryCache;
import com.css.util.StringHelper;



public class DirRecycledMsg extends CssAction{

	@ModelField
	private PersonalMsg item = null;
	@ModelField
	private Page page;
	
	public DirRecycledMsg() {
		page = new Page();
		page.setCountField("a.uuid");
	}
	
	public void execute() {
			QueryCache qc = new QueryCache("select a.uuid from PersonalMsg a " + getWhere() + getOrder());
			setWhere(qc);
			page = qc.page(page);
			page.setResults(QueryCache.idToObj(PersonalMsg.class, page.getResults()));
	}
	public String getWhere() {
		StringBuffer sb = new StringBuffer(" where 1=1");
		//查找已删除
		sb.append("and a.delStatus = :delStatus" );
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
		qc.setParameter("delStatus", MsgEnvironment.DEL_STATUS_YES );
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

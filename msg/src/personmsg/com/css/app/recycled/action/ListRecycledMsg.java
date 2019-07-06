package com.css.app.recycled.action;

import java.util.ArrayList;
import java.util.List;

import org.slw.mvc.annotation.ModelField;

import com.css.app.MsgEnvironment;
import com.css.app.personalmsg.model.PersonalMsg;
import com.css.core.action.CssAction;
import com.css.db.query.QueryCache;

public class ListRecycledMsg extends CssAction{

	@ModelField
	private PersonalMsg item = null;

	@ModelField
	private List<PersonalMsg> personalMsgList = new ArrayList<PersonalMsg>();
	
	public void execute() {
			QueryCache qc = new QueryCache("select a.uuid from PersonalMsg a "+ getWhere() + getOrder());
			setWhere(qc);
			personalMsgList = api.Dao.getList(qc, PersonalMsg.class);
	}

	public String getWhere() {
		StringBuffer sb = new StringBuffer(" where 1=1");
		//查找已删除
		sb.append("and a.delStatus = :delStatus");
    return sb.toString();
	}

	public void setWhere(QueryCache qc) {
		qc.setParameter("delStatus", MsgEnvironment.DEL_STATUS_YES);
	}

	public String getOrder() {
		/*return StringHelper.isNotEmpty(page.getOrderByString()) ? page.getOrderByString() : " order by a.uuid";*/
		return "";
	}
}

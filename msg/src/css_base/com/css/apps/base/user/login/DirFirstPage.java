package com.css.apps.base.user.login;

import java.util.ArrayList;
import java.util.List;

import com.css.util.StringHelper;
import org.slw.mvc.annotation.ModelField;

import com.css.app.MsgEnvironment;
import com.css.app.personalmsg.model.PersonalMsg;
import com.css.core.action.CssAction;
import com.css.db.query.QueryCache;

public class DirFirstPage extends CssAction {

	
	@ModelField
	private PersonalMsg item = null;

	@ModelField
	private List<PersonalMsg> personalMsgList = new ArrayList<PersonalMsg>();
	
	@Override
	public void execute() throws Exception {
		QueryCache qc = new QueryCache("select a.uuid from PersonalMsg a "+ getWhere() + getOrder());
		setWhere(qc);
		personalMsgList = api.Dao.getList(qc, PersonalMsg.class);

	}
	
	public String getWhere() {
			StringBuffer sb = new StringBuffer(" where 1=1");
			sb.append("and a.delStatus = :delStatus ");
			sb.append("and a.readFlag = :readFlag");
			sb.append(" and a.receiver =:receiver");
		return sb.toString(); 
	}
	public void setWhere(QueryCache qc) {
		qc.setParameter("delStatus", MsgEnvironment.DEL_STATUS_NO);
		qc.setParameter("readFlag", MsgEnvironment.READ_FLAG_NO);
		qc.setParameter("receiver", sUser.getLoginName());
	}
	public String getOrder() {
		return " order by a.receiveTime DESC";
	}

}

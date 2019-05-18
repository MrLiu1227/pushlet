package com.css.app.personalmsg.action;

import com.css.app.MsgEnvironment;
import com.css.app.personalmsg.model.PersonalMsg;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.db.query.QueryCache;
import com.css.db.query.TransactionCache;
import com.css.util.Messages;
import com.css.util.StringHelper;

import java.util.List;

public class UpdPersonalMsgReadFlag extends CssAction {
	private String ids;

	public void execute() {
		if (StringHelper.isEmpty(ids)) 
			throw new CssException(Messages.getString("systemMsg.fieldEmpty"));

		List<String> idList = StringHelper.strToList(ids);
		List<PersonalMsg> lstObj = QueryCache.idToObj(PersonalMsg.class, idList);
		if (lstObj != null && lstObj.size() > 0) {
				for (PersonalMsg msg : lstObj){
					if(StringHelper.isEmpty(msg.getReadFlag())
							|| StringHelper.equals(msg.getReadFlag(), MsgEnvironment.DEL_STATUS_NO)){
						TransactionCache tx = new QueryCache().getTransaction();
						msg.setReadFlag(MsgEnvironment.DEL_STATUS_YES);
						tx.update(msg);
						tx.commit();
					}
				}
		}
	}
}

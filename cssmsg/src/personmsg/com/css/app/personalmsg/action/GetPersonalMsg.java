package com.css.app.personalmsg.action;

import com.css.app.MsgEnvironment;
import com.css.db.query.TransactionCache;
import org.slw.mvc.annotation.SetIgnoredField;

import com.css.app.personalmsg.model.PersonalMsg;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.db.query.QueryCache;
import com.css.util.Messages;
import com.css.util.StringHelper;

public class GetPersonalMsg extends CssAction {
	private String uuid  = null;
	@SetIgnoredField
	private PersonalMsg item = null;

	public void execute() {
			if (StringHelper.isEmpty(uuid)){
				item = new PersonalMsg();
			} else {
				item = QueryCache.get(PersonalMsg.class, uuid);
				if (item == null) 
					throw new CssException(Messages.getString("systemMsg.readError"));
				//修改阅读状态
				if(StringHelper.isEmpty(item.getReadFlag()) || item.getReadFlag().equals(MsgEnvironment.READ_FLAG_NO)){
					item.setReadFlag(MsgEnvironment.READ_FLAG_YES);
					TransactionCache tx = new QueryCache().getTransaction();
					tx.update(item);
					tx.commit();
				}
			}
	}
}

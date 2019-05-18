package com.css.app.recycled.action;

import com.css.app.personalmsg.model.PersonalMsg;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.db.query.QueryCache;
import com.css.util.Messages;
import com.css.util.StringHelper;

import org.slw.mvc.annotation.SetIgnoredField;

public class GetRecycledMsg extends CssAction {
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
			}
	}
}

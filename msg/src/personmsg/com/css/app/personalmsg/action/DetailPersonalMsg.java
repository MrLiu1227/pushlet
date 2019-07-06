package com.css.app.personalmsg.action;

import org.slw.mvc.annotation.SetIgnoredField;

import com.css.app.personalmsg.model.PersonalMsg;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.db.query.QueryCache;
import com.css.util.Messages;
import com.css.util.StringHelper;

public class DetailPersonalMsg extends CssAction {
	private String uuid  = null;
	@SetIgnoredField
	private PersonalMsg item = null;

	public void execute() {
		if (StringHelper.isEmpty(uuid)) 
			throw new CssException(Messages.getString("systemMsg.fieldEmpty"));

		item = QueryCache.get(PersonalMsg.class, uuid);
		if (item == null) 
			throw new CssException(Messages.getString("systemMsg.readError"));
	}
}

package com.css.app.personalmsg.server;

import com.css.app.personalmsg.model.PersonalMsg;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.db.query.QueryCache;
import com.css.db.query.TransactionCache;
import com.css.util.Messages;
import com.css.util.StringHelper;
import nl.justobjects.pushlet.core.Session;
import nl.justobjects.pushlet.core.SessionManager;

import java.util.List;

public class DelPushLetSession extends CssAction {
	private String id;

	public void execute() {
		if (StringHelper.isNotEmpty(id)){
			Session session = SessionManager.getInstance().getSession(id);
			if(session != null)
				session.stop();
		}
	}
}

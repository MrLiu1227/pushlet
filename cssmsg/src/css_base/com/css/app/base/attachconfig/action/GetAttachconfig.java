package com.css.app.base.attachconfig.action;

import org.slw.mvc.annotation.SetIgnoredField;

import com.css.app.base.attachconfig.model.Attachconfig;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.db.query.QueryCache;
import com.css.util.Messages;
import com.css.util.StringHelper;

public class GetAttachconfig extends CssAction {
	private String uuid = null;
	@SetIgnoredField
	private Attachconfig item = null;

	public void execute() {
		if (StringHelper.isEmpty(uuid)) {
			item = new Attachconfig();
		} else {
			item = QueryCache.get(Attachconfig.class, uuid);
			if (item == null)
				throw new CssException(Messages.getString("systemMsg.fieldEmpty"));
		}
	}

}

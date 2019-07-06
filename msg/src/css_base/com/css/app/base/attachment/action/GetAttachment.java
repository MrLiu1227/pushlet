package com.css.app.base.attachment.action;

import org.slw.mvc.annotation.SetIgnoredField;

import com.css.app.base.attachment.model.Attachment;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.db.query.QueryCache;
import com.css.util.Messages;
import com.css.util.StringHelper;

public class GetAttachment extends CssAction {
	private String uuid = null;
	@SetIgnoredField
	private Attachment item = null;

	public void execute() {
		if (StringHelper.isEmpty(uuid)) {
			item = new Attachment();
		} else {
			item = QueryCache.get(Attachment.class, uuid);
			if (item == null)
				throw new CssException(Messages.getString("systemMsg.readError"));
		}
	}

}

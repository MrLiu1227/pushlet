package com.css.app.base.attachment.action;

import org.slw.mvc.annotation.ModelField;

import com.css.app.base.attachment.model.Attachment;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.db.query.QueryCache;
import com.css.db.query.TransactionCache;
import com.css.util.Messages;
import com.css.util.StringHelper;

public class UpdAttachment extends CssAction {
	@ModelField
	private Attachment item = null;

	public void execute() {
		if (!checkField())
			throw new CssException(Messages.getString("systemMsg.fieldEmpty"));

		Attachment old = QueryCache.get(Attachment.class, item.getUuid());
		if (old == null)
			throw new CssException(Messages.getString("systemMsg.readError"));

		if (!equals(old, item)) {
			old.setFileName(item.getFileName());
			TransactionCache tx = new QueryCache().getTransaction();
			tx.update(old);
			tx.commit();
		}
	}

	public boolean checkField() {
		if (item != null)
			if (StringHelper.isNotEmpty(item.getFileName()))
				return true;
		return false;
	}

	public boolean equals(Attachment oldObj, Attachment newObj) {
		StringBuilder sb1 = new StringBuilder();
		StringBuilder sb2 = new StringBuilder();
		sb1.append(oldObj.getFileName());
		sb2.append(newObj.getFileName());
		return sb1.toString().equals(sb2.toString());
	}
}

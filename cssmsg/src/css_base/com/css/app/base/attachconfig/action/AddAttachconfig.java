package com.css.app.base.attachconfig.action;

import java.util.Set;

import org.slw.mvc.annotation.ModelField;

import com.css.app.base.attachconfig.model.Attachconfig;
import com.css.app.base.attachment.service.AttachService;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.db.query.QueryCache;
import com.css.db.query.TransactionCache;
import com.css.util.Messages;
import com.css.util.StringHelper;

public class AddAttachconfig extends CssAction {
	@ModelField
	private Attachconfig item = null;

	public void execute() {
		if (!checkField())
			throw new CssException(Messages.getString("systemMsg.fieldEmpty"));
		String uuid = AttachService.getUuid(item.getTableName(), item.getTableKey());
		item.setUuid(uuid);
		TransactionCache tx = new QueryCache().getTransaction();
		tx.save(item);
		tx.commit();
	}

	public boolean checkField() {
		if (item != null)
			if (StringHelper.isNotEmpty(item.getTableName()))
				if (StringHelper.isNotEmpty(item.getTableKey()))
					if (item.getFileLength() != null)
						if (item.getFileNumber() != null)
							if (StringHelper.isNotEmpty(item.getFileExt()))
								return true;
		return false;
	}
}

package com.css.app.base.attachconfig.action;

import org.slw.mvc.annotation.ModelField;

import com.css.app.base.attachconfig.model.Attachconfig;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.db.query.QueryCache;
import com.css.db.query.TransactionCache;
import com.css.util.Messages;
import com.css.util.StringHelper;

public class UpdAttachconfig extends CssAction {
	@ModelField
	private Attachconfig item = null;

	public void execute() {
		if (!checkField())
			throw new CssException(Messages.getString("systemMsg.fieldEmpty"));
		Attachconfig old = QueryCache.get(Attachconfig.class, item.getUuid());
		if (old == null)
			throw new CssException(Messages.getString("systemMsg.readError"));

		if (!equals(old, item)) {
			TransactionCache tx = new QueryCache().getTransaction();
			tx.update(item);
			tx.commit();
		}
	}

	public boolean checkField() {
		if (item != null)
			if (StringHelper.isNotEmpty(item.getName()))
				if (StringHelper.isNotEmpty(item.getTableName()))
					if (StringHelper.isNotEmpty(item.getTableKey()))
						if (item.getFileLength() != null)
							if (item.getFileNumber() != null)
								if (StringHelper.isNotEmpty(item.getFileExt()))
									return true;
		return false;
	}

	public boolean equals(Attachconfig oldObj, Attachconfig newObj) {
		StringBuilder sb1 = new StringBuilder();
		StringBuilder sb2 = new StringBuilder();
		sb1.append(oldObj.getName());
		sb2.append(newObj.getName());
		sb1.append(oldObj.getOrderNum());
		sb2.append(newObj.getOrderNum());
		sb1.append(oldObj.getTableName());
		sb2.append(newObj.getTableName());
		sb1.append(oldObj.getTableKey());
		sb2.append(newObj.getTableKey());
		sb1.append(oldObj.getFileLength());
		sb2.append(newObj.getFileLength());
		sb1.append(oldObj.getFileNumber());
		sb2.append(newObj.getFileNumber());
		sb1.append(oldObj.getFileExt());
		sb2.append(newObj.getFileExt());
		sb1.append(oldObj.getExtraPara());
		sb2.append(newObj.getExtraPara());
		return sb1.toString().equals(sb2.toString());
	}

}

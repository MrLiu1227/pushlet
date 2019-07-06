package com.css.apps.base.sarea.action;

import org.slw.framework.context.SlwContext;
import org.slw.mvc.annotation.ModelField;

import com.css.apps.base.sarea.model.SArea;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.core.model.tree.Folder;
import com.css.db.query.QueryCache;
import com.css.db.query.TransactionCache;
import com.css.util.Messages;
import com.css.util.StringHelper;

public class UpdSArea extends CssAction {
	@ModelField
	private SArea item = null;

	public void execute() {
		if (!checkField())
			throw new CssException(Messages.getString("systemMsg.fieldEmpty"));

		SArea old = QueryCache.get(SArea.class, item.getUuid());
		if (old == null)
			throw new CssException(Messages.getString("systemMsg.readError"));

		if (!equals(old, item)) {
			old.setCode(item.getCode());
			old.setName(item.getName());
			old.setType(item.getType());
			old.setOrderNum(item.getOrderNum());
			TransactionCache tx = new QueryCache().getTransaction();
			tx.update(old);
			tx.commit();
			Folder fi = new Folder();
			fi.setName(old.getName());
			fi.setUuid(old.getUuid());
			fi.setParentId(old.getParentId());
			SlwContext.result().set(2, null, fi);
		}
	}

	public boolean checkField() {
		if (item != null)
			if (StringHelper.isNotEmpty(item.getName()))
				if (StringHelper.isNotEmpty(item.getCode()))
					return true;
		return false;
	}

	public boolean equals(SArea oldObj, SArea newObj) {
		StringBuilder sb1 = new StringBuilder();
		StringBuilder sb2 = new StringBuilder();
		sb1.append(oldObj.getCode());
		sb2.append(newObj.getCode());
		sb1.append(oldObj.getName());
		sb2.append(newObj.getName());
		sb1.append(oldObj.getType());
		sb2.append(newObj.getType());
		sb1.append(oldObj.getOrderNum());
		sb2.append(newObj.getOrderNum());
		return sb1.toString().equals(sb2.toString());
	}
}

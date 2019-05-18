package com.css.apps.base.sarea.action;

import org.slw.mvc.annotation.ModelField;
import org.slw.framework.context.SlwContext;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.apps.base.sarea.model.SArea;
import com.css.db.query.QueryCache;
import com.css.db.query.TransactionCache;
import com.css.util.Messages;
import com.css.util.StringHelper;
import com.css.util.UuidUtil;
import com.css.core.model.tree.Folder;

public class AddSArea extends CssAction {
	@ModelField
	private SArea item = null;

	public void execute() {
		if (!checkField())
			throw new CssException(Messages.getString("systemMsg.fieldEmpty"));

		item.setUuid(UuidUtil.getUuid());
		TransactionCache tx = new QueryCache().getTransaction();
		tx.save(item);
		tx.commit();
		item.refreshParentList();
		Folder fi = new Folder();
		fi.setName(item.getName());
		fi.setUuid(item.getUuid());
		fi.setParentId(item.getParentId());
		SlwContext.result().setInfo(fi);
	}

	public boolean checkField() {
		if (item != null)
			if (StringHelper.isNotEmpty(item.getName()))
				if (StringHelper.isNotEmpty(item.getCode()))
					return true;
		return false;
	}
}

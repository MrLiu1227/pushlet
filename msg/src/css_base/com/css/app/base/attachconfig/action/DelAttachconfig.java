package com.css.app.base.attachconfig.action;

import java.util.List;

import com.css.app.base.attachconfig.model.Attachconfig;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.db.query.QueryCache;
import com.css.db.query.TransactionCache;
import com.css.util.Messages;
import com.css.util.StringHelper;

public class DelAttachconfig extends CssAction {
	private String ids;

	public void execute() {
		if (StringHelper.isEmpty(ids))
			throw new CssException(Messages.getString("systemMsg.fieldEmpty"));

		List idList = StringHelper.strToList(ids);
		List<Attachconfig> lstObj = QueryCache.idToObj(Attachconfig.class, idList);
		if (lstObj != null && lstObj.size() > 0) {
			TransactionCache tx = null;
			tx = new QueryCache().getTransaction();
			tx.delete(lstObj);
			tx.commit();
		}
	}

}

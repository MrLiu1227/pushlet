package com.css.apps.base.sarea.action;

import org.slw.framework.context.SlwContext;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.apps.base.sarea.model.SArea;
import java.util.ArrayList;
import java.util.List;
import com.css.db.query.QueryCache;
import com.css.db.query.TransactionCache;
import com.css.util.Messages;
import com.css.util.StringHelper;

public class DelSArea extends CssAction {
	private String ids;

	public void execute() {
		if (StringHelper.isEmpty(ids)) 
			throw new CssException(Messages.getString("systemMsg.fieldEmpty"));

		List<String> idList = StringHelper.strToList(ids);
		List<SArea> lstObj = QueryCache.idToObj(SArea.class, idList);
		if (lstObj != null && lstObj.size() > 0) {
			List delList = new ArrayList();
			for (SArea temp : lstObj) {
				delList.addAll(temp.getAllChildren());
				temp.refreshParentList();
			}
				TransactionCache tx = new QueryCache().getTransaction();
				tx.delete(lstObj);
				tx.delete(delList);
				tx.commit();
		}
		SlwContext.result().setInfo(idList);
	}
}

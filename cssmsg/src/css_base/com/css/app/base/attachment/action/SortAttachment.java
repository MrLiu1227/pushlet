package com.css.app.base.attachment.action;

import java.util.ArrayList;
import java.util.List;

import org.slw.mvc.annotation.ModelField;

import com.css.app.base.attachment.model.Attachment;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.db.query.QueryCache;
import com.css.db.query.TransactionCache;
import com.css.util.Messages;
import com.css.util.StringHelper;

public class SortAttachment extends CssAction {
	@ModelField
	private Attachment item = null;
	private String sortStr;

	public void execute() {
		if (StringHelper.isEmpty(sortStr))
			throw new CssException(Messages.getString("systemMsg.fieldEmpty"));

		if (!checkField())
			throw new CssException(Messages.getString("systemMsg.fieldEmpty"));

		item.initMd5Uuid();

		List<Attachment> updList = new ArrayList<Attachment>();
		String[] itemsStr = sortStr.split(",");
		int orderNum = itemsStr.length;
		for (String items : itemsStr) {
			if (StringHelper.isNotEmpty(items)) {
				Attachment tmp = QueryCache.get(Attachment.class, items);
				if (tmp != null && tmp.getMd5Uuid().equals(item.getMd5Uuid())) {
					if (tmp.getOrderNum() == null || tmp.getOrderNum() != orderNum) {
						tmp.setOrderNum(orderNum);
						updList.add(tmp);
					}
					orderNum--;
				}
			}
		}
		if (updList != null && updList.size() > 0) {
			TransactionCache tx = new QueryCache().getTransaction();
			tx.update(updList);
			tx.commit();
			item.getJionList().removeAll();
		}
	}

	public boolean checkField() {
		if (item != null)
			if (StringHelper.isNotEmpty(item.getTableName()))
				if (StringHelper.isNotEmpty(item.getTableKey()))
					if (StringHelper.isNotEmpty(item.getTableUuid()))
						return true;
		return false;
	}

}

package com.css.apps.base.sarea.action;

import com.css.core.action.CssAction;
import com.css.core.exception.CssException;

import java.util.ArrayList;
import java.util.List;

import com.css.apps.base.sarea.model.SArea;
import com.css.db.query.QueryCache;
import com.css.db.query.TransactionCache;
import com.css.util.Messages;
import com.css.util.StringHelper;

public class SaveSAreaTree extends CssAction {
	private String treeStr = null;
	public void execute() {
		if (StringHelper.isEmpty(treeStr)) 
			throw new CssException(Messages.getString("systemMsg.fieldEmpty"));

		String[] node = treeStr.split("@");
		List udpList = new ArrayList();
		for (int i = 0; i < node.length; i += 2) {
			if (StringHelper.isNotEmpty(node[i])) {
				SArea old = QueryCache.get(SArea.class, node[i]);
				if (old != null) {
					String parentId = node[i + 1];
					if (!parentId.equals(old.getParentId()) || old.getOrderNum() != i) {
						old.setParentId(parentId);
						old.setOrderNum(i);
						udpList.add(old);
					}
				}
			}
		}
		if (udpList.size() > 0) {
			TransactionCache tx = new QueryCache().getTransaction();
			tx.update(udpList);
			tx.commit();
			new SArea().refresh();
		}
	}
}

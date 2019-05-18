package com.css.apps.base.sarea.action;

import org.slw.mvc.annotation.SetIgnoredField;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.apps.base.sarea.model.SArea;
import com.css.db.query.QueryCache;
import com.css.util.Messages;
import com.css.util.StringHelper;

public class GetSArea extends CssAction {
	private String uuid = null;
	private String parentId = null;
	@SetIgnoredField
	private SArea item = null;

	public void execute() {
		if (StringHelper.isEmpty(uuid)) {
			item = new SArea();
			item.setParentId(parentId);
			item.setOrderNum(item.getParent().getChildren().size() + 1);
		} else {
			item = QueryCache.get(SArea.class, uuid);
			if (item == null)
				throw new CssException(Messages.getString("systemMsg.readError"));
		}
	}
}

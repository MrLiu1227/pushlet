package com.css.apps.base.sarea.action;

import org.slw.framework.context.SlwContext;

import com.css.apps.base.sarea.model.SArea;
import com.css.core.action.CssAction;
import com.css.core.model.tree.AbstractTree;
import com.css.db.query.QueryCache;
import com.css.util.StringHelper;

public class JsonSAreaTree extends CssAction {
	private String id;

	// 逐层加载
	public void execute() {
		if (StringHelper.isEmpty(id))
			id = "1";
		SArea item = QueryCache.get(SArea.class, id);
		String result = "1".equals(id) ? item.getJsonTreeChildren(AbstractTree.INCLUDE_SELF_YES, 1) : item.getJsonTreeChildren();
		SlwContext.result().setData(result);
	}

	// 逐层级联加载
	public void cascade() {
		if (StringHelper.isEmpty(id))
			id = "1";
		SArea item = QueryCache.get(SArea.class, id);
		String result = item.getJsonTreeChildren();
		SlwContext.result().setData(result);
	}
	// 一次性级联加载
	public void cascadeAll() {
		if (StringHelper.isEmpty(id))
			id = "1";
		SArea item = QueryCache.get(SArea.class, id);
		String result = item.toCascadeJson().toString();
		SlwContext.result().setData(result);
	}

	// 一次性加载
	public void executeAll() {
		SArea item = QueryCache.get(SArea.class, "1");
		String result = item.getJsonTreeAllChildren(AbstractTree.INCLUDE_SELF_YES, 1);
		SlwContext.result().setData(result);
	}
}

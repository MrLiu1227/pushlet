package com.css.app.base.attachconfig.action;

import org.slw.mvc.annotation.ModelField;

import com.css.app.base.attachconfig.model.Attachconfig;
import com.css.core.action.CssAction;
import com.css.db.page.Page;
import com.css.db.query.QueryCache;
import com.css.util.StringHelper;

public class DirAttachconfig extends CssAction {
	@ModelField
	private Attachconfig item = null;
	@ModelField
	private Page page;

	public DirAttachconfig() {
		page = new Page();
		page.setCountField("a.uuid");
	}

	public void execute() {
		QueryCache qc = new QueryCache("select a.uuid from Attachconfig a " + getWhere() + getOrder());
		setWhere(qc);
		page = qc.page(page);
		page.setResults(QueryCache.idToObj(Attachconfig.class, page.getResults()));
	}

	public String getWhere() {
		StringBuffer sb = new StringBuffer(" where 1=1 ");
		if (StringHelper.isNotEmpty(item.getTableName()))
			sb.append("and a.tableName like :tableName ");
		if (StringHelper.isNotEmpty(item.getTableKey()))
			sb.append("and a.tableKey like :tableKey ");
		return sb.toString();
	}

	public void setWhere(QueryCache qc) {
		if (StringHelper.isNotEmpty(item.getTableName()))
			qc.setParameter("tableName", "%" + item.getTableName().trim() + "%");
		if (StringHelper.isNotEmpty(item.getTableKey()))
			qc.setParameter("tableKey", "%" + item.getTableKey().trim() + "%");
	}

	public String getOrder() {
		return StringHelper.isNotEmpty(page.getOrderByString()) ? page.getOrderByString() : " order by a.tableName, orderNum";
	}
}

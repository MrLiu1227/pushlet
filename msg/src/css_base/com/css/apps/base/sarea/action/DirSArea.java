package com.css.apps.base.sarea.action;

import org.slw.mvc.annotation.ModelField;
import com.css.core.action.CssAction;

import com.css.apps.base.sarea.model.SArea;
import com.css.db.page.Page;
import com.css.db.query.QueryCache;
import com.css.util.StringHelper;

public class DirSArea extends CssAction {
	@ModelField
	private SArea item = null;
	@ModelField
	private Page page;

	public DirSArea() {
		page = new Page();
		page.setCountField("a.uuid");
	}

	public void execute() {
		if (StringHelper.isEmpty(item.getParentId()))
			item.setParentId("0");
		QueryCache qc = new QueryCache("select a.uuid from SArea a " + getWhere() + getOrder());
		setWhere(qc);
		page = qc.page(page);
		page.setResults(QueryCache.idToObj(SArea.class, page.getResults()));
	}

	public String getWhere() {
		StringBuffer sb = new StringBuffer(" where a.parentId = :parentId");

		if (StringHelper.isNotEmpty(item.getCode()))
			sb.append(" and a.code like :code");
		if (StringHelper.isNotEmpty(item.getName()))
			sb.append(" and a.name like :name");
		return sb.toString();
	}

	public void setWhere(QueryCache qc) {
		qc.setParameter("parentId", item.getParentId());
		if (StringHelper.isNotEmpty(item.getCode()))
			qc.setParameter("code", "%" + item.getCode().trim() + "%");
		if (StringHelper.isNotEmpty(item.getName()))
			qc.setParameter("name", "%" + item.getName().trim() + "%");
	}

	public String getOrder() {
		return StringHelper.isNotEmpty(page.getOrderByString()) ? page.getOrderByString() : " order by a.orderNum";
	}
}

package com.css.apps.base.user.common;

import org.slw.common.helper.StringHelper;
import org.slw.mvc.annotation.ModelField;

import com.css.apps.base.user.model.SUser;
import com.css.core.action.CssAction;
import com.css.db.page.Page;
import com.css.db.query.QueryCache;

public class SelectUserList extends CssAction {
	private String realName = null;
	public String funId = null;
	@ModelField
	private Page page;

	public SelectUserList() {
		page = new Page();
		page.setCountField("a.uuid");
	}

	public void execute() {
		QueryCache qc = new QueryCache("select a.uuid from SUser a " + getWhere() + getOrder());
		setWhere(qc);
		page = qc.page(page);
		page.setResults(QueryCache.idToObj(SUser.class, page.getResults()));

	}

	public String getWhere() {
		StringBuffer sb = new StringBuffer(" where 1=1 ");
		if (StringHelper.isNotEmpty(realName))
			sb.append("and a.realName like :realName ");
		return sb.toString();
	}

	public void setWhere(QueryCache qc) {
		if (StringHelper.isNotEmpty(realName))
			qc.setParameter("realName", "%" + realName + "%");
	}

	public String getOrder() {
		return StringHelper.isNotEmpty(page.getOrderByString()) ? page.getOrderByString() : " order by a.realName";
	}

}

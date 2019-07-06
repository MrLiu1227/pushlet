package com.css.app.base.attachment.action;

import org.slw.mvc.annotation.ModelField;

import com.css.app.base.attachment.model.Attachment;
import com.css.core.action.CssAction;
import com.css.db.page.Page;
import com.css.db.query.QueryCache;
import com.css.util.StringHelper;

public class DirAttachment extends CssAction {
	@ModelField
	private Attachment item = null;
	@ModelField
	private Page page;

	public DirAttachment() {
		page = new Page();
		page.setCountField("a.uuid");
	}

	public void execute() {
		QueryCache qc = new QueryCache("select a.uuid from Attachment a " + getWhere() + getOrder());
		setWhere(qc);
		page = qc.page(page);
		page.setResults(QueryCache.idToObj(Attachment.class, page.getResults()));
	}

	public String getWhere() {
		StringBuffer sb = new StringBuffer(" where 1=1 ");
		if (StringHelper.isNotEmpty(item.getTableName()))
			sb.append("and a.tableName like :tableName ");
		if (StringHelper.isNotEmpty(item.getTableKey()))
			sb.append("and a.tableKey like :tableKey ");
		if (StringHelper.isNotEmpty(item.getTableUuid()))
			sb.append("and a.tableUuid like :tableUuid ");
		if (StringHelper.isNotEmpty(item.getFileName()))
			sb.append("and a.fileName like :fileName ");
		if (StringHelper.isNotEmpty(item.getUserId()))
			sb.append("and a.userId like :userId ");
		return sb.toString();
	}

	public void setWhere(QueryCache qc) {
		if (StringHelper.isNotEmpty(item.getTableName()))
			qc.setParameter("tableName", "%" + item.getTableName().trim() + "%");
		if (StringHelper.isNotEmpty(item.getTableKey()))
			qc.setParameter("tableKey", "%" + item.getTableKey().trim() + "%");
		if (StringHelper.isNotEmpty(item.getTableUuid()))
			qc.setParameter("tableUuid", "%" + item.getTableUuid().trim() + "%");
		if (StringHelper.isNotEmpty(item.getFileName()))
			qc.setParameter("fileName", "%" + item.getFileName().trim() + "%");
		if (StringHelper.isNotEmpty(item.getUserId()))
			qc.setParameter("userId", "%" + item.getUserId().trim() + "%");
	}

	public String getOrder() {
		return StringHelper.isNotEmpty(page.getOrderByString()) ? page.getOrderByString() : " order by a.uuid";
	}
}

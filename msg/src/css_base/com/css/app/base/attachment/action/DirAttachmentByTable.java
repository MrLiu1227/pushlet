package com.css.app.base.attachment.action;

import org.slw.mvc.annotation.ModelField;

import com.css.app.base.attachment.model.Attachment;
import com.css.core.action.CssAction;
import com.css.db.page.Page;
import com.css.db.query.QueryCache;
import com.css.util.StringHelper;
import com.css.util.UuidUtil;

public class DirAttachmentByTable extends CssAction {
	private String formId = null;
	@ModelField
	private Attachment item = null;
	@ModelField
	private Page page;

	public DirAttachmentByTable() {
		page = new Page();
		page.setCountField("a.uuid");
	}

	public void execute() {
		if (StringHelper.isEmpty(formId))
			formId = UuidUtil.getUuid();
		QueryCache qc = new QueryCache("select a.uuid from Attachment a " + getWhere() + getOrder());
		setWhere(qc);
		page = qc.page(page);
		page.setResults(QueryCache.idToObj(Attachment.class, page.getResults()));
	}

	public boolean checkUpload() {
		if (item != null)
			if (StringHelper.isNotEmpty(item.getTableName()))
				if (StringHelper.isNotEmpty(item.getTableKey()))
					if (StringHelper.isNotEmpty(item.getTableUuid()))
						return true;
		return false;
	}

	public String getWhere() {
		StringBuffer sb = new StringBuffer(" where a.tableName = :tableName ");
		if (StringHelper.isNotEmpty(item.getTableKey()))
			sb.append("and a.tableKey = :tableKey ");
		if (StringHelper.isNotEmpty(item.getFileName()))
			sb.append("and a.fileName like :fileName ");
		if (StringHelper.isNotEmpty(item.getTableUuid()))
			sb.append("and a.tableUuid = :tableUuid ");
		return sb.toString();
	}

	public void setWhere(QueryCache qc) {
		qc.setParameter("tableName", item.getTableName().trim());
		if (StringHelper.isNotEmpty(item.getTableKey()))
			qc.setParameter("tableKey", item.getTableKey().trim());
		if (StringHelper.isNotEmpty(item.getTableUuid()))
			qc.setParameter("tableUuid", item.getTableUuid().trim());
		if (StringHelper.isNotEmpty(item.getFileName()))
			qc.setParameter("fileName", "%" + item.getFileName().trim() + "%");
	}

	public String getOrder() {
		return StringHelper.isNotEmpty(page.getOrderByString()) ? page.getOrderByString() : " order by a.uploadTime desc";
	}

}

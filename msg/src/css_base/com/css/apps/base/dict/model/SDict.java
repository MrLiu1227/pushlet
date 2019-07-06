package com.css.apps.base.dict.model;

import java.io.Serializable;

import com.css.apps.base.dict.service.QueryDict;
import com.css.core.model.tree.AbstractTree;
import com.css.db.query.QueryCache;

public class SDict extends AbstractTree implements Serializable {
	private String uuid;
	private String name;
	private String parentId;
	private String code;
	private String tableName;
	private String remark;
	private Integer orderNum;
	private String tableType;

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Integer getOrderNum() {
		return orderNum;
	}

	public void setOrderNum(Integer orderNum) {
		this.orderNum = orderNum;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getTableType() {
		return tableType;
	}

	public void setTableType(String tableType) {
		this.tableType = tableType;
	}

	public QueryCache getQuery() {
		return new QueryDict("select a.uuid from SDict a where a.parentId=:parentId order by a.orderNum");
	}

	public QueryCache getQuery2() {
		return new QueryDict("select a.uuid, a.parentId from SDict a order by a.orderNum");
	}

	public String getNodeId() {
		return this.uuid;
	}

	public String getNodeParentId() {
		return this.parentId;
	}

	public String getNodeName() {
		return this.name;
	}

	public String getRootId() {
		return "33b9e37e990e6e1600650ca0d4e644b1";
	}

	public String getData() {
		return this.tableName + "@" + this.code;
	}

}

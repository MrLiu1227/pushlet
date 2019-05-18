package com.css.app.base.attachconfig.model;

import java.io.Serializable;

@SuppressWarnings("serial")
public class Attachconfig implements Serializable {
	private String uuid;
	/**
	 * 业务名称
	 */
	private String name;
	/**
	 * 序号
	 */
	private Integer orderNum;
	/**
	 * 业务表名
	 */
	private String tableName;
	/**
	 * 业务关键字
	 */
	private String tableKey;
	/**
	 * 附件最大(KB)
	 */
	private Integer fileLength;
	/**
	 * 最大附件数
	 */
	private Integer fileNumber;
	/**
	 * 允许附件类型
	 */
	private String fileExt;
	/**
	 * 扩展参数
	 */
	private String extraPara;
	/**
	 * 当前附件数
	 */
	private transient String counter = "0";

	public Attachconfig() {
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getUuid() {
		return this.uuid;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getTableName() {
		return this.tableName;
	}

	public void setTableKey(String tableKey) {
		this.tableKey = tableKey;
	}

	public String getTableKey() {
		return this.tableKey;
	}

	public void setFileLength(Integer fileLength) {
		this.fileLength = fileLength;
	}

	public Integer getFileLength() {
		return this.fileLength;
	}

	public void setFileNumber(Integer fileNumber) {
		this.fileNumber = fileNumber;
	}

	public Integer getFileNumber() {
		return this.fileNumber;
	}

	public void setFileExt(String fileExt) {
		this.fileExt = fileExt;
	}

	public String getFileExt() {
		return this.fileExt;
	}

	public String getExtraPara() {
		return extraPara;
	}

	public void setExtraPara(String extraPara) {
		this.extraPara = extraPara;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getOrderNum() {
		return orderNum;
	}

	public void setOrderNum(Integer orderNum) {
		this.orderNum = orderNum;
	}

	public String getCounter() {
		return counter;
	}

	public void setCounter(String counter) {
		this.counter = counter;
	}

}
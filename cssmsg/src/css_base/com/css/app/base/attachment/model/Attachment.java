package com.css.app.base.attachment.model;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.css.app.base.attachconfig.model.Attachconfig;
import com.css.app.base.attachment.service.AttachService;
import com.css.db.query.JoinList;
import com.css.db.query.QueryCache;

@SuppressWarnings("serial")
public class Attachment implements Serializable {
	private String uuid;
	/**
	 * md5Uuid=Md5Util.MD5Encode(tableName + ',' + tableKey + ',' + tableUuid)
	 */
	private String md5Uuid;
	/**
	 * 业务表名
	 */
	private String tableName;
	/**
	 * 业务关键字
	 */
	private String tableKey;
	/**
	 * 表记录ID
	 */
	private String tableUuid;
	/**
	 * 服务器ID
	 */
	private String serverId;
	/**
	 * 附件路径
	 */
	private String fileUrl;
	/**
	 * 附件名称
	 */
	private String fileName;
	/**
	 * 附件类型
	 */
	private String fileType;
	/**
	 * 扩展名
	 */
	private String fileExt;
	/**
	 * 文件大小
	 */
	private Long fileSize;
	/**
	 * 用户ID
	 */
	private String userId;
	/**
	 * 上传时间
	 */
	private Date uploadTime;
	/**
	 * 上传时间转换为yyyy-MM-dd HH:mm:ss格式
	 */
	private String time;
	/**
	 * 排序号
	 */
	private Integer orderNum;
	/**
	 * 附件全路径
	 */
	private String fileUrlFull;
	/**
	 * 文件分类
	 */
	private String category;
	/**
	 * 扩展数据
	 */
	private String extraData;
	/**
	 * 是否加载数据
	 */
	private transient String loadData;

	public String getFullName() {
		return AttachService.getFullName(this);
	}

	public Attachment() {
	}

	public JoinList getJionList() {
		QueryCache qc = new QueryCache("select a.uuid from Attachment a where a.md5Uuid=:md5Uuid order by a.orderNum").setParameter("md5Uuid", this.md5Uuid);
		return new JoinList(Attachment.class, qc);
	}

	public List<Attachment> getAttachments() {
		return getJionList().getList();
	}

	public int getSize() {
		List<Attachment> lst = getAttachments();
		return lst.size();
	}

	public Attachconfig getAttachconfig() {
		String uuid = AttachService.getUuid(tableName, tableKey);
		return QueryCache.get(Attachconfig.class, uuid);
	}

	public void initMd5Uuid() {
		this.md5Uuid = AttachService.getMd5Uuid(this.tableName, this.tableKey, this.tableUuid);
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

	public void setTableUuid(String tableUuid) {
		this.tableUuid = tableUuid;
	}

	public String getTableUuid() {
		return this.tableUuid;
	}

	public void setServerId(String serverId) {
		this.serverId = serverId;
	}

	public String getServerId() {
		return this.serverId;
	}

	public void setFileUrl(String fileUrl) {
		this.fileUrl = fileUrl;
	}

	public String getFileUrl() {
		return this.fileUrl;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFileName() {
		return this.fileName;
	}

	public void setFileType(String fileType) {
		this.fileType = fileType;
	}

	public String getFileType() {
		return this.fileType;
	}

	public void setFileExt(String fileExt) {
		this.fileExt = fileExt;
	}

	public String getFileExt() {
		return this.fileExt;
	}

	public void setFileSize(Long fileSize) {
		this.fileSize = fileSize;
	}

	public Long getFileSize() {
		return this.fileSize;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserId() {
		return this.userId;
	}

	public void setUploadTime(Date uploadTime) {
		this.uploadTime = uploadTime;
	}

	public Date getUploadTime() {
		return this.uploadTime;
	}

	public void setOrderNum(Integer orderNum) {
		this.orderNum = orderNum;
	}

	public Integer getOrderNum() {
		return this.orderNum;
	}

	public String getMd5Uuid() {
		return md5Uuid;
	}

	public void setMd5Uuid(String md5Uuid) {
		this.md5Uuid = md5Uuid;
	}

	public String getFileUrlFull() {
		return fileUrlFull;
	}

	public void setFileUrlFull(String fileUrlFull) {
		this.fileUrlFull = fileUrlFull;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getUrl() {
		this.fileUrlFull = AttachService.getFileUrl(this);
		return fileUrlFull;
	}

	public String getExtraData() {
		return extraData;
	}

	public void setExtraData(String extraData) {
		this.extraData = extraData;
	}

	public String getLoadData() {
		return loadData;
	}

	public void setLoadData(String loadData) {
		this.loadData = loadData;
	}
}
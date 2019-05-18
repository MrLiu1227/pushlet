package com.css.msgcenter.server.model;

import java.util.Date;

import net.sf.json.JSONObject;

import com.css.msgcenter.server.MessageTools;

public class MsgTask implements java.io.Serializable {
	private String uuid;
	private String msgId;
	private String receiverName;
	private String receiverId;
	private String msgType;
	private Date createTime;
	private Date beginTime;
	private Date finishTime;
	private String msgStatus;
	private Integer failCount;
	
	public JSONObject toJson(){
		JSONObject j = new JSONObject()
			.element("uuid", uuid==null?"":uuid)
			.element("msgId", msgId==null?"":msgId)
			.element("receiverName", receiverName==null?"":receiverName)
			.element("receiverId", receiverId==null?"":receiverId)
			.element("msgType", msgType==null?"":msgType)
			.element("createTime", createTime==null?"":MessageTools.dateToStr(createTime));
		return j;
    }
	
	

	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	public String getMsgId() {
		return msgId;
	}
	public void setMsgId(String msgId) {
		this.msgId = msgId;
	}
	public String getReceiverName() {
		return receiverName;
	}
	public void setReceiverName(String receiverName) {
		this.receiverName = receiverName;
	}
	public String getReceiverId() {
		return receiverId;
	}
	public void setReceiverId(String receiverId) {
		this.receiverId = receiverId;
	}
	public String getMsgType() {
		return msgType;
	}
	public void setMsgType(String msgType) {
		this.msgType = msgType;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public Date getBeginTime() {
		return beginTime;
	}
	public void setBeginTime(Date beginTime) {
		this.beginTime = beginTime;
	}
	public Date getFinishTime() {
		return finishTime;
	}
	public void setFinishTime(Date finishTime) {
		this.finishTime = finishTime;
	}
	public String getMsgStatus() {
		return msgStatus;
	}
	public void setMsgStatus(String msgStatus) {
		this.msgStatus = msgStatus;
	}
	public Integer getFailCount() {
		return failCount;
	}
	public void setFailCount(Integer failCount) {
		this.failCount = failCount;
	}
	

	
}

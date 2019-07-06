package com.css.msgcenter.server.model;

import java.util.Date;

import net.sf.json.JSONObject;

import com.css.msgcenter.server.MessageTools;

public class MsgMain implements java.io.Serializable{
	private String uuid;
	private String appId;
	private String sender;
	private String receiver;
	private String msgType;
	private String msgTopic;
	private String msgContent;
	private Date finishTime;//接收时间
	private String msgStatus;
	private Integer taskSum;
	private Integer taskSuccess;
	private Integer taskFail;
	private Integer taskInvalid;
	private Date lastExecTime;//最后执行时间
	
	public JSONObject toJson(){
		JSONObject j = new JSONObject()
			.element("uuid", uuid==null?"":uuid)
			.element("appId", appId==null?"":appId)
			.element("sender", sender==null?"":sender)
			.element("receiver", receiver==null?"":receiver)
			.element("msgType", msgType==null?"":msgType)
			.element("msgTopic", msgTopic==null?"":msgTopic)
			.element("msgContent", msgContent==null?"":msgContent)
			.element("finishTime", finishTime==null?"":MessageTools.dateToStr(finishTime));
		return j;
    }
	
	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	public String getAppId() {
		return appId;
	}
	public void setAppId(String appId) {
		this.appId = appId;
	}
	public String getSender() {
		return sender;
	}
	public void setSender(String sender) {
		this.sender = sender;
	}
	public String getReceiver() {
		return receiver;
	}
	public void setReceiver(String receiver) {
		this.receiver = receiver;
	}
	public String getMsgType() {
		return msgType;
	}
	public void setMsgType(String msgType) {
		this.msgType = msgType;
	}
	public String getMsgTopic() {
		return msgTopic;
	}
	public void setMsgTopic(String msgTopic) {
		this.msgTopic = msgTopic;
	}
	public String getMsgContent() {
		return msgContent;
	}
	public void setMsgContent(String msgContent) {
		this.msgContent = msgContent;
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
	public Integer getTaskSum() {
		return taskSum;
	}
	public void setTaskSum(Integer taskSum) {
		this.taskSum = taskSum;
	}
	public Integer getTaskSuccess() {
		return taskSuccess;
	}
	public void setTaskSuccess(Integer taskSuccess) {
		this.taskSuccess = taskSuccess;
	}
	public Integer getTaskFail() {
		return taskFail;
	}
	public void setTaskFail(Integer taskFail) {
		this.taskFail = taskFail;
	}
	public Integer getTaskInvalid() {
		return taskInvalid;
	}
	public void setTaskInvalid(Integer taskInvalid) {
		this.taskInvalid = taskInvalid;
	}
	public Date getLastExecTime() {
		return lastExecTime;
	}
	public void setLastExecTime(Date lastExecTime) {
		this.lastExecTime = lastExecTime;
	}
	
	

}

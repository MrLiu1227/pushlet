package com.css.app.personalmsg.model;
import java.io.Serializable;
import java.util.*;
@SuppressWarnings("serial")
public class PersonalMsg implements Serializable{

	/**
	 * ID
	 */
	private String uuid;
	/**
	 * 消息名称
	 */
	private String msgName;
	/**
	 * 消息url
	 */
	private String msgUrl;
	/**
	 * 消息类型
	 */
	private String msgType;
	/**
	 * 消息内容
	 */
	private String msgContent;
	/**
	 * 消息关键字
	 */
	private String msgKeyWord;
	/**
	 * 发送者
	 */
	private String sender;
	/**
	 * 接收者
	 */
	private String receiver;
	/**
	 * 接收时间
	 */
	private Date receiveTime;
	/**
	 * 删除标志
	 */
	private String delStatus;
	/**
	 * 未读/已读
	 */
	private String readFlag;
	
	public PersonalMsg() {
	}

	
	
  public void setUuid(String uuid) {
  	this.uuid = uuid;
  }
    
  public String getUuid() {
  	return this.uuid;
  }
  public void setMsgName(String msgName) {
  	this.msgName = msgName;
  }
    
  public String getMsgName() {
  	return this.msgName;
  }
  public void setMsgUrl(String msgUrl) {
  	this.msgUrl = msgUrl;
  }
    
  public String getMsgUrl() {
  	return this.msgUrl;
  }
  public void setMsgType(String msgType) {
  	this.msgType = msgType;
  }
    
  public String getMsgType() {
  	return this.msgType;
  }
  public void setMsgContent(String msgContent) {
  	this.msgContent = msgContent;
  }
    
  public String getMsgContent() {
  	return this.msgContent;
  }
  public void setMsgKeyWord(String msgKeyWord) {
  	this.msgKeyWord = msgKeyWord;
  }
    
  public String getMsgKeyWord() {
  	return this.msgKeyWord;
  }
  public void setSender(String sender) {
  	this.sender = sender;
  }
    
  public String getSender() {
  	return this.sender;
  }
  public void setReceiver(String receiver) {
  	this.receiver = receiver;
  }
    
  public String getReceiver() {
  	return this.receiver;
  }
  public void setReceiveTime(Date receiveTime) {
  	this.receiveTime = receiveTime;
  }
    
  public Date getReceiveTime() {
  	return this.receiveTime;
  }
  public void setDelStatus(String delStatus) {
  	this.delStatus = delStatus;
  }
    
  public String getDelStatus() {
  	return this.delStatus;
  }
  public void setReadFlag(String readFlag) {
  	this.readFlag = readFlag;
  }
    
  public String getReadFlag() {
  	return this.readFlag;
  }
}
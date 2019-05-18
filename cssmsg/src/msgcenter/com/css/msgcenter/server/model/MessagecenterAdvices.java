package com.css.msgcenter.server.model;
import java.io.Serializable;
import java.util.*;
@SuppressWarnings("serial")
public class MessagecenterAdvices implements Serializable{
	/**
	 * uuid
	 */
	private String uuid;
	/**
	 * 消息标题
	 */
	private String title;
	/**
	 * 消息内容
	 */
	private String content;
	/**
	 * 消息时间
	 */
	private Date createTime;
	/**
	 * 消息发送人ID
	 */
	private String publisherId;
	/**
	 * 消息发送人
	 */
	private String publisherName;
	/**
	 * 消息类型(公共消息：1；私人消息：2)
	 */
	private String type;
	/**
	 * 消息接收人ID
	 */
	private String receiverId;
	/**
	 * 消息访问链接URL
	 */
	private String linkUrl;
	/**
	 * 消息对应的应用系统appId
	 */
	private String appId;
	/**
	 * 有效期至
	 */
	private Date validUntil;


	public MessagecenterAdvices() {
	}
  public void setUuid(String uuid) {
  	this.uuid = uuid;
  }
    
  public String getUuid() {
  	return this.uuid;
  }
  public void setTitle(String title) {
  	this.title = title;
  }
    
  public String getTitle() {
  	return this.title;
  }
  public void setContent(String content) {
  	this.content = content;
  }
    
  public String getContent() {
  	return this.content;
  }
  public void setCreateTime(Date createTime) {
  	this.createTime = createTime;
  }
    
  public Date getCreateTime() {
  	return this.createTime;
  }
  public void setPublisherId(String publisherId) {
  	this.publisherId = publisherId;
  }
    
  public String getPublisherId() {
  	return this.publisherId;
  }
  public void setPublisherName(String publisherName) {
  	this.publisherName = publisherName;
  }
    
  public String getPublisherName() {
  	return this.publisherName;
  }
  public void setType(String type) {
  	this.type = type;
  }
    
  public String getType() {
  	return this.type;
  }
  public void setReceiverId(String receiverId) {
  	this.receiverId = receiverId;
  }
    
  public String getReceiverId() {
  	return this.receiverId;
  }
  public void setLinkUrl(String linkUrl) {
  	this.linkUrl = linkUrl;
  }
    
  public String getLinkUrl() {
  	return this.linkUrl;
  }
  public void setAppId(String appId) {
  	this.appId = appId;
  }
    
  public String getAppId() {
  	return this.appId;
  }

	public Date getValidUntil() {
		return validUntil;
	}
	public void setValidUntil(Date validUntil) {
		this.validUntil = validUntil;
	}
}
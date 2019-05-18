package com.css.msgcenter.common;

/**
 * IM 消息内容
 * 
 * @author wfm
 *
 */
public class IMMessage {
	private String title = "";//标题
	private String text = "";//正文
	private String targetUser = "";//接收方用户id
	private String selfUser = "";//发送方
	private String realName = "";//发送方真实姓名
	private String type = "";//消息类型 7 8 9 10 邮件 代办 督办 日程
	private String url = "";//打开的连接 

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getTargetUser() {
		return targetUser;
	}

	public void setTargetUser(String targetUser) {
		this.targetUser = targetUser;
	}

	public String getSelfUser() {
		return selfUser;
	}

	public void setSelfUser(String selfUser) {
		this.selfUser = selfUser;
	}

	public String getRealName() {
		return realName;
	}

	public void setRealName(String realName) {
		this.realName = realName;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
}

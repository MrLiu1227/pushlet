package com.css.msgcenter.common;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;


public class Message implements Serializable {
	private String senderAppCode;
	private String sender;
	private String messagebody;
	private String title;
	private List<Address> addrlist = new ArrayList<Address>();
	
	private String targetUser = "";//接收方用户id
	private String selfUser = "";//发送方的用户id
	private String type = "";//消息类型 7 8 9 10 邮件 代办 督办 日程

	public void pushAddress( Address addr )
	{
		addrlist.add( addr );
	}
	
	public int sizeAddress()
	{
		return addrlist.size();
	}
	
	public String getSenderAppCode() {
		return senderAppCode;
	}

	public void setSenderAppCode(String senderAppCode) {
		this.senderAppCode = senderAppCode;
	}

	public String getSender() {
		return sender;
	}


	public void setSender(String sender) {
		this.sender = sender;
	}


	public String getMessagebody() {
		return messagebody;
	}
	public void setMessagebody(String messagebody) {
		this.messagebody = messagebody;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}

	public List<Address> getAddrlist() {
		return addrlist;
	}

	public void setAddrlist(List<Address> addrlist) {
		this.addrlist = addrlist;
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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
	
}

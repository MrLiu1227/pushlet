package com.css.msgcenter.server.model;

public class MsgAppIp implements java.io.Serializable{
	private String uuid;
	private String appId;
	private String appSysIp;
	
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
	public String getAppSysIp() {
		return appSysIp;
	}
	public void setAppSysIp(String appSysIp) {
		this.appSysIp = appSysIp;
	}
	
	

}

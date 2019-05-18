package com.css.msgcenter.server.model;

import java.util.Date;
import java.util.List;

import com.css.db.query.JoinList;
import com.css.db.query.QueryCache;
import com.css.msgcenter.server.QueryMsg;

public class MsgApp implements java.io.Serializable{
	private String uuid;
	private String appCode;
	private String appName;
	private String openFlag;
	private String checkIp;
	private String checkMsgType;
	private Date createdTime;
	private String memo;
	
	private transient JoinList ipList = null;
	
	
	public JoinList getIpList() {
		if (ipList == null) {
			QueryCache qc = new QueryMsg("select a.uuid from MsgAppIp a where a.appId=:appId")
				.setParameter("appId",uuid);
			ipList = new JoinList(MsgAppIp.class, qc);
		}
		return ipList;
	}
	
	public List getIpListObj() {
		return QueryMsg.idToObj(MsgAppIp.class, getIpList().getListById());
	}

	public void setIpList(JoinList ipList) {
		this.ipList = ipList;
	}
	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	public String getAppName() {
		return appName;
	}
	public void setAppName(String appName) {
		this.appName = appName;
	}
	public String getAppCode() {
		return appCode;
	}
	public void setAppCode(String appCode) {
		this.appCode = appCode;
	}
	public String getOpenFlag() {
		return openFlag;
	}
	public void setOpenFlag(String openFlag) {
		this.openFlag = openFlag;
	}
	public String getCheckIp() {
		return checkIp;
	}
	public void setCheckIp(String checkIp) {
		this.checkIp = checkIp;
	}
	public String getCheckMsgType() {
		return checkMsgType;
	}
	public void setCheckMsgType(String checkMsgType) {
		this.checkMsgType = checkMsgType;
	}
	public Date getCreatedTime() {
		return createdTime;
	}
	public void setCreatedTime(Date createdTime) {
		this.createdTime = createdTime;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	
	
}

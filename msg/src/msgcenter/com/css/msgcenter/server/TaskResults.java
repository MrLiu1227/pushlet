package com.css.msgcenter.server;

import net.sf.json.JSONObject;

public class TaskResults {
	private int status;
	private JSONObject info;
	
	public TaskResults() {
	}
	public TaskResults(int status) {
		this.status = status;
	}
	public TaskResults(int status, JSONObject info) {
		this.status = status;
		this.info = info;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public JSONObject getInfo() {
		return info;
	}
	public void setInfo(JSONObject info) {
		this.info = info;
	}
	
}

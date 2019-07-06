package com.css.msgcenter.common;

import net.sf.json.JSONObject;

public class Results implements java.io.Serializable {
	private int status;
	private JSONObject info;
	
	public Results() {
	}
	public Results(int status) {
		this.status = status;
	}
	public Results(int status, JSONObject info) {
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

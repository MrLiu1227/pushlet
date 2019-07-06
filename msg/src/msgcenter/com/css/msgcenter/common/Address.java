package com.css.msgcenter.common;

import java.io.Serializable;

public class Address implements Serializable {
	private String uesrName;
	private String addressType;
	private String addressDetail;
	
	public String getUesrName() {
		return uesrName;
	}
	public void setUesrName(String uesrName) {
		this.uesrName = uesrName;
	}
	public String getAddressDetail() {
		return addressDetail;
	}
	public void setAddressDetail(String addressDetail) {
		this.addressDetail = addressDetail;
	}
	public String getAddressType() {
		return addressType;
	}
	public void setAddressType(String addressType) {
		this.addressType = addressType;
	}
	
}

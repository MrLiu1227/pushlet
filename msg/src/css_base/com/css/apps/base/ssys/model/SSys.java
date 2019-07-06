package com.css.apps.base.ssys.model;
import java.io.Serializable;
@SuppressWarnings("serial")
public class SSys implements Serializable{
	private String sysid;
	/**
	 * 系统名称
	 */
	private String name;
	/**
	 * 访问地址
	 */
	private String url;
	/**
	 * 备注
	 */
	private String remark;
	/**
	 * 开启状态
	 */
	private String openflag;
	/**
	 * 删除标记
	 */
	private String delflag;
	/**
	 * 系统编码
	 */

	public SSys() {
	}
	
  public void setName(String name) {
  	this.name = name;
  }
    
  public String getName() {
  	return this.name;
  }
  public void setUrl(String url) {
  	this.url = url;
  }
    
  public String getUrl() {
  	return this.url;
  }
  public void setRemark(String remark) {
  	this.remark = remark;
  }
    
  public String getRemark() {
  	return this.remark;
  }
  public void setOpenflag(String openflag) {
  	this.openflag = openflag;
  }
    
  public String getOpenflag() {
  	return this.openflag;
  }
  public void setDelflag(String delflag) {
  	this.delflag = delflag;
  }
    
  public String getDelflag() {
  	return this.delflag;
  }
  public void setSysid(String sysid) {
  	this.sysid = sysid;
  }
    
  public String getSysid() {
  	return this.sysid;
  }

@Override
public String toString() {
	return "SSys [sysid=" + sysid + ", name=" + name + ", url=" + url + ", remark=" + remark + ", openflag=" + openflag
			+ ", delflag=" + delflag + "]";
}
  
  

}
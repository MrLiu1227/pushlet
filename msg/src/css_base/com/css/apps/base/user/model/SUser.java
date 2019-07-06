package com.css.apps.base.user.model;
import java.io.Serializable;
import java.util.Date;

import com.css.core.configuration.Environment;


/**
 * SUser entity. @author MyEclipse Persistence Tools
 */

@SuppressWarnings("serial")
public  class SUser implements Serializable {
	// Fields
	private String uuid;
	private String realName;
	private String loginName;
	private String reviewPwd;
	private String password;
	private String sex;
	private String mobile;
	private String phone;
	private String email;
	private String userType;
	private Integer orderNum;
	private String delFlag;
	private String openFlag;
	private Date issueDate;
	private String issueId;
	private String issueName;
	private Date editDate;
	private String remark;
	private Date lastLoginTime;
	private Integer totalLoginCount;
	private Integer failedLoginCount;
	private String orgId;//reference
	private String orgName;
	private Date editPwdTime;
	private String activeStatus;
	private Date activeDeadLine;
	private String secLevel;
	private String skinId;
	
	// Constructors
	//功能列表
	private java.util.Set<String>  functions = new java.util.HashSet<String>();
	//功能点列表
	private java.util.Set<String>  funcActions = new java.util.HashSet<String>();

	/** default constructor */
	public SUser() {
	}
	public boolean getAdmin(){
		return Environment.USERTYPE_ADMIN.equals(userType) || Environment.USERTYPE_SECURITY.equals(userType) 
			|| Environment.USERTYPE_AUDITOR.equals(userType);
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getRealName() {
		return realName;
	}

	public void setRealName(String realName) {
		this.realName = realName;
	}

	public String getLoginName() {
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	public Integer getOrderNum() {
		return orderNum;
	}

	public void setOrderNum(Integer orderNum) {
		this.orderNum = orderNum;
	}

	public String getDelFlag() {
		return delFlag;
	}

	public void setDelFlag(String delFlag) {
		this.delFlag = delFlag;
	}

	public String getOpenFlag() {
		return openFlag;
	}

	public void setOpenFlag(String openFlag) {
		this.openFlag = openFlag;
	}

	public Date getIssueDate() {
		return issueDate;
	}

	public void setIssueDate(Date issueDate) {
		this.issueDate = issueDate;
	}

	public String getIssueId() {
		return issueId;
	}

	public void setIssueId(String issueId) {
		this.issueId = issueId;
	}

	public String getIssueName() {
		return issueName;
	}

	public void setIssueName(String issueName) {
		this.issueName = issueName;
	}

	public Date getEditDate() {
		return editDate;
	}

	public void setEditDate(Date editDate) {
		this.editDate = editDate;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Date getLastLoginTime() {
		return lastLoginTime;
	}

	public void setLastLoginTime(Date lastLoginTime) {
		this.lastLoginTime = lastLoginTime;
	}

	public Integer getTotalLoginCount() {
		return totalLoginCount;
	}

	public void setTotalLoginCount(Integer totalLoginCount) {
		this.totalLoginCount = totalLoginCount;
	}

	public Integer getFailedLoginCount() {
		return failedLoginCount;
	}

	public void setFailedLoginCount(Integer failedLoginCount) {
		this.failedLoginCount = failedLoginCount;
	}

	public String getOrgId() {
		return orgId;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}	
	
	public java.util.Set<String> getFunctions() {
		return functions;
	}

	public void setFunctions(java.util.Set<String> functions) {
		if(functions!=null){
			this.functions.clear();
			this.functions.addAll(functions);
		}
	}

	public java.util.Set<String> getFuncActions() {
		return funcActions;
	}

	public void setFuncActions(java.util.Set<String> funcActions) {
		//this.funcActions = funcActions;
		if(funcActions!=null){
			this.funcActions.clear();
			this.funcActions.addAll(funcActions);
		}
	}

	public String getUserId() {
		 return this.uuid;
	}

	public void setUserId(String uid) {
		this.uuid=uid;
		
	}

	public String getType() {
		return this.userType;
	}
	
	public String getOrganId() {		 
		return this.orgId;
	}
	
	public String getStatus() {		 
		return this.openFlag;
	}

	public String getReviewPwd() {
		return reviewPwd;
	}

	public void setReviewPwd(String reviewPwd) {
		this.reviewPwd = reviewPwd;
	}

	public Date getEditPwdTime() {
		return editPwdTime;
	}

	public void setEditPwdTime(Date editPwdTime) {
		this.editPwdTime = editPwdTime;
	}

	public String getActiveStatus() {
		return activeStatus;
	}

	public void setActiveStatus(String activeStatus) {
		this.activeStatus = activeStatus;
	}

	public Date getActiveDeadLine() {
		return activeDeadLine;
	}

	public void setActiveDeadLine(Date activeDeadLine) {
		this.activeDeadLine = activeDeadLine;
	}
	
	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}
	
	public String getSecLevel() {
		return secLevel;
	}
	public void setSecLevel(String secLevel) {
		this.secLevel = secLevel;
	}
	public String getSkinId() {
		return skinId;
	}
	public void setSkinId(String skinId) {
		this.skinId = skinId;
	}
	
}
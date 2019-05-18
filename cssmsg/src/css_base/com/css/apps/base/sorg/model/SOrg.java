package com.css.apps.base.sorg.model;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.css.core.model.tree.AbstractTree;
import com.css.db.query.QueryCache;
import com.css.util.StringHelper;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * @author:fujiayu
 * @date:2019年1月22日
 * @Description:组织机构
 * 
 */
@SuppressWarnings("serial")
public class SOrg extends AbstractTree implements Serializable {
	private String uuid;
	/**
	 * 机构名称
	 */
	private String name;
	/**
	 * 父节点
	 */
	private String parentId;
	/**
	 * 序号
	 */
	private Integer orderNum;
	/**
	 * 删除标记
	 */
	private String delFlag;
	/**
	 * 开启标记
	 */
	private String openFlag;
	/**
	 * 详情描述
	 */
	private String remark;
	/**
	 * 创建时间
	 */
	private Date issueDate;
	/**
	 * 创建人ID
	 */
	private String issueId;
	/**
	 * 创建人
	 */
	private String issueName;
	/**
	 * 修改日期
	 */
	private Date editDate;
	/**
	 * 机构编码
	 */
	private String unitCode;

	private String codeName;

	public SOrg() {
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getUuid() {
		return this.uuid;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return this.name;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public String getParentId() {
		return this.parentId;
	}

	public Integer getOrderNum() {
		return orderNum;
	}

	public void setOrderNum(Integer orderNum) {
		this.orderNum = orderNum;
	}

	public void setDelFlag(String delFlag) {
		this.delFlag = delFlag;
	}

	public String getDelFlag() {
		return this.delFlag;
	}

	public void setOpenFlag(String openFlag) {
		this.openFlag = openFlag;
	}

	public String getOpenFlag() {
		return this.openFlag;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setIssueDate(Date issueDate) {
		this.issueDate = issueDate;
	}

	public Date getIssueDate() {
		return this.issueDate;
	}

	public void setIssueId(String issueId) {
		this.issueId = issueId;
	}

	public String getIssueId() {
		return this.issueId;
	}

	public void setIssueName(String issueName) {
		this.issueName = issueName;
	}

	public String getIssueName() {
		return this.issueName;
	}

	public void setEditDate(Date editDate) {
		this.editDate = editDate;
	}

	public Date getEditDate() {
		return this.editDate;
	}

	public void setUnitCode(String unitCode) {
		this.unitCode = unitCode;
	}

	public String getUnitCode() {
		return this.unitCode;
	}

	public String getCodeName() {
		return codeName;
	}

	public void setCodeName(String codeName) {
		this.codeName = codeName;
	}

	/**
	 * 实现AbstractTree定义的抽象方法，默认树型对象应至少包含nodeId, nodeParentId,
	 * nodeName等请根据实际定义类进行修改
	 */
	@Override
	public QueryCache getQuery() {
		return new QueryCache("select a.uuid from SOrg a where a.parentId=:parentId order by a.orderNum");
	}

	@Override
	public String getNodeId() {
		return this.uuid;
	}

	@Override
	public String getNodeParentId() {
		return this.parentId;
	}

	@Override
	public String getNodeName() {
		return this.name;
	}

	@Override
	public String getRootId() {
		return "0";
	}
	
	/**
	 * @Description: 在构造组织机构树时候，对于根节点带上isRoot参数 
	 * @param @param selfFlag
	 * @param @param openLevel
	 * @param @return    设定文件 
	 * @return String    返回类型 
	 */
	@SuppressWarnings("unchecked")
	public String getJsonTreeAllChildrenWithRoot(int selfFlag, int openLevel) {
		return getRoleJsonTreeByList(super.getAllChildren(selfFlag), openLevel);
	}
	
	/**
	 * 对于根节点，构造树的时候带上isRoot参数
	 */
	public String getRoleJsonTreeByList(List<AbstractTree> lst, int openLevel) {
		Map<String, Integer> levelMap = new HashMap<String, Integer>();
		JSONArray jsonArray = new JSONArray();
		for (AbstractTree tree : lst) {
			JSONObject one = new JSONObject();
			one.put("id", tree.getNodeId());
			one.put("value", tree.getNodeId());
			one.put("name", tree.getNodeName());
			if(StringHelper.equals(tree.getNodeParentId(), "0")){
				one.put("isRoot", true);
			}
			one.put("isOrg","1");
			one.put("pId", tree.getNodeParentId());
			one.put("isLeaf", tree.isLeaf());
			Integer level = levelMap.get(tree.getNodeParentId());
			level = (level == null) ? 0 : level + 1;
			levelMap.put(tree.getNodeId(), level);
			one.put("open", openLevel < 0 || level < openLevel);
			jsonArray.add(one);
		}
		return jsonArray.toString();
	}
	
}
package com.css.apps.base.sarea.model;
import java.io.Serializable;

import com.css.core.model.tree.AbstractTree;
import com.css.db.query.QueryCache;

@SuppressWarnings("serial")
public class SArea  extends AbstractTree implements Serializable{
	/**
	 * 编号
	 */
	private String uuid;
	/**
	 * 父级编号
	 */
	private String parentId;
	/**
	 * 名称
	 */
	private String name;
	/**
	 * 排序
	 */
	private Integer orderNum;
	/**
	 * 区域编码
	 */
	private String code;
	/**
	 * 区域类型
	 */
	private String type;

	public SArea() {
	}
	

  	public void setUuid(String uuid) {
  		this.uuid = uuid;
  	}
    
  	public String getUuid() {
  		return this.uuid;
  	}
  	public void setParentId(String parentId) {
  		this.parentId = parentId;
  	}
    
  	public String getParentId() {
  		return this.parentId;
  	}
  	public void setName(String name) {
  		this.name = name;
  	}
    
  	public String getName() {
  		return this.name;
  	}
  	public void setOrderNum(Integer orderNum) {
  		this.orderNum = orderNum;
  	}
    
  	public Integer getOrderNum() {
  		return this.orderNum;
  	}
  	public void setCode(String code) {
  		this.code = code;
  	}
    
  	public String getCode() {
  		return this.code;
  	}
  	public void setType(String type) {
  		this.type = type;
  	}
    
  	public String getType() {
  		return this.type;
  	}
/**
 * 实现AbstractTree定义的抽象方法，默认树型对象应至少包含nodeId, nodeParentId, nodeName等请根据实际定义类进行修改
 */
  @Override
	public QueryCache getQuery() {
		return new QueryCache("select a.uuid from SArea a where a.parentId=:parentId order by a.orderNum");
		//return new QueryCache("select a.uuid, a.parentId from SArea a order by a.orderNum");
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
}
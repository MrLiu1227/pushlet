package com.css.webbase.tags;
import javax.servlet.jsp.JspTagException;

import org.slw.common.helper.StringHelper;
import org.slw.mvc.view.tag.WebWorkTagSupport;
@SuppressWarnings("serial")
public abstract class CssUISupport extends WebWorkTagSupport{
	//列数据对应属性名称
	private String name=null;
	//标题
	private String caption = null;		
	//样式属性
	private String style = null;
	//样式类
	private String css = null;	 
	//是否可见
	private String visible="true";
	//是否可用
	private boolean disabled =false;
	//其它属性,附加在标签中
	private String attributes=null;
	 
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getCaption() {
		return caption;
	}
	public void setCaption(String caption) {
		this.caption = caption;
	}
	public String getStyle() {
		return style;
	}
	public void setStyle(String style) {
		this.style = style;
	}
	public String getCss() {
		return css;
	}
	public void setCss(String cssClass) {
		this.css = cssClass;
	}		 
	public String getVisible() {
		return visible;
	}
	public void setVisible(String visible) {
		this.visible = visible;
	}
 
	/**
	 * 返回如何处理子标签
	 */
	public int doStartTag() throws JspTagException {
		if(isContainer() && hasPrivilege())
			return EVAL_BODY_AGAIN; 
		else
			return SKIP_BODY;
	}
		
	public int doEndTag() throws JspTagException {
		//无权限则直接跳过整个form
		//if(!hasPrivilege())	return SKIP_BODY;
		//处理可见性
		{
			if(StringHelper.isEmpty(visible))
				return SKIP_BODY;
			visible = visible.trim();
			if("false".equalsIgnoreCase(visible))
				return SKIP_BODY;
			if(!"true".equalsIgnoreCase(visible)){
				Object visibleValue=super.findValue(visible);
			    if(visibleValue==null || StringHelper.isEmpty(visibleValue.toString())){
			    	return SKIP_BODY;
			    }	
			    if(!visibleValue.toString().trim().equals("true"))
			    	return SKIP_BODY;	
			}
		}
		try{		 
		        pageContext.getOut().print(getHtmlContent());    		
    	}catch(Exception e){
    		//控制台抛出异常
    		e.printStackTrace();
    	}
		return EVAL_PAGE;
	}	 
	
	protected abstract String getHtmlContent()throws JspTagException;
	
	/**
	 * 是否容器控件
	 * @return
	 */
	protected   boolean isContainer(){
		return false;
	}
 	
	public void release(){
		super.release();
	}
	/**
	 * 是否拥有权限
	 * @return
	 */
	protected boolean hasPrivilege(){
		return true;
	}
	
	
	public String getAttributes() {
		return attributes;
	}
	public void setAttributes(String attributes) {
		this.attributes = attributes;
	}
	
	public boolean isDisabled() {
		return disabled;
	}
	public void setDisabled(boolean disable) {
		this.disabled = disable;
	}	
	
}

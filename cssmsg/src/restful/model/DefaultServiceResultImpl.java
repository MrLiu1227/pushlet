package model;

@SuppressWarnings("serial")
public class DefaultServiceResultImpl<T> implements IServiceResult<T> {	 
	//其它状态码
	private int resultCode;
	private String resultDesc;
	//结果对象
	private T resultObject;
	public int getResultCode() {
		return resultCode;
	}
	public void setResultCode(int resultCode) {
		this.resultCode = resultCode;
	}
	public String getResultDesc() {
		return resultDesc;
	}
	public void setResultDesc(String resultDesc) {
		this.resultDesc = resultDesc;
	}
	public T getResultObject() {
		return resultObject;
	}
	public void setResultObject(T resultObject) {
		this.resultObject = resultObject;
	}
 	
	/**
	 * 返回Action结果串,带扩展完善;最好让客户端与后端action返回一致，减少解析
	 */
	public String toActionResult(){	 
		if(this.resultCode==RESULT_ERROR || this.resultCode==RESULT_UNAUTHORIZED || this.resultCode==RESULT_UNKNOWN){
			return "error";
		}else if(this.resultCode==RESULT_UNLOGON ){
			return "login";
		}
		else  
			return "success";	 
	}

	/**
	 * 返回json响应结果：<br/>
		若resultObject的值为字符串，则返回结果形如：<br/>
		{"result":0,"msg":"操作成功!","info":"xxx"}<br/>
		若resultObject的值为Map对象，则返回结果形如：<br/>
		{"result":0,"msg":"操作成功!","info":{"name":"paladin","age":23}}<br/>
		即只要info参数有值，则会转换成为符合json规范的值<br/>
	 */
	public String toJson() {		 
		return Ajax.JSONResult(resultCode, resultDesc, (Object)resultObject);
	}

}
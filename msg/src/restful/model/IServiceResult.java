package model;
/**
 * 服务返回结果
 * @author paladin
 *
 * @param <R> 处理结果编码类型
 * @param <T> 返回的对象类型
 */
public interface IServiceResult<T> extends java.io.Serializable,IJson{
	 //处理成功
	 int RESULT_OK=0;
	 //业务失败
	 int RESULT_FAILED=1;
	 //系统错误
	 int RESULT_ERROR=2;
	 //尚未登录
	 int RESULT_UNLOGON=3;
	 //无权限
	 int RESULT_UNAUTHORIZED=4;	 
	 //未知错误
	 int RESULT_UNKNOWN=9;
	
	 /*
	 * @return 业务逻辑编码
	 */
	public int getResultCode();
 
	/**
	 * 操作结果描述
	 * @return
	 */
	public String getResultDesc();
	 
	/**
	 * 操作返回业务对象
	 * @return
	 */
	public T getResultObject() ;
	
	/**
	 * 返回动作结果
	 * @return
	 */
	public String toActionResult();
}
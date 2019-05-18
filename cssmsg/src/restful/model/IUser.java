package model;
public interface IUser extends java.io.Serializable{
	/**用户ID**/
	String getUserId();
	/**用户登录名**/
	String getLoginName();
	/**用户真实姓名**/
	String getRealName();
	/**用户密码**/
	String getPassword();
	/**用户类型**/
	String getType();
	/**电话**/
	String getPhone();
	/**机构ID**/
	String getOrganId();
	/**用户状态**/
	String getStatus();
	/**权限列表**/
	java.util.Set<String> getFuncActions();
	/**功能列表**/
	java.util.Set<String> getFunctions();
}
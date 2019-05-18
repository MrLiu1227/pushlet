package service;

import org.slw.rest.client.RestClient;
import org.slw.rest.client.RestRequest;
import org.slw.rest.client.RestResponse;

import com.css.core.exception.CssException;
import com.css.util.Messages;

public class SUserResult {

	private static String serverUri = CSSDirectoryConfig.getUrl()+"suser";
	private static RestClient client = new RestClient();
	
	public static String check(String loginName,String password){
		String url =serverUri+"/check";
		RestRequest request = new RestRequest(url);
		request.addParams("loginName", loginName);
		request.addParams("password", password);
		RestResponse response = client.get(request);
		if(!response.isSuccessful())
			throw new CssException( Messages.getString("slw.message"));
		return response.getBody();	
	}
	public static String getAuth(String loginName){
		String url =serverUri+"/getAuth";
		RestRequest request = new RestRequest(url);
		request.addParams("loginName", loginName);
		RestResponse response = client.get(request);
		if(!response.isSuccessful())
			throw new CssException( Messages.getString("slw.message"));
		return response.getBody();	
	}


	/**
	 * 获取能登录的人员List
	 * @return
	 */
	public static String getLoginUserListBySysId() {
		String url =serverUri+"/getLoginUserListBySysId";
		RestRequest request = new RestRequest(url);
		String sysId = CSSDirectoryConfig.getSysId();
		request.addParams("sysId", sysId);
		RestResponse response = client.get(request);
		if(!response.isSuccessful())
			throw new CssException( Messages.getString("slw.message"));
		return response.getBody();
	}
	
	public static String updUserPassword(String oldPassword, String newPassword, String userId){
		String url =serverUri+"/updUserPassword";
		RestRequest request = new RestRequest(url);
		request.addParams("oldPassword", oldPassword);
		request.addParams("newPassword", newPassword);
		request.addParams("userId", userId);
		RestResponse response = client.post(request);
		if(!response.isSuccessful())
			throw new CssException( Messages.getString("slw.message"));
		return response.getBody();	
	}

	/**
	 * 根据id查询用户
	 */
	public static String getUserById(String id) {
		RestRequest request = new RestRequest(serverUri + "/getUser");
		request.addParams("userId", id);
		RestResponse response = client.get(request);
		if(!response.isSuccessful())
			throw new CssException( Messages.getString("slw.message"));
		return response.getBody();
	}

	public static void main(String[] args) {

		System.out.println(	getUserById("4028812e473e19d101473e1d56bc0001"));
	}

}

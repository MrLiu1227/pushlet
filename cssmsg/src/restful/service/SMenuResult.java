package service;

import org.slw.rest.client.RestClient;
import org.slw.rest.client.RestRequest;
import org.slw.rest.client.RestResponse;

import com.css.core.exception.CssException;
import com.css.util.Messages;
import com.css.util.StringHelper;

public class SMenuResult {
	private static String serverUri = CSSDirectoryConfig.getUrl()+"smenu";
	private static RestClient client = new RestClient();
	
	/**
	 * 根据用户id 和 系统id  获取左侧菜单
	 * @param userId
	 * @param sysId
	 * @return
	 */
	public static String getUserMenu(String userId,String sysId){
		String url =serverUri+"/getUserMenu";
		RestRequest request = new RestRequest(url);
		request.addParams("userId", userId);
		if(StringHelper.isEmpty(sysId))
			sysId = CSSDirectoryConfig.getSysId();
		request.addParams("sysId", sysId);
		RestResponse response = client.get(request);

		if(!response.isSuccessful())
			throw new CssException( Messages.getString("slw.message"));
		return response.getBody();	
	}
	/**
	 * 根据用户id获取快捷入口 
	 * @param sysId
	 * @return
	 */
	public static String getFastMenuList(String sysId,String userId){
		String url =serverUri+"/getFastMenuListByUser";
		RestRequest request = new RestRequest(url);
		if(StringHelper.isEmpty(sysId))
			sysId = CSSDirectoryConfig.getSysId();
		request.addParams("sysId", sysId);
		request.addParams("userId", userId);
		RestResponse response = client.get(request);
		if(!response.isSuccessful())
			throw new CssException( Messages.getString("slw.message"));
		return response.getBody();	
	}
	public static void main(String[] args) {
		String fastMenuList = getUserMenu("40dd5337111f4d64875b748f06d66cd8","1016");
		System.out.println(fastMenuList);
	}
}

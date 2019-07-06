package service;

import org.slw.rest.client.RestClient;
import org.slw.rest.client.RestRequest;
import org.slw.rest.client.RestResponse;

import com.css.apps.base.sorg.model.SOrg;
import com.css.core.exception.CssException;
import com.css.util.Messages;
import com.google.gson.Gson;

/**
 * @author:fujiayu
 * @date:2019年1月22日
 * @Description:组织机构rest
 * 
 */
public class SOrgResult {
	private static String serverUri = CSSDirectoryConfig.getUrl()+"sorg";
	private static RestClient client = new RestClient();

	/**
	 * 获取能登录的人员组织
	 * @return
	 */
	@SuppressWarnings("rawtype")
	public static String getOrgByOrgId(String orgId){
		String url =serverUri+"/getOrg";
		RestRequest request = new RestRequest(url);
		request.addParams("orgId", orgId);
		RestResponse response = client.get(request);
		if(!response.isSuccessful())
			throw new CssException( Messages.getString("slw.message"));
		return response.getBody();	
	}
	/**
	 * @Description 获取能登录的人员组织名称
	 * @return
	 */
	public static String getOrgName(String orgId){
		String orgJson=getOrgByOrgId(orgId);
		Gson gson = new Gson();
		SOrg org=gson.fromJson(orgJson, SOrg.class);
		return org.getName();
	}
	public static void main(String[] args) {
		String string=getOrgName("defb8c785e82494b84296a4b354d0ba6");
		
		System.out.println(string);
	}
}

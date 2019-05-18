package service;

import java.lang.reflect.Type;
import java.util.List;

import org.slw.rest.client.RestClient;
import org.slw.rest.client.RestRequest;
import org.slw.rest.client.RestResponse;

import com.css.apps.base.ssys.model.SSys;
import com.css.core.exception.CssException;
import com.css.util.Messages;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class SSysResult {
	private static String serverUri = CSSDirectoryConfig.getUrl()+"ssys";
	private static RestClient client = new RestClient();
//	private static DefaultIdsService ssysService = new DefaultIdsService();
	
	/**
	 * 根据用户id  获取用户所属系统
	 * @param userId
	 * @return
	 */
	public static String getSysAuth(String userId){
		String url =serverUri+"/getSysAuth";
		RestRequest request = new RestRequest(url);
		request.addParams("userId", userId);
		RestResponse response = client.get(request);
		if(!response.isSuccessful())
			throw new CssException( Messages.getString("slw.message"));
		return response.getBody();	
	}
	
	/**
	 * 获取所有系统
	 * @return
	 */
	public static String getSysList() {
		String url =serverUri+"/getSysList";
		RestRequest request = new RestRequest(url);
		RestResponse response = client.get(request);
		if(!response.isSuccessful())
			throw new CssException( Messages.getString("slw.message"));
		return response.getBody();	
	}

	/**
	 * 获取关联表的sysId的系统
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public static SSys getSysIdAuth(String sysId){
		String url =serverUri+"/getSys";
		RestRequest request = new RestRequest(url);
		request.addParams("sysId", sysId);
		RestResponse response = client.get(request);
		SSys sSys = response.readEntity(SSys.class);
		if(!response.isSuccessful())
			throw new CssException( Messages.getString("slw.message"));
		return sSys;	
	}
	
	/**
	 * 根据查询条件获取关联表的的系统
	 * @return
	 */
	@SuppressWarnings("rawtype")
	public static String getSysByNameOrCode(String param){
		String url =serverUri+"/getSysByNameOrCode";
		RestRequest request = new RestRequest(url);
		request.addParams("param", param);
		RestResponse response = client.post(request);
		if(!response.isSuccessful())
			throw new CssException( Messages.getString("slw.message"));
		return response.getBody();	
	}
	
	public static void main(String[] args) {
		String sysAuth = getSysByNameOrCode("网");
		Gson gson = new Gson();
		Type type = new TypeToken<List<SSys>>(){}.getType();
		List<SSys> list = gson.fromJson(sysAuth, type);
		System.out.println(sysAuth);
	}
}

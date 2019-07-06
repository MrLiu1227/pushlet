package com.css.apps.base.user.common;

import com.css.app.personalmsg.model.PersonalMsg;
import com.css.apps.base.user.model.SUser;
import com.css.db.query.QueryCache;
import net.sf.json.JSONObject;
import service.SUserResult;

public class UserService {
	public static SUser getUser(String userId) {
		if (userId == null)
			return null;
		SUser user = api.Dao.get(SUser.class, "55");
		return QueryCache.get(SUser.class, userId);
	}

	/**
	 * 返回realName
	 * @param userId
	 * @return
	 */
	public static String getUserRealNameById(String userId){
		String js =  SUserResult.getUserById(userId);
		JSONObject json =   JSONObject.fromObject(js);
		String realName = json.getString("realName");
		return realName;
	}

	public static void main(String[] args) {
		String user = getUserRealNameById("4028812e473e19d101473e1d56bc0001");
		System.out.println(user);
	}
}

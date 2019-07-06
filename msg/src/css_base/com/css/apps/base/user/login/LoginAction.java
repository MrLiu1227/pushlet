package com.css.apps.base.user.login;

import java.lang.reflect.Type;

import org.slw.common.helper.StringHelper;
import org.slw.common.utils.Messages;
import org.slw.framework.context.SlwContext;
import org.slw.mvc.annotation.ModelField;

import com.css.apps.base.user.model.SUser;
import com.css.core.action.CssAction;
import com.css.core.configuration.Environment;
import com.css.core.exception.CssException;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import model.DefaultServiceResultImpl;
import model.IServiceResult;
import service.SUserResult;

public class LoginAction extends CssAction {
	@ModelField
	public SUser user = null;

	public void execute() {
		if (sUser == null) {
			if (StringHelper.isEmpty(user.getLoginName()) || StringHelper.isEmpty(user.getPassword()))
				throw new CssException(Messages.getString("systemMsg.fieldEmpty"));

			String check = SUserResult.check(user.getLoginName(), user.getPassword());
			Gson gson = new Gson();
			Type type = new TypeToken<DefaultServiceResultImpl<SUser>>(){}.getType();
			IServiceResult<SUser> aIServiceResult = gson.fromJson(check, type);
			if(IServiceResult.RESULT_OK != aIServiceResult.getResultCode())
				throw new CssException(aIServiceResult.getResultDesc());
			sUser = aIServiceResult.getResultObject();
			SlwContext.setSession(Environment.SESSION_LOGIN_KEY, sUser);
		}
		SlwContext.result().setInfo(String.valueOf(sUser.getUserType()));
	}
}

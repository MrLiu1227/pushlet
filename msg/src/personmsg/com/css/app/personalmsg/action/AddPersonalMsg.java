package com.css.app.personalmsg.action;

import org.slw.mvc.annotation.ModelField;
import org.slw.framework.context.SlwContext;

import com.css.app.personalmsg.model.PersonalMsg;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.db.query.QueryCache;
import com.css.db.query.TransactionCache;
import com.css.util.Messages;
import com.css.util.StringHelper;
import com.css.util.UuidUtil;

public class AddPersonalMsg extends CssAction{
	@ModelField
	private PersonalMsg item = null;

	public void execute() {
			if (!checkField()) 
				throw new CssException(Messages.getString("systemMsg.fieldEmpty"));

			item.setUuid(UuidUtil.getUuid());
			TransactionCache tx = new QueryCache().getTransaction();
			tx.save(item);
			tx.commit();
	}
	public boolean checkField(){
		if (item != null)
    	return true;
    return false; 
	}
}

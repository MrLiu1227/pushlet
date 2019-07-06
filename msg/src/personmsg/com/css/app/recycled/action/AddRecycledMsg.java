package com.css.app.recycled.action;

import com.css.app.personalmsg.model.PersonalMsg;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.db.query.QueryCache;
import com.css.db.query.TransactionCache;
import com.css.util.Messages;
import com.css.util.UuidUtil;

import org.slw.mvc.annotation.ModelField;

public class AddRecycledMsg extends CssAction{
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

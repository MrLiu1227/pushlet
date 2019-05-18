package com.css.app.recycled.action;

import com.css.app.personalmsg.model.PersonalMsg;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.db.query.QueryCache;
import com.css.db.query.TransactionCache;
import com.css.util.Messages;

import org.slw.mvc.annotation.ModelField;

public class UpdRecycledMsg extends CssAction {
	@ModelField
	private PersonalMsg item = null;
	
	public void execute() {
			if (!checkField()) 
				throw new CssException(Messages.getString("systemMsg.fieldEmpty"));

			PersonalMsg old = QueryCache.get(PersonalMsg.class, item.getUuid());
			if (old == null) 
				throw new CssException(Messages.getString("systemMsg.readError"));

			if(!equals(old,item)){
			 	old.setMsgName(item.getMsgName());
			 	old.setMsgUrl(item.getMsgUrl());
			 	old.setMsgType(item.getMsgType());
			 	old.setMsgContent(item.getMsgContent());
			 	old.setMsgKeyWord(item.getMsgKeyWord());
			 	old.setSender(item.getSender());
			 	old.setReceiver(item.getReceiver());
			 	old.setReceiveTime(item.getReceiveTime());
			 	old.setDelStatus(item.getDelStatus());
			 	old.setReadFlag(item.getReadFlag());
		    	TransactionCache tx = new QueryCache().getTransaction();
				tx.update(old);
				tx.commit();
			}
	}
	public boolean checkField(){
		if (item != null)
    	return true;
    return false; 
	}
	public boolean equals(PersonalMsg oldObj, PersonalMsg newObj){
		StringBuilder sb1 = new StringBuilder();
		StringBuilder sb2 = new StringBuilder();
     	sb1.append(oldObj.getMsgName());
     	sb2.append(newObj.getMsgName());
     	sb1.append(oldObj.getMsgUrl());
     	sb2.append(newObj.getMsgUrl());
     	sb1.append(oldObj.getMsgType());
     	sb2.append(newObj.getMsgType());
     	sb1.append(oldObj.getMsgContent());
     	sb2.append(newObj.getMsgContent());
     	sb1.append(oldObj.getMsgKeyWord());
     	sb2.append(newObj.getMsgKeyWord());
     	sb1.append(oldObj.getSender());
     	sb2.append(newObj.getSender());
     	sb1.append(oldObj.getReceiver());
     	sb2.append(newObj.getReceiver());
     	sb1.append(oldObj.getReceiveTime());
     	sb2.append(newObj.getReceiveTime());
     	sb1.append(oldObj.getDelStatus());
     	sb2.append(newObj.getDelStatus());
     	sb1.append(oldObj.getReadFlag());
     	sb2.append(newObj.getReadFlag());
    	return sb1.toString().equals(sb2.toString());
	}
}

package com.css.app.base.attachment.action;

import java.util.List;

import org.slw.framework.context.SlwContext;

import com.css.app.base.attachment.model.Attachment;
import com.css.app.base.attachment.service.AttachService;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.db.query.QueryCache;
import com.css.db.query.TransactionCache;
import com.css.util.Messages;
import com.css.util.StringHelper;

public class DelAttachment extends CssAction {
	private String ids;

	public void execute() {
		if (StringHelper.isEmpty(ids))
			throw new CssException(Messages.getString("systemMsg.fieldEmpty"));

		List idList = StringHelper.strToList(ids);
		List<Attachment> lstObj = QueryCache.idToObj(Attachment.class, idList);
		if (lstObj != null && lstObj.size() > 0) {
			TransactionCache tx = new QueryCache().getTransaction();
			tx.delete(lstObj);
			tx.commit();
			AttachService.delAttachmentFiles(lstObj);
		}
		SlwContext.result().setInfo(idList);
	}

}

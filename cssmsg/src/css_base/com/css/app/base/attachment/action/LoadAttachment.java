package com.css.app.base.attachment.action;

import java.util.ArrayList;

import org.slw.framework.context.SlwContext;
import org.slw.mvc.annotation.ModelField;

import com.css.app.base.attachconfig.model.Attachconfig;
import com.css.app.base.attachment.model.Attachment;
import com.css.app.base.attachment.model.AttachmentJson;
import com.css.app.base.attachment.service.AttachService;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.util.Messages;
import com.css.util.StringHelper;

public class LoadAttachment extends CssAction {
	@ModelField
	private Attachment item = null;

	public void execute() {
		if (!checkField())
			throw new CssException(Messages.getString("systemMsg.fieldEmpty"));
		Attachconfig config = item.getAttachconfig();
		if (config == null)
			throw new CssException(Messages.getString("systemMsg.readError"));

		AttachmentJson msg = new AttachmentJson();

		msg.setConfig(config);
		if ("no".equals(item.getLoadData()))
			msg.setList(new ArrayList<Attachment>());
		else
			msg.setList(AttachService.getAttachments(item));

		SlwContext.result().setMsg(msg.toJson());
	}

	public boolean checkField() {
		if (item != null)
			if (StringHelper.isNotEmpty(item.getTableName()))
				if (StringHelper.isNotEmpty(item.getTableKey()))
					if (StringHelper.isNotEmpty(item.getTableUuid()))
						return true;
		return false;
	}

}

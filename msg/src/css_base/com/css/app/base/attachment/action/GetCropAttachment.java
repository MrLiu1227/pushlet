package com.css.app.base.attachment.action;

import org.slw.mvc.annotation.ModelField;
import org.slw.mvc.annotation.SetIgnoredField;

import com.css.app.base.attachconfig.model.Attachconfig;
import com.css.app.base.attachment.model.Attachment;
import com.css.app.base.attachment.model.CropInfo;
import com.css.app.base.attachment.service.AttachService;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.db.query.QueryCache;
import com.css.util.Messages;
import com.css.util.StringHelper;

public class GetCropAttachment extends CssAction {
	@ModelField
	private Attachment item = null;
	@SetIgnoredField
	private Attachconfig config = null;
	@SetIgnoredField
	private CropInfo crop = null;

	public void execute() {
		if (!checkField())
			throw new CssException(Messages.getString("systemMsg.fieldEmpty"));

		item.initMd5Uuid();
		config = item.getAttachconfig();
		if (config == null)
			throw new CssException(Messages.getString("systemMsg.readError"));

		crop = AttachService.getCropInfo(config);
		if (crop == null)
			throw new CssException(Messages.getString("systemMsg.readError"));

		item = QueryCache.get(Attachment.class, item.getMd5Uuid());
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

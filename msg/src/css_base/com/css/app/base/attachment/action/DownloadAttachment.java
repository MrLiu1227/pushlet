package com.css.app.base.attachment.action;

import java.io.File;

import org.slw.framework.context.SlwContext;
import org.slw.framework.view.model.StreamData;

import com.css.app.base.attachment.model.Attachment;
import com.css.app.base.attachment.service.AttachService;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.db.query.QueryCache;
import com.css.util.Messages;
import com.css.util.StringHelper;

public class DownloadAttachment extends CssAction {
	private String uuid;
	private Integer mod; // 

	public void execute() throws Exception {
		if (StringHelper.isEmpty(uuid))
			throw new CssException(Messages.getString("systemMsg.fieldEmpty"));
		Attachment item = QueryCache.get(Attachment.class, uuid);
		if (item == null)
			throw new CssException(Messages.getString("systemMsg.readError"));

		File file = AttachService.getFile(item);
		if (file == null)
			throw new CssException(Messages.getString("systemMsg.downError"));
		
		if (mod == null)
			mod = StreamData.MOD_DOWNLOAD;
		
		String fileName = item.getFileName() + (StringHelper.isEmpty(item.getFileExt()) ? "" : "." + item.getFileExt());
		SlwContext.setStreamData(new StreamData(file, mod, fileName));
	}
}

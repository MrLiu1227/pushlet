package com.css.app.base.attachment.action;

import java.io.File;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.apache.commons.io.FileUtils;
import org.slw.common.utils.SlwJson;
import org.slw.framework.context.SlwContext;
import org.slw.mvc.annotation.IgnoredField;
import org.slw.mvc.annotation.ModelField;

import com.css.app.base.attachconfig.model.Attachconfig;
import com.css.app.base.attachment.model.Attachment;
import com.css.app.base.attachment.model.CropInfo;
import com.css.app.base.attachment.service.AttachService;
import com.css.apps.base.user.model.SUser;
import com.css.core.action.CssAction;
import com.css.core.configuration.Environment;
import com.css.core.exception.CssException;
import com.css.core.upload.AttachItem;
import com.css.core.upload.FileInfo;
import com.css.db.query.QueryCache;
import com.css.db.query.TransactionCache;
import com.css.util.ImageService;
import com.css.util.Messages;
import com.css.util.StringHelper;

public class CropAttachment extends CssAction {
	@ModelField
	private Attachment item = null;
	private Integer x, y, rotate, width, height;
	@IgnoredField
	public static String fileAttach = "7";

	public void execute() throws Exception {
		if (!checkField())
			throw new CssException(Messages.getString("systemMsg.fieldEmpty"));
		item.initMd5Uuid();

		Attachment old = QueryCache.get(Attachment.class, item.getMd5Uuid());
		if (old == null)
			throw new CssException(Messages.getString("systemMsg.readError"));

		Attachconfig config = item.getAttachconfig();
		if (config == null)
			throw new CssException(Messages.getString("systemMsg.attachconfig"));

		CropInfo crop = AttachService.getCropInfo(config);
		if (crop == null)
			throw new CssException(Messages.getString("systemMsg.attachconfig"));

		String sExt = old.getFileExt();
		String oldFileName = AttachService.getFilePath(old);

		FileInfo fi = AttachItem.getAttach(this.fileAttach);
		if (fi == null)
			throw new CssException(Messages.getString("systemMsg.invalidFilePath"));

		fi.setFileName(UUID.randomUUID() + "." + sExt);
		String fileName = fi.getFilePath() + "/" + fi.getFileName();
		FileUtils.copyFile(new File(oldFileName), new File(fileName));

		AttachService.delFiles(old);
		String newFile = fileName + "." + "0." + sExt;
		ImageService.corpImage(fileName, newFile, x, y, width, height);
		ImageService.cropImageCenter(newFile, fileName + "." + sExt, crop.getWidth(), crop.getHeight());
		int i = 0;
		List<Integer> widths = crop.getCropWidth();
		if (widths != null) {
			for (Integer w : widths) {
				i++;
				ImageService.zoomImage(fileName + "." + "0." + sExt, fileName + "." + i + "." + sExt, w, Math.round(w * height / width));
			}
			SlwJson extreData = new SlwJson();
			extreData.put("x", x);
			extreData.put("y", y);
			extreData.put("width", width);
			extreData.put("height", height);
			extreData.put("rotate", rotate);
			extreData.put("number", widths.size());
			old.setExtraData(extreData.toString());
			old.setUploadTime(new Date());
			SUser user = (SUser) SlwContext.getSession(Environment.SESSION_LOGIN_KEY);
			old.setUserId(user.getUserId());
			old.setFileUrl(fi.getRelativePath() + "/" + fi.getFileName());
			old.setFileUrlFull(fi.getDictUrl() + old.getFileUrl());
		}
		TransactionCache tx = new QueryCache().getTransaction();
		tx.update(old);
		tx.commit();
		SlwJson one = new SlwJson();
		one.put("uuid", old.getUuid());
		one.put("userId", old.getUserId());
		one.put("fileUrlFull", old.getFileUrlFull());
		one.put("fileExt", old.getFileExt());
		one.put("time", new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(old.getUploadTime()));
		SlwContext.result().setMsg(one.toString());
	}

	public boolean checkField() {
		if (item != null)
			if (x != null && y != null && width != null && height != null)
				if (StringHelper.isNotEmpty(item.getTableName()))
					if (StringHelper.isNotEmpty(item.getTableKey()))
						if (StringHelper.isNotEmpty(item.getTableUuid()))
							return true;
		return false;
	}

}

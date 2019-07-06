package com.css.app.base.attachment.action;

import java.io.File;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.apache.commons.fileupload.FileItem;
import org.slw.common.utils.SlwJson;
import org.slw.framework.context.SlwContext;
import org.slw.mvc.annotation.IgnoredField;

import com.css.app.base.attachconfig.model.Attachconfig;
import com.css.app.base.attachment.model.Attachment;
import com.css.app.base.attachment.model.CropInfo;
import com.css.app.base.attachment.service.AttachService;
import com.css.core.action.CssAction;
import com.css.core.exception.CssException;
import com.css.core.upload.AttachItem;
import com.css.core.upload.FileInfo;
import com.css.db.query.QueryCache;
import com.css.db.query.TransactionCache;
import com.css.util.ImageService;
import com.css.util.Messages;
import com.css.util.StringHelper;
import com.css.util.UuidUtil;

/**
 * @author Administrator TODO To change the template for this generated type
 *         group go to Window - Preferences - Java - Code Style - Code Templates
 */
public class UploadAttachment extends CssAction {
	private String tableName = null;
	private String tableKey = null;
	private String tableUuid = null;
	private String ie = null;
	private String param = null;
	private Integer x, y, rotate, width, height;
	private String name = null;
	private String fileType = null;
	@IgnoredField
	public static String fileAttach = "7";
	private FileItem file = null;

	public void execute() throws Exception {
		if (!checkField())
			throw new CssException(Messages.getString("systemMsg.fieldEmpty"));

		Attachment item = new Attachment();
		item.setTableName(tableName);
		item.setTableKey(tableKey);
		item.setTableUuid(tableUuid);
		item.initMd5Uuid();
		Attachconfig config = item.getAttachconfig();
		if (config == null)
			throw new CssException(Messages.getString("systemMsg.attachconfig"));

		CropInfo crop = AttachService.getCropInfo(config);
		name = file.getName();
		String sExt = AttachService.getFileExt(name);
		name = AttachService.getFileName(name);
		String ext = config.getFileExt();
		if (!ext.equals("*")) {
			if (sExt.equals("") || ext.indexOf(sExt) < 0)
				throw new CssException(Messages.getString("systemMsg.invalidFileExt"));

		}
		Integer maxLength = config.getFileLength();
		if (file.getSize() > 1024l * maxLength)
			throw new CssException(Messages.getString("systemMsg.totalMaxSize"));

		Attachment old = null;
		boolean updateFlag = false;
		if (crop != null) {
			old = QueryCache.get(Attachment.class, item.getMd5Uuid());
			if (old != null)
				updateFlag = true;
		} else {
			if (config.getFileNumber() > 0) {
				if (item.getSize() >= config.getFileNumber())
					throw new CssException(Messages.getString("systemMsg.attachMaxNumber", new String[] { String.valueOf(config.getFileNumber()) }));
			}
		}

		FileInfo fi = AttachItem.getAttach(this.fileAttach);
		if (fi == null)
			throw new CssException(Messages.getString("systemMsg.invalidFilePath"));
		fi.setDescription(file.getName());
		fi.setFileName(UUID.randomUUID() + "." + sExt);
		String fileName = fi.getFilePath() + "/" + fi.getFileName();

		File saveFile = new File(fileName);
		file.write(saveFile);

		item.setUuid(config.getFileNumber() == 1 ? item.getMd5Uuid() : UuidUtil.getUuid());
		item.setFileName(name);
		item.setFileSize(file.getSize());
		item.setFileExt(sExt);
		item.setOrderNum(item.getSize() + 1);

		/*if (crop != null) {
			String newFile = fileName + "." + "0." + sExt;
			// ie6,7,8,9必须先上传文件
			if (x == null || y == null || width == null || height == null) {
				Integer pos[] = ImageService.getPosition(saveFile, crop.getWidth(), crop.getHeight(), 0.6f);
				if (pos == null)
					throw new CssException(Messages.getString("systemMsg.invalidFileExt"));
				x = pos[0];
				y = pos[1];
				width = pos[2];
				height = pos[3];
			}
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
				item.setExtraData(extreData.toString());
			}
		} else if ("pic".equals(category) && width != null && height != null) {
			ImageService.cropImageCenter(fileName, fileName + "." + sExt, width, height);
		}*/

		item.setFileType(fileType);
		item.setFileUrl(fi.getRelativePath() + "/" + fi.getFileName());
		item.setUploadTime(new Date());
		item.setUserId(sUser.getUserId());
		item.setServerId(fi.getServerId());
		item.setFileUrlFull(fi.getDictUrl() + item.getFileUrl().split("."+sExt)[0]);

		TransactionCache tx = new QueryCache().getTransaction();
		if (updateFlag)
			tx.update(item);
		else
			tx.save(item);
		tx.commit();
		if (!updateFlag)
			item.getJionList().add(item.getUuid());
		else
			AttachService.delFiles(old);

		SlwJson one = new SlwJson();
		one.put("uuid", item.getUuid());
		one.put("userId", item.getUserId());
		
		if("pic".equals(item.getCategory())){
			one.put("fileUrlFull", item.getFileUrlFull().split("."+sExt)[0]);
		}else{
			one.put("fileUrlFull", item.getFileUrlFull());
		}
		
		one.put("fileName", item.getFileName());
		one.put("fileExt", item.getFileExt());
		one.put("fileSize", item.getFileSize());
		one.put("time", new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(item.getUploadTime()));
		SlwContext.result().setMsg(one.toString());
	}

	public boolean checkField() {
		if (file != null)
			if (StringHelper.isNotEmpty(tableName))
				if (StringHelper.isNotEmpty(tableKey))
					if (StringHelper.isNotEmpty(tableUuid))
						return true;
		return false;
	}

}

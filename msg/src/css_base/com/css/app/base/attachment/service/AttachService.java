package com.css.app.base.attachment.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.slw.common.helper.StringHelper;
import org.slw.common.utils.SlwJson;

import com.css.app.base.attachconfig.model.Attachconfig;
import com.css.app.base.attachment.model.Attachment;
import com.css.app.base.attachment.model.CropInfo;
import com.css.apps.base.dict.service.DictMan;
import com.css.db.query.QueryCache;
import com.css.util.Md5Util;

public class AttachService {

	public static void main(String[] args) throws ClassNotFoundException, Exception {
		List<String> delIds = new ArrayList();
		delIds.add("6fa8c5fef4cd4328ab0dbf4361430453");
		List<Attachment> attachments = AttachService.getAttachmentsByTableUuid(delIds);
		AttachService.delAttachmentFiles(attachments);
	}

	public static String getUuid(String tableName, String tableKey) {
		return Md5Util.MD5Encode(tableName + ',' + tableKey);
	}

	public static String getMd5Uuid(String tableName, String tableKey, String tableUuid) {
		return Md5Util.MD5Encode(tableName + ',' + tableKey + ',' + tableUuid);
	}

	public static List<Attachment> getAttachments(Attachment item) {
		String[] uuids = item.getTableUuid().split(",");
		if (uuids.length > 1) {
			List<String> uuidList = new ArrayList<String>();
			for (String uuid : uuids)
				uuidList.add(getMd5Uuid(item.getTableName(), item.getTableKey(), uuid));
			QueryCache qc = new QueryCache("select a.uuid from Attachment a where a.md5Uuid in(:md5Uuid) order by a.orderNum").setParameter("md5Uuid", uuidList);
			return QueryCache.idToObj(Attachment.class, qc.list());
		} else {
			item.initMd5Uuid();
			return item.getAttachments();
		}
	}

	public static List<Attachment> getAttachmentsByTableUuid(List<String> ids) {
		QueryCache qc = new QueryCache("select a.uuid from Attachment a where a.tableUuid in(:ids) order by a.orderNum").setParameter("ids", ids);
		return QueryCache.idToObj(Attachment.class, qc.list());
	}

	public static byte[] getFileByte(Attachment item) {
		String fileName = getFilePath(item);
		if (fileName == null)
			return null;
		try {
			return FileUtils.readFileToByteArray(new File(fileName));
		} catch (IOException e) {
			return null;
		}
	}

	public static File getFile(Attachment item) {
		String fileName = getFilePath(item);
		if (fileName == null)
			return null;
		File file = new File(fileName);
		return file.exists() ? file : null;

	}

	public static void delAttachmentFiles(List<Attachment> attachments) {
		if (attachments != null && attachments.size() > 0) {
			for (Attachment item : attachments) {
				item.getJionList().remove(item.getUuid());
				AttachService.delFiles(item);
			}
		}
	}

	public static void delFiles(Attachment item) {
		try {
			String fileName = AttachService.getFilePath(item);
			File f = new File(fileName);
			if (f.exists())
				f.delete();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	public static CropInfo getCropInfo(Attachconfig config) {
		if (config == null)
			return null;
		try {
			return (CropInfo) SlwJson.toObject(config.getExtraPara(), CropInfo.class);
		} catch (Exception ex) {
			return null;
		}
	}

	public static String getFilePath(Attachment item) {
		if (item == null)
			return null;
		String path = DictMan.getDictType("d_serverid", item.getServerId()).getRemark();
		return path + item.getFileUrl();
	}

	public static String getFileUrl(Attachment item) {
		if (item == null)
			return null;
		String path = DictMan.getDictType("d_serverid", item.getServerId()).getName();
		return path + item.getFileUrl();
	}

	public static String getFullName(Attachment item) {
		if (StringHelper.isEmpty(item.getFileExt()))
			return item.getFileName();
		else
			return item.getFileName() + "." + item.getFileExt();
	}

	public static String getFileExt(String fileName) {
		int iIndex = fileName.lastIndexOf(".");
		if (iIndex < 0)
			return "";
		return fileName.substring(iIndex + 1).toLowerCase();
	}

	public static String getFileName(String fileName) {
		int iIndex = fileName.lastIndexOf(".");
		if (iIndex < 0)
			return fileName;
		return fileName.substring(0, iIndex);
	}

	public static String getFileName(String fileName, String name) {
		if (StringHelper.isEmpty(name))
			return fileName;
		if (fileName.equalsIgnoreCase(name)) {
			int iIndex = fileName.lastIndexOf(".");
			if (iIndex > 0)
				name = fileName.substring(0, iIndex);
		}
		return name;
	}

}

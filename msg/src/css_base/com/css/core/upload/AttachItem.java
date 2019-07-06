package com.css.core.upload;

import java.io.File;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.slw.common.utils.Md5Util;
import org.slw.memcached.client.MemAgent;

import com.css.apps.base.dict.model.SDict;
import com.css.apps.base.dict.service.DictMan;
import com.css.core.configuration.Environment;
import com.css.db.query.QueryCache;

public class AttachItem {
	private static Log log = LogFactory.getLog(AttachItem.class);
	public static String attachPath = "attachPath";
	private static MemAgent memAgent = new QueryCache().getMemcached();
	public static String getAttachImp(String id) {
		try {
			String setting = DictMan.getDictType("d_para_g", id).getName();
			String[] val = setting.split("@");
			String serverId = val[0];
			int maxNum = Integer.parseInt(val[1]);
			String path = DictMan.getDictType("d_serverid", serverId).getRemark();
			File dir = new File(path);
			if (!dir.exists())
				dir.mkdirs();
			int i = getFolder(path, 0, maxNum);
			return path + i;
		} catch (Exception ex) {
			log.error(ex.getMessage());
			return null;
		}
	}

	public static int getFolder(String dictPath, int start, int maxNum) {
		int i = start;
		File dir = null;
		while (true) {
			String tmp = dictPath + i;
			dir = new File(tmp);
			if (!dir.exists()) {
				dir.mkdir();
				break;
			} else {
				if (dir.listFiles().length < maxNum)
					break;
			}
			i++;
		}
		return i;
	}

	public static FileInfo getAttach(String id) {
		try {
			String path = getAttachCache(id);
			if (path == null)
				return null;
			File dir = new File(path);
			if (!dir.exists())
				return null;
			FileInfo fi = new FileInfo();
			String setting = DictMan.getDictType("d_para_g", id).getName();
			String[] val = setting.split("@");
			String serverId = val[0];
			int maxNum = Integer.parseInt(val[1]);
			SDict dt = DictMan.getDictType("d_serverid", serverId);
			fi.setDictPath(dt.getRemark());
			fi.setDictUrl(dt.getName());
			fi.setMaxNum(maxNum);
			fi.setServerId(serverId);
			int start = -1;
			if (path.indexOf(dt.getRemark()) < 0) // 字典有更新
				start = 0;
			if (start < 0 && dir.listFiles().length < maxNum) {
				int index = path.lastIndexOf("/");
				start = Integer.parseInt(path.substring(index + 1));
				fi.setFilePath(path);
				fi.setRelativePath(start + "");
				return fi;
			}
			start = getFolder(fi.getDictPath(), start, maxNum);
			path = fi.getDictPath() + start;
			fi.setRelativePath(start + "");
			fi.setFilePath(path);
			String key = getKey(id.toString());
			memAgent.set(key, path);
			return fi;
		} catch (Exception ex) {
			log.error(ex.getMessage());
			return null;
		}
	}

	public static String getKey(String id) {
		String key = Md5Util.MD5Encode(Environment.SYSTEM_NAME + (AttachItem.attachPath + ":" + id).toLowerCase());
		return key;
	}

	public static String getAttachCache(String id) {
		if (id == null)
			return null;
		String key = getKey(id);
		String value = (String) memAgent.get(key);
		if (value == null) {
			value = getAttachImp(id);
			memAgent.set(key, value);
		}
		return value;
	}
}

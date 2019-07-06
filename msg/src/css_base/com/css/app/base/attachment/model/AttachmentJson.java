package com.css.app.base.attachment.model;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slw.common.utils.SlwJson;
import org.slw.mvc.annotation.IgnoredField;

import com.css.app.base.attachconfig.model.Attachconfig;
import com.css.apps.base.dict.model.SDict;
import com.css.apps.base.dict.service.DictMan;
import com.css.util.StringHelper;
import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.io.json.JettisonMappedXmlDriver;

@SuppressWarnings("serial")
public class AttachmentJson implements Serializable {
	@IgnoredField
	private static Map<String, String> fieldMap = new HashMap<>();
	static {
		fieldMap.put("tableName", "tableName");
		fieldMap.put("tableKey", "tableKey");
		fieldMap.put("md5Uuid", "md5Uuid");
		fieldMap.put("tableType", "tableType");
		fieldMap.put("uploadTime", "uploadTime");
		fieldMap.put("fileUrl", "fileUrl");
		fieldMap.put("fileType", "fileType");
		fieldMap.put("serverId", "serverId");
		fieldMap.put("extraData", "extraData");
	}

	private Attachconfig config;
	private List<Attachment> list;

	public String toJson() {
		return SlwJson.toJSON(this, fieldMap);
	}

	public Attachconfig getConfig() {
		return config;
	}

	public void setConfig(Attachconfig config) {
		this.config = config;
	}

	public List<Attachment> getList() {
		return list;
	}

	public void setList(List<Attachment> list) {
		if (list == null)
			return;
		this.list = list;
		Map<String, String> serveridMap = new HashMap<String, String>();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		for (Attachment item : this.list) {
			String path = (String) serveridMap.get(item.getServerId());
			if (StringHelper.isEmpty(path)) {
				SDict dict = DictMan.getDictType("d_serverid", item.getServerId());
				if (dict == null)
					System.out.println(item.getUuid() + "," + item.getServerId());
				path = dict.getName();
				serveridMap.put(item.getServerId(), path);
			}
			if("pic".equals(item.getCategory())){
				item.setFileUrlFull(path + item.getFileUrl().split("."+item.getFileExt())[0]);
			}else{
				item.setFileUrlFull(path + item.getFileUrl());
			}
			item.setTime(sdf.format(item.getUploadTime()));
		}

	}
}
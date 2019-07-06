/*
 * Created on 2006-5-24
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package com.css.core.upload;

import java.io.Serializable;

import org.slw.common.utils.SlwJson;

//文件：c:/file/123/xxx.ext = filePath +'/' + fileName
//文件：c:/file/123/xxx.ext = dictPath + relativePath +'/' + fileName
//URL：http://192.168.0.1/file/123/xx.ext= dictUrl + relativePath  +'/' + fileName
//extension：	ext
//fileName：		xxx.ext
//filePath：		c:/file/123
//relativePath:	123/xxx.ext
//dictUrl：   	http://192.168.0.1/file/	通常由d_serverId设置
//dictPath：		c:/file/					通常由d_serverId设置
public class FileInfo implements Serializable {
	String sid, extension, fileName, filePath, dictUrl, dictPath, relativePath, description, url, path;
	String id, serverId;
	int maxNum;
	long fileSize;

	public String toString() {
		return this.description + ">" + this.fileName + ">" + this.extension + ">" + this.fileSize;
	}

	public String JSONResult(int code, String msg) throws Exception {
		SlwJson json = new SlwJson();
		json.put("result", code);
		json.put("msg", msg);
		json.put("extension", extension);
		json.put("fileName", fileName);
		json.put("description", description);
		json.put("url", this.getUrl());
		json.put("path", this.getPath());
		json.put("id", id);
		json.put("sid", sid).toString();
		return json.toString();
	}

	public String getUrl() {
		return dictUrl + relativePath + '/' + fileName;
	}

	public String getPath() {
		return dictPath + relativePath + '/' + fileName;
	}

	public String getExtension() {
		return extension;
	}

	public void setExtension(String extension) {
		this.extension = extension;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public long getFileSize() {
		return fileSize;
	}

	public void setFileSize(long fileSize) {
		this.fileSize = fileSize;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getServerId() {
		return serverId;
	}

	public void setServerId(String serverId) {
		this.serverId = serverId;
	}

	public String getDictUrl() {
		return dictUrl;
	}

	public void setDictUrl(String dictUrl) {
		this.dictUrl = dictUrl;
	}

	public String getDictPath() {
		return dictPath;
	}

	public void setDictPath(String dictPath) {
		this.dictPath = dictPath;
	}

	public String getRelativePath() {
		return relativePath;
	}

	public void setRelativePath(String relativePath) {
		this.relativePath = relativePath;
	}

	public Integer getMaxNum() {
		return maxNum;
	}

	public void setMaxNum(Integer maxNum) {
		this.maxNum = maxNum;
	}

	public String getSid() {
		return sid;
	}

	public void setSid(String sid) {
		this.sid = sid;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public void setPath(String path) {
		this.path = path;
	}
}

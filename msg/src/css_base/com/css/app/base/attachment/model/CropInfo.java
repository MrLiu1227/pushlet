package com.css.app.base.attachment.model;

import java.io.Serializable;
import java.util.List;

@SuppressWarnings("serial")
public class CropInfo implements Serializable {
	String type;
	Integer width;
	Integer height;
	List<Integer> previewWidth;
	List<Integer> cropWidth;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Integer getWidth() {
		return width;
	}

	public void setWidth(Integer width) {
		this.width = width;
	}

	public Integer getHeight() {
		return height;
	}

	public void setHeight(Integer height) {
		this.height = height;
	}

	public List<Integer> getPreviewWidth() {
		return previewWidth;
	}

	public void setPreviewWidth(List<Integer> previewWidth) {
		this.previewWidth = previewWidth;
	}

	public List<Integer> getCropWidth() {
		return cropWidth;
	}

	public void setCropWidth(List<Integer> cropWidth) {
		this.cropWidth = cropWidth;
	}

}
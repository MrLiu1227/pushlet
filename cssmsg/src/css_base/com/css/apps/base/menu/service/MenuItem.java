package com.css.apps.base.menu.service;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
public class MenuItem implements Serializable {
	private static final long serialVersionUID = -7130564753291455733L;
	private String id;
	private String name;
	private String path;
	private String icon;
	private String openIcon;
	private String funcode;
	private Boolean visible;
	private Boolean isLast;
	private String parentId;
	private int level;
	private List<MenuItem> menus = new ArrayList<MenuItem>();
	public MenuItem() {
	}

	public MenuItem(String id, String name, String path, String icon,
			String openIcon, String funcode, Boolean visible, Boolean isLast,
			String parentId, int level, List<MenuItem> menus) {
		super();
		this.id = id;
		this.name = name;
		this.path = path;
		this.icon = icon;
		this.openIcon = openIcon;
		this.funcode = funcode;
		this.visible = visible;
		this.isLast = isLast;
		this.parentId = parentId;
		this.level = level;
		this.menus = menus;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getOpenIcon() {
		return openIcon;
	}

	public void setOpenIcon(String openIcon) {
		this.openIcon = openIcon;
	}

	public String getFuncode() {
		return funcode;
	}

	public void setFuncode(String funcode) {
		this.funcode = funcode;
	}

	public Boolean getVisible() {
		return visible;
	}

	public void setVisible(Boolean visible) {
		this.visible = visible;
	}

	public Boolean getIsLast() {
		return isLast;
	}

	public void setIsLast(Boolean isLast) {
		this.isLast = isLast;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	public List<MenuItem> getMenus() {
		return menus;
	}

	public void setMenus(List<MenuItem> menus) {
		this.menus = menus;
	}
}

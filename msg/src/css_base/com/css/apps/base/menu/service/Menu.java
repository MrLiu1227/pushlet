package com.css.apps.base.menu.service;

import java.lang.reflect.Type;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import service.SMenuResult;

public class Menu {
	/**
	 * rest 获取菜单
	 * @param uuid
	 * @return
	 */
	public String getMenu(String uuid){
		return SMenuResult.getUserMenu(uuid,"");
	}
	
	/**
	 * rest 通过系统id 和用户id 获取快捷菜单
	 * @param uuid
	 * @return
	 */
	public List<Menu> getFastMenuList(String userId){
		String fastMenuList = SMenuResult.getFastMenuList("",userId);
		Gson gson = new Gson();
		Type type = new TypeToken<List<MenuItem>>(){}.getType();
		return gson.fromJson(fastMenuList, type);
	}
	
}
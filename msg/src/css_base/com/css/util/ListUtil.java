package com.css.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ListUtil {
	public static boolean isLstEmpty(List<?> lst){
		return lst==null || lst.size()==0;
	}
	public static List init(List lst){
		if(isLstEmpty(lst)){
			lst = new ArrayList();
		}
		return lst;
	}
	/**
	 * 获取第一个list中的不同项
	 * @param list
	 * @param filter
	 * @return
	 */
	public static List<String> getFilter(List<String> list,List<String> filter) {
		if(isLstEmpty(list) || isLstEmpty(filter)){
			return (List<String>) init(list);
		}
		Map<String, Integer> map = new HashMap<String, Integer>(list.size());
		List<String> list1 = list;
		List<String> list2 = filter;
		List<String> diff = new ArrayList<String>();
		for (String string : list1) {
			map.put(string, 1);
		}
		for (String string : list2) {
			Integer cc = map.get(string);
			if (cc != null) {
				map.put(string, ++cc);
			}
		}
		for (Map.Entry<String, Integer> entry : map.entrySet()) {
			if (entry.getValue() == 1) {
				diff.add(entry.getKey());
			}
		}
		return diff;
	}
	/**
	 * 获取两个list中的不同项
	 * @param list1
	 * @param list2
	 * @return
	 */
	public static List<String> getDiffrent(List<String> list1,List<String> list2) {
		Map<String, Integer> map = new HashMap<String, Integer>(list1.size()
				+ list2.size());
		List<String> diff = new ArrayList<String>();
		List<String> maxList = list1;
		List<String> minList = list2;
		if (list2.size() > list1.size()) {
			maxList = list2;
			minList = list1;
		}
		for (String string : maxList) {
			map.put(string, 1);
		}
		for (String string : minList) {
			Integer cc = map.get(string);
			if (cc != null) {
				map.put(string, ++cc);
				continue;
			}
			map.put(string, 1);
		}
		for (Map.Entry<String, Integer> entry : map.entrySet()) {
			if (entry.getValue() == 1) {
				diff.add(entry.getKey());
			}
		}
		return diff;
	}

}


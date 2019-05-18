package api;

import java.util.List;

import com.css.apps.base.dict.model.SDict;
import com.css.apps.base.dict.service.DictMan;

public class Dict {
	/**
	 * 通过字典表名、key获取单个字典对象
	 * 
	 * @param table
	 *           字典表名
	 * @param key
	 *           字典key值
	 * @return
	 */
	public static SDict getDict(String table, String key) {
		return DictMan.getDictType(table, key);
	}

	/**
	 * 通过字典表名获取值为key的List对象
	 * 
	 * @param table
	 *           字典表名
	 * @param key
	 *           字典key值
	 * @return
	 */
	public static List<?> getDictList(String table, String key) {
		return DictMan.getDictTypeList(table, key);
	}

	/**
	 * 通过字典表名获取字典列表，并在第一条追加一个自定义记录
	 * 
	 * @param table
	 *           字典表名
	 * @param key
	 *           字典key值
	 * @param firstVal
	 *           自定义记录值
	 * @return
	 */
	public static List<?> getDictList(String table, String key, String firstVal) {
		return DictMan.getDictList(table, key, firstVal);
	}

	public static List<?> getDictListQuery(String table, String key) {
		return getDictList(table, key, "全部");
	}

	public static List<?> getDictListSel(String table, String key) {
		return getDictList(table, key, "请选择");
	}
}

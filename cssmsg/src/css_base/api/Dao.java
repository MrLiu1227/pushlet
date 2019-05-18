package api;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

import com.css.db.page.Page;
import com.css.db.query.QueryCache;
import com.css.db.query.TransactionCache;

public class Dao {
	public static <T> T get(Class<T> clazz, Serializable id) {
		return new QueryCache().getObject(clazz, id);
	}

	public static <T> T get(Class<T> clazz, Serializable id, String naTiveTable) {
		return new QueryCache(true, naTiveTable).getObject(clazz, id);
	}

	public static <T> T get(Class<T> clazz, Serializable id, String naTiveTable, String naTiveTableId) {
		return new QueryCache(true, naTiveTable, naTiveTableId).getObject(clazz, id);
	}

	/**
	 * 根据传入list<String>, String ids 返回对象列表
	 * 
	 * @param clazz
	 * @param ids
	 * @return
	 */
	public static <T> List<T> getListByIds(Class<T> clazz, List<String> idList) {
		return new QueryCache().idToObject(clazz, idList);
	}

	public static <T> List<T> getListByIds(Class<T> clazz, List<String> idList, String naTiveTable, String naTiveTableId) {
		return new QueryCache(true, naTiveTable, naTiveTableId).idToObject(clazz, idList);
	}

	public static <T> List<T> getListByIds(Class<T> clazz, String ids) {
		List<String> idList = Arrays.asList(ids.split(","));
		return getListByIds(clazz, idList);
	}

	/**
	 * 返回分页数据
	 * 
	 * @param qc
	 * @param page
	 * @param clazz
	 * @return
	 */
	public static <T> Page getPage(QueryCache qc, Page page, Class<T> clazz) {
		page = qc.page(page);
		page.setResults(QueryCache.idToObj(clazz, page.getResults()));
		return page;
	}

	/**
	 * 返回列表数据，不分页
	 * 
	 * @param qc
	 * @param clazz
	 * @return
	 */
	public static <T> List<T> getList(QueryCache qc, Class<T> clazz) {
		List<String> list = qc.list();
		return getListByIds(clazz, list);
	}

	/**
	 * 返回 TransactionCache事务处理
	 * 
	 * @return
	 */
	public static TransactionCache getTransaction() {
		return new QueryCache().getTransaction();
	}

	public static TransactionCache getTransaction(QueryCache qc) {
		return qc.getTransaction();
	}
}

/**
 * @author WeidongWang
 * @since 2016-5-20
 * @version 0.1
 */
package com.css.apps.base.dict.service;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Query;
import org.hibernate.StatelessSession;
import org.hibernate.Transaction;
import org.slw.common.helper.StringHelper;
import org.slw.common.utils.Md5Util;

import com.css.apps.base.dict.model.SDict;
import com.css.db.query.TransactionCache;

public class DictMan {
	/**
	 * 根据表名、字典编码，通过md5加密生成字典表的uuid
	 * 
	 * @param table
	 * @param dictId
	 * @return
	 */
	public static String getUuid(String table, String dictId) {
		return Md5Util.MD5Encode(table + dictId);
	}

	/**
	 * 通过字典表名、dictId获取单个字典对象
	 * 
	 * @param table
	 * @param dictId
	 * @return
	 */
	public static SDict getDictType(String table, String dictId) {
		if (StringHelper.isEmpty(table) || StringHelper.isEmpty(dictId))
			return null;
		String uuid = getUuid(table, dictId);
		return new QueryDict().getObject(SDict.class, uuid);
	}

	/**
	 * 通过字典表名、dictId获取单个字典名称
	 * 
	 * @param table
	 * @param dictId
	 * @return
	 */
	public static String getDictName(String table, String dictId) {
		SDict dict = getDictType(table, dictId);
		return dict == null ? "" : dict.getName();
	}

	/**
	 * 通过字典表名获取值为dictId的List对象，便于通过dictId查找SDict对象
	 * 
	 * @param table
	 * @return
	 */
	public static List getDictTypeId(String table) {
		return getDictTypeId("d_root", table);
	}

	public static List getDictTypeId(String table, String dictId) {
		SDict dict = getDictType(table, dictId);
		return dict == null ? null : dict.getChildrenId();
	}

	/**
	 * 通过字典表名获取值为SDict的List对象，
	 * 
	 * @param table
	 * @return
	 */
	public static List getDictType(String table) {
		return (new QueryDict()).idToObject(SDict.class, getDictTypeId(table));
	}

	public static List<SDict> getDictTypeList(String table, String dictId) {
		SDict dict = getDictType(table, dictId);
		return dict == null ? null : dict.getChildren();
	}

	/**
	 * 通过表名获取字典列表
	 * 
	 * @param table
	 * @return
	 */
	public static List getDictList(String table, String dictId, String firstVal) {
		List lstRes = new ArrayList();
		firstVal = StringHelper.dealNull(firstVal);
		SDict dictType = new SDict();
		dictType.setName(firstVal);
		lstRes.add(dictType);
		lstRes.addAll(getDictTypeList(table, dictId));
		return lstRes;
	}

	/**
	 * 通过复合表名获取字典列表 para1@para2
	 * 
	 * @param dictId
	 * @return
	 */

	public static List getDictListQuery(String dictId) {
		return getDictListQuery("d_root", dictId);
	}

	public static List getDictListSel(String dictId) {
		return getDictListSel("d_root", dictId);
	}

	public static List getDictListQuery(String table, String dictId) {
		return getDictList(table, dictId, "全部");
	}

	public static List getDictListSel(String table, String dictId) {
		return getDictList(table, dictId, "请选择");
	}

	public static void updateTableName() {
		List updList = new ArrayList();

		QueryDict qc = new QueryDict("select a.uuid from SDict a where a.code!='d_root' order by a.uuid");
		List<SDict> dicts = QueryDict.idToObj(SDict.class, qc.list());
		for (SDict dt : dicts) {
			SDict parentDt = QueryDict.get(SDict.class, dt.getParentId());
			if (!dt.getTableName().equals(parentDt.getCode())) {
				System.out.println(parentDt.getCode() + ',' + dt.getTableName());
				dt.setTableName(parentDt.getCode());
				updList.add(dt);
			}

		}
		if (updList.size() > 0) {
			TransactionCache tx = null;
			try {
				tx = new QueryDict().getTransaction();
				tx.update(updList);
				tx.commit();
				updList.clear();
			} catch (Exception ex) {
				if (tx != null)
					tx.rollback();
			}
		}
	}

	public static void updateMd5Code() {
		List updList = new ArrayList();
		StatelessSession s = new QueryDict().getSession();
		Query q = s.createQuery("from SDict a where a.code!='d_root'");
		List<SDict> dicts = q.list();
		Transaction tx = null;
		try {
			tx = s.beginTransaction();
			for (SDict dt : dicts) {
				String uuid = getUuid(dt.getTableName(), dt.getCode());
				if (!uuid.equals(dt.getUuid())) {
					System.out.println(dt.getName() + ',' + dt.getCode());
					s.createSQLQuery("update s_dict set uuid='" + uuid + "' where uuid='" + dt.getUuid() + "'").executeUpdate();
					s.createSQLQuery("update s_dict set parentId='" + uuid + "' where parentId='" + dt.getUuid() + "'").executeUpdate();
				}
			}
			tx.commit();
		} catch (Exception ex) {
			ex.printStackTrace();
			if (tx != null) {
				tx.rollback();
			}
		}
	}
}

package com.css.msgcenter.server;

import java.io.Serializable;
import java.util.List;

import com.css.db.query.QueryCache;
import com.css.db.query.TransactionCache;

public class QueryMsg extends QueryCache {
	public static final String MAPPING = "/hibernate_msg.cfg.xml";
	public static final String msgKeyName = "Global_Msg_Key";
	//public static final String memPrefixName = "msg_";

	public void initKeyName() {
		this.setSystemKeyName(msgKeyName);
		/*this.setMemPrefix(memPrefixName);*/
	}

	public QueryMsg(String hql, boolean naTive) {
		super(MAPPING, hql, naTive);
		initKeyName();
	}

	public QueryMsg(String hql) {
		super(MAPPING, hql);
		initKeyName();
	}

	public QueryMsg() {
		super(MAPPING, null);
		initKeyName();
	}

	public static <T> T get(Class<T> clazz, Serializable id) {
		return new QueryMsg().getObject(clazz, id);
	}

	public static <T> T get(String className, Serializable id) {
		try {
			return new QueryMsg().getObject((Class<T>) Class.forName(className), id);
		} catch (ClassNotFoundException ex) {
			ex.printStackTrace();
			return null;
		}
	}

	public static List idToObj(Class clazz, List list) {
		return new QueryMsg().idToObject(clazz, list);
	}

	public TransactionCache getTransaction() {
		return new TransactionCache(MAPPING, this);
	}
}
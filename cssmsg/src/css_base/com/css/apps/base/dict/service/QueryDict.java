package com.css.apps.base.dict.service;

import java.io.Serializable;
import java.util.List;

import org.slw.memcached.client.MemAgent;
import org.slw.memcached.client.MemConfig;

import com.css.db.query.QueryCache;
import com.css.db.query.TransactionCache;

public class QueryDict extends QueryCache {
	public static final String MAPPING = "/hibernate_dict.cfg.xml";
	public static final String dictKeyName =  MemConfig.getInstance().getDictSystemName();

	public MemAgent getMemcached() {
		if (memAgent == null)
			memAgent = api.Mem.DICT;
		return memAgent;
	}

	public void initKeyName() {
		this.setSystemKeyName(dictKeyName);
	}

	public QueryDict(String hql, boolean naTive) {
		super(MAPPING, hql, naTive);
		initKeyName();
	}

	public QueryDict(String hql) {
		super(MAPPING, hql);
		initKeyName();
	}

	public QueryDict() {
		super(MAPPING, null);
		initKeyName();
	}

	public static <T> T get(Class<T> clazz, Serializable id) {
		return new QueryDict().getObject(clazz, id);
	}

	public static <T> T get(String className, Serializable id) {
		try {
			return new QueryDict().getObject((Class<T>) Class.forName(className), id);
		} catch (ClassNotFoundException ex) {
			ex.printStackTrace();
			return null;
		}
	}

	public static List idToObj(Class clazz, List list) {
		return new QueryDict().idToObject(clazz, list);
	}

	public TransactionCache getTransaction() {
		return new TransactionCache(MAPPING, this);
	}
}
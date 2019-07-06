package com.css.app.base.attachconfig.model;

import com.css.core.model.tree.AbstractTree;
import com.css.db.query.QueryCache;

/**
 * Code Generator
 * 
 * @author CSS WangWeidong
 * @since 2018-05-17
 * @version 1.0
 */

public class AttachconfigTree extends AbstractTree {
	public Attachconfig config;

	public AttachconfigTree(Attachconfig config) {
		this.config = config;
	}

	@Override
	public QueryCache getQuery() {
		return new QueryCache();

	}

	@Override
	public String getNodeId() {
		return config.getTableKey();
	}

	@Override
	public String getNodeName() {
		return config.getName() + "(" + config.getCounter() + ")";
	}

	@Override
	public String getRootId() {
		return getNodeParentId();
	}

	public boolean isLeaf() {
		return true;
	}

	@Override
	public String getNodeParentId() {
		return "";
	}
}

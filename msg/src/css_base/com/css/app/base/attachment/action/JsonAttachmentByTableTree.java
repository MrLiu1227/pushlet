package com.css.app.base.attachment.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slw.framework.context.SlwContext;
import org.slw.framework.view.model.ActionResult;

import com.css.app.base.attachconfig.model.Attachconfig;
import com.css.app.base.attachconfig.model.AttachconfigTree;
import com.css.core.action.CssAction;
import com.css.core.model.tree.AbstractTree;
import com.css.db.query.QueryCache;

public class JsonAttachmentByTableTree extends CssAction {
	private String tableName = null;
	private String tableUuid = null;

	public void execute() {
		/**
		 * 得到分类(tableKey)分类列表
		 */
		QueryCache qc = new QueryCache("select a.uuid from Attachconfig a where a.tableName = :tableName order by a.tableName, orderNum");
		qc.setParameter("tableName", tableName);
		List<Attachconfig> list = QueryCache.idToObj(Attachconfig.class, qc.listCache());
		/**
		 * 统计各分类(tableKey)附件数量
		 */
		QueryCache counter = new QueryCache("select a.tableKey, count(a.uuid) from Attachment a where a.tableName=:tableName and a.tableUuid=:tableUuid group by a.tableKey");
		counter.setParameter("tableName", tableName);
		counter.setParameter("tableUuid", tableUuid);

		List<Object[]> counterList = counter.list();

		Map<String, String> keyMap = new HashMap<String, String>();
		Long total = (long) 0;
		for (Object[] rs : counterList) {

			keyMap.put((String) rs[0], String.valueOf(rs[1]));
			total += (Long) rs[1];
		}
		/**
		 * 构造分类(tableKey)树
		 */
		List<AbstractTree> listObject = new ArrayList<AbstractTree>();
		Attachconfig all = new Attachconfig();
		all.setTableKey("");
		all.setName("所有文件");
		all.setCounter(String.valueOf(total));

		AttachconfigTree root = new AttachconfigTree(all);

		listObject.add(root);
		for (Attachconfig config : list) {
			AttachconfigTree configTree = new AttachconfigTree(config);
			String count = keyMap.get(config.getTableKey());
			config.setCounter(count == null ? "0" : count);
			listObject.add(configTree);
		}
		String result = root.getJsonTreeByList(listObject, -1);
		SlwContext.result().setData(result);

	}

}

package com.css.apps.base.sarea.action;

import org.slw.framework.annotation.RequestMapping;
import org.slw.framework.annotation.SlwController;
import org.slw.framework.view.JsonView;
import org.slw.framework.view.JspView;
import org.slw.mvc.view.action.ActionChain;

@SlwController(path = "", caption = "行政区划管理")
public class SAreaController {
	@RequestMapping(caption = "查询行政区划")
	public JspView dirSArea() {
		ActionChain.excuteAction(DirSArea.class);
		return new JspView("base/sarea/dirsarea.jsp");
	}

	@RequestMapping(caption = "获取行政区划")
	public JspView getSArea() {
		ActionChain.excuteAction(GetSArea.class);
		return new JspView("base/sarea/getsarea.jsp");
	}

	@RequestMapping(caption = "添加行政区划")
	public JsonView addSArea() {
		ActionChain.excuteAction(AddSArea.class);
		return new JsonView();
	}

	@RequestMapping(caption = "修改行政区划")
	public JsonView updSArea() {
		ActionChain.excuteAction(UpdSArea.class);
		return new JsonView();
	}

	@RequestMapping(caption = "删除行政区划")
	public JsonView delSArea() {
		ActionChain.excuteAction(DelSArea.class);
		return new JsonView();
	}

	@RequestMapping(caption = "查询行政区划")
	public JspView dirSAreaMain() {
		ActionChain.excuteAction(DirSArea.class);
		return new JspView("base/sarea/dirsareamain.jsp");
	}

	@RequestMapping(caption = "加载行政区划Json树")
	public JsonView jsonSAreaTree() {
		ActionChain.excuteAction(JsonSAreaTree.class);
		return new JsonView();
	}

	@RequestMapping(caption = "行政区划Json树级联逐级")
	public JsonView jsonSAreaCascade() {
		ActionChain.excuteAction(JsonSAreaTree.class, "cascade");
		return new JsonView();
	}

	@RequestMapping(caption = "行政区划Json树级联一次")
	public JsonView jsonSAreaCascadeAll() {
		ActionChain.excuteAction(JsonSAreaTree.class, "cascadeAll");
		return new JsonView();
	}

	@RequestMapping(caption = "修改行政区划顺序")
	public JsonView saveSAreaTree() {
		ActionChain.excuteAction(SaveSAreaTree.class);
		return new JsonView();
	}
}
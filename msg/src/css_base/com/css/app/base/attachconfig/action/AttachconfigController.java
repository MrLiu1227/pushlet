package com.css.app.base.attachconfig.action;

import org.slw.framework.annotation.RequestMapping;
import org.slw.framework.annotation.SlwController;
import org.slw.framework.context.SlwContext;
import org.slw.framework.view.JsonView;
import org.slw.framework.view.JspView;
import org.slw.framework.view.model.ActionResult;
import org.slw.mvc.view.action.ActionChain;

@SlwController
public class AttachconfigController {
	@RequestMapping(caption = "查询附件配置")
	public JspView dirAttachconfig() {
		ActionChain.excuteAction(DirAttachconfig.class);
		ActionResult r = SlwContext.result();
		return new JspView("base/attachconfig/dirattachconfig.jsp");
	}

	@RequestMapping(caption = "获取附件配置")
	public JspView getAttachconfig() {
		ActionChain.excuteAction(GetAttachconfig.class);
		return new JspView("base/attachconfig/getattachconfig.jsp");
	}

	@RequestMapping(caption = "添加附件配置")
	public JsonView addAttachconfig() {
		ActionChain.excuteAction(AddAttachconfig.class);
		return new JsonView();
	}

	@RequestMapping(caption = "修改附件配置")
	public JsonView updAttachconfig() {
		ActionChain.excuteAction(UpdAttachconfig.class);
		return new JsonView();
	}

	@RequestMapping(caption = "删除附件配置")
	public JsonView delAttachconfig() {
		ActionChain.excuteAction(DelAttachconfig.class);
		return new JsonView();
	}

}

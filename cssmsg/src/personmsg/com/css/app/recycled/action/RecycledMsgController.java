package com.css.app.recycled.action;

import org.slw.framework.annotation.RequestMapping;
import org.slw.framework.annotation.SlwController;
import org.slw.framework.view.JsonView;
import org.slw.framework.view.JspView;
import org.slw.mvc.view.action.ActionChain;

@SlwController(path="/recycled", caption="PERSONAL_MSG管理")
public class RecycledMsgController {

	@RequestMapping(caption = "查询PERSONAL_MSG")
	public JspView dirRecycledMsg() {
		ActionChain.excuteAction(DirRecycledMsg.class);
		return new JspView("/personmsg/recycled/dirpersonalmsg.jsp");
	}

	@RequestMapping(caption = "获取PERSONAL_MSG")
	public JspView getPersonalMsg() {
		ActionChain.excuteAction(GetRecycledMsg.class);
		return new JspView("/personmsg/recycled/getpersonalmsg.jsp");
	}

	@RequestMapping(caption = "添加PERSONAL_MSG")
	public JsonView addPersonalMsg() {
		ActionChain.excuteAction(AddRecycledMsg.class);
		return new JsonView();
	}

	@RequestMapping(caption = "修改PERSONAL_MSG")
	public JsonView updPersonalMsg() {
		ActionChain.excuteAction(UpdRecycledMsg.class);
		return new JsonView();
	}

	@RequestMapping(caption = "删除PERSONAL_MSG")
	public JsonView delPersonalMsg() {
		ActionChain.excuteAction(DelRecycledMsg.class);
		return new JsonView();
	}

	@RequestMapping(caption = "查看PERSONAL_MSG详细页")
	public JspView detailPersonalMsg() {
		ActionChain.excuteAction(DetailRecycledMsg.class);
		return new JspView("/personmsg/recycled/detailrecycledmsg.jsp");
	}

	@RequestMapping(caption = "修改PERSONAL_MSG删除状态")
	public JsonView UpdPersonalMsgDelStatus() {
		ActionChain.excuteAction(UpdRecycledMsgDelStatus.class);
		return new JsonView();
	}
}
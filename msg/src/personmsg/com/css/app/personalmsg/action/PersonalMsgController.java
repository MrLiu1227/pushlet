package com.css.app.personalmsg.action;

import com.css.app.MsgEnvironment;
import com.css.app.personalmsg.server.DelPushLetSession;
import org.slw.framework.annotation.SlwController;
import org.slw.framework.annotation.RequestMapping;
import org.slw.framework.view.JsonView;
import org.slw.framework.view.JspView;
import org.slw.mvc.view.action.ActionChain;


@SlwController(path="/personal", caption="PERSONAL_MSG管理")
public class PersonalMsgController {

	@RequestMapping(caption = "查询PERSONAL_MSG")
	public JspView dirPersonalMsg() {
		ActionChain.excuteAction(DirPersonalMsg.class);
		return new JspView("/personmsg/personalmsg/dirpersonalmsg.jsp");
	}
	
	@RequestMapping(caption = "获取PERSONAL_MSG")
	public JspView getPersonalMsg() {
		ActionChain.excuteAction(GetPersonalMsg.class);
		return new JspView("/personmsg/personalmsg/getpersonalmsg.jsp");
	}

	@RequestMapping(caption = "添加PERSONAL_MSG")
	public JsonView addPersonalMsg() {
		ActionChain.excuteAction(AddPersonalMsg.class);
		return new JsonView();
	}

	@RequestMapping(caption = "修改PERSONAL_MSG")
	public JsonView updPersonalMsg() {
		ActionChain.excuteAction(UpdPersonalMsg.class);
		return new JsonView();
	}

	@RequestMapping(caption = "删除PERSONAL_MSG")
	public JsonView delPersonalMsg() {
		ActionChain.excuteAction(DelPersonalMsg.class);
		return new JsonView();
	}
	
	@RequestMapping(caption = "查看PERSONAL_MSG详细页")
	public JspView detailPersonalMsg() {
		ActionChain.excuteAction(DetailPersonalMsg.class);
		return new JspView("personmsg/personalmsg/detailpersonalmsg.jsp");
	}

	@RequestMapping(caption = "修改PERSONAL_MSG删除状态")
	public JsonView UpdPersonalMsgDelStatus() {
		ActionChain.excuteAction(UpdPersonalMsgDelStatus.class);
		return new JsonView();
	}

	@RequestMapping(caption = "修改PERSONAL_MSG阅读状态")
	public JsonView UpdPersonalMsgReadFlag() {
		ActionChain.excuteAction(UpdPersonalMsgReadFlag.class);
		return new JsonView();
	}

	@RequestMapping(caption = "查询PERSONAL_MSG")
	public JspView dirPersonalMsgDesk() {
		return new JspView("/personmsg/personalmsg/dirPersonalMsgDesk.jsp");
	}

	@RequestMapping(caption = "delPushLetSession")
	public JsonView delPushLetSession() {
		ActionChain.excuteAction(DelPushLetSession.class);
		return new JsonView();
	}
}
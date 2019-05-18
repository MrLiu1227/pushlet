package com.css.app.base.attachment.action;

import org.slw.framework.annotation.SlwController;
import org.slw.framework.view.JsonView;
import org.slw.framework.view.JspView;
import org.slw.framework.view.StreamView;
import org.slw.framework.annotation.RequestMapping;
import org.slw.mvc.view.action.ActionChain;

@SlwController(path = "", caption = "附件管理")
public class AttachmentController {
	@RequestMapping(caption = "查询附件表")
	public JspView dirAttachment() {
		ActionChain.excuteAction(DirAttachment.class);
		return new JspView("base/attachment/dirattachment.jsp");
	}

	@RequestMapping(caption = "上传附件")
	public JsonView uploadAttachment() {
		ActionChain.excuteAction(UploadAttachment.class);
		return new JsonView();
	}

	@RequestMapping(caption = "下载附件")
	public StreamView downloadAttachment() {
		ActionChain.excuteAction(DownloadAttachment.class);
		return new StreamView();
	}

	@RequestMapping(caption = "附件排序")
	public JsonView sortAttachment() {
		ActionChain.excuteAction(SortAttachment.class);
		return new JsonView();
	}

	@RequestMapping(caption = "原有图片剪裁")
	public JsonView cropAttachment() {
		ActionChain.excuteAction(CropAttachment.class);
		return new JsonView();
	}

	@RequestMapping(caption = "加载附件")
	public JsonView loadAttachment() {
		ActionChain.excuteAction(LoadAttachment.class);
		return new JsonView();
	}

	@RequestMapping(caption = "获取附件表")
	public JspView getAttachment() {
		ActionChain.excuteAction(GetAttachment.class);
		return new JspView("base/attachment/getattachment.jsp");
	}

	@RequestMapping(caption = "获取附件表")
	public JspView getCropAttachment() {
		ActionChain.excuteAction(GetCropAttachment.class);
		return new JspView("base/attachment/getcropattachment.jsp");
	}

	@RequestMapping(caption = "修改附件表")
	public JsonView updAttachment() {
		ActionChain.excuteAction(UpdAttachment.class);
		return new JsonView();
	}

	@RequestMapping(caption = "删除附件表")
	public JsonView delAttachment() {
		ActionChain.excuteAction(DelAttachment.class);
		return new JsonView();
	}

	@RequestMapping(caption = "附件浏览")
	public JspView dirAttachmentByTable() {
		ActionChain.excuteAction(DirAttachmentByTable.class);
		return new JspView("base/attachment/dirattachmentbytable.jsp");
	}

	@RequestMapping(caption = "附件浏览")
	public JspView dirAttachmentByTableMain() {
		ActionChain.excuteAction(DirAttachmentByTable.class);
		return new JspView("base/attachment/dirattachmentbytablemain.jsp");
	}

	@RequestMapping(caption = "Json附件分类")
	public JsonView jsonAttachmentByTableTree() {
		ActionChain.excuteAction(JsonAttachmentByTableTree.class);
		return new JsonView();
	}

}

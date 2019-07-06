<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@ taglib prefix="ww" uri="webwork"%>
<form class="form-horizontal form-validate" id="getAttachmentForm">
	<input type="hidden" name="uuid" id="uuid" value="<ww:property value='item.uuid'/>">
	<div class="content" style="min-width: 500px;">
		<table class="table  table-nobordered editTable form-group-sm">
			<td colspan="3" class="tdLable"><span class="required">*</span> 附件名称</td>
			<td colspan="9"><input type="text" maxlength="100" placeholder="请输入附件名称" class="form-control required" name="fileName" id="fileName" value="<ww:property value='item.fileName'/>"></td>
			</tr>
		</table>
	</div>

	<div class="set-btn" data-spy="affix" data-offset-top="200">
		<button class="btn btn-sm btn-primary submitButton" type="button">
			<i class="fa fa-save"></i> 保存
		</button>
		<a class="btn btn-sm btn-default" href="javascript:;" onclick="$css.closeDialog()"> <i class="fa fa-close"></i> 关闭
		</a>
	</div>
</form>
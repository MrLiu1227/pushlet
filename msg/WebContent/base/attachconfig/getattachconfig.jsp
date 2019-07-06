<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@ taglib prefix="ww" uri="webwork"%>
<ww:bean name="'com.css.apps.base.dict.service.DictMan'" id="dictID" />
<form class="form-horizontal form-validate" method="post" <ww:if test="uuid != null">action="updAttachconfig.action"</ww:if> <ww:else>action="addAttachconfig.action"</ww:else> onsubmit="return $action.submit(this);">
	<input type="hidden" name="uuid" id="uuid" value="<ww:property value='item.uuid'/>">
	<div style="width: 500px;">
		<table class="table table-nobordered editTable form-group-sm">
			<tr class="firstRow">
				<td colspan="1" class="col-md-1"></td>
				<td colspan="1" class="col-md-1"></td>
				<td colspan="1" class="col-md-1"></td>
				<td colspan="1" class="col-md-1"></td>
				<td colspan="1" class="col-md-1"></td>
				<td colspan="1" class="col-md-1"></td>
				<td colspan="1" class="col-md-1"></td>
				<td colspan="1" class="col-md-1"></td>
				<td colspan="1" class="col-md-1"></td>
				<td colspan="1" class="col-md-1"></td>
				<td colspan="1" class="col-md-1"></td>
				<td colspan="1" class="col-md-1"></td>
			</tr>
			<tr>
				<td colspan="4" class="tdLable"><span class="required">*</span>业务名称</td>
				<td colspan="8"><input type="text" maxlength="100" placeholder="请输入业务表名称" class="form-control required " name="name" id="name" value="<ww:property value='item.name'/>"></td>
			</tr>
			<tr>
				<td colspan="4" class="tdLable"><span class="required">*</span>业务表名</td>
				<td colspan="8"><input type="text" maxlength="100" <ww:if test="item.uuid != null">readonly</ww:if> placeholder="请输入业务表名" class="form-control required " name="tableName" id="tableName" value="<ww:property value='item.tableName'/>"></td>
			</tr>
			<tr>
				<td colspan="4" class="tdLable"><span class="required">*</span>业务关键字</td>
				<td colspan="8"><input type="text" maxlength="100" <ww:if test="item.uuid != null">readonly</ww:if> placeholder="请输入业务关键字" class="form-control required " name="tableKey" id="tableKey" value="<ww:property value='item.tableKey'/>"></td>
			</tr>
			<tr>
				<td colspan="4" class="tdLable"><span class="required">*</span>允许附件类型</td>
				<td colspan="8"><input type="text" maxlength="100" placeholder="请输入允许附件类型" class="form-control required " name="fileExt" id="fileExt" value="<ww:property value='item.fileExt'/>"></td>
			</tr>
			<tr>
				<td colspan="4" class="tdLable"><span class="required">*</span>附件最大(KB)</td>
				<td colspan="8"><input type="text" maxlength="100" placeholder="请输入附件最大(KB)" class="form-control required number" name="fileLength" id="fileLength" value="<ww:property value='item.fileLength'/>"></td>
			</tr>
			<tr>
				<td colspan="4" class="tdLable"><span class="required">*</span>最大附件数</td>
				<td colspan="8"><input type="text" maxlength="100" placeholder="请输入最大附件数" class="form-control required number" name="fileNumber" id="fileNumber" value="<ww:property value='item.fileNumber'/>"></td>
			</tr>
			<tr>
				<td colspan="4" class="tdLable">排序</td>
				<td colspan="8"><input type="text" maxlength="10" placeholder="请输入排序号" class="form-control " name="orderNum" id="orderNum" value="<ww:property value='item.orderNum'/>"></td>
			</tr>
			<tr>
				<td colspan="4" class="tdLable">扩展参数</td>
				<td colspan="8"><textarea name="extraPara" id="extraPara" class="form-control" rows="5"><ww:property value="@com.css.util.RegexCheck@textArea(item.extraPara)" /></textarea></td>
			</tr>
		</table>
	</div>

	<div class="set-btn" data-spy="affix" data-offset-top="200">
		<button class="btn btn-sm btn-primary submitButton" type="button" onclick="$(this).submit();">
			<i class="fa fa-save"></i> 保存
		</button>
		<button class="btn btn-sm btn-default" type="button" onclick="$css.closeDialog();">
			<i class="fa fa-close"></i> 关闭
		</button>
	</div>
</form>
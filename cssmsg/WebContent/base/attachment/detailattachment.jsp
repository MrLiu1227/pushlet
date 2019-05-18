<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@ taglib prefix="ww" uri="webwork" %>
<ww:bean name="'com.css.apps.base.dict.service.DictMan'" id="dictID" />
<form class="form-horizontal table-form" name="form1" id="form1" method="post" action="detailAttachment.action" onsubmit="return $action.query(this)">
 <input type="hidden" name="uuid" id="uuid" value="<ww:property value="item.uuid"/>">
<div class="content">

	<div class="box box-primary">
		<div class="box-header with-border">
			<b>附件表基本信息</b>
			<div class="box-tools pull-right">
				<button type="button" class="btn btn-box-tool" data-widget="collapse">
					<i class="fa fa-minus"></i>
				</button>
				<button type="button" class="btn btn-box-tool" data-widget="remove">
					<i class="fa fa-times"></i>
				</button>
			</div>
		</div>
		<!-- /.box-header -->
		<div class="box-body">
			<div class="table-responsive">
				<table class="table table-bordered table-striped table-hover">
					<thead>
					<tr>
						<th width="120px">操作</th>
			     	 	<th width="150px" order-field="tableName" class="order">业务表名</th>
			     	 	<th width="150px" order-field="tableKey" class="order">业务关键字</th>
			     	 	<th width="150px" order-field="tableUuid" class="order">表记录ID</th>
			     	 	<th width="150px" order-field="fileName" class="order">附件名称</th>
			     	 	<th width="150px" order-field="fileType" class="order">附件类型</th>
			     	 	<th width="150px" order-field="fileExt" class="order">扩展名</th>
			     	 	<th width="150px" order-field="fileSize" class="order">文件大小</th>
			     	 	<th width="150px" order-field="userId" class="order">用户ID</th>
			     	 	<th width="150px" order-field="uploadTime" class="order">上传时间</th>
			     	 	<th width="150px" order-field="orderNum" class="order">排序号</th>
					</tr>
				</thead>
				<tbody>
				<tr>
				 	<td class="text-center">
						<ww:link funcode="acl_Attachment/updAttachment" caption="修改"  title="修改附件表"  target="cssDialog" rel="getAttachment" href="getAttachment.action?uuid=%{item.uuid}" ></ww:link>&nbsp;
					</td>
					<td class="text-center"><ww:property value="item.tableName"/></td>
					<td class="text-center"><ww:property value="item.tableKey"/></td>
					<td class="text-center"><ww:property value="item.tableUuid"/></td>
					<td class="text-center"><ww:property value="item.fileName"/></td>
					<td class="text-center"><ww:property value="item.fileType"/></td>
					<td class="text-center"><ww:property value="item.fileExt"/></td>
					<td class="text-center"><ww:property value="item.fileSize"/></td>
					<td class="text-center"><ww:property value="item.userId"/></td>
					<td class="text-center"><ww:property value="item.uploadTime"/></td>
					<td class="text-center"><ww:property value="item.orderNum"/></td>
				</tbody>
			</table>
		</div>
	 </div>
	<!-- /.box-body -->
  </div>


			
			
</div>
</form>
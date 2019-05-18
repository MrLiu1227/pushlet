<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@ taglib prefix="ww" uri="webwork"%>
<ww:bean name="'com.css.apps.base.dict.service.DictMan'" id="dictID" />
<form class="form-horizontal table-form" name="attachconfigForm" id="attachconfigForm" method="post" action="dirAttachconfig.action" onsubmit="return $action.query(this)">
	<input type="hidden" name="page.orderFlag" id="page.orderFlag" class="order-flag" value="<ww:property value='page.orderFlag'/>">
	<input type="hidden" name="page.orderString" id="page.orderString" class="order-string" value="<ww:property value='page.orderString'/>">
	<input type="hidden" name="page.pageSize" id="page.pageSize" class="page-size" value="<ww:property value='page.pageSize'/>">
	<input type="hidden" name="page.totalPages" id="page.totalPages" class="page-count" value="<ww:property value='page.totalPages'/>">
	<input type="hidden" name="page.currentPage" id="page.currentPage" class="page-current" value="<ww:property value='page.currentPage'/>">
	
	<div class="content">
		<div class="box box-primary col-ie" ie-size="20" ie-cols="12">
			<div class="box-header with-border">
				<div class="input-group input-group-sm">
					<div class="table-search">
						<ul>
							<li><input class="input-medium" type="text" id="item.tableName" name="item.tableName" maxlength="50" placeholder="请输入业务表名" value="<ww:property value='item.tableName'/>"></li>
							<li><input class="input-medium" type="text" id="item.tableKey" name="item.tableKey" maxlength="50" placeholder="请输入业务关键字" value="<ww:property value='item.tableKey'/>"></li>
							<li><ww:button css="btn btn-sm btn-primary" caption="<i class='fa fa-search'></i> 查询" funcode="acl_attachconfig/dirAttachconfig" type="submit"></ww:button></li>
						</ul>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<!-- /.box-header -->
			<div class="box-body">
				<div class="controls" style="margin: 0px 0px 5px 0px; padding-top: 0px;">
					<!-- Check all button -->
					<div class="btn-group">
						<ww:link funcode="acl_attachconfig/addAttachconfig" css="btn btn-default btn-sm" caption="<i class='fa fa-plus'></i> 添加" title="添加附件配置" target="cssDialog" rel="getAttachconfig" href="getAttachconfig.action"></ww:link>
						<ww:link funcode="acl_attachconfig/delAttachconfig" css="btn btn-default btn-sm" caption="<i class='fa fa-trash-o'></i> 删除" onclick="$action.execBatch(this,{url:'delAttachconfig.action',title:'确认要进行删除操作?'});"></ww:link>
					</div>
				</div>
				<div class="table-responsive">
					<table class="table table-bordered table-striped table-hover">
						<thead>
							<tr>
								<th width="25px"><input group="ids" class="cleck-all" type="checkbox" /></th>
								<th width="120px">操作</th>
								<th width="150px" order-field="name" class="order">业务表称</th>
								<th width="150px" order-field="tableName" class="order">业务表名</th>
								<th width="150px" order-field="tableKey" class="order">业务关键字</th>
								<th width="150px" order-field="fileLength" class="order">附件最大(KB)</th>
								<th width="150px" order-field="fileNumber" class="order">最大附件数</th>
								<th width="150px" order-field="fileExt" class="order">允许附件类型</th>
								<th width="80px" order-field="fileExt" class="order">排序</th>
								<th width="150px" order-field="extraPara" class="order">扩展参数</th>
							</tr>
						</thead>
						<tbody>
							<ww:iterator value="page.results" id="data" status="data">
								<tr>
									<td class="text-center"><input type="checkbox" name="ids" id="ids" value="<ww:property value="uuid" />" /></td>
									<td class="text-center"><ww:link funcode="acl_attachconfig/updAttachconfig" caption="修改" title="修改附件配置" target="cssDialog" rel="getAttachconfig" href="getAttachconfig.action?uuid=%{uuid}"></ww:link>&nbsp; <ww:link funcode="acl_attachconfig/delAttachconfig" caption="删除" onclick="$action.exec(this,{url:'delAttachconfig.action?ids=%{uuid}',title:'确认要进行删除操作?'})" href="javascript:;"></ww:link>&nbsp;</td>
									<td class="text-center"><ww:property value="name" /></td>
									<td class="text-center"><ww:property value="tableName" /></td>
									<td class="text-center"><ww:property value="tableKey" /></td>
									<td class="text-center"><ww:property value="fileLength" /></td>
									<td class="text-center"><ww:property value="fileNumber" /></td>
									<td class="text-center"><ww:property value="fileExt" /></td>
									<td class="text-center"><ww:property value="orderNum" /></td>
									<td class="text-left"><ww:property value="extraPara" /></td>
							</ww:iterator>
						</tbody>
					</table>
				</div>
				<div class="table-pagination">
					<ul class="no-margin">
						<ww:property value="page.pageSplit" />
					</ul>
				</div>
			</div>
			<!-- /.box-body -->
		</div>
	</div>
</form>
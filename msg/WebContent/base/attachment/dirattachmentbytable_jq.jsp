<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@ taglib prefix="ww" uri="webwork"%>
<ww:bean name="'com.css.apps.base.dict.service.DictMan'" id="dictID" />
<ww:bean name="'com.css.apps.base.user.common.UserService'" id="userService" />

<form class="form-horizontal table-form" name="frm_<ww:property value='formId'/>" id="frm_<ww:property value='formId'/>" method="post" action="dirAttachmentByTable.action" onsubmit="return $action.query(this)">
	<input type="hidden" name="page.orderFlag" id="page.orderFlag" class="order-flag" value="<ww:property value='page.orderFlag'/>"> <input type="hidden" name="page.orderString" id="page.orderString" class="order-string" value="<ww:property value='page.orderString'/>"> <input type="hidden" name="page.pageSize" id="page.pageSize" class="page-size" value="<ww:property value='page.pageSize'/>"> <input type="hidden" name="page.totalPages" id="page.totalPages" class="page-count" value="<ww:property value='page.totalPages'/>"> <input type="hidden" name="page.currentPage" id="page.currentPage" class="page-current" value="<ww:property value='page.currentPage'/>"> <input
		type="hidden" name="item.tableName" id="item.tableName" value="<ww:property value='item.tableName'/>"> <input type="hidden" name="item.tableKey" id="item.tableKey" value="<ww:property value='item.tableKey'/>"> <input type="hidden" name="item.tableUuid" id="item.tableUuid" value="<ww:property value='item.tableUuid'/>"> <input type="hidden" name="formId" id="formId" value="<ww:property value='formId'/>">


	<div class="content" style="min-height: 400px">
		<div class="box box-primary col-ie" ie-size="10" ie-cols="12">
			<div class="box-header with-border">
				<div class="input-group input-group-sm" style="width: 400px">
					<div class="table-search">
						<ul>
							<li><input class="input-large" type="text" id="item.fileName" name="item.fileName" maxlength="50" placeholder="请输入名称" value="<ww:property value='item.fileName'/>"></li>
							<li><ww:button css="btn btn-sm btn-primary" caption="<i class='fa fa-search'></i> 查询" funcode="acl_fileMain/dirCategory" type="submit"></ww:button></li>
						</ul>
					</div>
				</div>
				<ul class="list-unstyled pull-right">
					<li class="pull-right">
						<div id="uploadAttach" class="mouseMove"></div>
					</li>
				</ul>
				<div class="clear-fix"></div>
			</div>
			<!-- /.box-header -->
			<div class="box-body">
				<div class="table-responsive" id="list-container">
					<table class="table table-bordered table-striped table-hover">
						<thead>
							<tr>
								<th width="50px">图标</th>
								<th order-field="fileName" class="order">名称</th>
								<th width="120px" order-field="uploadTime" class="order">上传时间</th>
								<th width="50px" order-field="fileType" class="order">类型</th>
								<th width="100px" order-field="fileSize" class="order">大小</th>
							</tr>
						</thead>
						<tbody>
							<ww:iterator value="page.results" id="data" status="data">
								<tr class="fileRow" id="<ww:property value="uuid" />" data-key="<ww:property value="tableKey" />">
									<td class="text-center icon"></td>
									<td class="text-left chWord"><span class="default-file-name">
											<ww:property value="fullName" />
										</span> <span class="statusCell"> </span> <span class="toolsCell"></span></td>
									<td class="text-center chWord"><ww:property value="new java.text.SimpleDateFormat('yy-MM-dd HH:mm').format(uploadTime)" /></td>
									<td class="text-center fileType chWord"><ww:property value="fileExt" /></td>
									<td class="text-center size chWord"><ww:property value="fileSize" /></td>
								</tr>
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
<script type="text/javascript">
	using('jqupload', function() {
		var $form = $('#frm_<ww:property value='formId'/>');
		var selfTableMethod = {
			name : 'noStyle',
			sortable : false,
			dotFlag : false,
			getTemplate : function(config) {
				return '';
			},
			addFile : function(el, data, status, config) {
				var id = data.id;
				var $table = $('#list-container', $form).find('table tbody');
				var tbl, row, cell;
				tbl = $table[0];
				var rowId = 0;
				row = tbl.insertRow(rowId);
				row.id = id;
				row.className = "fileRow";
				row.setAttribute('status', status);
				row.setAttribute('data-key', '<ww:property value="item.tableKey"/>');
				
				var k = 0;
				cell = row.insertCell(k++);
				if (config.fileIcon) {
					cell.className = "text-center icon";
					cell.innerHTML = $.jquploadUtil.getIconImg(data, 48);
				}
				else {
					cell.className = "numCell";
					$table.find('.firstCell').html('序号');
					cell.innerHTML = $table[0].rows.length - 1;
				}
				
				cell = row.insertCell(k++);
				cell.className = "text-left chWord";
				var liStr = '<span class="default-file-name">' + getFullName(data) + '</span> ';
				if (!config.readonly) liStr += '<span class="statusCell"><span class="label label-info">' + (status == 1 ? '加载' : '初始') + '成功</span></span>';
				liStr += '<span class="toolsCell"></span>';
				cell.innerHTML = liStr;
				
				//时间
				cell = row.insertCell(k++);
				cell.className = "text-center chWord";
				cell.innerHTML = $.jquploadUtil.formatDate($.jquploadUtil.currentDate(), 2, 16);
				
				//类型
				cell = row.insertCell(k++);
				cell.className = "text-center fileType chWord";
				cell.innerHTML = data.fileExt;
				
				//文件大小
				cell = row.insertCell(k++);
				cell.className = "text-center size chWord";
				cell.innerHTML = '<span class="default-file-size">' + $.file.getFileSize(data.fileSize) + '</span>';
				addCallback(id, config);
			}
		};
		var setNumber = function(tableKey, step) {
			$el = $form.find('.table-pagination b');
			var number = parseInt($el.html()) + step;
			$el.html(number);
			
			var treeObj = $treeObj<ww:property value="formId" />.getTreeObj();
			var allNode = treeObj.getNodeByParam("id", "");
			updateTreeNode(treeObj, allNode, step);
			var keyNode = treeObj.getNodeByParam("id", tableKey);
			updateTreeNode(treeObj, keyNode, step);
		};
		var updateTreeNode = function(treeObj, node, step) {
			var name = node.name.split('(');
			var number = parseInt(name[1].substring(0, name[1].length - 1)) + step;
			node.name = name[0] + '(' + number + ')'
			treeObj.updateNode(node);
		};
		
		var tmplInit = function() {
			this.body = $('#list-container', $form).find('table tbody');
		};
		var addCallback = function(data, o) {
			setNumber(o.extraData.tableKey, 1);
		};
		var delCallback = function(trId, o, extraData) {
			setNumber(extraData.tableKey, -1);
		};
		
		var setting = $form.find('#uploadAttach').jqupload({
			btnClass : 'btn-success',
			confirm : true,
			readonly : false,
			checkUpload : '<ww:property value="checkUpload()"/>',
			extraData : {
				tableName : '<ww:property value="item.tableName"/>',
				tableKey : '<ww:property value="item.tableKey"/>',
				tableUuid : '<ww:property value="item.tableUuid"/>',
				loadData : 'no'
			},
			style : selfTableMethod,
			delCallback : delCallback
		});
		
		$(".fileRow", $form).each(function() {
			var ext = $(this).find('.fileType').html();
			$(this).find('.icon').html($.file.getIconImg(48, ext));
			var size = $(this).find('.size').html();
			$(this).find('.size').html($.file.getFileSize(size));
			$.jquploadUtil.initTools($(this).attr('id'), setting, delCallback, $form); //readonly=false 编辑模式 1:重命名 下载 删除 ; readonly=true 查看模式 3:只有下载
		});
	});
</script>


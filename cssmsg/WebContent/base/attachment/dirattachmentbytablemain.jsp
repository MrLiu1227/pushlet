<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@ taglib prefix="ww" uri="webwork"%>

<div class="tab-pane-middle">
	<div class="tab-pane-body-215 l-autoscroll">
		<jsp:include page="dirattachmentbytable.jsp"></jsp:include>
	</div>
</div>

<div class="tab-pane-left-215 box box-danger">
	<div class="box-header with-border">
		<h3 class="box-title">文件分类</h3>
	</div>
	<div class="box-body">
		<ul id="tree_<ww:property value='formId' />" class="ztree"></ul>
	</div>
</div>

<script type="text/javascript">
	var $treeObj<ww:property value="formId" />;
	using('tree', function() {
		var formId = '<ww:property value='formId' />';
		var clickAttachTreeNode = function(e, treeId, treeNode) {
			var $form = $('#frm_' + formId);
			$("#item\\.tableKey", $form).val(treeNode.id);
			$('#page\\.currentPage', $form).val(1);
			$form.submit();
		};
		var treeSetting = {
			curNodeId : '',
			sortable : false,
			loadUrl : 'jsonAttachmentByTableTree.action',
			otherParam : {
				"tableName" : '<ww:property value="tableName"/>',
				"tableUuid" : '<ww:property value="tableUuid"/>'
			},
			onClick : clickAttachTreeNode
		};
		$treeObj<ww:property value="formId" /> = $('#tree_' + formId).jqztree(formId, treeSetting);
	});
</script>
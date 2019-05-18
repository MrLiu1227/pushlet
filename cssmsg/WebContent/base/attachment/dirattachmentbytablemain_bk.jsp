<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@ taglib prefix="ww" uri="webwork"%>

<div class="tab-pane-middle">
	<div class="tab-pane-body-2 l-autoscroll" id="AttachmentByTableContent">
		<jsp:include page="dirattachmentbytable.jsp"></jsp:include>
	</div>
</div>

<div class="tab-pane-left noscroll" id="AttachmentByTableTreePanel">
	<div class="box-lefttree">
		<div class="pull-left">
			<span>文件分类</span>
		</div>
	</div>
	<ul id="AttachmentByTableTree" class="ztree s-autoscroll"></ul>
</div>


<script type="text/javascript">
	var $AttachmentByTableTree;
	using('tree', function() {
		var formId = 'attachmentByTableForm';
		var clickAttachTreeNode = function(e, treeId, treeNode) {
			var $form = $('#' + formId);
			$("#item\\.tableKey", $form).val(treeNode.id);
			$('#page\\.currentPage', $form).val(1);
			$form.submit();
		};
		
		$AttachmentByTableTree = $('#AttachmentByTableTree').jqztree(formId, {
			curNodeId : '',
			sortable : false,
			loadUrl : 'jsonAttachmentByTableTree.action',
			otherParam : {
				"tableName" : '<ww:property value="tableName"/>',
			},
			onClick : clickAttachTreeNode
		});
		$('#AttachmentByTableTreePanel').jqsplit({
			next : 'AttachmentByTableContent',
			size : 230,
			draggable : true,
			toggle : true
		});
	});
</script>
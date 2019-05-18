;
(function($) {
	$sMenuTree = {
		treeObj : null,
		curNodeId : null,
		init : function(curNodeId) {
			$sMenuTree.curNodeId = curNodeId;
			$sMenuTree.treeObj = $.fn.zTree.init($("#sMenuTree"), sMenuTreeSettion);
		},
		addFolder : function(data, form) {
			if (data.result == 0) {
				closeDialogRefreshTabForm(null, form);
				$css.tip('新建成功！');
				var node = $sMenuTree.treeObj.getNodeByParam("id", $sMenuTree.curNodeId);
				$sMenuTree.treeObj.addNodes(node, {
					id : data.info.uuid,
					pId : $sMenuTree.curNodeId,
					isParent : false,
					name : data.info.name
				});
			} else if (data.result == 2) {
				closeDialogRefreshTabForm(null, form);
				$css.tip('修改成功！');
				if (data.info) {
					var node = $sMenuTree.treeObj.getNodeByParam("id", data.info.uuid);
					node.name = data.info.name;
					$sMenuTree.treeObj.updateNode(node);
				}
			} else {
				$css.alert(data.msg);
			}
		},
		removeFolder : function(data, form) {
			if (data.result == 0) {
				refreshCurrentTabForm(null, form);
				$css.tip('操作成功！');
				var ids = data.info;
				if (ids.length > 0) {
					for (var i = 0; i < ids.length; i++) {
						var node = $sMenuTree.treeObj.getNodeByParam("id", ids[i]);
						$sMenuTree.treeObj.removeNode(node);
					}
				}
			} else {
				$css.alert(data.msg);
			}
		},
		saveSMenuTree : function(el) {
			var nodes = $sMenuTree.treeObj.transformToArray($sMenuTree.treeObj.getNodes());
			var str = '';
			for (var i = 0; i < nodes.length; i++) {
				if (nodes[i].id != '0')
					str += nodes[i].id + '@' + nodes[i].pId + '@';
			}
			$action.exec(el, {
				url : 'saveSMenuTree.action',
				data : {
					treeStr : str
				},
				title : '确认要进行栏目顺序保存操作？'
			});
		},
		onSuccess : function(event, treeId, treeNode, msg) {
			var node = $sMenuTree.treeObj.getNodeByParam("id", $sMenuTree.curNodeId);
			$sMenuTree.treeObj.selectNode(node, false);
		},
		clickSMenuTree : function(e, treeId, treeNode) {
			var $form = $("#sMenuForm");
			$sMenuTree.curNodeId = treeNode.id;
			$("#item\\.parentId", $form).val(treeNode.id);
			$('#page\\.currentPage', $form).val(1);
			$form.submit();
		},
		clickFolder : function(treeNodeId) {
			var node = $sMenuTree.treeObj.getNodeByParam("id", treeNodeId);
			$sMenuTree.treeObj.selectNode(node, false);
			$sMenuTree.clickSMenuTree(null, null, node);
		},
		canDrag : function(treeId, nodes, targetNode) {
			return (targetNode.id != '0');
		}
	};
	var sMenuTreeSettion = {
		data : {
			simpleData : {
				enable : true
			}
		},
		async : {
			enable : true,
			url : "jsonSMenuTree.action",
			autoParam : [ "id=id" ],
			type : "post"
		},
		edit : {
			enable : true,
			showRemoveBtn : false,
			showRenameBtn : false,
			drag : {
				prev : $sMenuTree.canDrag,
				next : $sMenuTree.canDrag,
				isCopy : false,
				isMove : true
			}
		},
		callback : {
			onClick : $sMenuTree.clickSMenuTree,
			onAsyncSuccess : $sMenuTree.onSuccess
		}
	};
})(jQuery)

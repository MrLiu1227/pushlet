/*
 * jqztree v1.0 2017.7 by CSS WangWeidong
 * ztree组件扩展，通用列表增、删、改，树排序
 */
;
(function($) {
	$.fn.jqztree = function(formId, opt) {
		var $this = $(this), treeObj, curNodeId;
		var clickTreeNode = function(e, treeId, treeNode) {
			var $form = $('#' + formId);
			curNodeId = treeNode.id;
			if (!isnull(opt.parentId)) {
				$(opt.parentId, $form).val(treeNode.id);
			}
			else {
				$("#item\\.parentId", $form).val(treeNode.id);
				$("#parentId", $form).val(treeNode.id);
			}
			$('#page\\.currentPage', $form).val(1);
			$form.submit();
		};
		var defaults = {
			curNodeId : '',
			loadUrl : '',
			sortUrl : '',
			autoParam : [ "id=id" ],
			otherParam : {},
			addTip : '新建成功！',
			editTip : '修改成功！',
			delTip : '删除成功！',
			sortable : true, // true 支持排序
			sortSaveAuto : false, // 拖动后自动排序
			sortTip : '确认要进行栏目顺序保存操作？',
			onClick : clickTreeNode,
			canDrag : function(treeId, nodes, targetNode) {
				return (targetNode.id != '0');
			},
			canInner : function(treeId, nodes, targetNode) {
				return true;
			},
			onLoad : null,
			extSetting : {}
		};
		var o = $.extend(defaults, opt);
		curNodeId = o.curNodeId;
		var getSortParam = function() {
			var nodes = treeObj.transformToArray(treeObj.getNodes());
			var str = '';
			for (var i = 0; i < nodes.length; i++) {
				if (nodes[i].id != '0') str += nodes[i].id + '@' + nodes[i].pId + '@';
			}
			var param = $.extend({
				treeStr : str
			}, o.otherParam);
			
			return {
				url : o.sortUrl,
				title : o.sortTip,
				tip : !o.sortSaveAuto,
				data : param
			}
		},

		service = {
			getSetting : function() {
				return setting;
			},
			getTreeObj : function() {
				return treeObj;
			},
			getCurNodeId : function() {
				return curNodeId;
			},
			getCurNode : function() {
				return treeObj.getNodeByParam("id", curNodeId);
			},
			refreshParentNode : function(pId) {
				var node = treeObj.getNodesByParam("id", pId);
				if (node.length > 0) {
					treeObj.reAsyncChildNodes(node[0], "refresh");
				}
			},
			refreshAll : function() {
				treeObj.reAsyncChildNodes(null, "refresh");
			},
			rereshParentNode : function(id) {
				var node = treeObj.getNodesByParam("id", id, null);
				treeObj.reAsyncChildNodes(parent, "refresh");
			},
			addFolder : function(data, form) {
				if (data.result == 0) {
					closeDialogRefreshTabForm(null, form);
					$css.tip(o.addTip);
					var node = treeObj.getNodeByParam("id", curNodeId);
					treeObj.addNodes(node, {
						id : data.info.uuid,
						pId : curNodeId,
						isParent : false,
						name : data.info.name
					});
				}
				else if (data.result == 2) {
					closeDialogRefreshTabForm(null, form);
					$css.tip(o.editTip);
					if (data.info) {
						var node = treeObj.getNodeByParam("id", data.info.uuid);
						node.name = data.info.name;
						treeObj.updateNode(node);
					}
				}
				else {
					$css.alert(data.msg);
				}
			},
			removeFolder : function(data, form) {
				if (data.result == 0) {
					refreshCurrentTabForm(null, form);
					$css.tip(o.delTip);
					var ids = data.info;
					if (ids.length > 0) {
						for (var i = 0; i < ids.length; i++) {
							var node = treeObj.getNodeByParam("id", ids[i]);
							treeObj.removeNode(node);
						}
					}
				}
				else {
					$css.alert(data.msg);
				}
			},
			saveTreeAuto : function(form) {
				$action.execNoTip(getSortParam(), form);
			},
			saveTree : function(el, callback) {
				var params = getSortParam();
				params.afterExec = callback;
				$action.exec(el, params);
			},
			click : function(treeNodeId) {
				var node = service.focus(treeNodeId);
				o.onClick(null, null, node);
			},
			focus : function(treeNodeId) {
				curNodeId = treeNodeId;
				var node = treeObj.getNodeByParam("id", treeNodeId);
				if (node != null) treeObj.selectNode(node, false);
				return node;
			},
			find : function(key, value) {
				var node = treeObj.getNodeByParam(key, value);
				if (node) {
					curNodeId = node.value;
					treeObj.selectNode(node, false);
				}
				return node;
			}
		}

		var setting = {
			data : {
				simpleData : {
					enable : true
				}
			},
			async : {
				enable : true,
				url : o.loadUrl,
				autoParam : o.autoParam,
				otherParam : o.otherParam,
				type : "post"
			},
			edit : {
				enable : o.sortable,
				showRemoveBtn : false,
				showRenameBtn : false,
				drag : {
					prev : o.canDrag,
					next : o.canDrag,
					inner : o.canInner,
					isCopy : false,
					isMove : true
				}
			},
			callback : {
				onClick : o.onClick,
				onAsyncSuccess : function(event, treeId, treeNode, msg) {
					if (typeof treeNode == 'undefined') {
						service.focus(curNodeId);
					}
					if ($.isFunction(o.onLoad)) {
						o.onLoad.apply(treeObj);
					}
				},
				onDrop : o.sortSaveAuto ? function() {
					service.saveTreeAuto($('#' + formId));
				} : null
			}
		};
		setting = $.extend(true, setting, o.extSetting);
		treeObj = $.fn.zTree.init($this, setting);
		return service;
	};
})(jQuery);

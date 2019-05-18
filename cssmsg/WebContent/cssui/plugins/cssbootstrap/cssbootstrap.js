///<jscompress sourcefile="dropdown.js" />
/*
 * ========================================================================
 * Bootstrap: dropdown.js v3.3.7 http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc. Licensed under MIT
 * (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 */

;
(function($) {
	'use strict';
	
	// DROPDOWN CLASS DEFINITION
	// =========================
	
	var backdrop = '.dropdown-backdrop'
	var toggle = '[data-toggle="dropdown"]'
	var Dropdown = function(element) {
		$(element).on('click.bs.dropdown', this.toggle)
	}
	Dropdown.VERSION = '3.3.7';
	
	function getParent($this) {
		var selector = $this.attr('data-target');
		
		if (!selector) {
			selector = $this.attr('href');
			selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip
			// for ie7
		}
		var $parent = selector && $(selector);
		return $parent && $parent.length ? $parent : $this.parent();
	}
	
	function clearMenus(e) {
		if (e && e.which === 3)
			return;
		
		$(backdrop).remove()
		$(toggle).each(function() {
			var $this = $(this);
			var $parent = getParent($this);
			var relatedTarget = {
				relatedTarget : this
			}
			if (!$parent.hasClass('open'))
				return;
			if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target))
				return;
			$parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))
			if (e.isDefaultPrevented())
				return;
			$this.attr('aria-expanded', 'false');
			$parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget));
			
		})
	}
	
	Dropdown.prototype.toggle = function(e) {
		var $this = $(this);
		if ($this.is('.disabled, :disabled'))
			return;
		var $parent = getParent($this);
		var isActive = $parent.hasClass('open');
		clearMenus();
		if (!isActive) {
			if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
				$(document.createElement('div')).addClass('dropdown-backdrop').insertAfter($(this)).on('click', clearMenus)
			}
			var relatedTarget = {
				relatedTarget : this
			}
			$parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget));
			
			if (e.isDefaultPrevented())
				return;
			
			$this.trigger('focus').attr('aria-expanded', 'true');
			$parent.toggleClass('open').trigger($.Event('shown.bs.dropdown', relatedTarget));
			
		}
		return false;
	}

	Dropdown.prototype.keydown = function(e) {
		if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName))
			return;
		var $this = $(this);
		e.preventDefault();
		e.stopPropagation();
		if ($this.is('.disabled, :disabled'))
			return;
		var $parent = getParent($this);
		var isActive = $parent.hasClass('open');
		if (!isActive && e.which != 27 || isActive && e.which == 27) {
			if (e.which == 27)
				$parent.find(toggle).trigger('focus');
			return $this.trigger('click');
		}
		var desc = ' li:not(.disabled):visible a';
		var $items = $parent.find('.dropdown-menu' + desc);
		if (!$items.length)
			return;
		var index = $items.index(e.target);
		if (e.which == 38 && index > 0)
			index--; // up
		if (e.which == 40 && index < $items.length - 1)
			index++; // down
		if (!~index)
			index = 0;
		$items.eq(index).trigger('focus');
	}

	// DROPDOWN PLUGIN DEFINITION
	// ==========================
	
	function Plugin(option) {
		return this.each(function() {
			var $this = $(this);
			var data = $this.data('bs.dropdown');
			if (!data)
				$this.data('bs.dropdown', (data = new Dropdown(this)))
			if (typeof option == 'string')
				data[option].call($this);
		})
	}
	
	// APPLY TO STANDARD DROPDOWN ELEMENTS
	// ===================================
	
	$(document).on('click.bs.dropdown.data-api', clearMenus).on('click.bs.dropdown.data-api', '.dropdown form', function(e) {
		e.stopPropagation()
	}).on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

})(jQuery);

;
///<jscompress sourcefile="tab.js" />
/*
 * ========================================================================
 * Bootstrap: tab.js v3.3.7 http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc. Licensed under MIT
 * (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 */

;
(function($) {
	'use strict';
	// TAB CLASS DEFINITION
	// ====================
	var Tab = function(element) {
		this.element = $(element);
	};
	
	Tab.VERSION = '3.3.7';
	Tab.TRANSITION_DURATION = 150;
	
	Tab.prototype.show = function() {
		var $this = this.element;
		var $ul = $this.closest('ul:not(.dropdown-menu)');
		var selector = $this.data('target');
		if (!selector) {
			selector = $this.attr('href');
			selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip
			// for ie7
		}
		
		if ($this.parent('li').hasClass('active'))
			return;
		var $previous = $ul.find('.active:last a');
		var hideEvent = $.Event('hide.bs.tab', {
			relatedTarget : $this[0]
		})
		var showEvent = $.Event('show.bs.tab', {
			relatedTarget : $previous[0]
		})

		$previous.trigger(hideEvent);
		$this.trigger(showEvent);
		if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented())
			return;
		var $target = $(selector);
		this.activate($this.closest('li'), $ul);
		this.activate($target, $target.parent(), function() {
			$previous.trigger({
				type : 'hidden.bs.tab',
				relatedTarget : $this[0]
			})
			$this.trigger({
				type : 'shown.bs.tab',
				relatedTarget : $previous[0]
			})
		})
	}

	Tab.prototype.activate = function(element, container, callback) {
		var $active = container.find('> .active');
		var transition = callback && $.support.transition && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length);
		
		function next() {
			$active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded', false);
			element.addClass('active').find('[data-toggle="tab"]').attr('aria-expanded', true);
			if (transition) {
				element[0].offsetWidth; // reflow for transition
				element.addClass('in');
			} else {
				element.removeClass('fade');
			}
			
			if (element.parent('.dropdown-menu').length) {
				element.closest('li.dropdown').addClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded', true);
			}
			callback && callback();
		}
		$active.length && transition ? $active.one('bsTransitionEnd', next).emulateTransitionEnd(Tab.TRANSITION_DURATION) : next();
		$active.removeClass('in');
	}
	// TAB PLUGIN DEFINITION
	// =====================
	
	function Plugin(option) {
		return this.each(function() {
			var $this = $(this);
			var data = $this.data('bs.tab');
			if (!data)
				$this.data('bs.tab', (data = new Tab(this)));
			if (typeof option == 'string')
				data[option]();
		});
	}
	
	// TAB DATA-API
	// ============
	
	var clickHandler = function(e) {
		e.preventDefault();
		Plugin.call($(this), 'show');
	};
	
	$(document).on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler);
	$(document).on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler);
	
})(jQuery);
;
///<jscompress sourcefile="jqtab.js" />
/*
 * jqtab v1.0 2017.6 by CSS WangWeidong
 * bootstrap3-tab组件扩展
 */
;
(function($) {
	$.fn.jqtab = function(opt) {
		var defaults = {
			focusId : '',	//通过id定位，最高优先级
			focusIndex : 0,//通过索引序号定位（从0开始）
			extraPara : {} //业务参数
		};
		var o = $.extend(defaults, opt);
		return this.each(function() {
			var $this = $(this)
			var init = function() {
				$this.on('click.tab.data-api', '[data-toggle="tab"]', function(e) {
					var $tab = $(this);
					var id = $tab.attr('id');
					if (isnull(id))
						id = uuid();
					$tab.attr('id', id);
					$tab.attr('href', '#tab' + id);
					var $content = $this.find('.tab-content #tab' + id);
					if ($content.attr('id') == undefined) {
						$content = $('<div class="tab-pane" id="tab' + id + '"></div>');
						$this.find('.tab-content').append($content);
						var url = $tab.attr('data-url');
						$navTab.ajaxLoadForm(url, o.extraPara, $content);
					}
					e.preventDefault();
				});
				var $a = null;
				if (!isnull(o.focusId)) {
					$a = $this.find('#' + o.focusId).first();
					if ($a.length != 1)
						$a = null;
				}
				if ($a == null) {
					$a = $this.find('ul li a');
					if ($a.length < o.focusIndex)
						o.focusIndex = 0;
					$a = $this.find('ul li a').eq(o.focusIndex);
				}
				$a.click();
			};
			init();
		});
	};
})(jQuery);;
///<jscompress sourcefile="jqztree.js" />
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
;
///<jscompress sourcefile="jqdropdownztree.js" />
/**
 * jqdropdownztree v1.0 2017.8 by CSS WangWeidong 下拉ztree组件扩展
 */
;
(function($) {
	$.fn.jqdropdownztree = function(formId, optZtree, opt) {
		var defaults = {
			offsetLeft : null,
			offsetTop : null,
			height : 300,
			className : 'input-large'
		};
		var o = $.extend(defaults, opt);
		var $input = $(this);
		var contentId = uuid();
		var $content = $('<div id="' + contentId + '" class="' + o.className + '" style="display: none; position: absolute; background-color: #fff; border: 1px solid #CCCCCC; overflow: auto; height: ' + o.height + 'px;"></div>');
		var $tree = $('<ul class="ztree"></ul>');
		$input.after($content);
		$content.append($tree);
		
		var service = {
			showMenu : function() {
				var pos = $input.position();
				if (isnull(o.offsetLeft)) o.offsetLeft = 0;
				if (isnull(o.offsetTop)) o.offsetTop = $input.outerHeight();
				console.log($input.outerWidth());
				$content.css({
					left : (pos.left + o.offsetLeft) + "px",
					top : (pos.top + o.offsetTop) + "px",
					width : $input.outerWidth() + "px"
				}).slideDown("fast");
				$("body").bind("mousedown", service.onBodyDown);
			},
			onBodyDown : function(event) {
				if (!(event.target.id == contentId || $(event.target).parents("#" + contentId).length > 0)) service.hideMenu();
			},
			hideMenu : function() {
				$content.fadeOut("fast");
				$('body').unbind('mousedown', service.onBodyDown);
			},
			setValue : function(data) {
				$input.val(data);
			}
		};
		var init = function() {
			$input.css({
				"cursor" : "pointer",
				"background-color" : "#fff"
			});
			
			$input.bind('click', function() {
				service.showMenu();
			});
			
			$tree.jqztree(formId, optZtree);
		}
		init();
		return service;
	};
})(jQuery);
;
///<jscompress sourcefile="jqsplit.js" />
/*
 * jqsplit v1.0 2017.6 by CSS WangWeidong
 */
;
(function($) {
	$jqsplit = {
		resize : function() {
			if (isIE6) {
				$(".jqsplit").each(function() {
					var $prev = $(this).prev();
					$(this).css("height", px($prev.height()));
				});
			}
		},
		callback : null
	};
	$.fn.jqsplit = function(o) {
		var defaults = {
			next : null,
			size : 190,
			toogleSize : 40,
			toggle : true,
			draggable : true,
			splitWidth : 5,
			path : 'cssui/plugins/jqsplit/',
			direction : 'horizontal' // vertical, horizontal
		};
		var o = $.extend(defaults, o);
		return this.each(function() {
			var cur = {};
			var moveFlag = false;
			var $one = $(this);
			var initHeight = $one.height();
			var $two = o.next == null ? $one.next() : $('#' + o.next);
			var $container = $one.parent();
			var $d = $(document);
			var left = 0;
			var width = o.size;
			var toggleSize = o.size;
			var $split = $('<div class="jqsplit"></div>');
			var $img = $('<div class="openCloseImg"></div>');
			if (o.toggle)
				$split.append($img);
			$one.after($split);
			var getCursor = function(e) {
				var x = (e.originalEvent) ? e.originalEvent.pageX : e.pageX;
				var y = (e.originalEvent) ? e.originalEvent.pageY : e.pageY;
				if (isIE6 || isIE7 || isIE8 || isIE9) {
					x = e.pageX;
					y = e.pageY;
				}
				return {
					'x' : x,
					'y' : y
				};
			}, px = function(n) {
				return isNumber(n) ? n + 'px' : n;
			}, moveTo = function(cur) {
				width = cur.x - left;
				resize();
			}, toggleImg = function() {
				if (o.toggle) {
					$img.css('background-image', 'url(' + o.path + (width < o.toogleSize ? 'open.png' : 'close.png') + ')');
					if (isIE6 || isIE7)
						$one.find('.l-autoscroll, .s-autoscroll').css("overflow", width < o.toogleSize ? 'hidden' : 'auto');
				}
			}, imgClick = function(e) {
				e.stopPropagation();
				width = width > o.toogleSize ? 0 : o.size;
				animate(50);
				toggleImg();
			}, resize = function() {
				if (width < 0)
					return;
				$one.css("width", px(width));
				$split.css("left", px(width));
				if (o.next)
					$two.css("margin-left", px(width + o.splitWidth));
				toggleImg();
				if ($jqsplit.callback)
					$jqsplit.callback.call(this);
			}, ie6fixed = function() {
				if (isIE6) {
					setTimeout(function() {
						if (initHeight < o.toogleSize) {
							width = 0;
							$img.click();
							$split.css("left", px(o.size));
						}
						$split.css({
							"height" : px($one.height()),
							"width" : px(o.splitWidth),
							"border" : "1px solid #d2d6de"
						});
						$split.hide().delay(100).show();
					}, 0);
				}
			},
			animate = function(timer) {
				if (width < 0)
					return;
				$one.animate({
					"width" : px(width)
				}, timer);
				$split.animate({
					"left" : px(width)
				}, timer);
				if (o.next)
					$two.animate({
						"margin-left" : px(width + o.splitWidth)
					}, timer);
				if ($jqsplit.callback)
					$jqsplit.callback.call(this, null, timer);
			}, log = function(str) {
				console.log($one.attr('id'), str);
				
			}, startEvent = function() {
				$container.on('mousemove touchmove', function(e) {
					if (!moveFlag)
						return;
					e.preventDefault();
					cur = getCursor(e);
					moveTo(getCursor(e));
				});
				$d.on('mouseup.jqsplit', function(e) {
					e.preventDefault();
					stopEvent();
					moveFlag = false;
				});
				
			}, stopEvent = function() {
				$d.unbind('mouseup.jqsplit');
				$container.unbind();
				
			}, unbindEvent = function() {
				$d.unbind('mouseup.jqsplit');
				$container.unbind();
				$split.unbind();
				
			}, initEvent = function() {
				if (o.draggable) {
					unbindEvent();
					$split.on('mousedown touchstart', function(e) {
						e.preventDefault();
						moveFlag = true;
						startEvent();
						cur = getCursor(e);
						left = cur.x - $one.width();
					});
				}
				
				if (o.toggle)
					(o.draggable ? $img : $split).click(imgClick);
				
				if (!o.toggle && !o.draggable)
					$split.css("cursor", "default");
				
			}, initStyle = function() {
				$split.css("cursor", o.draggable ? "e-resize" : "pointer");
				$split.addClass(o.direction);
				resize();
			}, init = function() {
				initStyle();
				initEvent();
				ie6fixed();
			};
			init();
		});
	};
	function isNumber(n) {
		return typeof n === 'number' && !isNaN(n);
	}
})(jQuery);;
///<jscompress sourcefile="jqsplittable.js" />
/**
 * jqsplit v1.0 2017.7 by CSS WangWeidong
 * 
 */
;
(function($) {
	$.fn.jqsplittable = function(o) {
		var defaults = {
			draggable : true,
			direction : 'col' // col, row
		};
		var o = $.extend(defaults, o);
		var dir = o.direction;
		return this.each(function() {
			var $d = $(document);
			var $this = $(this);
			var curTd;
			var sCur = {};
			var objSize = [];
			var moveFlag = false;
			var getCurPosition = function(e) {
				var x = (e.originalEvent) ? e.originalEvent.pageX : e.pageX;
				var y = (e.originalEvent) ? e.originalEvent.pageY : e.pageY;
				if (isIE6 || isIE7 || isIE8 || isIE9) {
					x = e.pageX;
					y = e.pageY;
				}
				return {
					'x' : x,
					'y' : y
				};
			}, px = function(n) {
				return isNumber(n) ? n + 'px' : n;
			}, startEvent = function(e) {
				initSize[dir]();
				$this.addClass('dragging');
				$this.find(">tbody>tr>td").bind('mousemove', function(e) {
					if (!moveFlag)
						return;
					e.preventDefault();
					e.stopPropagation();
					var eCur = getCurPosition(e);
					var delta = getCurXY[dir](eCur) - getCurXY[dir](sCur)
					if (delta == 0)
						return;
					var firstObj = delta < 0 ? $(this) : getFirstObj[dir]($(this));
					var secondObj = getSecondObj[dir](firstObj);
					delta = Math.round(delta);
					
					if (getObjSize(firstObj) + delta > 0 && getObjSize(secondObj) - delta > 0) {
						setObjSizeDelta(firstObj, delta);
						setObjSizeDelta(secondObj, -delta);
						resize();
					}
					sCur = eCur;
					
				});
				$d.on('mouseup.jqsplit', function(e) {
					e.preventDefault();
					stopEvent();
					moveFlag = false;
				});
				
			}, getCurXY = {
				'col' : function(cur) {
					return cur.x;
					
				},
				'row' : function(cur) {
					return cur.y;
				}
			
			}, getFirstObj = {
				'col' : function(obj) {
					return obj.prev();
				},
				'row' : function(obj) {
					return obj.parent().prev().find('>td');
				}
			}, getSecondObj = {
				'col' : function(first) {
					return first.next()
				},
				'row' : function(first) {
					return first.parent().next().find('>td');
				}
			}, getIndex = {
				'col' : function(obj) {
					return obj.index();
				},
				'row' : function(obj) {
					return obj.parent().index();
				}
			}, resizeScroll = {
				'col' : function() {
					var maxWidth = jQuery.maxValue(objSize);
					$this.find(">tbody>tr>td").each(function() {
						if (maxWidth > 0 && objSize[$(this).index()] == maxWidth) {
							$(this).css('width', 'auto');
							maxWidth = -1;
						} else
							$(this).css('width', objSize[$(this).index()]);
					});
				},
				'row' : function() {
					$this.find(">tbody>tr").each(function() {
						var $td = $(this).find(">td");
						$td.css('height', objSize[$(this).index()]);
						// 调用外部$scroll方法
						$scroll.setScroll($td, objSize[$(this).index()] + 3);
						$td.css('height', '');
					});
				}
			}, initSize = {
				'col' : function() {
					$this.find(">tbody>tr>td").each(function() {
						objSize[$(this).index()] = $(this).outerWidth();
					});
				},
				'row' : function() {
					$this.find(">tbody>tr").each(function() {
						var $td = $(this).find(">td");
						objSize[$(this).index()] = $td.outerHeight();
					});
				}
			
			}, getCursorStyle = {
				'col' : 'e-resize',
				'row' : 'n-resize'
			}, getObjSize = function(obj) {
				return objSize[getIndex[dir](obj)];
				
			}, setObjSize = function(obj, size) {
				objSize[getIndex[dir](obj)] = size;
				
			}, setObjSizeDelta = function(obj, size) {
				objSize[getIndex[dir](obj)] += size;
				
			}, stopEvent = function() {
				$this.removeClass('dragging');
				$d.unbind('mouseup.jqsplit');
				$this.find(">tbody>tr>td").unbind();
				
			}, unbindEvent = function() {
				$d.unbind('mouseup.jqsplit');
				$this.unbind();
			}, resize = function() {
				resizeScroll[dir]();
				if ($jqsplit.callback)
					$jqsplit.callback.call(this, null, 100);
			},

			check = function(e) {
				if ($(e.target).attr('split-el') != 'splitDraggable')
					return false;
				sCur = getCurPosition(e);
				var pos = $this.offset();
				if (sCur.x - pos.left < 10 || pos.left + $this.width() - sCur.x < 10 || sCur.y - pos.top < 10 || pos.top + $this.height() - sCur.y < 10)
					return false;
				//e.stopPropagation();
				return true;
			},

			init = function() {
				if (o.draggable)
					$this.after('<div class="bottomMaskDiv"></div><div class="leftMaskDiv"></div><div class="rightMaskDiv"></div>');
				else
					$this.css('background-image', 'none');
				initSize[dir]();
				unbindEvent();
				$this.bind("mousemove", function(e) {
					if (check(e)) {
						$this.css("cursor", o.draggable?getCursorStyle[dir]:'default');
					} else
						$this.css("cursor", '');
				});
				if (o.draggable) {
					$this.bind("mousedown", function(e) {
						if (check(e)) {
							moveFlag = true;
							startEvent(e);
						}
					});
				}
			};
			init();
		});
	};
})(jQuery);;
///<jscompress sourcefile="jqdialog.js" />
/**
 * CssDialog & $jqDialog v1.0 2017.6.1 by CSS WangWeidong
 * 
 * modal.js from bootstrap3.3.x
 * 
 */

;
(function($) {
	'use strict';
	var Modal = function(element, options) {
		this.options = options;
		this.$body = $(document.body);
		this.$element = $(element);
		this.$dialog = this.$element.find('.modal-dialog');
		this.isShown = null;
		
		if (this.options.remote) {
			this.$element.find('.modal-content').load(this.options.remote, $.proxy(function() {
				this.$element.trigger('loaded.bs.modal');
			}, this))
		}
	}

	Modal.VERSION = '3.3.7';
	Modal.TRANSITION_DURATION = 300;
	
	Modal.DEFAULTS = {
		keyboard : true,
		show : true
	}

	Modal.prototype.toggle = function(_relatedTarget) {
		return this.isShown ? this.hide() : this.show(_relatedTarget);
	}

	Modal.prototype.show = function(_relatedTarget) {
		var that = this;
		var e = $.Event('show.bs.modal', {
			relatedTarget : _relatedTarget
		})
		this.$element.trigger(e);
		if (this.isShown || e.isDefaultPrevented()) return;
		this.isShown = true;
		this.$body.addClass('modal-open');
		this.escape();
		this.resize();
		this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));
		this.$dialog.on('mousedown.dismiss.bs.modal', function() {
			that.$element.one('mouseup.dismiss.bs.modal', function(e) {
			})
		})

		var transition = $.support.transition && that.$element.hasClass('fade');
		if (!that.$element.parent().length) that.$element.appendTo(that.$body);
		that.$element.show().scrollTop(0);
		if (transition) that.$element[0].offsetWidth;
		that.$element.addClass('in');
		that.enforceFocus();
		var e = $.Event('shown.bs.modal', {
			relatedTarget : _relatedTarget
		})
		transition ? that.$dialog // wait for modal to slide in
		.one('bsTransitionEnd', function() {
			that.$element.trigger('focus').trigger(e)
		}).emulateTransitionEnd(Modal.TRANSITION_DURATION) : that.$element.trigger('focus').trigger(e)
	}

	Modal.prototype.hide = function(e) {
		if (e) e.preventDefault();
		e = $.Event('hide.bs.modal');
		this.$element.trigger(e);
		if (!this.isShown || e.isDefaultPrevented()) return;
		this.isShown = false;
		this.escape();
		this.resize();
		$(document).off('focusin.bs.modal');
		this.$element.removeClass('in').off('click.dismiss.bs.modal').off('mouseup.dismiss.bs.modal');
		this.$dialog.off('mousedown.dismiss.bs.modal');
		$.support.transition && this.$element.hasClass('fade') ? this.$element.one('bsTransitionEnd', $.proxy(this.hideModal, this)).emulateTransitionEnd(Modal.TRANSITION_DURATION) : this.hideModal();
	}

	Modal.prototype.enforceFocus = function() {
		$(document).off('focusin.bs.modal') // guard against infinite focus loop
		.on('focusin.bs.modal', $.proxy(function(e) {
			if (document !== e.target && this.$element[0] !== e.target && !this.$element.has(e.target).length) {
				this.$element.trigger('focus');
			}
		}, this))
	}

	Modal.prototype.escape = function() {
		if (this.isShown && this.options.keyboard) {
			this.$element.on('keydown.dismiss.bs.modal', $.proxy(function(e) {
				switch (e.which) {
					case 27:
						this.hide()
						break;
					case 13:
						var $element = $(':focus');
						if (!$element.is('textarea') && !$element.is('select')) {
							var dlg = $jqdialog.getTopDialog();
							var button = dlg.getContent().find('.submitButton');
							if (button.length == 1) {
								e.preventDefault();
								button.click();
							}
						}
						break;
					default:
						break;
				}
			}, this))
		}
		else if (!this.isShown) {
			this.$element.off('keydown.dismiss.bs.modal');
		}
	}

	Modal.prototype.resize = function() {
		if (this.isShown) {
			$(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this));
		}
		else {
			$(window).off('resize.bs.modal');
		}
	}

	Modal.prototype.hideModal = function() {
		var that = this;
		this.$element.hide();
		that.$body.removeClass('modal-open');
		that.resetAdjustments();
		that.$element.trigger('hidden.bs.modal');
	}

	// these following methods are used to handle overflowing modals
	Modal.prototype.handleUpdate = function() {
	}

	Modal.prototype.resetAdjustments = function() {
		this.$element.css({
			paddingLeft : '',
			paddingRight : ''
		})
	}

	// MODAL PLUGIN DEFINITION
	// =======================
	
	function Plugin(option, _relatedTarget) {
		return this.each(function() {
			var $this = $(this);
			var data = $this.data('bs.modal');
			var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option);
			
			if (!data) $this.data('bs.modal', (data = new Modal(this, options)));
			if (typeof option == 'string')
				data[option](_relatedTarget);
			else if (options.show) data.show(_relatedTarget);
		})
	}
	
	$.fn.modal = Plugin;
	$.fn.modal.Constructor = Modal;
	
})(jQuery)

;
(function($) {
	var CssDialog = function(opt) {
		this.defaults = {
			id : uuid(),
			title : '视窗', // 标题,默认'视窗'
			content : '<div class="ui_loading"><span>loading...</span></div>',
			showHeader : true, // 是否显示header
			showFooter : true, // 是否显示footer
			showEffect : 'fade',// 弹出框特效
			cssClass : '',
			btnStyle : 'btn-default btn-sm',
			btnClose : true, // 是否显示关闭按钮
			draggable : true, // 是否允许用户拖动位置
			top : 0.382, // Y轴坐标
			backdrop : false, // 是否支持按空白处关闭
			keyboard : true, // 是否支持Esc键关闭
			onshown : null, // 自定义弹出框弹出完成后加载
			onshow : null, // 自定义弹出框show时立即加载
			maxHeight : null,
			width : null,
			height : null,
			buttons : [],
			/**
			 * <pre>
			 * 每个button对象的结构如下：
			 * {
			 * 	icon: 按钮图标
			 * 	name: 按钮标题
			 * 	label: 按钮显示的文字，说明：在label为空时，label = icon +' '+ name
			 * 	cssClass: 按钮自定义样式，默认为 btn-default btn-sm
			 * 	action: 按下按钮执行的方法定义传入对象为dialog对象
			 * }
			 * </pre>
			 */
			
			data : {}
		};
		this.draggableData = {
			isMouseDown : false,
			mouseOffset : {}
		};
		this.options = $.extend(this.defaults, opt);
	}
	/**
	 * CssDialog方法
	 */
	CssDialog.prototype = {
		init : function() {
			this.createModal();
			this.createDialog();
			this.createMask();
			this.createContent();
			this.createHeader();
			this.createBody();
			this.createFooter();
			this.getModal().append(this.getDialog()).append(this.getMask());
			if (isIE6) {
				this.createIE6frame();
				this.getModal().append(this.getIE6frame());
			}
			this.getDialog().append(this.getContent());
			this.getContent().append(this.getHeader()).append(this.getBody()).append(this.getFooter());
			
		},
		createModal : function() {
			this.$modal = $('<div class="modal jqmodal" role="dialog" aria-hidden="true" tabindex="-1"></div>');
			this.$modal.prop('id', this.getId());
			if (!isnull(this.getCssClass())) this.$modal.addClass(this.getCssClass());
			if (!isnull(this.options.showEffect)) this.$modal.addClass(this.options.showEffect);
		},
		getModal : function() {
			return this.$modal;
		},
		createDialog : function() {
			this.$modalDialog = $('<div class="modal-dialog"></div>');
		},
		getDialog : function() {
			return this.$modalDialog;
		},
		createMask : function() {
			this.$modalMask = $('<div class="modal-mask"></div>');
		},
		getMask : function() {
			return this.$modalMask;
		},
		createIE6frame : function() {
			this.$modalMask = $('<iframe frameborder="0" src="about:blank" style="position:absolute;z-index:-1;width:100%;top:0px;left:0px;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0)"><\/iframe>');
		},
		getIE6frame : function() {
			return this.$modalMask;
		},
		createContent : function() {
			this.$modalContent = $('<div class="modal-content"></div>');
		},
		getContent : function() {
			return this.$modalContent;
		},
		createHeader : function() {
			this.$modalHeader = this.options.showHeader ? $('<div class="modal-header"></div>') : $('');
		},
		getHeader : function() {
			return this.$modalHeader;
		},
		createBody : function() {
			this.$modalBody = $('<div class="modal-body"></div>');
		},
		getBody : function() {
			return this.$modalBody;
		},
		createFooter : function() {
			this.$modalFooter = this.options.showFooter ? $('<div class="modal-footer"></div>') : $('');
		},
		getFooter : function() {
			return this.$modalFooter;
		},
		getId : function() {
			return this.options.id;
		},
		getCssClass : function() {
			return this.options.cssClass;
		},
		getButtons : function() {
			return this.options.buttons;
		},
		setButtons : function(buttons) { // 重置
			this.options.buttons = buttons;
		},
		addButton : function(button) {
			this.options.buttons.push(button);
		},
		addButtons : function(buttons) { // 追加
			var _that = this;
			$.each(buttons, function(index, button) {
				_that.addButton(button);
			});
		},
		getTitle : function() {
			return this.$modalTitle
		},
		getTitleInfo : function() {
			return this.$modalTitle.html();
		},
		setTitle : function(title) {
			title = isnull(title) ? '视窗' : title;
			this.options.title = title;
			this.getTitle().html(title);
		},
		setContent : function(content) {
			this.options.content = content;
			this.getBody().html(content);
		},
		createHeaderContent : function() {
			if (!this.options.showHeader) return;
			var _that = this;
			if (this.options.btnClose) {
				var $button = $('<button type="button" class="close" data-dismiss="modal" aria-hidden="true"><span aria-hidden="true">&times;</span></button>');
				this.getHeader().append($button);
			}
			this.$modalTitle = $('<h4 class="modal-title"></h4>');
			this.getHeader().append(this.$modalTitle);
			this.setTitle(this.options.title);
		},
		createBodyContent : function() {
			this.setContent(this.options.content);
		},
		createFooterContent : function() {
			if (!this.options.showFooter) return;
			var _that = this;
			$.each(_that.options.buttons, function(index, button) {
				var $button = $('<button class="btn"></button>');
				_that.getFooter().append($button);
				
				if (!isnull(button.label))
					$button.append(button.label);
				else
					$button.append(dealNull(button.icon) + ' ' + dealNull(button.name));
				
				if (!isnull(button.title)) $button.attr('title', button.title);
				
				if (!isnull(button.cssClass))
					$button.addClass(button.cssClass);
				else
					$button.addClass(_that.options.btnStyle);
				
				if (!isnull(button.data)) {
					$.each(button.data, function(key, value) {
						$button.attr(key, value);
					});
				}
				if (button.action) {
					$button.click(function() {
						button.action.call(this, _that);
					})
				}
			});
		},
		resizeSimple : function() {
			var top = ($(window).height() - this.getContent().height() - 80) * this.options.top;
			var left = ($(window).width() - this.getContent().width()) * 0.5;
			if (top < 0) top = 0;
			if (left < 0) left = 0;
			this.getDialog().css({
				"left" : px(left),
				"top" : px(top)
			});
			if (isnull(this.options.height)) {
				if (isnull(this.options.maxHeight)) this.options.maxHeight = $(window).height() - 60;
				this.getBody().css({
					"max-height" : px(this.options.maxHeight)
				});
			}
		},
		resize : function() {
			var _that = this;
			if (isIE6 || isIE7) {
				this.getDialog().css("width", px(this.getBody()[0].scrollWidth + 20));
				setTimeout(function() {
					_that.resizeSimple();
				}, 0);
			}
			else
				_that.resizeSimple();
		},
		initEvent : function() {
			var _that = this;
			_that.getModal().modal({
				backdrop : _that.options.backdrop,
				keyboard : _that.options.keyboard
			});
			_that.getModal().on('hide.bs.modal', function() {
				$jqdialog.remove(_that.getId());
				$(this).remove();
			});
			if (!isnull(_that.options.onshow)) {
				_that.getModal().on('show.bs.modal', function() {
					_that.options.onshow(_that);
				});
			}
			if (!isnull(_that.options.onshown)) {
				_that.getModal().on('shown.bs.modal', function() {
					_that.options.onshown(_that);
				});
			}
			
			if (!isnull(_that.options.width)) {
				this.getBody().css({
					"width" : px(_that.options.width)
				});
			}
			if (!isnull(_that.options.height)) {
				this.getBody().css({
					"height" : px(_that.options.height)
				});
			}
			
			_that.resizeSimple();
			_that.draggable();
		},
		draggable : function() {
			if (this.options.draggable) {
				this.getHeader().css("cursor", "move");
				this.getHeader().addClass('draggable').on('mousedown', {
					dialog : this
				}, function(event) {
					var dialog = event.data.dialog;
					dialog.draggableData.isMouseDown = true;
					var dialogOffset = dialog.getDialog().offset();
					dialog.draggableData.mouseOffset = {
						top : event.clientY - dialogOffset.top,
						left : event.clientX - dialogOffset.left
					};
				});
				this.getModal().on('mouseup mouseleave', {
					dialog : this
				}, function(event) {
					event.data.dialog.draggableData.isMouseDown = false;
				});
				$('body').on('mousemove', {
					dialog : this
				}, function(event) {
					var dialog = event.data.dialog;
					if (!dialog.draggableData.isMouseDown) {
						return;
					}
					dialog.getDialog().offset({
						top : event.clientY - dialog.draggableData.mouseOffset.top,
						left : event.clientX - dialog.draggableData.mouseOffset.left
					});
				});
			}
			return this;
		},
		close : function() {
			this.getModal().modal('hide');
		},
		show : function() {
			this.init();
			this.createHeaderContent();
			this.createBodyContent();
			this.createFooterContent();
			this.initEvent();
			this.getModal().modal('show');
			return this;
		}
	};
	var map = {};
	$jqdialog = {
		show : function(options) {
			var dlg = new CssDialog(options).show();
			delete map[dlg.getId()];
			map[dlg.getId()] = dlg;
			if ($navTab.options.shownCallback) $navTab.options.shownCallback.call(this, dlg.getBody());
			dlg.resize();
			return dlg;
		},
		getTopId : function() {
			var id = '';
			for (tmpKey in map)
				id = tmpKey;
			return id;
		},
		getDialogById : function(id) {
			return map[id];
		},
		getTopDialog : function(id) {
			var id = $jqdialog.getTopId();
			return map[id];
		},
		remove : function(id) {
			delete map[id];
		},
		closeById : function(id) {
			var instance = map[id];
			instance.close();
		},
		closeAll : function() {
			$.each(map, function(id, instance) {
				instance.close();
			});
		},
		closeTop : function() {
			var id = $jqdialog.getTopId();
			if (!isnull(id)) $jqdialog.closeById(id);
		},
		getButton : function(btnName, callback, autoClose) {
			var button = {};
			switch (btnName) {
				case '关闭':
				case '取消':
					button.label = '<i class="fa fa-close"></i> ' + btnName;
					break;
				case '保存':
					button.cssClass = 'btn-primary btn-sm submitButton';
					button.label = '<i class="fa fa-save"></i> ' + btnName;
					break;
				case '确定':
					button.cssClass = 'btn-primary btn-sm  submitButton';
					button.label = '<i class="fa fa-check"></i> ' + btnName;
					break;
			}
			button.action = function(dialog) {
				if (callback) callback.call(this, dialog);
				if (typeof autoClose == 'undefined' || autoClose == true) dialog.close();
			};
			return button;
		},
		getButtonNotClose : function(btnName, callback) {
			return $jqdialog.getButton(btnName, callback, false)
		},
		alert : function(content, callback) {
			$jqdialog.show({
				title : '提示',
				cssClass : 'alert_dialog',
				content : '<div class="dialogIcon"><i class="fa fa-info-circle"></i> </div>' + content,
				buttons : [ $jqdialog.getButton('关闭', callback) ]
			});
		},
		confirm : function(content, callbackOk, callbackCancel) {
			$jqdialog.show({
				title : '确认',
				cssClass : 'confirm_dialog',
				content : '<div class="dialogIcon"><i class="fa fa-question-circle"></i> </div>' + content,
				buttons : [ $jqdialog.getButton('确定', callbackOk), $jqdialog.getButton('取消', callbackCancel) ]
			})
		},
		open : function(params) {
			var url, title, rel, data, width, height, callback, srcForm = null;
			if (params instanceof jQuery) {
				var $target = params;
				url = dealNull($target.attr('href'));
				title = dealNull($target.attr('title'));
				rel = dealNull($target.attr('rel'));
				width = dealNull($target.attr('width'));
				height = dealNull($target.attr('height'));
				data = '';
				// 关闭对话框时要刷新该窗口
				var $sForm = $target.parents('form').first();
				srcForm = uuid();
				$sForm.attr('data-wwd-formid', srcForm);
			}
			else {
				if (typeof (params) === 'string') {
					url = params, title = '', rel = '', data = '';
				}
				else {
					url = dealNull(params.url), title = dealNull(params.title), rel = dealNull(params.rel), data = dealNull(params.data), callback = params.callback ? params.callback : null;
					width = dealNull(params.width), height = dealNull(params.height);
				}
			}
			if (isnull(rel)) rel = uuid();
			if (url.isExternalUrl()) {
				var dlg = $jqdialog.show({
					id : rel,
					title : title,
					cssClass : 'iframe_' + rel, // 可自定义 modal-frame 样式
					content : '<iframe src="' + url + '" class="modal-frame" frameborder="no" border="0" marginwidth="0" marginheight="0"></iframe>',
					showFooter : false
				});
			}
			else {
				var opt = {
					id : rel,
					title : title,
					showFooter : false
				};
				if (!isnull(width)) opt.width = width;
				if (!isnull(height)) opt.height = height;
				
				var dlg = $jqdialog.show(opt);
				$.ajax({
					url : url,
					data : data,
					type : 'POST',
					cache : false,
					success : function(content) {
						dlg.getBody().html(content);
						if (srcForm != null) {
							var form = dlg.getBody().find('form')[0];
							$(form).attr('data-wwd-srcformid', srcForm);
						}
						var $btns = $('#' + rel + ' .set-btn');
						if (!isnull($btns)) {
							$btns.css({
								'padding-top' : '15px',
								'padding-right' : '15px',
								'margin-top' : '15px',
								'margin-left' : '-15px',
								'margin-right' : '-15px',
								'border-top' : '1px solid #f4f4f4'
							});
						}
						if ($navTab.options.shownCallback) $navTab.options.shownCallback.call(this, dlg.getBody());
						dlg.resize();
						if (callback != null) callback(params);
						
					}
				});
			}
			return false;
		},
		tip : function(content, timer) {
			var dlg = $jqdialog.show({
				content : '<div class="dialogIcon"><i class="fa fa-check-circle-o"></i> </div>' + content,
				cssClass : 'tip_dialog',
				showHeader : false,
				showFooter : false
			});
			setTimeout(function() {
				dlg.close();
			}, isnull(timer) ? 1500 : timer);
		}
	// toDo
	}
})(jQuery)
;
///<jscompress sourcefile="maskedinput.js" />
/*
    jQuery Masked Input Plugin
    Copyright (c) 2007 - 2015 Josh Bush (digitalbush.com)
    Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
    Version: 1.4.1
*/
!function(factory) {
    "function" == typeof define && define.amd ? define([ "jquery" ], factory) : factory("object" == typeof exports ? require("jquery") : jQuery);
}(function($) {
    var caretTimeoutId, ua = navigator.userAgent, iPhone = /iphone/i.test(ua), chrome = /chrome/i.test(ua), android = /android/i.test(ua);
    $.mask = {
        definitions: {
            "9": "[0-9]",
            a: "[A-Za-z]",
            "*": "[A-Za-z0-9]"
        },
        autoclear: false,
        dataName: "rawMaskFn",
        placeholder: "_"
    }, $.fn.extend({
        caret: function(begin, end) {
            var range;
            if (0 !== this.length && !this.is(":hidden")) return "number" == typeof begin ? (end = "number" == typeof end ? end : begin, 
            this.each(function() {
                this.setSelectionRange ? this.setSelectionRange(begin, end) : this.createTextRange && (range = this.createTextRange(), 
                range.collapse(!0), range.moveEnd("character", end), range.moveStart("character", begin), 
                range.select());
            })) : (this[0].setSelectionRange ? (begin = this[0].selectionStart, end = this[0].selectionEnd) : document.selection && document.selection.createRange && (range = document.selection.createRange(), 
            begin = 0 - range.duplicate().moveStart("character", -1e5), end = begin + range.text.length), 
            {
                begin: begin,
                end: end
            });
        },
        unmask: function() {
            return this.trigger("unmask");
        },
        inputmask: function(){
      	  return this.each(function () {
         	  var opts = $(this).attr("data-inputmask");
         	  $(this).mask(opts);
         	});
        },
        mask: function(mask, settings) {
            var input, defs, tests, partialPosition, firstNonMaskPos, lastRequiredNonMaskPos, len, oldVal;
            if (!mask && this.length > 0) {
                input = $(this[0]);
                var fn = input.data($.mask.dataName);
                return fn ? fn() : void 0;
            }
            return settings = $.extend({
                autoclear: $.mask.autoclear,
                placeholder: $.mask.placeholder,
                completed: null
            }, settings), defs = $.mask.definitions, tests = [], partialPosition = len = mask.length, 
            firstNonMaskPos = null, $.each(mask.split(""), function(i, c) {
                "?" == c ? (len--, partialPosition = i) : defs[c] ? (tests.push(new RegExp(defs[c])), 
                null === firstNonMaskPos && (firstNonMaskPos = tests.length - 1), partialPosition > i && (lastRequiredNonMaskPos = tests.length - 1)) : tests.push(null);
            }), this.trigger("unmask").each(function() {
                function tryFireCompleted() {
                    if (settings.completed) {
                        for (var i = firstNonMaskPos; lastRequiredNonMaskPos >= i; i++) if (tests[i] && buffer[i] === getPlaceholder(i)) return;
                        settings.completed.call(input);
                    }
                }
                function getPlaceholder(i) {
                    return settings.placeholder.charAt(i < settings.placeholder.length ? i : 0);
                }
                function seekNext(pos) {
                    for (;++pos < len && !tests[pos]; ) ;
                    return pos;
                }
                function seekPrev(pos) {
                    for (;--pos >= 0 && !tests[pos]; ) ;
                    return pos;
                }
                function shiftL(begin, end) {
                    var i, j;
                    if (!(0 > begin)) {
                        for (i = begin, j = seekNext(end); len > i; i++) if (tests[i]) {
                            if (!(len > j && tests[i].test(buffer[j]))) break;
                            buffer[i] = buffer[j], buffer[j] = getPlaceholder(j), j = seekNext(j);
                        }
                        writeBuffer(), input.caret(Math.max(firstNonMaskPos, begin));
                    }
                }
                function shiftR(pos) {
                    var i, c, j, t;
                    for (i = pos, c = getPlaceholder(pos); len > i; i++) if (tests[i]) {
                        if (j = seekNext(i), t = buffer[i], buffer[i] = c, !(len > j && tests[j].test(t))) break;
                        c = t;
                    }
                }
                function androidInputEvent() {
                    var curVal = input.val(), pos = input.caret();
                    if (oldVal && oldVal.length && oldVal.length > curVal.length) {
                        for (checkVal(!0); pos.begin > 0 && !tests[pos.begin - 1]; ) pos.begin--;
                        if (0 === pos.begin) for (;pos.begin < firstNonMaskPos && !tests[pos.begin]; ) pos.begin++;
                        input.caret(pos.begin, pos.begin);
                    } else {
                        for (checkVal(!0); pos.begin < len && !tests[pos.begin]; ) pos.begin++;
                        input.caret(pos.begin, pos.begin);
                    }
                    tryFireCompleted();
                }
                function blurEvent() {
                    checkVal(), input.val() != focusText && input.change();
                }
                function keydownEvent(e) {
                    if (!input.prop("readonly")) {
                        var pos, begin, end, k = e.which || e.keyCode;
                        oldVal = input.val(), 8 === k || 46 === k || iPhone && 127 === k ? (pos = input.caret(), 
                        begin = pos.begin, end = pos.end, end - begin === 0 && (begin = 46 !== k ? seekPrev(begin) : end = seekNext(begin - 1), 
                        end = 46 === k ? seekNext(end) : end), clearBuffer(begin, end), shiftL(begin, end - 1), 
                        e.preventDefault()) : 13 === k ? blurEvent.call(this, e) : 27 === k && (input.val(focusText), 
                        input.caret(0, checkVal()), e.preventDefault());
                    }
                }
                function keypressEvent(e) {
                    if (!input.prop("readonly")) {
                        var p, c, next, k = e.which || e.keyCode, pos = input.caret();
                        if (!(e.ctrlKey || e.altKey || e.metaKey || 32 > k) && k && 13 !== k) {
                            if (pos.end - pos.begin !== 0 && (clearBuffer(pos.begin, pos.end), shiftL(pos.begin, pos.end - 1)), 
                            p = seekNext(pos.begin - 1), len > p && (c = String.fromCharCode(k), tests[p].test(c))) {
                                if (shiftR(p), buffer[p] = c, writeBuffer(), next = seekNext(p), android) {
                                    var proxy = function() {
                                        $.proxy($.fn.caret, input, next)();
                                    };
                                    setTimeout(proxy, 0);
                                } else input.caret(next);
                                pos.begin <= lastRequiredNonMaskPos && tryFireCompleted();
                            }
                            e.preventDefault();
                        }
                    }
                }
                function clearBuffer(start, end) {
                    var i;
                    for (i = start; end > i && len > i; i++) tests[i] && (buffer[i] = getPlaceholder(i));
                }
                function writeBuffer() {
                    input.val(buffer.join(""));
                }
                function checkVal(allow) {
                    var i, c, pos, test = input.val(), lastMatch = -1;
                    for (i = 0, pos = 0; len > i; i++) if (tests[i]) {
                        for (buffer[i] = getPlaceholder(i); pos++ < test.length; ) if (c = test.charAt(pos - 1), 
                        tests[i].test(c)) {
                            buffer[i] = c, lastMatch = i;
                            break;
                        }
                        if (pos > test.length) {
                            clearBuffer(i + 1, len);
                            break;
                        }
                    } else buffer[i] === test.charAt(pos) && pos++, partialPosition > i && (lastMatch = i);
                    return allow ? writeBuffer() : partialPosition > lastMatch + 1 ? settings.autoclear || buffer.join("") === defaultBuffer ? (input.val() && input.val(""), 
                    clearBuffer(0, len)) : writeBuffer() : (writeBuffer(), input.val(input.val().substring(0, lastMatch + 1))), 
                    partialPosition ? i : firstNonMaskPos;
                }
                var input = $(this), buffer = $.map(mask.split(""), function(c, i) {
                    return "?" != c ? defs[c] ? getPlaceholder(i) : c : void 0;
                }), defaultBuffer = buffer.join(""), focusText = input.val();
                input.data($.mask.dataName, function() {
                    return $.map(buffer, function(c, i) {
                        return tests[i] && c != getPlaceholder(i) ? c : null;
                    }).join("");
                }), input.one("unmask", function() {
                    input.off(".mask").removeData($.mask.dataName);
                }).on("focus.mask", function() {
                    if (!input.prop("readonly")) {
                        clearTimeout(caretTimeoutId);
                        var pos;
                        focusText = input.val(), pos = checkVal(), caretTimeoutId = setTimeout(function() {
                            input.get(0) === document.activeElement && (writeBuffer(), pos == mask.replace("?", "").length ? input.caret(0, pos) : input.caret(pos));
                        }, 10);
                    }
                }).on("blur.mask", blurEvent).on("keydown.mask", keydownEvent).on("keypress.mask", keypressEvent).on("input.mask paste.mask", function() {
                    input.prop("readonly") || setTimeout(function() {
                        var pos = checkVal(!0);
                        input.caret(pos), tryFireCompleted();
                    }, 0);
                }), chrome && android && input.off("input.mask").on("input.mask", androidInputEvent), 
                checkVal();
            });
        }
    });
});;
///<jscompress sourcefile="textarea.js" />
/**
 * textarea-api v1.0 2017.9 by CSS WangWeidong textarea-api: maxlength
 */
;
(function($) {
	'use strict';
	var textareaMaxlen = function() {
		var $this = $(this);
		var $parent = $this.parent();
		var name = $this.attr('name');
		var $next = $parent.find('#' + name + '-textarea-api');
		if ($next.length == 0) {
			$next = $('<div id="' + name + '-textarea-api" class="pull-right maxlenCls"></div>');
			$this.after($next);
		}
		var count_input = $('<em style="color:red"></em>')
		var count_total = $this.attr('maxlen');
		var count_max = $('<span>' + count_total + '</span>');
		var area_val = $this.val();
		if (area_val.lenCn() > count_total) {
			area_val = autoAddEllipsis(area_val, count_total);// 根据字节截内容
			$this.val(area_val);
			count_input.text(0);
		}
		else {
			count_input.text(count_total - area_val.lenCn());// 显示可输入数
		}
		$next.html('');
		$next.append(count_input).append('/').append(count_max);
	}
	$(document).on('keyup.css.textarea-api keydown.css.textarea-api', '[textarea-api="maxlen"]', textareaMaxlen);
	
})(jQuery);
;

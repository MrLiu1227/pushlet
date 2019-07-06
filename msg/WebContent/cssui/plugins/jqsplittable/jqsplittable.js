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
})(jQuery);
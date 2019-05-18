/*
 * jqsplit v1.0 2017.7 by CSS WangWeidong
 */
;
(function($) {
	$.fn.jqsplittable = function() {
		return this.each(function() {
			var $d = $(document);
			var $this = $(this);
			var curTd;
			var sCur = {};
			var colWidth = [];
			var moveFlag = false;
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
			}, startEvent = function(e) {
				initSize();
				$this.addClass('dragging');
				$this.find(">tbody>tr>td").bind('mousemove', function(e) {
					if (!moveFlag)
						return;
					e.preventDefault();
					e.stopPropagation();
					var eCur = getCursor(e);
					if (sCur.x == eCur.x)
						return;
					var leftTd = (sCur.x > eCur.x) ? $(this) : $(this).prev();
					var rightTd = leftTd.next();
					var dt = Math.round(eCur.x - sCur.x);
					if (getWidth(leftTd) + dt > 0 && getWidth(rightTd) - dt > 0) {
						setWidthDelta(leftTd, dt);
						setWidthDelta(rightTd, -dt);
						resize();
					}
					sCur = eCur;
					
				});
				$d.on('mouseup.jqsplit', function(e) {
					e.preventDefault();
					stopEvent();
					moveFlag = false;
				});
				
			}, getWidth = function(td) {
				return colWidth[td.index()];
				
			}, setWidth = function(td, width) {
				colWidth[td.index()] = width;
				
			}, setWidthDelta = function(td, width) {
				colWidth[td.index()] += width;
				
			}, stopEvent = function() {
				$this.removeClass('dragging');
				$d.unbind('mouseup.jqsplit');
				$this.find(">tbody>tr>td").unbind();
				
			}, unbindEvent = function() {
				$d.unbind('mouseup.jqsplit');
				$this.unbind();
			}, initSize = function() {
				$this.find(">tbody>tr>td").each(function() {
					colWidth[$(this).index()] = $(this).outerWidth();
				});
			}, resize = function() {
				var maxWidth = jQuery.maxValue(colWidth);
				$this.find(">tbody>tr>td").each(function() {
					if (maxWidth > 0 && colWidth[$(this).index()] == maxWidth) {
						$(this).css('width', 'auto');
						maxWidth = -1;
					} else
						$(this).css('width', colWidth[$(this).index()]);
				});
				if ($jqsplit.callback)
					$jqsplit.callback.call(this, null, 100);
				
			}, init = function() {
				$this.after('<div class="splitTableRowDiv"></div><div class="splitTableDiv"></div>');
				initSize();
				unbindEvent();
				$this.bind("mousemove", function(e) {
					var eCur = getCursor(e);
					var pos = $this.offset();
					if (eCur.x - pos.left < 10 || pos.left + $this.width() - eCur.x < 10 || eCur.y - pos.top < 10 || pos.top + $this.height() - eCur.y < 10)
						return;
					var $target = $(e.target);
					$(this).css("cursor", $target.attr('split-el') == 'splitDraggable' ? 'e-resize' : '');
				});
				$this.bind("mousedown", function(e) {
					var eCur = getCursor(e);
					var pos = $this.offset();
					if (eCur.x - pos.left < 10 || pos.left + $this.width() - eCur.x < 10 || eCur.y - pos.top < 10 || pos.top + $this.height() - eCur.y < 10)
						return;
					e.stopPropagation();
					var $target = $(e.target);
					sCur = getCursor(e);
					if ($target.attr('split-el') == 'splitDraggable') {
						moveFlag = true;
						startEvent(e);
					}
				});
			};
			init();
		});
	};
})(jQuery);
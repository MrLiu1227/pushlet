/*
 * jqscroll for ie6,ie7 v1.0 2017.6 by CSS WangWeidong
 */
;
(function($) {
	$.fn.jqscroll = function(o) {
		var defaults = {
			size : 190,
			toogleSize : 40,
			toggle : true,
			draggable : true,
			path : 'cssui/plugins/jqsplit/',
			direction : 'horizontal' // vertical, horizontal
		};
		var o = $.extend(defaults, o);
		return this.each(function() {
			var cur = {};
			var moveFlag = false;
			var $one = $(this);
			var $two = $one.next();
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
				resize(width);
			}, toggleImg = function() {
				if (o.toggle) {
					$img.css('background-image', 'url(' + o.path + (width < o.toogleSize ? 'open.png' : 'close.png') + ')');
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
				if (isIE6)
					$split.css("height", px($one.height()));
				toggleImg();
			}, animate = function(timer) {
				if (width < 0)
					return;
				$one.animate({
					"width" : px(width)
				}, timer);
				$split.animate({
					"left" : px(width)
				}, timer);
				
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
				if (isIE6) {
					setTimeout(function() {
						$split.css("height", px($one.height()));
					}, 0);
				}
				$split.addClass(o.direction);
				resize();
				
			}, init = function() {
				initStyle();
				initEvent();
			};
			init();
		});
	};
	function isNumber(n) {
		return typeof n === 'number' && !isNaN(n);
	}
})(jQuery);
/*
 * contextmenu 2016.6 by CSS WeidongWang
 */
(function($) {
	var menuMap = {};
	$.fn.contextMenu = function(id, options) {
		if (!(id in menuMap)) menuMap[id] = $('#' + id).clone(true).appendTo('body');
		var menu = menuMap[id];
		var a = $(this);
		a.contextmenu(function(e) {
			var that = this;
			$.each(options.callback, function(id, func) {
				menu.find('[rel=' + id + ']').off().on('click', function() {
					func(a, id);
				})
			});
			if (options.init) options.init(a, menu);
			var top = e['pageY'] + menu.height();
			var topOffset = $(window).height() - top - 10;
			top = topOffset > 0 ? e['pageY'] : e['pageY'] + topOffset;
			var left = e['pageX'] + menu.width();
			var leftOffset = $(window).width() - left - 10;
			left = leftOffset > 0 ? e['pageX'] : e['pageX'] + leftOffset;
			menu.css({
				'left' : left,
				'top' : top
			}).show();
			$(document).one('click', function() {
				menu.hide();
			});
			return false;
		});
	};
})(jQuery);

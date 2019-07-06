/**
 * SlwPlugins.SlwThumb v2.1 2016.7 by CSS WangWeidong
 */
;
(function($) {
	$.fn.slwThumb = $.fn.cssThumb = function(option) {
		var thumb = new SlwPlugins.SlwThumb(this, option);
		thumb.init();
		return thumb;
	};
	
	SlwPlugins.SlwThumb = function(el, option) {
		this.version = 'slwThumb v2.1';
		this.defaults = {
			url : null,
			picClass : 'pic-element',
			picData : 'data-url',
			thumbW : 40,
			thumbH : 50,
			fitType : 'fixed' // fixed, scale
		};
		this.option = $.extend(this.defaults, option);
		this.el = $(el);
	}
	/**
	 * SlwPlugins.SlwThumb方法
	 */
	SlwPlugins.SlwThumb.prototype = {
		init : function() {
			var o = this.option;
			var $images = this.el;
			if (o.url == null) {
				$images = this.el.find('.' + o.picClass);
				if ($images.length == 0) return;
			}
			$images.each(function(i) {
				var $parent = $(this);
				var $el = $(this);
				var url = o.url;
				if (url == null) {
					$el = $('<div />');
					url = $parent.attr(o.picData);
				}
				var viewImage = function(img) {
					var $image = $(img);
					Slw.Image.trumbImage(img, o);
					$el.css({
						'overflow' : 'hidden',
						'width' : (o.fitType == 'scale' ? $image.width() : o.thumbW) + 'px',
						'height' : (o.fitType == 'scale' ? $image.height() : o.thumbH) + 'px'
					});
					$el.html($image);
					if (o.url == null) $parent.prepend($el);
				}
				Slw.Image.loadImage(url, viewImage);
			});
		}
	}
})(jQuery)

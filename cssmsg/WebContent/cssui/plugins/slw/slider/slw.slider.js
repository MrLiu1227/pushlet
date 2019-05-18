/**
 * SlwPlugins.SlwSlider v2.0 2012.4 by CSS WangWeidong
 */
;
(function($) {
	$.fn.slwSlider = $.fn.cssSlider = function(option) {
		var slider = new SlwPlugins.SlwSlider(this, option);
		slider.init();
		return slider;
	};
	
	SlwPlugins.SlwSlider = function(el, option) {
		this.defaults = {
			speed : 3000
		};
		this.option = $.extend(this.defaults, option);
		this.el = $(el);
		this.curIndex = 0;
		this.timer = null;
		this.pause = false;
	}
	/**
	 * SlwPlugins.SlwSlider方法
	 */
	SlwPlugins.SlwSlider.prototype = {
		init : function() {
			this.draw();
			this.to(0).show();
			this.initEvent();
			this.start();
		},
		draw : function() {
			this.imgs = this.el.find('img');
			this.imgs.css('display', 'none');
			this.length = this.imgs.length;
			this.nav = $('<div class="css-nav"></div>');
			this.href = $('<div class="css-href"></div>');
			this.el.append(this.nav).append(this.href).append('<div style="clear:both;"></div>');
			for (var i = 0; i < this.length; i++)
				this.nav.append('<a rel="' + i + '">' + (i + 1) + '</a>');
			this.items = this.nav.find('a');
		},
		initEvent : function() {
			var that = this;
			that.items.bind('click', function() {
				if ($(this).hasClass('active'))
					that.start();
				else
					that.show(Number($(this).attr('rel')));
			});
			that.imgs.bind('click', function(e) {
				var posX = e.clientX - $(this).offset().left;
				if (posX * 2 < $(this).width())
					that.prev();
				else
					that.next();
			});
			that.imgs.hover(function() {
				that.paused = true;
				that.stop();
			}, function() {
				that.paused = false;
				that.start();
			});
		},
		show : function(index) {
			var that = this;
			that.stop();
			that.items.eq(that.curIndex).removeClass('active');
			that.imgs.eq(that.curIndex).fadeOut(200, function() {
				that.to(index).fadeIn(200, that.start());
				that.curIndex = index;
			});
		},
		next : function() {
			this.show((this.curIndex + 1) % this.length);
		},
		prev : function() {
			this.show((this.curIndex + this.length - 1) % this.length);
		},
		to : function(index) {
			var img = this.imgs.eq(index);
			this.items.eq(index).addClass('active');
			var w = parseInt((this.el.width() - 10 * this.length - 20) * 2 / 12);
			this.href.html('<a target="_blank" ' + (img.attr('rel') == '' ? '' : 'href="' + img.attr('rel') + '"') + '>' + Slw.Utils.substr(img.attr('title'), w) + '</a>');
			return img;
		},
		start : function() {
			var that = this;
			if (!that.paused) {
				that.stop();
				that.timer = setInterval(function() {
					that.next();
				}, that.option.speed);
			}
		},
		stop : function() {
			clearInterval(this.timer);
		}
	};
})(jQuery)

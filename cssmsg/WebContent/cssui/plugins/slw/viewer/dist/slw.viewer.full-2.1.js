///<jscompress sourcefile="slw.viewer.js" />
/**
 * SlwPlugins.SlwViewer v2.1 2016.7 by CSS WangWeidong
 */
$.fn.slwViewer = $.fn.cssViewer = function(option) {
	var viewer = new SlwPlugins.SlwViewer(this, option);
	viewer.init();
	return viewer;
};
var SlwViewer = {};
SlwPlugins.SlwViewer = function(el, option) {
	this.version = 'slwViewer v2.1';
	this.defaults = {
		picClass : 'pic-element',
		picData : 'data-original',
		picThumb : 'src',
		picTitle : 'alt',
		zoomRatio : 0.1,
		thumbW : 40,
		thumbH : 50,
		fitType : 'fixed', // fixed, scale
		loading : 'cssui/plugins/slw/viewer/style/loading.gif'
	};
	this.option = $.extend(this.defaults, option);
	this.el = $(el);
	this.view = new SlwViewer.View(this);
	this.cmd = new SlwViewer.Cmd(this);
}
/**
 * SlwPlugins.SlwViewer方法
 */
SlwPlugins.SlwViewer.prototype = {
	init : function() {
		var that = this;
		this.view.init();
		this.load();
	},
	load : function() {
		var o = this.option;
		var that = this;
		var $images = this.el.find('.' + o.picClass);
		if ($images.length == 0) return;
		this.view.clear();
		$images.css({
			'cursor' : 'pointer'
		});
		$images.each(function(i) {
			var $img = $(this);
			var imgInfo = {
				src : $img.attr(o.picThumb),
				alt : $img.attr(o.picTitle),
				url : $img.attr(o.picData),
				rotate : 0,
				scaleX : 1,
				scaleY : 1,
				index : i
			};
			var preView = function(img) {
				imgInfo.naturalWidth = img.width;
				imgInfo.naturalHeight = img.height;
			};
			Slw.Image.loadImage(imgInfo.url, preView);
			that.view.addList(imgInfo);
			$img.unbind('click.slwViewer');
			$img.on('click.slwViewer', function() {
				that.view.show();
				that.view.view(i)
			});
		});
	},
	reload : function() {
		this.load();
		if (this.view.isLoad) this.view.load();
	}
}
;
///<jscompress sourcefile="slw.viewer.view.js" />
/**
 * SlwViewer.View v2.1 2016.7 by CSS WangWeidong
 */
SlwViewer.View = function(main) {
	this.main = main;
	this.option = main.option;
	this.layer = $('<div class="viewer-layer viewer-layeruuid"" style="display: none;">');
	this.container = $('<div class="viewer-container viewer-in">');
	this.isShow = false;
	this.isLoad = false;
	this.images = [];
	this.curIndex = -1;
	this.curImage = null;
	this.CLASS_SHOW = 'viewer-show';
	this.CLASS_ACTIVE = 'viewer-active';
	this.CLASS_TRANSITION = 'viewer-transition';
};
/**
 * SlwViewer.View方法
 */
SlwViewer.View.prototype = {
	init : function() {
		this.layer.append(this.container);
		this.canvas = $('<div class="viewer-canvas"></div>');
		this.footer = $('<div class="viewer-footer"></div>');
		this.tooltip = $('<div class="viewer-tooltip"></div>');
		this.button = $('<div class="viewer-button viewer-close" data-action="mix"></div>');
		this.container.append(this.canvas);
		this.container.append(this.footer);
		this.container.append(this.tooltip);
		this.container.append(this.button);
		this.initFooter();
		var that = this;
		$('body').append(that.layer);
	},
	initFooter : function() {
		this.title = $('<div class="viewer-title"></div>');
		this.toolbar = $('<ul class="viewer-toolbar"></ul>');
		this.navbar = $('<div class="viewer-navbar"></div>');
		this.footer.append(this.title);
		this.footer.append(this.toolbar);
		this.footer.append(this.navbar);
		
		var li = '<li class="viewer-zoom-in" data-action="zoom-in"></li>';
		li += '<li class="viewer-zoom-out" data-action="zoom-out"></li>';
		li += '<li class="viewer-one-to-one" data-action="one-to-one"></li>';
		li += '<li class="viewer-reset" data-action="reset"></li>';
		li += '<li class="viewer-prev" data-action="prev"></li>';
		li += '<li class="viewer-next" data-action="next"></li>';
		li += '<li class="viewer-rotate-left" data-action="rotate-left"></li>';
		li += '<li class="viewer-rotate-right" data-action="rotate-right"></li>';
		li += '<li class="viewer-flip-horizontal" data-action="flip-horizontal"></li>';
		li += '<li class="viewer-flip-vertical" data-action="flip-vertical"></li>';
		this.toolbar.append(li);
		this.list = $('<ul class="viewer-list"></ul>');
		this.navbar.append(this.list);
	},
	initTooltip : function(image) {
		var classes = [ this.CLASS_SHOW, this.CLASS_TRANSITION ].join(' ');
		this.tooltip.text(Math.round(image.ratio * 100) + '%');
		this.tooltip.addClass(classes);
		this.tooltip.show().delay(1000).fadeOut();
	},
	clear : function() {
		this.curIndex = -1
		this.images = [];
		this.list.html('');
	},
	getLength : function() {
		return this.images.length;
	},
	addList : function(imgInfo) {
		this.images.push(imgInfo);
		this.list.append('<li data-action="view" data-index="' + imgInfo.index + '" data-img="' + imgInfo.src + '"></li>');
	},
	initLayer : function() {
		var that = this;
		var layer_iestyle = function() {
			var maxWidth = Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth) + "px";
			var maxHeight = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight) + "px";
			that.layer.css({
				"width" : maxWidth,
				"height" : maxHeight
			});
			that.container.css({
				"width" : document.documentElement.clientWidth,
				"height" : document.documentElement.clientHeight
			});
		}
		var viewer_iestyle = function() {
			var marginTop = $(document).scrollTop + "px";
			var marginLeft = $(document).scrollLeft + "px";
			that.container.css({
				"margin-top" : marginTop,
				"margin-left" : marginLeft
			});
		}
		if (Slw.Utils.isIE() && Slw.Utils.ieVersion() < 9) {
			that.layer.css({
				"background-color" : "#333",
				"opacity" : "1"
			});
		}
		layer_iestyle();
		if (Slw.Utils.ieVersion() == 6) viewer_iestyle();
	},
	initThumb : function() {
		var o = this.option;
		var that = this;
		that.list.find('li').each(function(i) {
			var $el = $(this);
			var url = $el.attr('data-img');
			var setImage = function(img) {
				var $image = $(img);
				$image.attr('data-action', 'view');
				$image.attr('data-index', i);
				Slw.Image.trumbImage(img, o);
				$el.css({
					'overflow' : 'hidden',
					'width' : (o.thumbW - 2) + 'px',
					'height' : (o.thumbH - 2) + 'px'
				});
				$el.html($image);
			}
			Slw.Image.loadImage(url, setImage);
		});
	},
	initRender : function() {
		var o = this.option;
		var that = this;
		that.initLayer()
		var width = (o.thumbW + 4) * that.getLength();
		that.list.css({
			height : o.thumbH,
			width : width,
			marginLeft : (that.container.width() - width) / 2
		});
		var footerHeight = o.thumbH + 40;
		that.canvas.css({
			width : that.container.width(),
			height : that.container.height() - footerHeight - 5,
		})
		that.imageToFit();
	},
	view : function(index) {
		var o = this.option;
		var that = this;
		index = Number(index) || 0;
		if (that.curIndex == index || index < 0 || index >= that.getLength()) {
			return;
		}
		var image = that.images[index];
		var $items = that.list.find('li');
		if (that.curIndex != -1) $items.eq(that.curIndex).removeClass(that.CLASS_ACTIVE);
		that.curIndex = index;
		$items.eq(index).addClass(that.CLASS_ACTIVE);
		that.title.html(image.alt + ' (' + image.naturalWidth + ' &times; ' + image.naturalHeight + ')');
		var $loading = $('<img src="' + o.loading + '" />');
		$loading.addClass(that.CLASS_TRANSITION);
		$loading.css({
			marginLeft : (that.canvas.width() - 50) / 2,
			marginTop : (that.canvas.height() - 50) / 2
		});
		that.canvas.html($loading);
		var viewImage = function(img) {
			that.curImage = $(img);
			that.curImage.addClass(that.CLASS_TRANSITION);
			that.imageToFit();
			that.canvas.html(that.curImage);
		}
		Slw.Image.loadImage(image.url, viewImage);
	},
	getImage : function() {
		return this.images[this.curIndex];
	},
	imageToFit : function() {
		var that = this;
		if (that.curIndex < 0) return;
		var image = that.getImage();
		var naturalWidth = image.naturalWidth;
		var naturalHeight = image.naturalHeight;
		var imgRatio = naturalWidth / naturalHeight;
		var canvasRatio = that.canvas.width() / that.canvas.height();
		var width, height;
		if (imgRatio > canvasRatio) {
			width = that.canvas.width();
			height = width / imgRatio;
		}
		else {
			height = that.canvas.height() - 20;
			width = imgRatio * height;
		}
		width = (width > naturalWidth) ? naturalWidth : width;
		height = (height > naturalHeight) ? naturalHeight : height;
		that.main.cmd.zoomTo(width, height);
	},
	load : function() {
		this.initThumb();
		this.initRender();
	},
	show : function() {
		if (!this.isLoad) {
			this.isLoad = true;
			this.load();
			this.main.cmd.initEvent();
		}
		if (this.isShow) return;
		this.isShow = true;
		this.layer.show();
	},
	hide : function() {
		if (!this.isShow) return;
		this.isShow = false;
		this.layer.hide();
	}
};;
///<jscompress sourcefile="slw.viewer.cmd.js" />
/**
 * SlwViewer.Cmd v2.1 2016.7 by CSS WangWeidong
 */
SlwViewer.Cmd = function(main) {
	this.main = main;
	this.option = main.option;
	this.view = main.view;
	this.iePosition = false;
	this.wheeling = false;
};
/**
 * SlwViewer.Cmd方法
 */
SlwViewer.Cmd.prototype = {
	initEvent : function() {
		var that = this;
		var EVENT_WHEEL = 'wheel.slwViewer mousewheel.slwViewer DOMMouseScroll.slwViewer';
		var EVENT_CLICK = 'click.slwViewer';
		var EVENT_KEYDOWN = 'keydown.slwViewer';
		var EVENT_RESIZE = 'resize.slwViewer';
		$(window).on(EVENT_RESIZE, function(e) {
			that.view.initRender();
		});
		
		$(document).on(EVENT_KEYDOWN, function(e) {
			that.keydown(e)
		});
		that.view.container.on(EVENT_CLICK, function(e) {
			that.click(e)
		});
		that.view.container.on(EVENT_WHEEL, function(e) {
			that.wheel(e);
		});
	},
	click : function(e) {
		var view = this.view;
		var o = this.option;
		var image = view.getImage();
		var $target = $(e.target);
		var action = $target.attr('data-action');
		e.preventDefault();
		switch (action) {
			case 'mix':
				view.hide();
				break;
			case 'view':
				view.view($target.attr('data-index'));
				break;
			case 'zoom-in':
				this.zoom(o.zoomRatio);
				break;
			case 'zoom-out':
				this.zoom(-o.zoomRatio);
				break;
			case 'one-to-one':
				this.zoomToNatural();
				break;
			case 'reset':
				this.zoomToFit();
				break;
			case 'prev':
				this.prev();
				break;
			case 'next':
				this.next();
				break;
			case 'rotate-left':
				this.rotate(-90);
				break;
			case 'rotate-right':
				this.rotate(90);
				break;
			case 'flip-horizontal':
				this.scaleX(image, -image.scaleX || -1);
				break;
			case 'flip-vertical':
				this.scaleY(image, -image.scaleY || -1);
				break;
		}
	},
	keydown : function(e) {
		var view = this.view;
		if (!view.isShow) return;
		var o = this.option;
		var image = view.getImage();
		var which = e.which;
		switch (which) {
			case 27: // Esc
				view.hide();
				break;
			case 37: // ←
				if (e.ctrlKey || e.shiftKey)
					this.rotate(-90);
				else
					this.prev();
				break;
			case 39: // →
				if (e.ctrlKey || e.shiftKey)
					this.rotate(90);
				else
					this.next();
				break;
			case 38: // ↑
				if (e.ctrlKey || e.shiftKey)
					this.scaleY(image, -image.scaleY || -1);
				else
					this.zoom(o.zoomRatio);
				break;
			case 40: // ↓
				if (e.ctrlKey || e.shiftKey)
					this.scaleX(image, -image.scaleX || -1);
				else
					this.zoom(-o.zoomRatio);
				break;
			case 49: // Ctrl + 1
				if (e.ctrlKey || e.shiftKey) this.zoomToNatural();
				break;
		}
	},
	wheel : function(event) {
		var view = this.view;
		if (!view.isShow) return;
		var o = this.option;
		var image = view.getImage();
		var that = this;
		
		var e = event.originalEvent || event;
		var ratio = Number(o.zoomRatio) || 0.1;
		var delta = 1;
		event.preventDefault();
		if (that.wheeling) return;
		that.wheeling = true;
		setTimeout(function() {
			that.wheeling = false;
		}, 50);
		if (e.deltaY) {
			delta = e.deltaY > 0 ? 1 : -1;
		}
		else if (e.wheelDelta) {
			delta = -e.wheelDelta / 120;
		}
		else if (e.detail) {
			delta = e.detail > 0 ? 1 : -1;
		}
		that.zoom(-delta * ratio);
	},
	prev : function() {
		var view = this.view;
		view.view(Math.max(view.curIndex - 1, 0));
	},
	next : function() {
		var view = this.view;
		view.view(Math.min(view.curIndex + 1, view.getLength() - 1));
	},
	rotate : function(deg) {
		this.iePosition = !this.iePosition;
		if (deg == 0) this.iePosition = false;
		var image = this.view.getImage();
		image.rotate += deg;
		this.renderImage();
	},
	scale : function(image, scaleX, scaleY) {
		var changed = false;
		if (Slw.Utils.isUndefined(scaleY)) {
			scaleY = scaleX;
		}
		scaleX = Number(scaleX);
		scaleY = Number(scaleY);
		if (isNumber(scaleX)) {
			image.scaleX = scaleX;
			changed = true;
		}
		if (isNumber(scaleY)) {
			image.scaleY = scaleY;
			changed = true;
		}
		if (changed) this.renderImage();
	},
	scaleX : function(image, scaleX) {
		this.scale(image, scaleX, image.scaleY);
	},
	scaleY : function(image, scaleY) {
		this.scale(image, image.scaleX, scaleY);
	},
	zoomToFit : function() {
		var view = this.view;
		var image = view.getImage();
		image.rotate = 0;
		image.scaleX = 1;
		image.scaleY = 1;
		this.rotate(0);
		view.imageToFit();
	},
	zoom : function(ratio) {
		var image = this.view.getImage();
		ratio = Number(ratio);
		if (ratio < 0)
			ratio = 1 / (1 - ratio);
		else
			ratio = 1 + ratio;
		var width = image.width * ratio;
		var height = image.height * ratio
		this.zoomTo(width, height);
	},
	zoomTo : function(width, height) {
		var image = this.view.getImage();
		image.width = width;
		image.height = height;
		image.ratio = image.width / image.naturalWidth;
		this.renderImage();
		this.view.initTooltip(image);
	},
	zoomToNatural : function() {
		var view = this.view;
		var image = view.getImage();
		this.zoomTo(image.naturalWidth, image.naturalHeight);
	},
	getPosition : function() {
		var view = this.view;
		var image = view.getImage();
		var width = image.width;
		var height = image.height;
		if (this.iePosition && Slw.Utils.isIE() && Slw.Utils.ieVersion() < 9) {
			var width = image.height;
			var height = image.width;
		}
		var cw = view.canvas.width();
		var ch = view.canvas.height();
		if (Slw.Utils.ieVersion() == 6) {
			image.left = (cw - width) / 2 + view.container.position().left;
			image.top = (ch - height) / 2 + view.container.position().top;
		}
		else {
			image.left = (cw - width) / 2 + $(document).scrollLeft();
			image.top = (ch - height) / 2 + $(document).scrollTop();
		}
		return image;
	},
	renderImage : function() {
		var view = this.view;
		var that = this;
		var image = that.getPosition();
		var transform = that.getTransform(image);
		view.curImage.css({
			width : image.width,
			height : image.height,
			marginLeft : image.left,
			marginTop : image.top,
			transform : transform
		});
		if (Slw.Utils.isIE() && Slw.Utils.ieVersion() < 9) {
			var ie_filter = that.getIeFilter(image);
			view.curImage.css("filter", ie_filter);
			view.curImage.css("-ms-filter", ie_filter);
		}
	},
	getTransform : function(img) {
		var transforms = [];
		transforms.push('rotate(' + img.rotate + 'deg)');
		transforms.push('scale(' + img.scaleX + ',' + img.scaleY + ')');
		return transforms.length ? transforms.join(' ') : 'none';
	},
	getIeFilter : function(img) {
		var deg = img.rotate % 360;
		deg = deg >= 0 ? deg : 360 + deg;
		var deg2radians = Math.PI * 2 / 360;
		var rad = deg * deg2radians;
		var cos = Math.cos(rad);
		var sin = Math.sin(rad);
		return "filter: progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand',M11=" + (cos * img.scaleX) + ", M12=" + (-sin * img.scaleY) + ",M21=" + (sin * img.scaleX) + ", M22=" + (cos * img.scaleY) + ")";
	}
};;

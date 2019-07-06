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
};
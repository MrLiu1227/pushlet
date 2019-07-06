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

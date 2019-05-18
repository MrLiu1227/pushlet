/**
 * slw.plugins 2018.8 by CSS WangWeidong
 * 这个文件不需要引用，仅为索引，供开发人员快速查询
 */
;
(function($) {
	$.fn.extend({
		'slwSpinner' : function(option) {
			var spinner = new SlwPlugins.SlwSpinner(this, option);
			spinner.init();
			return spinner;
		},
		'slwTag' : function(option) {
			var tag = new SlwPlugins.SlwTag(this, option);
			tag.init();
			return tag;
		},
		'slwComplete' : function(option) {
			var list = new SlwPlugins.SlwComplete(this, option);
			list.init();
			return list;
		},
		'slwSelect' : function(option) {
			var select = new SlwPlugins.SlwSelect(this, option);
			select.init();
			return select;
		},
		'slwMenu' : function(option) {
			var menu = new SlwPlugins.SlwMenu(this, option);
			menu.init();
			return menu;
		},
		'slwGrid' : function(option) {
			var grid = new SlwPlugins.SlwGrid(this, option);
			grid.init();
			return grid;
		},
		'slwTree' : function(option) {
			var tree = new SlwPlugins.SlwTree(this, option);
			tree.init();
			return tree;
		},
		'slwAjaxUpload' : function(option) {
			var ajaxUpload = new SlwPlugins.SlwAjaxUpload(this, option);
			ajaxUpload.init();
			return ajaxUpload;
		},
		'slwUpload' : function(option) {
			var upload = new SlwPlugins.SlwUpload(this, option);
			upload.init();
			return upload;
		},
		'slwThumb' : function(option) {
			var thumb = new SlwPlugins.SlwThumb(this, option);
			thumb.init();
			return thumb;
		},
		'slwViewer' : function(option) {
			var viewer = new SlwPlugins.SlwViewer(this, option);
			viewer.init();
			return viewer;
		},
		'slwSlider' : function(option) {
			var slider = new SlwPlugins.SlwSlider(this, option);
			slider.init();
			return slider;
		},
		'slwColor' : function(option) {
			var color = new SlwPlugins.SlwColor(this, option);
			color.init();
			return color;
		}
	});
	$.fn.jqSpinner = $.fn.slwSpinner;
	$.fn.jqTag = $.fn.slwTag;
	$.fn.jqComplete = $.fn.slwComplete;
	$.fn.jqSelect = $.fn.slwSelect;
	$.fn.cssThumb = $.fn.slwThumb;
	$.fn.cssViewer = $.fn.slwViewer;
	$.fn.cssSlider = $.fn.slwSlider;
	$.fn.jqupload = $.fn.slwUpload;
})(jQuery);

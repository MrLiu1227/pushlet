/**
 * SlwUpload.Tmpl v1.1 2018.8 by CSS WangWeidong
 */
SlwUpload.Tmpl = function(main) {
	this.main = main;
};
/**
 * SlwUpload.Tmpl方法
 */
SlwUpload.Tmpl.prototype = {
	init : function() {
		var config = this.getOption();
		if ($.isFunction(config.tmplInit)) config.tmplInit.apply(this, []);
	},
	getOption : function() {
		return this.main.upload.option;
	},
	getClear : function() {
		return '<div style="clear: both;"></div>';
	},
	createBody : function() {
		return this.body;
	},
	/**
	 * 更新状态信息
	 */
	updateStatus : function(id, status, message) {
		var $cell = $('#' + id).find('.statusCell');
		$cell.html('');
		$cell.append('<span class="label label-' + status + '">' + message + '</span>');
	},
	/**
	 * 初始化进度条
	 */
	initProgress : function(id) {
		var $statCell = $('#' + id).find('.statusCell');
		$statCell.html('<div class="progress"><div class="progress-bar" role="progressbar" style="min-width:3em;">0%</div></div>')
		this.main.view.clearTips(id);
	},
	/**
	 * 上传进度条更新
	 */
	updateProgress : function(id, percent) {
		var $progress = $('#' + id).find('div.progress-bar');
		$progress.width(percent);
		$progress.html(percent);
	},
	uploadSuccess : function() {
	}
};

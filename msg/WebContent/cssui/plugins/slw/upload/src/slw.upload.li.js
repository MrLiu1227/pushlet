/**
 * SlwUpload.Li v1.1 2018.8 by CSS WangWeidong
 */
liMethod = SlwUpload.Li = function(main) {
	this.main = main;
	this.name = 'liTemplate';
	this.sortable = true;
	this.dotFlag = true;
	this.body = $('<ul class="sortable"></ul>');
};
/**
 * SlwUpload.Li方法
 */
SlwUpload.Li.prototype = new SlwUpload.Tmpl();
$.extend(SlwUpload.Li.prototype, {
	addFile : function(data, status) {
		var config = this.getOption();
		var id = data.id;
		var liStr = '<li id="' + id + '" class="jquploadRow">';
		if (config.fileIcon)
			liStr += '	<span class="iconCell">' + Slw.UploadUtil.getIconImg(data, 56) + '</span>';
		else
			liStr += '	<span class="numCell"></span>';
		liStr += '		<span class="messageCell"><span class="default-file-name">' + Slw.File.getFullName(data) + '</span> <span class="default-file-size">(' + Slw.File.getFileSize(data.fileSize) + ')</span></span>';
		if (!config.readonly) liStr += '	<span class="statusCell">';
		if (config.initLoadInfo != '') liStr += ' <span class="label label-info">' + (status == 1 ? config.initLoadInfo : '初始成功') + '</span>';
		liStr += '		</span><span class="toolsCell"></span>';
		liStr += '	</li>';
		var $li = $(liStr);
		$li.attr('status', status);
		this.body.prepend($li);
	}
});

simpleLiMethod = SlwUpload.SimpleLi = function(main) {
	this.main = main;
	this.name = 'simpleLiMethod';
	this.sortable = false;
	this.dotFlag = false;
	this.body = $('<ul></ul>');
};

/**
 * SlwUpload.Li方法
 */
SlwUpload.SimpleLi.prototype = new SlwUpload.Tmpl();
$.extend(SlwUpload.SimpleLi.prototype, {
	addFile : function(data, status) {
		var config = this.getOption();
		var id = data.id;
		var liStr = '<li id="' + id + '" class="jquploadRow">';
		liStr += '	  <span class="statusCell"></span>';
		liStr += '		<span class="toolsCell"></span>';
		liStr += '	</li>';
		var $li = $(liStr);
		$li.attr('status', status);
		this.body.prepend($li);
	},
	getClear : function() {
		return '';
	}
});

/**
 * SlwUpload.Pic v1.1 2018.8 by CSS WangWeidong
 */
picMethod = SlwUpload.Pic = function(main) {
	this.main = main;
	this.name = 'picTemplate';
	this.sortable = true;
	this.dotFlag = true;
	this.imageFlag = true;
	this.body = $('<ul class="sortable"></ul>');
};
/**
 * SlwUpload.Pic 方法
 */
SlwUpload.Pic.prototype = new SlwUpload.Tmpl();
$.extend(SlwUpload.Pic.prototype, {
	init : function() {
		this.main.btn.addClass('btnUpload');
	},
	addFile : function(data, status) {
		var config = this.getOption();
		var that = this;
		var id = data.id;
		var liStr = '<li id="' + id + '" class="jquploadRow"><div class="imgPreview"><div class="details">';
		liStr += '		<div class="default-file-name">' + Slw.File.getFullName(data) + '</div>';
		liStr += '		<div class="default-file-size">' + Slw.File.getFileSize(data.fileSize) + '</div>';
		if (data.category == 'pic')
			liStr += '		<div class="iconCell">' + Slw.UploadUtil.getUrlImg(data) + '</div>';
		else
			liStr += '		<div class="iconCell">' + Slw.UploadUtil.getIconImg(data, 256) + '</div>';
		if (!config.readonly) liStr += '	<div class="statusCell"></div>';
		liStr += '		<div class="messageCell"></div>';
		liStr += '		<div class="toolsCell"></div>';
		liStr += '		<div class="successMark"><i class="fa fa-check"> </i></div>';
		liStr += '		<div class="dangerMark"><i class="fa fa-close"> </i></div>';
		liStr += '	</div></div></li>';
		var $li = $(liStr);
		$li.attr('status', status);
		that.body.prepend($li);
		if (Slw.Utils.isIE() && Slw.Utils.ieVersion() == 6) {
			$li.css({
				"width" : config.width + 'px',
				"height" : config.height + 'px'
			});
		}
		// 处理图片宽高
		$li.find('.details').css({
			"width" : config.width + 'px',
			"height" : config.height + 'px',
			"margin-bottom" : config.bottom ? '22px' : '0px'
		});
		$li.find('.statusCell').css({
			"top" : config.height + 'px'
		});
		if (Slw.Utils.isIE()) {
			$li.css({
				"margin-bottom" : '5px'
			});
		}
		
		// 不显示文件大小的底边框
		if (!config.bottom) {
			$li.find('.default-file-size').css("display", "none");
		}
		// 一张图片时居中处理
		if (config.fileNumber == 1 && config.btnAlign == 'center-block') {
			that.body.find('li').css("float", "none");
			/**
			 * css3+ $el.css({ "display" : "table", "width" : "0" });
			 */
		}
		if (!config.readonly && config.fileNumber == 1 && data.id == 'defaultImageId') {
			var $img = $li.find('img');
			$img.css("cursor", "pointer");
			$img.click(function() {
				var $file = that.body.find("input[name='" + o.fileName + "']");
				$file.click();
			});
		}
		// 处理本地文件预览
		if (data.file != null) Slw.UploadUtil.getLocalImg($li.find('img'), data.file);
	},
	updateStatus : function(id, status, message) {
		var main = this.main;
		var $cell = $('#' + id).find('.statusCell');
		$cell.hide();
		var $mark = $('#' + id).find('.' + status + 'Mark');
		var tip = $('#' + id).find('.tipsCell').html();
		tip = message + (!Slw.Utils.isnull(tip) ? '：' + tip : '');
		$mark.attr('title', tip);
		if (status == 'danger') {
			$mark.css("cursor", "pointer");
			$mark.show();
			$mark.click(function() {
				main.cmd.delFile(id);
			});
		}
		else {
			$mark.show().delay(8000).hide(1000);
		}
	},
	initProgress : function(id) {
		$('#' + id).find('.successMark, .dangerMark').hide();
		var $statCell = $('#' + id).find('.statusCell');
		$statCell.html('<div class="progress progress-xs"><div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" >0%</div></div>')
		$statCell.show();
		this.main.view.clearTips(id);
	},
	updateProgress : function(id, percent) {
		var $progress = $('#' + id).find('div.progress-bar');
		$progress.width(percent);
		$progress.html('');
	},
	uploadSuccess : function(id, data) {
		var main = this.main;
		var imgSrc = data.msg.fileUrlFull + '.' + data.msg.fileExt;
		if (this.background == true) {
			main.btn.css({
				"background" : '#fff url(' + imgSrc + ') no-repeat'
			});
		}
		else {
			var $img = $('#' + id).find('.iconCell img');
			$img.attr('src', imgSrc);
			$img.attr('class', 'pic-element');
			$img.attr('data-original', data.msg.fileUrlFull);
		}
	}
});

simplePicMethod = SlwUpload.SimplePic = function(main) {
	this.main = main;
	this.name = 'simplePicMethod';
	this.sortable = false;
	this.dotFlag = false;
	this.imageFlag = true;
	this.background = true;
	this.body = $('<ul></ul>');
};
SlwUpload.SimplePic.prototype = new SlwUpload.Pic();
$.extend(SlwUpload.SimplePic.prototype, {
	init : function() {
		var config = this.getOption();
		var btn = this.main.btn;
		config.defaultBackground = btn.css("background-image");
		config.defaultFilter = btn.css("filter");
		btn.css({
			"width" : config.width,
			"height" : config.height
		});
	},
	addFile : function(data, status) {
		var config = this.getOption();
		var that = this;
		var id = data.id;
		var liStr = '<li id="' + id + '" class="jquploadRow">';
		liStr += '	  <span class="statusCell"></span>';
		liStr += '		<span class="toolsCell"></span>';
		liStr += '	</li>';
		var $li = $(liStr);
		$li.attr('status', status);
		this.body.prepend($li);
		this.setBackground(data);
	},
	setBackground : function(data) {
		var config = this.getOption();
		var btn = this.main.btn;
		var url = config.defaultBackground;
		if (data.id != 'defaultImageId') {
			if (data.fileUrlFull) url = 'url(' + data.fileUrlFull + '.' + data.fileExt + ')';
		}
		if ((Slw.Utils.isIE() && Slw.Utils.ieVersion() < 9) && data.id == 'defaultImageId') {
			btn.css({
				"background" : 'none',
				"filter" : config.defaultFilter
			});
		}
		else {
			btn.css({
				"background-image" : url,
				"background-size" : config.width + 'px' + ' ' + config.height + 'px',
				"filter" : 'none'
			});
		}
	}

});

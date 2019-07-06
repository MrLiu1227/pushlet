/**
 * SlwUpload.View v1.1 2018.8 by CSS WangWeidong
 */
SlwUpload.View = function(main) {
	this.main = main;
	this.option = main.option;
};
/**
 * SlwUpload.View方法
 */
SlwUpload.View.prototype = {
    init : function() {
        var o = this.option;
        var main = this.main;
        main.el.addClass('jqUploadTemplate');
        main.el.addClass(main.template.name);
        main.btnDiv = $('<div class="' + o.btnAlign + '"></div>');
        main.btn = $('<button type="button" class="jquploadButton btn ' + o.btnClass + ' ' + o.btnAlign + '"> <i class="fa fa-folder-open-o"></i> ' + o.btnTitle + '</button>');
        main.el.html('');
        main.btnDiv.append(main.btn);
        main.el.append(main.container)
        if (o.btnOnTop) {
            if (!o.readonly) main.el.append(main.btnDiv).append(main.template.getClear());
            main.el.append(main.container);
        }
        else {
            main.el.append(main.container).append(main.template.getClear());
            if (!o.readonly) main.el.append(main.btnDiv);
        }
        main.container.append(main.template.createBody());
        main.template.init();
        if (main.btnDiv.hasClass('center-block')) {
            if (Slw.Utils.ieVersion() == 8||Slw.Utils.ieVersion() == 9) {
                main.btnDiv.css('display' , 'table');
            }
        }
    },
	/**
	 * 更新出错信息
	 */
	updateMessage : function(id, status, message) {
		var $msg = $('<code class="tipsCell" text-red">' + message + '</code>');
		var $cell = $('#' + id).find('.messageCell');
		$cell.find('.tipsCell').remove();
		$cell.append($msg);
		if (status == 'danger') this.main.template.updateStatus(id, status, '上传失败');
	},
	clearTips : function(id) {
		var $toolCell = $('#' + id).find('.toolsCell');
		$toolCell.html('');
		$('#' + id).find('.tipsCell').remove();
	},
	onFileTypeError : function(id, file) {
		this.onUploadError(id, '不允许上传该类型文件');
	},
	onFileExtError : function(id, file, ext) {
		this.onUploadError(id, '文件扩展名(.' + ext + ')类型不允许');
	},
	onFileSizeError : function(id, file, size) {
		this.onUploadError(id, '文件大小不能超过' + Slw.File.getFileSize(size));
	},
	onUploadSuccess : function(id, data) {
		var main = this.main;
		if (data.result == 0) {
			$('#' + id).attr('status', 1);
			this.main.template.updateStatus(id, 'success', '上传成功');
			main.filesMap[id].uuid = data.msg.uuid;
			main.filesMap[id].fileUrlFull = data.msg.fileUrlFull;
			main.filesMap[id].time = data.msg.time;
			main.filesMap[id].userId = data.msg.userId;
			main.filesMap[id].file = null;
			if (Slw.Utils.isIE() && Slw.Utils.ieVersion() < 10) {
				main.filesMap[id].fileSize = data.msg.fileSize;
				var _size = $('#' + id).find('.default-file-size');
				if (_size) {
					var _pre = _size.html();
					if (Slw.Utils.isnull(_pre))
						_size.html(Slw.File.getFileSize(main.filesMap[id].fileSize));
					else
						_size.html('(' + Slw.File.getFileSize(main.filesMap[id].fileSize) + ')');
				}
			}
			this.main.updateTools(id, 1);
			this.main.template.uploadSuccess(id, data)
			this.main.initPlugins('upload');
		}
		else
			this.onUploadError(id, data.msg);
	},
	onUploadError : function(id, message) {
		var o = this.option;
		var main = this.main;
		$('#' + id).attr('status', 2);
		this.updateMessage(id, 'danger', message);
		this.main.updateTools(id, 2);
	}
};

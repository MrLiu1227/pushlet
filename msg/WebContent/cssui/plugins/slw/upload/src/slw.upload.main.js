/**
 * SlwUpload.Main v1.1 2018.8 by CSS WangWeidong
 */
SlwUpload.Main = function(upload, tableUuid, data, el) {
	this.el = $(el);
	this.upload = upload;
	this.option = upload.option;
	this.data = data;
	this.extraData = $.extend(true, {}, upload.option.extraData);
	this.extraData.tableUuid = tableUuid;
	this.successFiles = 0;
	this.nextIndex = 0;
	this.files;
	this.cropData = {};
	this.filesMap = {};
	this.fileModel = [];
	this.template = null;
	// plugins: imgviewer, sortable, croper
	this.container = $('<div class="jqupload-container"></div>');
	this.cmd = new SlwUpload.Cmd(this);
	this.view = new SlwUpload.View(this);
	this.ieUpload = null;
	this.imgViewer = null;
};
/**
 * SlwUpload.Main方法
 */
SlwUpload.Main.prototype = {
	init : function() {
		var o = this.option;
		this.template = new o.style(this);
		this.view.init();
		this.initRowData();
		this.initPlugins('init');
		this.initEvent();
	},
	/**
	 * 初始化事件
	 */
	initEvent : function() {
		var o = this.option;
		if (o.readonly) return;
		if (!Slw.Utils.isnull(o.extraPara) && o.extraPara.type == 'crop') {
			// 剪裁时IE6, 7, 8, 9先上传
			if (this.getTotalFiles() == 0 && (Slw.Utils.isIE() && Slw.Utils.ieVersion() < 10))
				this.initUploadEvent();
			else {
				this.initCropEvent(false);
			}
		}
		else
			this.initUploadEvent();
	},
	/**
	 * 初始数据加载
	 */
	initRowData : function() {
		var o = this.option;
		var dataArray = this.data;
		if (dataArray.length > 0) {
			for (var i = 0; i < dataArray.length; i++)
				this.readJson(dataArray[i]);
		}
		this.loadEnd();
		if (!Slw.Utils.isnull(o.onload)) o.onload();
	},
	getTotalFiles : function() {
		var len = Object.keys(this.filesMap).length;
		if ('defaultImageId' in this.filesMap) len--;
		return len;
	},
	/**
	 * 完成后事件处理
	 */
	loadEnd : function() {
		this.addDefaultImage();
		this.resort();
	},
	/**
	 * 展示默认图片
	 */
	addDefaultImage : function() {
		var o = this.option;
		if (o.fileNumber == 1 && this.getTotalFiles() == 0 && this.template.imageFlag) {
			var data = this.filesMap['defaultImageId'];
			if (Slw.Utils.isnull(data)) {
				data = {};
				data.id = 'defaultImageId';
				data.file = null;
				data.fileName = '';
				data.fileSize = '-1';
				data.category = 'pic';
				data.fileUrlFull = o.defaultImage;
				this.filesMap[data.id] = data;
			}
			this.cmd.addFile(data, 1);
		}
	},
	/**
	 * 对于已经上传的图片再次剪裁时，只需要上传剪裁区坐标即可
	 */
	onlyCrop : function() {
		var that = this;
		var o = this.option;
		var a = {};
		a.x = Math.round(cropData.e.x);
		a.y = Math.round(cropData.e.y);
		a.width = cropData.e.width;
		a.height = cropData.e.height;
		a.tSessionId = new Date().valueOf();
		var pars = $.param($.extend(a, that.extraData));
		$.post(o.cropUrl, pars, function(data) {
			if (data.result == 0) {
				if (that.template.background == true)
					that.template.setBackground(data.msg);
				else {
					var $img = that.el.find('.iconCell img');
					$img.attr('src', data.msg.fileUrlFull + '.' + data.msg.fileExt);
				}
				$css.tip('保存成功！');
			}
			else
				$css.alert(data.msg);
		}, o.dataType);
	},
	/**
	 * 初始化组件
	 */
	initPlugins : function(info) {
		this.picViewer();
		if (info == 'init' || (Slw.Utils.isIE() && Slw.Utils.ieVersion() < 10)) {
			this.sortable();
		}
	},
	/**
	 * 图片预览
	 */
	picViewer : function(a) {
		var o = this.option;
		var that = this;
		if (o.imgPreview == true) {
			if (this.imgViewer == null)
				this.imgViewer = this.el.slwViewer({
					picTitle : 'title'
				});
			else
				this.imgViewer.reload();
		}
	},
	/**
	 * 排序处理
	 */
	sortable : function() {
		var o = this.option;
		var that = this;
		if (!o.readonly && o.sortable && that.template.sortable) {
			var sortObj = this.el.find('.sortable');
			sortObj.sortable('destroy');
			sortObj.sortable();
			sortObj.css("cursor", "move");
			sortObj.on('dragend', function() {
				that.resort();
				that.cmd.sortFiles();
			})
		}
	},
	/**
	 * 根据状态生成工具列按扭
	 */
	updateTools : function(id, status) {
		var o = this.option;
		var that = this;
		var $cell = $('#' + id).find('.toolsCell');
		var $tools = $('<div class="tools"></div>');
		var $del = $('<i class="fa fa-trash-o" title="删除"> </i>');
		var $edit = $('<i class="fa fa-edit" title="编辑"> </i>');
		var $down = $('<i class="fa fa-download" title="下载"> </i>');
		var $redo = $('<i class="fa fa-reply" title="重传"> </i>');
		$cell.html('').append($tools);
		if (status == 1) { // 上传成功
			$tools.append($edit);
			$tools.append($down);
			$tools.append($del);
		}
		else if (status == 2) {// 上传失败
			if (!Slw.Utils.isIE() || Slw.Utils.ieVersion() > 9) {
				$tools.append($redo);
			}
			$tools.append($del);
		}
		else if (status == 3) {// 查看模式
			$tools.append($down);
		}
		$del.click(function() {
			that.cmd.delFile(id);
		});
		$edit.click(function() {
			that.cmd.renameFile(id);
		});
		$down.click(function() {
			that.cmd.downloadFile(id, 2);
		});
		$redo.click(function() {
			that.cmd.reupload(id);
		});
		$.each(o.buttons, function(index, button) {
			var $button = $('<i class="' + button.icon + '" title="' + button.title + '"> </i>');
			$tools.append($button);
			if ($.isFunction(button.action)) {
				$button.click(function() {
					button.action.apply(that, [ that.getFileInfo(id) ]);
				})
			}
		});
	},
	getFileInfo : function(id) {
		var o = this.option;
		var data = this.filesMap[id];
		if (!Slw.Utils.isnull(o.extraPara)) data.extraPara = o.extraPara
		return data;
	},
	initUploadEvent : function() {
		if (Slw.Utils.isIE() && Slw.Utils.ieVersion() < 10)
			this.initLessIe9Event();
		else
			this.initBrowserEvent();
	},
	initLessIe9Event : function() {
		var o = this.option;
		var that = this;
		var pars = $.extend({}, that.extraData);
		pars.ie = 'ie8';
		if (!Slw.Utils.isnull(o.extraPara) && o.extraPara.type == 'crop') {
		}
		else if (that.template.imageFlag) {
			pars.width = o.width;
			pars.height = o.height;
		}
		var data = {};
		var progressTimer = null;
		that.ieUpload = that.btn.slwAjaxUpload({
			action : o.uploadUrl,
			name : o.fileName,
			allowedTypes : o.allowedTypes,
			fileNumber : o.fileNumber,
			data : pars,
			responseType : 'json',
			onSubmit : function(filename, ext) {
				if (o.fileExt != null && o.fileExt != '*') {
					var extList = o.fileExt.toLowerCase().split(',');
					if ($.inArray(ext, extList) < 0) {
						that.view.onFileExtError(fm.id, file, ext);
						return false;
					}
				}
				if (o.fileNumber > 0 && that.getTotalFiles() >= o.fileNumber) {
					$css.alert('最多允许上传 ' + o.fileNumber + ' 个附件！');
					return false;
				}
				data.id = Slw.Utils.uuid();
				data.fileExt = ext;
				data.fileName = filename.substring(0, filename.lastIndexOf("."));
				data.fileSize = 0;
				data.file = null;
				that.filesMap[data.id] = data;
				that.addNewFile(data);
				/**
				 * ie6,7,8 上传假进度条件
				 */
				that.template.initProgress(data.id);
				var percent = 10;
				progressTimer = setInterval(function() {
					percent += Math.ceil((100 - percent) / 10);
					if (percent > 98) clearInterval(progressTimer);
					that.template.updateProgress(data.id, percent + '%');
				}, 500)
				return true;
			},
			onSuccess : function(filename, _data) {
				clearInterval(progressTimer);
				that.view.onUploadSuccess(data.id, _data);
			},
			onError : function(file, response, textSatus) {
				that.view.onUploadError(data.id, textSatus);
			},
			onComplete : function(file, response) {
				if (!Slw.Utils.isnull(o.extraPara) && o.extraPara.type == 'crop') {
					this.hide();
					that.initCropEvent(true);
				}
			}
		});
	},
	initBrowserEvent : function() {
		var o = this.option;
		var that = this;
		
		var acceptType = (o.allowedTypes != '*' ? 'accept="' + o.allowedTypes + '"' : '');
		var $input = $('<input type="file" name="' + o.name + '" style="display:none" unselectable="on" ' + acceptType + (o.fileNumber != 1 ? ' multiple="multiple"' : ' ') + '/>');
		that.btn.after($input);
		
		that.btn.click(function() {
			if (o.fileNumber > 0 && that.getTotalFiles() >= o.fileNumber)
				$css.alert('最多允许上传 ' + o.fileNumber + ' 个附件！');
			else
				$input.click();
		});
		
		$input.on('change', function(evt) {
			if ($input.val() == '') return;
			that.btn.attr("disabled", true);
			that.processFiles(evt.target.files);
			$input.val('');
		});
		that.btn.attr("disabled", false);
	},
	/**
	 * 文件Ajax文件上传
	 */
	uploadFile : function(fm) {
		var o = this.option;
		var that = this;
		that.template.initProgress(fm.id);
		var fd = new FormData();
		fd.append(o.fileName, fm.file);
		fd.append('name', fm.file.name);
		fd.append('fileType', fm.file.type);
		if (!Slw.Utils.isnull(o.extraPara) && o.extraPara.type == 'crop') {
			fd.append('x', Math.round(cropData.e.x));
			fd.append('y', Math.round(cropData.e.y));
			fd.append('width', cropData.e.width);
			fd.append('height', cropData.e.height);
		}
		else if (that.template.imageFlag) {
			fd.append('width', o.width);
			fd.append('height', o.height);
		}
		$.each(that.extraData, function(exKey, exVal) {
			fd.append(exKey, exVal);
		});
		$.ajax({
			url : o.uploadUrl,
			type : o.method,
			dataType : o.dataType,
			data : fd,
			cache : false,
			contentType : false,
			processData : false,
			forceSync : false,
			xhr : function() {
				var xhrobj = $.ajaxSettings.xhr();
				if (xhrobj.upload) {
					xhrobj.upload.addEventListener('progress', function(event) {
						var percent = 0;
						var position = event.loaded || event.position;
						var total = event.total || e.totalSize;
						if (event.lengthComputable) percent = Math.ceil(position / total * 100);
						that.template.updateProgress(fm.id, percent + '%');
					}, false);
				}
				return xhrobj;
			},
			success : function(data, message, xhr) {
				that.view.onUploadSuccess(fm.id, data);
			},
			error : function(xhr, status, errMsg) {
				that.view.onUploadError(fm.id, errMsg);
			},
			complete : function(xhr, textStatus) {
				if (o.uploadType == 'sync')
					that.syncProcessNext();
				else
					that.sortable();
			}
		});
	},
	/**
	 * 对要上传的文件集合进行预处理，先插入列表显示，再根据同/异步参数上传
	 */
	processFiles : function(files) {
		var o = this.option;
		this.fileModel = [];
		for (var i = 0; i < files.length; i++) {
			if (o.fileNumber > 0 && this.getTotalFiles() >= o.fileNumber) break;
			this.initFileData(i, files[i]);
		}
		if (o.uploadType == 'sync')
			this.syncProcess();
		else
			this.asyncProcess();
	},
	/**
	 * 初始化文件map数据
	 */
	initFileData : function(index, file) {
		var data = {};
		data.id = uuid();
		data.fileExt = Slw.File.getFileExt(file.name);
		var extPos = file.name.lastIndexOf(".");
		data.fileName = extPos > 0 ? file.name.substring(0, extPos) : file.name;
		data.fileSize = file.size;
		data.file = file;
		this.filesMap[data.id] = data;
		this.fileModel[index] = data;
		this.addNewFile(data);
	},
	/**
	 * 同步上传程序入口
	 */
	syncProcess : function() {
		this.nextIndex = 0;
		this.syncProcessNext();
	},
	/**
	 * 同步上传下一个文件
	 */
	syncProcessNext : function() {
		if (this.nextIndex < this.fileModel.length)
			this.processFile(this.fileModel[this.nextIndex++]);
		else {
			this.sortable();
			this.btn.attr("disabled", false);
		}
	},
	/**
	 * 异步上传程序入口
	 */
	asyncProcess : function() {
		for (var i = 0; i < this.fileModel.length; i++)
			this.processFile(this.fileModel[i]);
		this.btn.attr("disabled", false);
	},
	/**
	 * 对要上传的单个文件进行上传
	 */
	processFile : function(fm) {
		var o = this.option;
		var file = fm.file;
		if (o.allowedTypes != '*' && o.allowedTypes.indexOf(file.type) < 0) {
			this.view.onFileTypeError(fm.id, file);
			return;
		}
		if (o.fileExt != null && o.fileExt != '*') {
			var extList = o.fileExt.toLowerCase().split(',');
			var ext = Slw.File.getFileExt(file.name);
			if ($.inArray(ext, extList) < 0) {
				this.view.onFileExtError(fm.id, file, ext);
				return;
			}
		}
		if (o.fileLength > 0 && file.size > o.fileLength * 1024) {
			this.view.onFileSizeError(fm.id, file, o.fileLength * 1024);
			return;
		}
		this.uploadFile(fm);
	},
	addNewFile : function(data) {
		var o = this.option;
		if (o.fileNumber == 1 && this.template.imageFlag) {
			var $tr = this.el.find('li');
			$tr.remove()
		}
		this.cmd.addFile(data, 0);
		this.resort();
	},
	/**
	 * 初始化按钮事件
	 */
	initCropEvent : function(ieUploadFlag) {
		var o = this.option;
		var that = this;
		that.btn.click(function() {
			var params = {};
			params.url = o.getCropUrl;
			params.data = that.extraData;
			params.rel = 'getCropFile';
			params.title = '图片剪裁';
			params.callback = function() {
				var $frm = $('#getCropAttachmentForm');
				$frm.find('.crop-save').click(function() {
					cropData = $cropApp.saveClick();
					if (!Slw.Utils.isnull(cropData)) {
						var e = cropData.e;
						$css.closeDialog();
						that.fileModel = [];
						if (Slw.Utils.isnull(cropData.file))
							that.onlyCrop();
						else {
							that.initFileData(0, cropData.file);
							that.syncProcess();
						}
					}
				});
			}
			$css.openDialog(params)
		});
		if (ieUploadFlag) that.btn.click();
	},
	readJson : function(data) {
		var o = this.option;
		data.id = Slw.Utils.uuid();
		data.file = null;
		this.filesMap[data.id] = data;
		this.cmd.addFile(data, 1);
		this.updateTools(data.id, o.readonly ? 3 : 1);
	},
	/**
	 * 列表记录序号重排
	 */
	resort : function() {
		var o = this.option;
		var that = this;
		if (!o.fileIcon) {
			var num = 1;
			this.getBody().find('.numCell').each(function() {
				$(this).html((num++) + (that.template.dotFlag ? '.' : ''));
			});
		}
	},
	getBody : function() {
		return this.template.body;
	},
	printData : function() {
		console.log(this.extraData);
		console.log(this.data);
		console.log(this.el[0]);
	}
};

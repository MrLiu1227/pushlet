///<jscompress sourcefile="slw.upload.js" />
/**
 * SlwPlugins.SlwUpload v1.3 2018.8 by CSS WangWeidong
 */
$.fn.slwUpload = $.fn.jqupload = function(option) {
	var upload = new SlwPlugins.SlwUpload(this, option);
	upload.init();
	return upload;
};
var SlwUpload = {};
/**
 * <pre>
 * 返回数据对象
 * id 前端dom对象id
 * uuid 数据库中文件的uuid
 * fileName 文件名称
 * fileExt 文件扩展名
 * fileSize 文件大小(Byte)
 * userId 上传用户Id
 * time 文件上传时间
 * orderNum 文件排序号
 * fileUrlFull 文件url
 * category 文件类型
 * extraPara 裁剪模式
 *    预览图： fileUrlFull.fileExt
 *    缩略图1：fileUrlFull.0.fileExt
 *    缩略图2：fileUrlFull.1.fileExt
 *    ...
 *    缩略图n：fileUrlFull.n.fileExt
 * </pre>
 */
SlwPlugins.SlwUpload = function(el, option) {
	this.version = 'slwUpload v1.0';
	this.debug = false;
	this.defaults = {
		btnTitle : '请选择文件',// 上传按钮标题
		btnAlign : 'pull-left', // pull-left 上传按钮居左, pull-right 上传按钮居右 ,
		// center-block 单图片上传按钮居中
		btnClass : 'btn-primary btn-sm', // 上传按钮样式
		btnOnTop : true, // ture上传按钮在上方, false上传按钮在下方
		btnSortClass : 'btn-default btn-sm', // 排序按钮样式
		readonly : false, // false 上传模式查, true 查看模式
		confirm : true, // true 删除确认, false 直接删除
		/**
		 * picMethod 扩展
		 */
		imgPreview : false,
		sortable : false, // true 支持排序 ，前提条件是模板首先要支持排序, 即模板参数 sortable=true
		sortSaveAuto : false, // 拖动排序后， true 自动保存, false 不自动保存
		fileIcon : true, // 文件类型图标显示， true显示, false不显示
		checkUpload : true, // 检查:是、否 显示上传按钮
		uploadUrl : 'uploadAttachment.action',
		getUrl : 'getAttachment.action',
		getCropUrl : 'getCropAttachment.action',
		cropUrl : 'cropAttachment.action',
		updUrl : 'updAttachment.action',
		delUrl : 'delAttachment.action',
		sortUrl : 'sortAttachment.action',
		loadUrl : 'loadAttachment.action',
		downUrl : 'downloadAttachment.action',
		extraData : { // 业务配置数据
			tableName : '',
			tableKey : '',
			tableUuid : ''
		},
		fileLength : 10000, // KB
		fileNumber : 1, // <0 则不限
		allowedTypes : '*',
		// image/*很慢，建议用'image/jpg,image/jpeg,image/png,image/gif'
		fileExt : null,
		fileName : 'file',
		dataType : 'json',
		method : 'POST',
		uploadType : 'sync', // sync:同步 , async: 异步（失败概率大）
		width : 140,
		height : 180,
		bottom : true,
		fileNameShow : false,
		defaultImage : 'cssui/plugins/slw/upload/style/blank.gif',
		/**
		 * 自定义模式，默认为liMethod
		 */
		style : SlwUpload.Li,
		onload : null,
		initLoadInfo : '加载成功',
		tmplInit : null,
		addCallback : null,
		delCallback : null,
		extraPara : null,
		buttons : []
	/**
	 * <pre>
	 * 每个button对象的结构如下：
	 * {
	 * 	icon: 按钮图标
	 * 	title: 按钮文字
	 * 	action: 按下按钮执行的方法定义，传入对象为当前文件的data对象
	 * }
	 * </pre>
	 */
	};
	this.option = $.extend(this.defaults, option);
	this.el = $(el);
	this.uploadArray = [];
};
/**
 * SlwPlugins.SlwUpload方法
 */
SlwPlugins.SlwUpload.prototype = {
	init : function() {
		var that = this;
		var o = that.option;
		if (that.el.length == 0) return;
		var batchFlag = that.el.length > 1 || Slw.Utils.isnull(o.extraData.tableUuid);
		var g_dataMap = {};
		if (batchFlag) {
			var uuidArray = [];
			that.el.each(function() {
				var _tableUuid = $(this).attr('data-id');
				uuidArray.push(_tableUuid);
				g_dataMap[_tableUuid] = [];
			});
			o.extraData.tableUuid = uuidArray.toString();
		}
		else
			g_dataMap[o.extraData.tableUuid] = [];
		if (o.checkUpload == 'false') return;
		$.post(o.loadUrl, o.extraData, function(data) {
			switch (data.result) {
				case 0:
					var config = data.msg.config;
					o.fileLength = config.fileLength;
					o.fileNumber = config.fileNumber;
					o.fileExt = config.fileExt;
					o.extraPara = Slw.Utils.toJson(config.extraPara);
					
					var attachments = data.msg.list;
					for (var i = 0; i < attachments.length; i++) {
						var _tableUuid = attachments[i].tableUuid;
						g_dataMap[_tableUuid].push(attachments[i]);
					}
					/**
					 * {type: 'crop',width : 180,height: 200 ,previewWidth : [ 180,
					 * 120, 60 ],cropWidth : [ 180, 120, 60 ]}";
					 */
					if (!Slw.Utils.isnull(o.extraPara)) {
						if (o.extraPara.type == 'pic') {
							o.width = o.extraPara.width;
							o.height = o.extraPara.height;
							o.allowedTypes = 'image/jpg,image/jpeg,image/png,image/gif';
							o.imgPreview = (o.extraPara.imgPreview == true);
						}
						else if (!Slw.Utils.isnull(o.extraPara) && o.extraPara.type == 'crop') {
							o.width = o.extraPara.width;
							o.height = o.extraPara.height;
						}
					}
					var uuidArray = o.extraData.tableUuid.split(',');
					for (var i = 0; i < uuidArray.length; i++) {
						that.uploadArray[i] = new SlwUpload.Main(that, uuidArray[i], g_dataMap[uuidArray[i]], that.el[i]);
						that.uploadArray[i].init();
					}
					break;
				default:
					$css.alert(data.msg);
					break;
			}
		}, o.dataType);
	}
};
;
///<jscompress sourcefile="slw.upload.main.js" />
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
;
///<jscompress sourcefile="slw.upload.cmd.js" />
/**
 * SlwUpload.Cmd v1.1 2018.8 by CSS WangWeidong
 */
SlwUpload.Cmd = function(main) {
	this.main = main;
	this.option = main.option;
};
/**
 * SlwUpload.Cmd方法
 */
SlwUpload.Cmd.prototype = {
	addFile : function(data, status) {
		var main = this.main;
		var o = this.option;
		main.template.addFile(data, status);
		if ($.isFunction(o.addCallback)) o.addCallback.apply(this, [ data, o ]);
	},
	/**
	 * 删除上传列表中的记录
	 */
	delFile : function(id) {
		var main = this.main;
		var o = this.option;
		var that = this;
		var $tr = $('#' + id);
		var removeFun = function(trId, option, extraData) {
			delete main.filesMap[id];
			main.loadEnd();
			main.initPlugins('del');
			if ($.isFunction(o.delCallback)) o.delCallback.apply(this, [ trId, o, extraData ]);
			if (!Slw.Utils.isnull(o.extraPara) && o.extraPara.type == 'crop') {
				if (main.getTotalFiles() == 0) {
					if (main.ieUpload != null)
						main.ieUpload.show();
					else {
						if (Slw.Utils.isIE() && Slw.Utils.ieVersion() < 10) main.initUploadEvent();
					}
				}
			}
		};
		if ($tr.attr('status') != '1') {
			removeFun();
			$tr.remove();
		}
		else {
			var fId = main.filesMap[id].uuid;
			Slw.UploadUtil.del(id, fId, removeFun, o, main.extraData);
		}
		
	},
	/**
	 * 重新上传
	 */
	reupload : function(id) {
		var main = this.main;
		if (id in main.filesMap) main.processFile(main.filesMap[id]);
	},
	/**
	 * 文件下载
	 */
	downloadFile : function(trId, mod) {
		var o = this.option;
		var fId = this.main.filesMap[trId].uuid;
		Slw.UploadUtil.download(trId, fId, mod, o);
	},
	/**
	 * 文件重命名
	 */
	renameFile : function(id) {
		var main = this.main;
		var o = this.option;
		var _data = main.filesMap[id];
		var params = {
			title : '重命名',
			url : o.getUrl,
			data : {
				uuid : _data.uuid
			},
			rel : 'attachmentRename',
			callback : function() {
				var $frm = $('#getAttachmentForm');
				$frm.find('button').click(function() {
					if (!$frm.valid()) return false;
					var newFileName = $frm.find('#fileName').val();
					$.post(o.updUrl, $frm.serialize(), function(data) {
						if (data.result == 0) {
							$css.closeDialog();
							$css.tip("保存成功！");
							_data.fileName = newFileName;
							main.filesMap[id] = _data;
							$('#' + id).find('.default-file-name').html(Slw.File.getFullName(_data));
						}
						else
							$css.alert(data.msg);
					}, o.dataType);
				});
			}
		}
		$css.openDialog(params)
	},
	/**
	 * 文件排序
	 */
	sortFiles : function() {
		var main = this.main;
		var o = this.option;
		var sortStr = '';
		main.el.find('li').each(function() {
			var id = $(this).attr('id');
			if (!Slw.Utils.isnull(id)) {
				var _data = main.filesMap[$(this).attr('id')];
				sortStr += _data.uuid + ',';
			}
		});
		if (Slw.Utils.isnull(sortStr)) return;
		var pars = $.extend({}, main.extraData);
		pars.sortStr = sortStr;
		pars.tSessionId = new Date().valueOf();
		$.post(o.sortUrl, pars, function(data) {
			if (data.result != 0) $css.alert(data.msg);
		}, o.dataType);
	}

};
;
///<jscompress sourcefile="slw.upload.view.js" />
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
;
///<jscompress sourcefile="slw.upload.tmpl.js" />
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
;
///<jscompress sourcefile="slw.upload.li.js" />
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
;
///<jscompress sourcefile="slw.upload.pic.js" />
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
;
///<jscompress sourcefile="slw.upload.table.js" />
/**
 * SlwUpload.Table v1.1 2018.8 by CSS WangWeidong
 */
tableMethod = SlwUpload.Table = function(main) {
	this.main = main;
	this.name = 'tableTemplate';
	this.sortable = true;
	this.dotFlag = false;
	this.table;
	this.body = $('<tbody class="sortable"></tbody>');
};
/**
 * SlwUpload.Table方法
 */
SlwUpload.Table.prototype = new SlwUpload.Tmpl();
$.extend(SlwUpload.Table.prototype, {
	createBody : function() {
		var config = this.getOption();
		var tempStr = '<table class="table table-bordered table-striped">';
		tempStr += '		<thead><tr>';
		tempStr += '		<th width="45px" class="firstCell">' + (config.fileIcon ? '类型' : '序号') + '</th>';
		tempStr += '		<th>文件名称</th>';
		if (!config.readonly) tempStr += '		<th width="70px">状态</th>';
		var toolBtns = config.readonly ? 1 : 3;
		var btnWidth = 25 + (toolBtns + config.buttons.length) * 18;
		tempStr += '		<th width="' + btnWidth + 'px">操作</th>';
		tempStr += '		</tr></thead>';
		tempStr += '	</table>';
		this.table = $(tempStr);
		this.table.append(this.body);
		return this.table;
	},
	addFile : function(data, status) {
		var config = this.getOption();
		var id = data.id;
		var tr = $('<tr id="' + id + '" class="jquploadRow" status="' + status + '"></tr>');
		if (config.fileIcon)
			tr.append('<td class="iconCell">' + Slw.UploadUtil.getIconImg(data, 56) + '</td>');
		else
			tr.append('<td class="numCell"></td>');
		tr.append('<td class="text-left messageCell"><span class="default-file-name">' + Slw.File.getFullName(data) + '</span> <span class="default-file-size">(' + Slw.File.getFileSize(data.fileSize) + ')</span></td>');
		if (!config.readonly) {
			tr.append('<td class="statusCell"><span class="label label-info">' + (status == 1 ? '加载' : '初始') + '成功</span></td>');
		}
		tr.append('<td class="toolsCell"></td>');
		this.body.prepend(tr);
	}
});
/**
 * SlwUpload.Table2 状态及进度条跟在文件名后
 */
tableMethod2 = SlwUpload.Table2 = function(main) {
	this.main = main;
	this.name = 'tableTemplate2';
	this.sortable = true;
	this.dotFlag = false;
	this.table;
	this.body = $('<tbody class="sortable"></tbody>');
};

SlwUpload.Table2.prototype = new SlwUpload.Tmpl();
$.extend(SlwUpload.Table2.prototype, {
	createBody : function() {
		var config = this.getOption();
		var tempStr = '<table class="table table-bordered table-striped">';
		tempStr += '		<thead><tr>';
		tempStr += '		<th width="45px" class="firstCell">' + (config.fileIcon ? '类型' : '序号') + '</th>';
		tempStr += '		<th>文件名称</th>';
		var toolBtns = config.readonly ? 1 : 3;
		var btnWidth = 25 + (toolBtns + config.buttons.length) * 18;
		tempStr += '		<th width="' + btnWidth + 'px">操作</th>';
		tempStr += '	  </tr></thead>';
		tempStr += '	</table>';
		this.table = $(tempStr);
		this.table.append(this.body);
		return this.table;
	},
	addFile : function(data, status) {
		var config = this.getOption();
		var id = data.id;
		var tr = $('<tr id="' + id + '" class="jquploadRow" status="' + status + '"></tr>');
		if (config.fileIcon)
			tr.append('<td class="iconCell">' + Slw.UploadUtil.getIconImg(data, 56) + '</td>');
		else
			tr.append('<td class="numCell"></td>');
		var liStr = '<span class="default-file-name">' + Slw.File.getFullName(data) + '</span> <span class="default-file-size">(' + Slw.File.getFileSize(data.fileSize) + ')</span>';
		if (!config.readonly) liStr += '<span class="statusCell"><span class="label label-info">' + (status == 1 ? '加载' : '初始') + '成功</span></span>';
		tr.append('<td class="text-left messageCell">' + liStr + '</td>');
		tr.append('<td class="toolsCell"></td>');
		this.body.prepend(tr);
	}
});

/**
 * SlwUpload.TableNormal 框架风格参见 dirattachmentbytable.jsp
 */
SlwUpload.TableNormal = function(main) {
	this.main = main;
	this.name = 'noStyle';
	this.sortable = false;
	this.dotFlag = false;
	this.table;
	this.body = $('<tbody></tbody>');
};
SlwUpload.TableNormal.prototype = new SlwUpload.Tmpl();
$.extend(SlwUpload.TableNormal.prototype, {
	createBody : function() {
		return '';
	},
	addFile : function(data, status) {
		var config = this.getOption();
		var main = this.main;
		var id = data.id;
		var $table = this.body;
		var tbl, row, cell;
		tbl = $table[0];
		var rowId = 0;
		row = tbl.insertRow(rowId);
		row.id = id;
		row.className = "fileRow";
		row.setAttribute('status', status);
		row.setAttribute('data-key', main.extraData.tableKey);
		
		var k = 0;
		cell = row.insertCell(k++);
		if (config.fileIcon) {
			cell.className = "text-center icon";
			cell.innerHTML = Slw.UploadUtil.getIconImg(data, 48);
		}
		else {
			cell.className = "numCell";
			$table.find('.firstCell').html('序号');
			cell.innerHTML = $table[0].rows.length - 1;
		}
		
		cell = row.insertCell(k++);
		cell.className = "text-left chWord";
		var liStr = '<span class="default-file-name">' + Slw.File.getFullName(data) + '</span> ';
		if (!config.readonly) liStr += '<span class="statusCell"><span class="label label-info">' + (status == 1 ? '加载' : '初始') + '成功</span></span>';
		liStr += '<span class="toolsCell"></span>';
		cell.innerHTML = liStr;
		
		// 时间
		cell = row.insertCell(k++);
		cell.className = "text-center chWord";
		cell.innerHTML = Slw.UploadUtil.formatDate(Slw.UploadUtil.currentDate(), 2, 16);
		
		// 类型
		cell = row.insertCell(k++);
		cell.className = "text-center fileType chWord";
		cell.innerHTML = data.fileExt;
		
		// 文件大小
		cell = row.insertCell(k++);
		cell.className = "text-center size chWord";
		cell.innerHTML = '<span class="default-file-size">' + Slw.File.getFileSize(data.fileSize) + '</span>';
	}
});
;
///<jscompress sourcefile="slw.upload.crop.js" />
/**
 * $crop v1.0 Copyright(c) 2017.6 by CSS WangWeidong
 */
;
(function($) {
	var $cropForm; // = $('#getCropAttachmentForm');
	var $cropPreview;// = $cropForm.find('.crop-preview');
	var imgCrop;
	var cropData = {};
	var srcPos = {};
	$cropApp = {
		checkPos : function(toPos) {
			if (isnull(srcPos)) return true;
			if (srcPos.x == toPos.x && srcPos.y == toPos.y && srcPos.width == toPos.width && srcPos.height == toPos.height)
				return false;
			else
				return true;
		},
		saveClick : function() {
			var toPos = imgCrop.getCropPos();
			if (toPos.x < 0 || toPos.y < 0) {
				$css.alert("剪裁框不要超出图片！");
				return null;
			}
			cropData.e = toPos;
			cropData.file = imgCrop.getFile();
			if (cropData.file == null && !$cropApp.checkPos(toPos)) {
				$css.closeDialog();
				$css.tip('保存成功');
				return null;
			}
			return cropData;
		},
		options : {
			extraPara : null,
			extraData : null,
			cropForm : null,
			cropPreview : null
		},
		init : function(options) {
			var extraPara = options.extraPara;
			var extraData = options.extraData;
			$cropForm = $(options.cropForm);
			$cropPreview = $cropForm.find(options.cropPreview);
			
			srcPos = extraData;
			if (isnull(extraPara.previewWidth)) $css.alert('参数配置错误', $css.closeDialog());
			var i = 0;
			for (i = 0; i < extraPara.previewWidth.length; i++) {
				$cropForm.find('.crop-preview.preview' + i).css({
					"width" : extraPara.previewWidth[i] + "px",
					"height" : (0.01 * Math.ceil(extraPara.previewWidth[i] * extraPara.height * 100 / extraPara.width)) + "px"
				});
			}
			for (var index = i; index < 3; index++)
				$cropForm.find('.preview' + index).remove();
			imgCrop = $cropForm.find('.crop-wrapper img').jqcropper({
				aspectRatio : extraPara.width / extraPara.height,
				preview : $cropPreview,
				pos : srcPos
			});
		}
	};
})(jQuery)
;

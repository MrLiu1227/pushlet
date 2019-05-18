///<jscompress sourcefile="crop.js" />
/*
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
			if (isnull(srcPos))
				return true;
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
			if (isnull(extraPara.previewWidth))
				$css.alert('参数配置错误', $css.closeDialog());
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

///<jscompress sourcefile="ieupload.js" />
;
(function() {
	var d = document, w = window;
	function addEvent(el, type, fn) {
		if (w.addEventListener) {
			el.addEventListener(type, fn, false);
		} else if (w.attachEvent) {
			var f = function() {
				fn.call(el, w.event);
			};
			el.attachEvent('on' + type, f)
		}
	}
	var toElement = function() {
		var div = d.createElement('div');
		return function(html) {
			div.innerHTML = html;
			var el = div.childNodes[0];
			div.removeChild(el);
			return el;
		}
	}();
	function hasClass(ele, cls) {
		return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	}
	function addClass(ele, cls) {
		if (!hasClass(ele, cls))
			ele.className += " " + cls;
	}
	function removeClass(ele, cls) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		ele.className = ele.className.replace(reg, ' ');
	}
	var getUID = function() {
		var id = 0;
		return function() {
			return 'ValumsIEUpload' + id++;
		}
	}();
	function fileFromPath(file) {
		return file.replace(/.*(\/|\\)/, "");
	}
	
	IEUpload = function(options) {
		this._input = null;
		this._submitting = false;
		this._parentDialog = d.body;
		this._settings = {
			action : 'upload.action',
			name : 'userfile',
			file : null,
			data : {},
			responseType : false,
			onChange : function(file, extension) {
			},
			onSubmit : function(file, extension) {
			},
			onComplete : function(file, response) {
			}
		};
		for ( var i in options) {
			this._settings[i] = options[i];
		}
		this._input = this._settings.file;
		this.submit();
	}
	IEUpload.prototype = {
		setData : function(data) {
			this._settings.data = data;
		},
		destroy : function() {
			if (this._input) {
				if (this._input.parentNode) {
					this._input.parentNode.removeChild(this._input);
				}
				this._input = null;
			}
		},
		_createIframe : function() {
			var id = getUID();
			var iframe = toElement('<iframe src="javascript:false;" name="' + id + '" />');
			iframe.id = id;
			iframe.style.display = 'none';
			d.body.appendChild(iframe);
			return iframe;
		},
		submit : function() {
			var self = this, settings = this._settings;
			this._input = settings.file;
			if (this._input.value === '') {
				return;
			}
			var file = fileFromPath(this._input.value);
			if (!(settings.onSubmit.call(this, file, getFileExt(file)) == false)) {
				var iframe = this._createIframe();
				var form = this._createForm(iframe);
				form.appendChild(this._input);
				form.submit();
				d.body.removeChild(form);
				form = null;
				this._input = null;
				var toDeleteFlag = false;
				addEvent(iframe, 'load', function(e) {
					if (iframe.src == "javascript:'%3Chtml%3E%3C/html%3E';" || iframe.src == "javascript:'<html></html>';") {
						if (toDeleteFlag) {
							setTimeout(function() {
								d.body.removeChild(iframe);
							}, 0);
						}
						return;
					}
					var doc = iframe.contentDocument ? iframe.contentDocument : frames[iframe.id].document;
					if (doc.readyState && doc.readyState != 'complete') {
						return;
					}
					if (doc.body && doc.body.innerHTML == "false") {
						return;
					}
					var response;
					if (doc.XMLDocument) {
						response = doc.XMLDocument;
					} else if (doc.body) {
						response = doc.body.innerHTML;
						if (settings.responseType && settings.responseType.toLowerCase() == 'json') {
							if (doc.body.firstChild && doc.body.firstChild.nodeName.toUpperCase() == 'PRE') {
								response = doc.body.firstChild.firstChild.nodeValue;
							}
							if (response) {
								response = window["eval"]("(" + response + ")");
							} else {
								response = {};
							}
						}
					} else {
						var response = doc;
					}
					settings.onComplete.call(self, file, response);
					toDeleteFlag = true;
					iframe.src = "javascript:'<html></html>';";
				});
			} else {
				d.body.removeChild(this._input);
				this._input = null;
			}
		},
		_createForm : function(iframe) {
			var settings = this._settings;
			var form = toElement('<form method="post" enctype="multipart/form-data"></form>');
			form.style.display = 'none';
			form.action = settings.action;
			form.target = iframe.name;
			d.body.appendChild(form);
			for ( var prop in settings.data) {
				var el = d.createElement("input");
				el.type = 'hidden';
				el.name = prop;
				el.value = settings.data[prop];
				form.appendChild(el);
			}
			return form;
		}
	};
})(jQuery);

///<jscompress sourcefile="method.js" />
/*
 * jqupload v1.0 2017.6 by CSS WangWeidong
 * 
 * default-methods: picMethod, liMethod, simplePicMethod, simpleLiMethod, tableMethod, tableMethod2
 */
;
(function($, window, undefined) {
	$.jquploadUtil = $.extend({}, {
		getIconImg : function(data, size) {
			return '<img title="' + getFullName(data) + '" src="cssui/plugins/cssuploader/images/' + size + '/' + $.file.getIcon(data.fileExt) + '" />';
		},
		getUrlImg : function(data) {
			var ext = (data.id == 'defaultImageId' ? '' : '.' + data.fileExt)
			return '<img class="pic-element"  data-original="' + data.fileUrlFull + '" title="' + getFullName(data) + '" src="' + data.fileUrlFull + ext + '" />';
		},
		getUrl : function(data) {
			return data.id == 'defaultImageId' ? '' : data.fileUrlFull + '.' + data.fileExt;
		},
		getLocalImg : function(img, file) {
			if (file.type.match('image/*')) {
				if (typeof FileReader !== "undefined") {
					var reader = new FileReader();
					reader.onload = function(e) {
						img.attr('src', e.target.result);
					}
					reader.readAsDataURL(file);
				}
			}
		}
	}, $.jquploadUtil);
})(jQuery);

function isnull(str) {
	return (str == null || str == "" || str == "undefined");
}
function uuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}
function getFileName(file) {
	return file.replace(/.*(\/|\\)/, "");
}
function getFileExt(fileName) {
	return fileName.toLowerCase().split('.').pop();
}

function getFullName(data) {
	var fullName = data.fileName;
	if (!isnull(data.fileExt)) fullName += '.' + data.fileExt;
	return fullName;
}
var picMethod = {
	name : 'picTemplate',
	sortable : true,
	dotFlag : true,
	imageFlag : true,
	getTemplate : function(config) {
		var tempStr = '<div style="clear: both;"></div>';
		tempStr += '<div class="jqupload-container"  >';
		tempStr += '<ul class="sortable"></ul></div>';
		return tempStr;
	},
	addFile : function(el, data, status, config) {
		var id = data.id;
		var $el = el.find('ul');
		var liStr = '<li id="' + id + '" class="jquploadRow"><div class="imgPreview"><div class="details">';
		liStr += '		<div class="default-file-name">' + getFullName(data) + '</div>';
		liStr += '		<div class="default-file-size">' + $.file.getFileSize(data.fileSize) + '</div>';
		if (data.category == 'pic')
			liStr += '		<div class="iconCell">' + $.jquploadUtil.getUrlImg(data) + '</div>';
		else
			liStr += '		<div class="iconCell">' + $.jquploadUtil.getIconImg(data, 256) + '</div>';
		if (!config.readonly) liStr += '	<div class="statusCell"></div>';
		liStr += '		<div class="messageCell"></div>';
		liStr += '		<div class="toolsCell"></div>';
		liStr += '		<div class="successMark"><i class="fa fa-check"> </i></div>';
		liStr += '		<div class="dangerMark"><i class="fa fa-close"> </i></div>';
		liStr += '	</div></div></li>';
		var $li = $(liStr);
		$li.attr('status', status);
		$el.prepend($li);
		if (isIE6) {
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
		if (isIE) {
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
			$el.find('li').css("float", "none");
			
			/**
			 * css3+
			 * 
			 * $el.css({ "display" : "table", "width" : "0" });
			 */
		}
		if (!config.readonly && config.fileNumber == 1 && data.id == 'defaultImageId') {
			var $img = $li.find('img');
			$img.css("cursor", "pointer");
			$img.click(function() {
				var $file = el.find("input[name='" + o.fileName + "']");
				$file.click();
			});
		}
		// 处理本地文件预览
		if (data.file != null) $.jquploadUtil.getLocalImg($li.find('img'), data.file);
	}
};
var simplePicMethod = {
	name : 'simplePicMethod',
	sortable : false,
	dotFlag : false,
	imageFlag : true,
	background : true,
	getTemplate : function(config) {
		var tempStr = '<div style="clear: both;"></div>';
		tempStr += '<div class="jqupload-container"><ul></ul></div>'
		return tempStr;
	},
	addFile : function(el, data, status, config) {
		var id = data.id;
		var $el = el.find('ul');
		var liStr = '<li id="' + id + '" class="jquploadRow">';
		liStr += '	  <span class="statusCell"></span>';
		liStr += '		<span class="toolsCell"></span>';
		liStr += '	</li>';
		var $li = $(liStr);
		$li.attr('status', status);
		$el.prepend($li);
		simplePicMethod.setBackground(el, data, config);
		
	},
	setBackground : function(el, data, config) {
		var url = data.id == 'defaultImageId' ? config.defaultBackground : 'url(' + $.jquploadUtil.getUrl(data) + ')';
		var btn = el.find('.jquploadButton');
		if ((isIE6 || isIE7 || isIE8) && data.id == 'defaultImageId') {
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

};

var simpleLiMethod = {
	name : 'simpleLiMethod',
	sortable : false,
	dotFlag : false,
	getTemplate : function(config) {
		return '<div class="jqupload-container pull-right"><ul></ul></div>';
	},
	addFile : function(el, data, status, config) {
		var id = data.id;
		var $el = el.find('ul');
		var liStr = '<li id="' + id + '" class="jquploadRow">';
		liStr += '	  <span class="statusCell"></span>';
		liStr += '		<span class="toolsCell"></span>';
		liStr += '	</li>';
		var $li = $(liStr);
		$li.attr('status', status);
		$el.prepend($li);
	}
};

var liMethod = {
	name : 'liTemplate',
	sortable : true,
	dotFlag : true,
	getTemplate : function(config) {
		var tempStr = '<div style="clear: both;"></div>';
		tempStr += '<div class="jqupload-container">';
		tempStr += '<ul class="sortable"></ul></div>';
		return tempStr;
	},
	addFile : function(el, data, status, config) {
		var id = data.id;
		var $el = el.find('ul');
		var liStr = '<li id="' + id + '" class="jquploadRow">';
		if (config.fileIcon)
			liStr += '	<span class="iconCell">' + $.jquploadUtil.getIconImg(data, 56) + '</span>';
		else
			liStr += '	<span class="numCell">' + ($el.find('li').length + 1) + '.</span>';
		liStr += '		<span class="messageCell"><span class="default-file-name">' + getFullName(data) + '</span> <span class="default-file-size">(' + $.file.getFileSize(data.fileSize) + ')</span></span>';
		if (!config.readonly) liStr += '	<span class="statusCell"><span class="label label-info">' + (status == 1 ? '加载' : '初始') + '成功</span></span>';
		liStr += '		<span class="toolsCell"></span>';
		liStr += '	</li>';
		var $li = $(liStr);
		$li.attr('status', status);
		$el.prepend($li);
	}
};
// 状态及进度条跟在文件名后
var tableMethod2 = {
	name : 'tableTemplate2',
	sortable : false,
	dotFlag : false,
	getTemplate : function(config) {
		var tempStr = '<div style="clear: both;"></div>';
		tempStr += '<div class="jqupload-container">';
		tempStr += '	<table class="table table-bordered table-nostriped">';
		tempStr += '		<thead><tr>';
		tempStr += '		<th width="45px" class="firstCell">类型</th>';
		tempStr += '		<th>文件名称</th>';
		var toolBtns = config.readonly ? 1 : 3;
		var btnWidth = 25 + (toolBtns + config.buttons.length) * 18;
		tempStr += '		<th width="' + btnWidth + 'px">操作</th>';
		tempStr += '	</table>';
		tempStr += '</div>';
		return tempStr;
	},
	addFile : function(el, data, status, config) {
		var id = data.id;
		var $table = el.find('table');
		var tbl, row, cell;
		tbl = $table[0];
		var rowId = 1;
		row = tbl.insertRow(rowId);
		row.id = id;
		row.className = "jquploadRow";
		row.setAttribute('status', status);
		var k = 0;
		cell = row.insertCell(k++);
		if (config.fileIcon) {
			cell.className = "iconCell";
			cell.innerHTML = $.jquploadUtil.getIconImg(data, 56);
		}
		else {
			cell.className = "numCell";
			$table.find('.firstCell').html('序号');
			cell.innerHTML = $table[0].rows.length - 1;
		}
		cell = row.insertCell(k++);
		cell.className = "text-left messageCell";
		var liStr = '<span class="default-file-name">' + getFullName(data) + '</span> <span class="default-file-size">(' + $.file.getFileSize(data.fileSize) + ')</span>';
		if (!config.readonly) liStr += '<span class="statusCell"><span class="label label-info">' + (status == 1 ? '加载' : '初始') + '成功</span></span>';
		cell.innerHTML = liStr;
		cell = row.insertCell(k++);
		cell.className = "toolsCell";
		cell.innerHTML = '';
	}
};
// 状态及进度条跟单独一列
var tableMethod = {
	name : 'tableTemplate',
	sortable : false,
	dotFlag : false,
	getTemplate : function(config) {
		var tempStr = '<div style="clear: both;"></div>';
		tempStr += '<div class="jqupload-container">';
		tempStr += '	<table class="table table-bordered table-nostriped">';
		tempStr += '		<thead><tr>';
		tempStr += '		<th width="45px" class="firstCell">类型</th>';
		tempStr += '		<th>文件名称</th>';
		if (!config.readonly) tempStr += '		<th width="70px">状态</th>';
		var toolBtns = config.readonly ? 1 : 3;
		var btnWidth = 25 + (toolBtns + config.buttons.length) * 18;
		tempStr += '		<th width="' + btnWidth + 'px">操作</th>';
		tempStr += '		</tr></thead>';
		tempStr += '	</table>';
		tempStr += '</div>';
		return tempStr;
	},
	addFile : function(el, data, status, config) {
		var id = data.id;
		var $table = el.find('table');
		var tbl, row, cell;
		tbl = $table[0];
		var rowId = 1;
		row = tbl.insertRow(rowId);
		row.id = id;
		row.className = "jquploadRow";
		row.setAttribute('status', status);
		var k = 0;
		cell = row.insertCell(k++);
		if (config.fileIcon) {
			cell.className = "iconCell";
			cell.innerHTML = $.jquploadUtil.getIconImg(data, 56);
		}
		else {
			cell.className = "numCell";
			$table.find('.firstCell').html('序号');
			cell.innerHTML = $table[0].rows.length - 1;
		}
		cell = row.insertCell(k++);
		cell.className = "text-left messageCell";
		cell.innerHTML = '<span class="default-file-name">' + getFullName(data) + '</span> <span class="default-file-size">(' + $.file.getFileSize(data.fileSize) + ')</span>';
		if (!config.readonly) {
			cell = row.insertCell(k++);
			cell.className = "statusCell";
			cell.innerHTML = '<span class="label label-info">' + (status == 1 ? '加载' : '初始') + '成功</span>';
		}
		cell = row.insertCell(k++);
		cell.className = "toolsCell";
		cell.innerHTML = '';
	}
};

///<jscompress sourcefile="upload.js" />
/*
 * jqupload v1.0 2017.6 by CSS WangWeidong
 */
;
(function($) {
	'use strict';
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
	 * 	预览图： fileUrlFull.fileExt
	 * 	缩略图1：fileUrlFull.0.fileExt
	 * 	缩略图2：fileUrlFull.1.fileExt
	 * 	...
	 * 	缩略图n：fileUrlFull.n.fileExt
	 * </pre>
	 */
	$.fn.newsjqupload = function(o) {
		var defaults = {
			btnTitle : '请选择文件',// 上传按钮标题
			btnAlign : 'pull-left', // pull-left 上传按钮居左, pull-right 上传按钮居右 ,
			// center-block 单图片上传按钮居中
			btnClass : 'btn-primary btn-sm', // 上传按钮样式
			btnOnTop : true, // ture上传按钮在上方, false上传按钮在下方
			btnSortClass : 'btn-default btn-sm', // 排序按钮样式
			readonly : false, // false 上传模式查, true 查看模式
			confirm : true, // true 删除确认, false 直接删除
			sortable : false, // true 支持排序 ，前提条件是模板首先要支持排序, 即模板参数 sortable=true
			sortSaveAuto : false, // 拖动排序后， true 自动保存, false 不自动保存
			fileIcon : true, // 文件类型图标显示， true显示, false不显示
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
			/**
			 * picMethod 扩展
			 */
			imgPreview : false,
			width : 140,
			height : 180,
			bottom : true,
			fileNameShow : false,
			totalInfoShow : true,
			defaultImage : 'cssui/plugins/jqupload/blank.gif',
			/**
			 * 自定义模式，默认为liMethod
			 */
			style : liMethod,
			onload : null,
			extraEvent : null,
			extraPara : null,
			extraButton : null,
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
		var o = $.extend(defaults, o);
		var g_dataMap = {};
		var _that = this;
		if ($(this).length == 0) return;
		var batchFlag = $(this).length > 1 || isnull(o.extraData.tableUuid);
		if (batchFlag) {
			var uuidArray = [];
			this.each(function() {
				var _tableUuid = $(this).attr('data-id');
				uuidArray.push(_tableUuid);
				g_dataMap[_tableUuid] = [];
			});
			o.extraData.tableUuid = uuidArray.toString();
		}
		else {
			g_dataMap[o.extraData.tableUuid] = [];
		}
		$.post(o.loadUrl, o.extraData, function(data) {
			switch (data.result) {
				case 0:
					var config = data.msg.data.config;
					o.fileLength = config.fileLength;
					o.fileNumber = config.fileNumber;
					o.fileExt = config.fileExt;
					o.extraPara = config.extraPara;
					var attachments = data.msg.data.list[0].attachments;
					
					if (attachments instanceof Array) {
						for (var i = 0; i < attachments.length; i++) {
							var _tableUuid = attachments[i].tableUuid;
							g_dataMap[_tableUuid].push(attachments[i]);
						}
					}
					else {
						if (!isnull(attachments)) {
							var _tableUuid = attachments.tableUuid;
							g_dataMap[_tableUuid].push(attachments);
						}
					}
					/**
					 * {type: 'crop',width : 180,height: 200 ,previewWidth : [ 180,
					 * 120, 60 ],cropWidth : [ 180, 120, 60 ]}";
					 */
					// console.log(o.extraPara);
					if (!isnull(o.extraPara)) {
						if (o.extraPara.type == 'pic') {
							o.width = o.extraPara.width;
							o.height = o.extraPara.height;
							o.allowedTypes = 'image/jpg,image/jpeg,image/png,image/gif';
							o.imgPreview = (o.extraPara.imgPreview == true);
						}
						else if (!isnull(o.extraPara) && o.extraPara.type == 'crop') {
							o.width = o.extraPara.width;
							o.height = o.extraPara.height;
						}
					}
					uploadMain();
					break;
				default:
					$css.alert(data.msg);
					break;
			}
		}, o.dataType);
		var uploadMain = function() {
			_that.each(function() {
				var $this = $(this), $document = $(document);
				var _extraData = {};
				_extraData = $.extend(_extraData, o.extraData);
				if (batchFlag) _extraData.tableUuid = $this.attr('data-id');
				var totalFiles = 0, successFiles = 0;
				$this.addClass('jqUploadTemplate');
				$this.addClass(o.style.name);
				var nextIndex = 0;
				var files;
				var cropData = {};
				var filesMap = {};
				var fileModel = [];
				var $uploadInfo = $('<div class="uploadInfo"></div>');
				var $totalStatus = $('<div class="pull-left totalStatus"></div>');
				var $btnDiv = $('<div class="btnUpload ' + o.btnAlign + '"></div>');
				var $btn = $('<button type="button" class="jquploadButton btn ' + o.btnClass + ' ' + o.btnAlign + '"> <i class="fa fa-folder-open-o"></i> ' + o.btnTitle + '</button>');
				var $btnSort = $('<button type="button" class="btnSort btn ' + o.btnSortClass + ' ' + o.btnAlign + '"> <i class="fa fa-arrows-v"></i> 保存顺序</button>');
				var service = {
					getFiles : function() {
						return $this.find('.jquploadRow');
					},
					getTotalFiles : function() {
						return totalFiles;
					},
					getSuccessFiles : function() {
						return successFiles;
					},
					getFileInfo : function(id) {
						var data = filesMap[id];
						if (!isnull(o.extraPara)) data.extraPara = o.extraPara
						return data;
					}
				};
				var on = {
					onInit : function(dataArray) {
						if (dataArray.length > 0) {
							totalFiles = dataArray.length;
							for (var i = 0; i < dataArray.length; i++)
								readJson(dataArray[i]);
						}
						else {
							addDefaultImage();
						}
						sortable();
						doFinish();
						if (!isnull(o.onload)) o.onload();
					},
					onNewFile : function(data) {
						if (o.fileNumber == 1 && o.style.imageFlag) {
							var $tr = $this.find('li');
							$tr.remove()
						}
						o.style.addFile($this, data, 0, o);
						updateUploadStatus();
						loadEnd(data);
					},
					onFileTypeError : function(id, file) {
						on.onUploadError(id, '不允许上传该类型文件');
					},
					onFileExtError : function(id, file, ext) {
						on.onUploadError(id, '文件扩展名(.' + ext + ')类型不允许');
					},
					onFileSizeError : function(id, file, size) {
						on.onUploadError(id, '文件大小不能超过' + $.file.getFileSize(size));
					},
					onUploadSuccess : function(id, data) {
						if (data.result == 0) {
							$('#' + id).attr('status', 1);
							updateStatus(id, 'success', '上传成功');
							updateUploadStatus();
							filesMap[id].uuid = data.msg.uuid;
							filesMap[id].fileUrlFull = data.msg.fileUrlFull;
							filesMap[id].time = data.msg.time;
							filesMap[id].userId = data.msg.userId;
							filesMap[id].file = null;
							if (isIE6 || isIE7 || isIE8 || isIE9) {
								filesMap[id].fileSize = data.msg.fileSize;
								var _size = $('#' + id).find('.default-file-size');
								if (_size) {
									var _pre = _size.html();
									if (isnull(_pre))
										_size.html($.file.getFileSize(filesMap[id].fileSize));
									else
										_size.html('(' + $.file.getFileSize(filesMap[id].fileSize) + ')');
								}
							}
							updateTools(id, 1);
							extraEvent(id);
							if (o.style.imageFlag) {
								var imgSrc = data.msg.fileUrlFull + '.' + data.msg.fileExt;
								if (o.style.background == true) {
									$btn.css({
										"background" : '#fff url(' + imgSrc + ') no-repeat'
									});
								}
								else {
									var $img = $('#' + id).find('.iconCell img');
									$img.attr('src', imgSrc);
									$img.attr('class', 'pic-element');
									$img.attr('data-original', data.msg.fileUrlFull);
									doFinish();
								}
							}
							
						}
						else
							on.onUploadError(id, data.msg);
					},
					onUploadError : function(id, message) {
						$('#' + id).attr('status', 2);
						updateMessage(id, 'danger', message);
						if (o.fileNumber == 1 && o.style.imageFlag) {
							$css.alert(message);
						}
						updateTools(id, 2);
					}
				};
				var updateUploadStatus = function() {
					totalFiles = $this.find('.jquploadRow').length;
					successFiles = $this.find('.jquploadRow[status=1]').length;
					$totalStatus.html('完成/总数：' + successFiles + '/' + totalFiles);
				},
				/**
				 * 自定义事件扩展，可以点击文件标题及图片触发
				 */
				extraEvent = function(id) {
					if (o.extraEvent != null) {
						var $textFile = $('#' + id).find('.default-file-name, img');
						if ($textFile) {
							$textFile.unbind();
							$textFile.css("cursor", "pointer");
							$textFile.click(function() {
								var data = service.getFileInfo(id);
								o.extraEvent(data);
							})
						}
					}
				},
				/**
				 * 更新上传状态
				 */
				updateStatus = function(id, status, message) {
					var $cell = $('#' + id).find('.statusCell');
					if (o.style.imageFlag) {
						$cell.hide();
						var $mark = $('#' + id).find('.' + status + 'Mark');
						var tip = $('#' + id).find('.tipsCell').html();
						tip = message + (!isnull(tip) ? '：' + tip : '');
						$mark.attr('title', tip);
						if (status == 'danger') {
							$mark.css("cursor", "pointer");
							$mark.show();
							$mark.click(function() {
								delFile(id);
							});
						}
						else {
							$mark.show().delay(8000).hide(1000);
						}
					}
					else {
						$cell.html('');
						$cell.append('<span class="label label-' + status + '">' + message + '</span>');
					}
				},
				/**
				 * 更新出错信息
				 */
				updateMessage = function(id, status, message) {
					var $msg = $('<code class="tipsCell" text-red">' + message + '</code>');
					var $cell = $('#' + id).find('.messageCell');
					$cell.find('.tipsCell').remove();
					$cell.append($msg);
					if (status == 'danger') updateStatus(id, status, '上传失败');
					if (isnull(message)) message = '异常错误，上传失败!';
				},
				/**
				 * 初始化进度条
				 */
				initProgress = function(id) {
					var $statCell = $('#' + id).find('.statusCell');
					if (o.style.imageFlag) {
						$statCell.html('<div class="progress progress-xs"><div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" >0%</div></div>')
						$statCell.show();
					}
					else
						$statCell.html('<div class="progress"><div class="progress-bar" role="progressbar" style="min-width:3em;">0%</div></div>')
					var $toolCell = $('#' + id).find('.toolsCell');
					$toolCell.html('');
					$('#' + id).find('.tipsCell').remove();
				},
				/**
				 * 上传进度条更新
				 */
				updateFileProgress = function(id, percent) {
					var $progress = $('#' + id).find('div.progress-bar');
					$progress.width(percent);
					if (o.style.imageFlag)
						$progress.html('');
					else
						$progress.html(percent);
				},
				/**
				 * 根据状态生成工具列按扭
				 */
				updateTools = function(id, status) {
					var $cell = $('#' + id).find('.toolsCell');
					var $tools = $('<div class="tools"></div>');
					var $del = $('<i class="fa fa-trash-o" title="删除"> </i>');
					var $edit = $('<i class="fa fa-edit" title="编辑"> </i>');
					var $down = $('<i class="fa fa-download" title="下载"> </i>');
					var $redo = $('<i class="fa fa-reply" title="重传"> </i>');
					var $insert = $('<i class="fa fa-angle-up" title="插入"> </i>');
					$cell.html('').append($tools);
					if (status == 1) { // 上传成功
						$tools.append($edit);
						$tools.append($down);
						$tools.append($del);
						$tools.append($insert);
					}
					else if (status == 2) {// 上传失败
						$tools.append($redo);
						$tools.append($del);
					}
					else if (status == 3) {// 查看模式
						$tools.append($down);
					}
					$del.click(function() {
						delFile(id);
					});
					$edit.click(function() {
						renameFile(id);
					});
					$down.click(function() {
						downloadFile(id, 2);
					});
					$redo.click(function() {
						reupload(id);
					});
					$insert.click(function() {
						insertHtml(id);
					});
					$.each(o.buttons, function(index, button) {
						var $button = $('<i class="' + button.icon + '" title="' + button.title + '"> </i>');
						$tools.append($button);
						if (button.action) {
							$button.click(function() {
								button.action.call(this, service.getFileInfo(id));
							})
						}
					});
				},
				/**
				 * addFile完成后事件处理
				 */
				loadEnd = function(data) {
					extraEvent(data.id);
					resort();
				},
				/**
				 * 通过json列表加载已经上传的文件
				 */
				readJson = function(data) {
					data.id = uuid();
					data.file = null;
					filesMap[data.id] = data;
					o.style.addFile($this, data, 1, o);
					if (!o.readonly) {
						updateUploadStatus();
						updateTools(data.id, 1);
					}
					else
						updateTools(data.id, 3);
					loadEnd(data);
				},
				/**
				 * 展示默认图片
				 */
				addDefaultImage = function() {
					if (o.fileNumber == 1 && o.style.imageFlag) {
						var data = filesMap['defaultImageId'];
						if (isnull(data)) {
							data = {};
							data.id = 'defaultImageId';
							data.file = null;
							data.fileName = '';
							data.fileSize = '-1';
							data.category = 'pic';
							data.fileUrlFull = o.defaultImage;
							filesMap[data.id] = data;
						}
						o.style.addFile($this, data, 1, o);
						if (isIE6 || isIE7 || isIE8 || isIE9) initFileInput();
					}
				},
				/**
				 * 对于已经上传的图片再次剪裁时，只需要上传剪裁区坐标即可
				 */
				onlyCrop = function() {
					var a = {};
					a.x = Math.round(cropData.e.x);
					a.y = Math.round(cropData.e.y);
					a.width = cropData.e.width;
					a.height = cropData.e.height;
					a.tSessionId = new Date().valueOf();
					var pars = $.param($.extend(a, _extraData));
					$.post(o.cropUrl, pars, function(data) {
						if (data.result == 0) {
							if (o.style.background == true)
								o.style.setBackground($this, data.msg, o);
							else {
								var $img = $this.find('.iconCell img');
								$img.attr('src', data.msg.fileUrlFull + '.' + data.msg.fileExt);
							}
							$css.tip('保存成功！');
						}
						else
							$css.alert(data.msg);
					}, o.dataType);
				},
				/**
				 * 文件Ajax文件上传
				 */
				uploadFile = function(fm) {
					initProgress(fm.id);
					var fd = new FormData();
					fd.append(o.fileName, fm.file);
					fd.append('name', fm.file.name);
					fd.append('fileType', fm.file.type);
					if (!isnull(o.extraPara) && o.extraPara.type == 'crop') {
						fd.append('x', Math.round(cropData.e.x));
						fd.append('y', Math.round(cropData.e.y));
						fd.append('width', cropData.e.width);
						fd.append('height', cropData.e.height);
					}
					else if (o.style.imageFlag) {
						fd.append('width', o.width);
						fd.append('height', o.height);
					}
					$.each(_extraData, function(exKey, exVal) {
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
									updateFileProgress(fm.id, percent + '%');
								}, false);
							}
							return xhrobj;
						},
						success : function(data, message, xhr) {
							on.onUploadSuccess.call($this, fm.id, data);
						},
						error : function(xhr, status, errMsg) {
							on.onUploadError.call($this, fm.id, errMsg);
						},
						complete : function(xhr, textStatus) {
							if (o.uploadType == 'sync')
								syncProcessNext();
							else
								sortable();
						}
					});
				},
				/**
				 * 组件初始化
				 */
				doFinish = function() {
					picViewer();
				},
				/**
				 * 图片预览
				 */
				picViewer = function() {
					if (o.imgPreview == true) {
						$this.cssViewer({
							uuid : $this.attr('id'),
							picClass : 'pic-element',
							picData : 'data-original',
							picTitle : 'title'
						});
					}
				},
				/**
				 * 排序处理
				 */
				sortable = function() {
					if (!o.readonly && o.sortable && o.style.sortable) {
						$this.find('.sortable').sortable('destroy');
						$this.find('.sortable').sortable();
						$this.find('.sortable').css("cursor", "move");
						$this.find('.sortable').on('dragend', function() {
							resort();
							if (o.sortSaveAuto) sortFiles();
						})
					}
				},
				/**
				 * 文件排序
				 */
				sortFiles = function() {
					var sortStr = '';
					$this.find('li').each(function() {
						var id = $(this).attr('id');
						if (!isnull(id)) {
							var _data = filesMap[$(this).attr('id')];
							sortStr += _data.uuid + ',';
						}
					});
					if (isnull(sortStr)) return;
					var a = {};
					a.sortStr = sortStr;
					a.tSessionId = new Date().valueOf();
					var pars = $.param($.extend(a, _extraData));
					$.post(o.sortUrl, pars, function(data) {
						if (data.result == 0) {
							if (!o.sortSaveAuto) $css.tip('顺序保存成功！');
						}
						else
							$css.alert(data.msg);
					}, o.dataType);
				},
				/**
				 * 对要上传的单个文件进行上传
				 */
				processFile = function(fm) {
					var file = fm.file;
					if (o.allowedTypes != '*' && o.allowedTypes.indexOf(file.type) < 0) {
						on.onFileTypeError(fm.id, file);
						return;
					}
					if (o.fileExt != null && o.fileExt != '*') {
						var extList = o.fileExt.toLowerCase().split(',');
						var ext = getFileExt(file.name);
						if ($.inArray(ext, extList) < 0) {
							on.onFileExtError(fm.id, file, ext);
							return;
						}
					}
					if (o.fileLength > 0 && file.size > o.fileLength * 1024) {
						on.onFileSizeError(fm.id, file, o.fileLength * 1024);
						return;
					}
					uploadFile(fm);
				},
				/**
				 * 同步上传程序入口
				 */
				syncProcess = function() {
					nextIndex = 0;
					syncProcessNext();
				},
				/**
				 * 同步上传下一个文件
				 */
				syncProcessNext = function() {
					if (nextIndex < fileModel.length)
						processFile(fileModel[nextIndex++]);
					else {
						sortable();
						$btn.attr("disabled", false);
					}
				},
				/**
				 * 异步上传程序入口
				 */
				asyncProcess = function() {
					for (var i = 0; i < fileModel.length; i++)
						processFile(fileModel[i]);
					$btn.attr("disabled", false);
				},
				/**
				 * 初始化文件map数据
				 */
				initFileData = function(index, file) {
					var data = {};
					data.id = uuid();
					data.fileExt = getFileExt(file.name);
					data.fileName = file.name.substring(0, file.name.lastIndexOf("."));
					data.fileSize = file.size;
					data.file = file;
					filesMap[data.id] = data;
					fileModel[index] = data;
					on.onNewFile(data);
				},
				/**
				 * ie6,7,8,9 上传
				 */
				ieUpload = function(inputEl) {
					var fileName = $(inputEl).val();
					var name = getFileName(fileName);
					var data = {};
					data.id = uuid();
					data.fileExt = getFileExt(fileName);
					data.fileName = name.substring(0, name.lastIndexOf("."));
					data.fileSize = 0;
					data.file = null;
					filesMap[data.id] = data;
					on.onNewFile(data);
					var a = {};
					if (!isnull(o.extraPara) && o.extraPara.type == 'crop') {
					}
					else if (o.style.imageFlag) {
						a.width = o.width;
						a.height = o.height;
					}
					a.ie = 'ie8';
					var pars = $.extend(a, _extraData);
					var progressTimer = null;
					new IEUpload({
						action : o.uploadUrl,
						name : o.fileName,
						data : pars,
						file : inputEl,
						responseType : 'json',
						onSubmit : function(filename, ext) {
							if (o.fileExt != null && o.fileExt != '*') {
								var extList = o.fileExt.toLowerCase().split(',');
								var ext = data.fileExt;
								if ($.inArray(ext, extList) < 0) {
									on.onFileExtError(fm.id, file, ext);
									return false;
								}
							}
							/**
							 * ie6,7,8 上传假进度条件
							 */
							initProgress(data.id);
							var percent = 10;
							progressTimer = setInterval(function() {
								percent += Math.ceil((100 - percent) / 10);
								if (percent > 98) clearInterval(progressTimer);
								updateFileProgress(data.id, percent + '%');
							}, 500)
						},
						onComplete : function(filename, _data) {
							clearInterval(progressTimer);
							on.onUploadSuccess.call(this, data.id, _data);
							if (!isnull(o.extraPara) && o.extraPara.type == 'crop') {
								initCropEvent(true);
							}
							else
								initFileInput();
						}
					});
				},
				/**
				 * 对要上传的文件集合进行预处理，先插入列表显示，再根据同/异步参数上传
				 */
				processFiles = function() {
					fileModel = [];
					for (var i = 0; i < files.length; i++) {
						if (o.fileNumber > 0 && totalFiles >= o.fileNumber) break;
						initFileData(i, files[i]);
					}
					if (o.uploadType == 'sync')
						syncProcess();
					else
						asyncProcess();
				},
				/**
				 * 可对上传失败的文件进行重传
				 */
				reupload = function(id) {
					if (id in filesMap) processFile(filesMap[id]);
				},
				/**
				 * 列表记录序号重排
				 */
				resort = function() {
					if (!o.fileIcon) {
						var num = 1;
						$this.find('.numCell').each(function() {
							$(this).html((num++) + (o.style.dotFlag ? '.' : ''));
						});
					}
				},
				/**
				 * 删除上传列表中的记录
				 */
				delFile = function(id) {
					var $tr = $('#' + id);
					var _del = function() {
						var removeFun = function() {
							$tr.remove();
							delete filesMap[id];
							updateUploadStatus();
							resort();
							addDefaultImage();
							doFinish();
						};
						if ($tr.attr('status') == '1') {
							var a = {};
							a.ids = filesMap[id].uuid;
							a.tSessionId = new Date().valueOf();
							var pars = $.param(a);
							$.post(o.delUrl, pars, function(data) {
								if (data.result == 0)
									removeFun();
								else
									$css.alert(data.msg);
							}, o.dataType);
						}
						else
							removeFun();
					};
					if (o.confirm && $tr.attr('status') == '1') {
						$css.confirm('确定要删除文件吗？', _del);
					}
					else
						_del();
				},
				insertHtml = function(id){
					var $tr = $('#' + id);
					var data = filesMap[id];
					var fileExt=data.fileExt;
					var fileName = data.fileName;
					var imgSrc = "information_upload/downloadAttachment.action?uuid="+data.uuid;
					var str="";
					if("jpg"==fileExt || "gif"==fileExt ||"png"==fileExt ||"jpeg"==fileExt ||"bmp"==fileExt ){
						 str='<img src="'+imgSrc+'" border=0 /><br/>';
					}else{
						 str='<a href="'+imgSrc+'" target=_blank>'+fileName+'.'+fileExt+'</a><br/>';
					}
					
					EditorObject.execCommand("inserthtml",str,true);
				},
				/**
				 * 文件重命名
				 */
				renameFile = function(id) {
					var _data = filesMap[id];
					var params = {};
					params.url = o.getUrl;
					params.data = {
						uuid : _data.uuid
					};
					params.rel = 'attachmentRename';
					params.title = '重命名';
					params.callback = function() {
						var $frm = $('#getAttachmentForm');
						$frm.find('button').click(function() {
							if (!$frm.valid()) return false;
							var newFileName = $frm.find('#fileName').val();
							$.post(o.updUrl, $frm.serialize(), function(data) {
								if (data.result == 0) {
									closeDialog();
									$css.tip("保存成功！");
									_data.fileName = newFileName;
									filesMap[id] = _data;
									$('#' + id).find('.default-file-name').html(getFullName(_data));
									extraEvent(id);
								}
								else
									$css.alert(data.msg);
							}, o.dataType);
						});
					}
					$css.openDialog(params)
				},
				/**
				 * 文件下载
				 */
				downloadFile = function(id, mod) {
					var _down = function() {
						var data = filesMap[id];
						var a = {};
						a.uuid = data.uuid;
						a.mod = mod;
						a.tSessionId = new Date().valueOf();
						var pars = $.param(a);
						var formObj = $('#hiddenformwwd');
						if (formObj.length == 0) {
							var hiddenForm = '<form id="hiddenformwwd" target="_blank" method="post"></form>';
							$("body").append(hiddenForm);
							formObj = $('#hiddenformwwd');
						}
						formObj.attr('action', o.downUrl + '?' + pars);
						formObj.submit();
					};
					var fileName = $('#' + id).find('.default-file-name').html();
					fileName = isnull(fileName) ? '' : '“' + fileName + '”';
					if (o.confirm)
						$css.confirm('确定要下载文件' + fileName + '到本地吗？', _down);
					else
						_down();
				}, px = function(n) {
					return isNumber(n) ? n + 'px' : n;
				},
				/**
				 * IE6,7,8,9 需要重复初始化按钮事件
				 */
				iepositionFix = function(fileInput) {
					var $file = fileInput;
					if (isIE6 || isIE7 || isIE8 || isIE9) {
						var btnLen = $btn.outerWidth();
						var fontSize = btnLen * 19.001 / 100;
						var pos = $btn.position();
						$file.css({
							"position" : "absolute",
							"display" : "",
							"width" : px($btn.outerWidth()),
							"height" : px($btn.outerHeight()),
							"left" : px(pos.left),
							"cursor" : "pointer",
							"color" : "transparent",
							"font-size" : fontSize + 'px',
							"z-index" : 201707,
							"overflow" : "hidden",
							"opacity" : 0
						});
						if (o.fileNumber == 1 && o.btnAlign == 'center-block' && o.style.background != true) {
							$file.css({
								"margin-top" : px(-$btn.outerHeight())
							});
						}
						$btn.unbind();
						$btn.hover(function() {
							iepositionFix($file);
						});
					}
				}, initFileInput = function() {
					var $file = $btnDiv.find("input[name='" + o.fileName + "']");
					if ($file.length > 0) $file.remove();
					var acceptType = (o.allowedTypes != '*' ? 'accept="' + o.allowedTypes + '"' : '');
					$file = $('<input type="file" name="' + o.fileName + '" style="display:none" unselectable="on" ' + acceptType + (o.fileNumber != 1 ? ' multiple="multiple"' : ' ') + '/>');
					$btn.after($file);
					iepositionFix($file);
					
					$file.click(function(e) {
						if (o.fileNumber > 0 && totalFiles >= o.fileNumber) {
							$css.alert('最多允许上传 ' + o.fileNumber + ' 个附件！');
							e.stopPropagation();
							return false;
						}
					});
					$file.on('change', function(evt) {
						$btn.attr("disabled", true);
						if (isIE6 || isIE7 || isIE8 || isIE9) {
							ieUpload(this);
						}
						else {
							files = evt.target.files;
							processFiles();
						}
						$(this).val('');
					});
					$btn.attr("disabled", false);
					return $file;
				},
				/**
				 * 初始化按钮事件
				 */
				initEvent = function() {
					initButton();
					var $file = initFileInput();
					if (o.style.sortable && o.sortable && !o.sortSaveAuto) {
						$btnDiv.append($btnSort);
						$btnSort.click(function() {
							if (o.confirm)
								$css.confirm("确定要保存当前排序吗？", sortFiles);
							else
								sortFiles();
						});
					}
					if (!(isIE6 || isIE7 || isIE8 || isIE9)) {
						$btn.click(function() {
							$file.click();
						});
					}
				},
				/**
				 * 初始化按钮事件
				 */
				initCropEvent = function(ieUploadFlag) {
					if (isIE6 || isIE7 || isIE8 || isIE9) {
						$btn.unbind();
						$btn.attr("disabled", false);
					}
					else
						initButton();
					$btn.click(function() {
						var params = {};
						params.url = o.getCropUrl;
						params.data = _extraData;
						params.rel = 'getCropFile';
						params.title = '图片剪裁';
						params.callback = function() {
							var $frm = $('#getCropAttachmentForm');
							$frm.find('.crop-save').click(function() {
								cropData = $cropApp.saveClick();
								if (!isnull(cropData)) {
									var e = cropData.e;
									$css.closeDialog();
									fileModel = [];
									if (isnull(cropData.file))
										onlyCrop();
									else {
										initFileData(0, cropData.file);
										syncProcess();
									}
								}
							});
						}
						$css.openDialog(params)
					});
					if (ieUploadFlag) $btn.click();
					
				}, initButton = function() {
					$btnDiv.append($btn);
					if (o.style.background == true) {
						o.defaultBackground = $btn.css("background-image");
						o.defaultFilter = $btn.css("filter");
						$btn.css({
							"width" : o.width,
							"height" : o.height
						});
					}
				},
				/**
				 * 上传模式初始化入口程序
				 */
				init = function() {
					$this.html('');
					if (o.btnAlign == 'pull-right')
						$uploadInfo.append($totalStatus).append($btnDiv).append('<div style="clear: both;"></div>');
					else
						$uploadInfo.append($btnDiv).append($totalStatus).append('<div style="clear: both;"></div>');
					if (o.btnOnTop) {
						if (!o.readonly) $this.append($uploadInfo);
						$this.append($(o.style.getTemplate(o)));
					}
					else {
						$this.append($(o.style.getTemplate(o)));
						if (!o.readonly) $this.append($uploadInfo);
					}
					if (!o.totalInfoShow) $totalStatus.hide();
					var dataArray = g_dataMap[_extraData.tableUuid];
					if (!isnull(o.extraPara)) {
						if (o.extraPara.type == 'pic') {
							if (!o.readonly) initEvent();
						}
						else if (!isnull(o.extraPara) && o.extraPara.type == 'crop') {
							if (!o.readonly) {
								// 剪裁时IE6, 7, 8, 9先上传
								if (dataArray.length == 0 && (isIE6 || isIE7 || isIE8 || isIE9))
									initEvent();
								else {
									initButton();
									initCropEvent(false);
								}
							}
						}
					}
					else {
						if (!o.readonly) initEvent();
					}
					on.onInit(dataArray);
				};
				init();
			});
		};
	};
})(jQuery)


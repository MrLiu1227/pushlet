/*
 * cssUploader v1.0 update from umuploader.js 2016.6 by CSS WeidongWang
 */
function uuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}
function fileModel() {
	id = null;
	file = null;
	status = 'init'; // init: 初始化, md5:计算md5, start: 开始上传, stop: 暂停, success:
							// 成功, failed: 失败,
	md5 = null;
};
(function($) {
	var filesMap = {}, o, $this, defaults = {/* 参数可以设置及方法可以重载 */
		url : document.URL,
		md5Url : null,
		method : 'POST',
		dataType : null,
		extraData : {},
		maxFileSize : 0,
		maxThread : 5,
		allowedTypes : '*', // image/*
		extFilter : null,
		fileName : 'file',
		onInit : function() {
		},
		onNewFile : function(id, file) {
		},
		onBeforeUpload : function(id) {
		},
		onMessage : function(id, msgType, message) {
		},
		onUploadProgress : function(id, percent) {
		},
		onFallbackMode : function(id, message) {
		},
		onUploadSuccess : function(id, data) {
		},
		onUploadError : function(id, message) {
		},
		onFileTypeError : function(id, file) {
		},
		onFileExtError : function(id, file) {
		},
		onFileSizeError : function(id, file, size) {
		}
	};
	$cssUploader = {
		init : function(objId, userSetting) {
			filesMap = {};
			o = $.extend(defaults, userSetting);
			$this = $('#' + objId);
			$this.on('dragenter', function(e) {
				e.stopPropagation();
				e.preventDefault();
			});
			$this.on('dragover', function(e) {
				e.stopPropagation();
				e.preventDefault();
			});
			$this.on('drop', function(e) {
				e.stopPropagation();
				e.preventDefault();
			});
			// -- Drag and drop event
			$this.on('drop', function(evt) {
				evt.preventDefault();
				var files = evt.originalEvent.dataTransfer.files;
				$cssUploader.processFiles(files);
			});
			// -- Optional File input to make a clickable area
			$this.find('input[type=file]').on('change', function(evt) {
				var files = evt.target.files;
				$cssUploader.processFiles(files);
				$(this).val('');
			});
			o.onInit.call($this);
		},
		setExtraData : function(extraData) {
			o.extraData = extraData;
		},
		processFiles : function(files) {
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				var fm = new fileModel();
				fm.id = uuid();
				fm.file = file;
				fm.status = 'init';
				filesMap[fm.id] = fm;
				o.onNewFile.call($this, fm.id, file);
				$cssUploader.processFile(fm);
			}
		},
		reupload : function(id) {
			if (id in filesMap) {
				$cssUploader.processFile(filesMap[id]);
			}
		},
		processFile : function(fm) {
			var file = fm.file;
			if (o.maxFileSize > 0 && file.size > o.maxFileSize) {
				o.onFileSizeError.call($this, fm.id, file, o.maxFileSize);
				return;
			}
			if (o.allowedTypes != '*' && !file.type.match(o.allowedTypes)) {
				o.onFileTypeError.call($this, fm.id, file);
				return;
			}
			if (o.extFilter != null) {
				var extList = o.extFilter.toLowerCase().split(';');
				var ext = file.name.toLowerCase().split('.').pop();
				if ($.inArray(ext, extList) < 0) {
					o.onFileExtError.call($this, fm.id, file);
					return;
				}
			}
			if (o.md5Url)
				$cssUploader.uploadMd5(fm);
			else
				$cssUploader.uploadFile(fm);
		},
		uploadMd5 : function(fm) {
			var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice, chunkSize = 2097152, file = fm.file, chunks = Math.ceil(file.size / chunkSize), currentChunk = 0, spark = new SparkMD5.ArrayBuffer(), fileReader = new FileReader();
			fm.status = 'md5';
			o.onMessage.call($this, fm.id, 'default', '计算MD5...');
			fileReader.onload = function(e) {
				var percent = Math.ceil((currentChunk + 1) * 100 / chunks);
				o.onUploadProgress.call($this, fm.id, percent);
				spark.append(e.target.result);
				currentChunk++;
				if (currentChunk < chunks) {
					loadNext();
				} else {
					fm.md5 = spark.end();
					o.onMessage.call($this, fm.id, 'default', 'MD5计算完成：' + fm.md5);
					$cssUploader.uploadFileInfo(fm);
				}
			};
			fileReader.onerror = function() {
				o.onMessage.call($this, fm.id, 'error', 'MD5计算出错');
			};
			function loadNext() {
				var start = currentChunk * chunkSize, end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
				fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
			}
			loadNext();
		},
		uploadFileInfo : function(fm) {
			var para = {};
			para.name = fm.file.name;
			para.fileType = fm.file.type;
			para.fileMd5 = fm.md5;
			var pars = $.param($.extend(para, o.extraData));
			$.ajax({
				url : o.md5Url,
				data : pars,
				type : 'POST',
				dataType : o.dataType,
				success : function(data) {
					if (data.result == 0) {// 秒传
						fm.status = 'success';
						o.onUploadSuccess.call($this, fm.id, data);
					} else if (data.result == 2) {// 正常传
						$cssUploader.uploadFile(fm);
					} else {
						fm.status = 'failed';
						o.onUploadError.call($this, fm.id, data.msg);
					}
				},
				error : function(xhr, status, errMsg) {
					fm.status = 'failed';
					o.onUploadError.call($this, fm.id, 'md5Error');
				}
			});
		},
		uploadFile : function(fm) {
			var fd = new FormData();
			fd.append(o.fileName, fm.file);
			fd.append('name', fm.file.name);
			fd.append('fileType', fm.file.type);
			fd.append('fileMd5', fm.md5);
			o.onBeforeUpload.call($this, fm.id);
			if (fm.status == 'stop') {
				o.onMessage.call($this, fm.id, 'default', '已暂停');
				return;
			}
			fm.status = 'start';
			$.each(o.extraData, function(exKey, exVal) {
				fd.append(exKey, exVal);
			});
			$.ajax({
				url : o.url,
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
							if (event.lengthComputable) {
								percent = Math.ceil(position / total * 100);
							}
							o.onUploadProgress.call($this, fm.id, percent);
						}, false);
					}
					return xhrobj;
				},
				success : function(data, message, xhr) {
					fm.status = 'success';
					o.onUploadSuccess.call($this, fm.id, data);
				},
				error : function(xhr, status, errMsg) {
					fm.status = 'failed';
					o.onUploadError.call($this, fm.id, 'uploadError');
				}
			});
		}
	}
})(jQuery)
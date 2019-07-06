/**
 * SlwUpload.Utils v1.1 2017.6 by CSS WangWeidong
 */
;
(function($, window, undefined) {
	Slw.UploadUtil = {
		getIconImg : function(data, size) {
			return '<img class="file-icon" title="' + Slw.File.getFullName(data) + '" src="cssui/plugins/cssuploader/images/' + size + '/' + Slw.File.getIcon(data.fileExt) + '" />';
		},
		getUrlImg : function(data) {
			var ext = (data.id == 'defaultImageId' ? '' : '.' + data.fileExt)
			return '<img class="pic-element"  data-original="' + data.fileUrlFull + '" title="' + Slw.File.getFullName(data) + '" src="' + data.fileUrlFull + ext + '" />';
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
		},
		currentDate : function() {
			var date = new Date();
			var y = date.getFullYear() + '';
			var m = date.getMonth() + 1;
			m = m < 10 ? ('0' + m) : m;
			var d = date.getDate();
			d = d < 10 ? ('0' + d) : d;
			var h = date.getHours();
			h = h < 10 ? ('0' + h) : h;
			var minute = date.getMinutes();
			minute = minute < 10 ? ('0' + minute) : minute;
			var second = date.getSeconds();
			second = second < 10 ? ('0' + second) : second;
			return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
		},
		formatDate : function(dateStr, from, to) {
			return dateStr.substring(from, to);
		},
		download : function(trId, fId, mod, o) {
			var _down = function() {
				var a = {};
				a.uuid = fId;
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
			var fileName = $('#' + trId).find('.default-file-name').html();
			fileName = isnull(fileName) ? '' : '“' + fileName + '”';
			if (o.confirm)
				$css.confirm('确定要下载文件' + fileName + '到本地吗？', _down);
			else
				_down();
		},
		del : function(trId, fId, delCallback, o, extraData) {
			var _del = function() {
				var $el = $('#' + trId);
				var a = {};
				a.ids = fId;
				a.tSessionId = new Date().valueOf();
				var pars = $.param(a);
				$.post(o.delUrl, pars, function(data) {
					if (data.result == 0) {
						$el.remove();
						if (delCallback) delCallback.call(this, trId, o, extraData);
					}
					else
						$css.alert(data.msg);
				}, o.dataType);
			}
			if (o.confirm)
				$css.confirm('确定要删除文件吗？', _del);
			else
				_del();
		},
		initTools : function(id, o, delCallback, form) {
			var $el = $('#' + id, form);
			var $cell = $el.find('.toolsCell');
			var $tools = $('<div class="tools"></div>');
			var $del = $('<i class="fa fa-trash-o" title="删除"> </i>');
			var $edit = $('<i class="fa fa-edit" title="编辑"> </i>');
			var $down = $('<i class="fa fa-download" title="下载"> </i>');
			$cell.html('').append($tools);
			
			if (!o.readonly) { // 编辑模式
				$tools.append($edit);
				$tools.append($down);
				$tools.append($del);
			}
			else {// 查看模式
				$tools.append($down);
			}
			var extraData = $.extend(true, {}, o.extraData);
			if (extraData.tableKey == '') {
				extraData.tableKey = $el.attr('data-key');
			}
			$del.click(function() {
				Slw.UploadUtil.del(id, id, delCallback, o, extraData);
			});
			
			$edit.click(function() {
				var params = {};
				params.url = o.getUrl;
				params.data = {
					uuid : id
				};
				params.rel = 'attachmentRename';
				params.title = '重命名';
				params.callback = function() {
					var $frm = $('#getAttachmentForm');
					$frm.find('button').click(function() {
						if (!$frm.valid()) return false;
						$.post(o.updUrl, $frm.serialize(), function(data) {
							if (data.result == 0) {
								data.fileExt = Slw.File.getFileExt($('#' + id).find('.default-file-name').html());
								data.fileName = $frm.find('#fileName').val();
								closeDialog();
								$css.tip("保存成功！");
								$('#' + id).find('.default-file-name').html(Slw.File.getFullName(data));
							}
							else
								$css.alert(data.msg);
						}, o.dataType);
					});
				}
				$css.openDialog(params)
			});
			
			$down.click(function() {
				Slw.UploadUtil.download(id, id, 2, o);
			});
		}
	};
	$.jquploadUtil = Slw.UploadUtil;
	
})(jQuery, this);

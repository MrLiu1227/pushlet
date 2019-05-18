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

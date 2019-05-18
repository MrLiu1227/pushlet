var defaultSetting = {
	onInit : function() {
	},
	onNewFile : function(id, file) {
		addFile('#uploadFileTable', id, file);
		updateUploadStatus();
	},
	onBeforeUpload : function(id) {
		updateFileStatus(id, 'default', '上传中...');
	},
	onMessage : function(id, msgType, message) {
		updateFileStatus(id, msgType, message);
	},
	onUploadProgress : function(id, percent) {
		updateFileProgress(id, percent + '%');
	},
	onFallbackMode : function(id, message) {
		updateFileStatus(id, 'error', '浏览器不支持' + message);
	},
	onUploadSuccess : function(id, data) {
		if (data.result == 0) {
			$('#' + id).attr('status', 1);
			updateFileStatus(id, 'success', '上传成功！');
			updateFileProgress(id, '100%');
			updateUploadStatus();
		} else
			defaultSetting.onUploadError(id, data.msg);
	},
	onUploadError : function(id, message) {
		$('#' + id).attr('status', 2);
		updateFileStatus(id, 'error', message);
		updateFileProgress(id, '0%');
		updateUploadStatus();
	},
	onFileTypeError : function(id, file) {
		updateFileStatus(id, 'error', '文件类型不允许');
		updateUploadStatus();
	},
	onFileExtError : function(id, file) {
		updateFileStatus(id, 'error', '文件扩展名类型不允许');
		updateUploadStatus();
	},
	onFileSizeError : function(id, file, size) {
		updateFileStatus(id, 'error', '文件大小不能超过' + $.file.getFileSize(size));
		updateUploadStatus();
	}
};
function updateUploadStatus() {
	var tab = $('#uploadFileTable');
	var total = tab[0].rows.length - 1;
	var success = tab.find('tr[status=1]').length;
	$('#uploadStatus').html('完成/总数：' + success + '/' + total);
}
function updateFileStatus(id, status, message) {
	$('#' + id).find('span.default-file-status').html(message).addClass(
			'default-file-status-' + status);
}
function updateFileProgress(id, percent) {
	$('#' + id).find('div.progress-bar').width(percent);
	$('#' + id).find('span.sr-only').html(percent + ' Complete');
}
function imagePreview(tableId, file) {
	if (file.type.match('image/*')) {
		if (typeof FileReader !== "undefined") {
			var reader = new FileReader();
			var img = $(tableId).find('.default-image-preview').eq(0);
			reader.onload = function(e) {
				img.attr('src', e.target.result);
			}
			reader.readAsDataURL(file);
		} else {
			$(tableId).find('.default-image-preview').remove();
		}
	}
}
function addFile(tableId, id, file) {
	var tbl, row, cell;
	tbl = $(tableId)[0];
	var rowId = 1;
	row = tbl.insertRow(rowId);
	row.id = id;
	row.setAttribute('status', 0);
	var index = tbl.rows.length - 1;
	var k = 0;
	cell = row.insertCell(k++);
	cell.className = "text-center";
	var ext = file.name.toLowerCase().split('.').pop();
	cell.innerHTML = '<img src="cssui/plugins/cssuploader/images/56/'
			+ $.file.getIcon(ext) + '" class="default-image-preview" />';
	cell = row.insertCell(k++);
	cell.className = "text-left";
	cell.innerHTML = '<span class="default-file-id">#'
			+ index
			+ '</span> - <span class="default-file-name">'
			+ file.name
			+ '</span> <span class="default-file-size">('
			+ $.file.getFileSize(file.size)
			+ ')</span><br /><span class="default-status">状态: </span><span class="default-file-status">数据处理...</span>';
	cell = row.insertCell(k++);
	cell.innerHTML = '<div class="progress progress-striped active">'
			+ '<div class="progress-bar" role="progressbar" style="width: 0%;">'
			+ '<span class="sr-only">0% Complete</span>' + '</div>' + '</div>';
	imagePreview(tableId, file);
}
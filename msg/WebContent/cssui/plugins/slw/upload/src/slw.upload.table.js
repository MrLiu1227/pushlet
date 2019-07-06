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

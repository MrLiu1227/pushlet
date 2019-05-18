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

//发文收文表单正文
var tableMethodZhengWen = {
    name : 'tableTemplate',
    sortable : false,
    dotFlag : false,
    getTemplate : function(config) {
        var tempStr = '<div style="clear: both;"></div>';
        tempStr += '<div class="jqupload-container">';
        tempStr += '	<table class="table table-bordered table-nostriped" id="zhengwen">';
        tempStr += '		<thead><tr>';
        tempStr += '		<th width="50px" >序号</th>';
        tempStr += '		<th width="50px" class="firstCell" >类型</th>';
        tempStr += '		<th>环节</th>';
        tempStr += '		<th width="80px" >操作人</th>';
        tempStr += '		<th width="160px" >操作时间</th>';
        var toolBtns = config.readonly ? 1 : 3;
        var btnWidth = 25 + (toolBtns + config.buttons.length) * 18;
        tempStr += '		<th width="230px">操作</th>';
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

        /*className 为空默认为center对齐方式*/
        //序号列
        cell = row.insertCell(k++);
        cell.className = "";
        cell.innerHTML = '<span class="default-file-name">' + data.orderNum+ '</span> ';

        //类型列
        cell = row.insertCell(k++);
        cell.className = "iconCell";
        cell.innerHTML = $.jquploadUtil.getIconImg(data, 56);

        //环节列
        cell = row.insertCell(k++);
        cell.className = "text-left";
        cell.innerHTML = '<span class="default-file-name">' + data.activityName + '</span> ';

        //操作人
        cell = row.insertCell(k++);
        cell.className = "";
        cell.innerHTML = '<span class="default-file-name">' + data.userName + '</span>';

        //操作时间
        cell = row.insertCell(k++);
        cell.className = "time";
        cell.innerHTML = '<span class="">' + data.time + '</span> ';

        //操作
        cell = row.insertCell(k++);
        cell.className = "text-left toolsCell";
        cell.innerHTML = '';
    }
};

var tableMethodGWAttach = {
	    name : 'tableTemplate',
	    sortable : false,
	    dotFlag : false,
	    getTemplate : function(config) {
	        var tempStr = '<div style="clear: both;"></div>';
	        tempStr += '<div class="jqupload-container">';
	        tempStr += '	<table class="table table-bordered table-nostriped">';
	        tempStr += '		<thead><tr>';
	        tempStr += '		<th width="50px" class="firstCell">类型</th>';
	        tempStr += '		<th>文件名</th>';
	        tempStr += '		<th width="90px">操作人</th>';
	        tempStr += '		<th width="150px">操作时间</th>';
	        var toolBtns = config.readonly ? 1 : 3;
	        var btnWidth = 25 + (toolBtns + config.buttons.length) * 18;
	        tempStr += '		<th width="160px">操作</th>';
	        tempStr += '		</tr></thead>';
	        tempStr += '	</table>';
	        tempStr += '</div>';
	        return tempStr;
	    },
	    addFile : function(el, data, status, config) {
	    	debugger
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

	        /*className 为空默认为center对齐方式*/

	        //类型列
	        cell = row.insertCell(k++);
	        cell.className = "iconCell";
	        cell.innerHTML = '<span >' + $.jquploadUtil.getIconImg(data, 56)+ '</span> ';
	        
	        //文件名
	        cell = row.insertCell(k++);
	        cell.className = "text-left";
	        cell.innerHTML = '<span class="default-file-name">' + data.fileName + '</span> <span class="default-file-size">(' + $.file.getFileSize(data.fileSize) + ')</span>';

	        //操作人
	        cell = row.insertCell(k++);
	        cell.className = "userId";
	        if(data.userName){
		        cell.innerHTML = '<span >' + data.userName + '</span>';
	        }else{
	        	cell.innerHTML = '<span ></span>';
	        }


	        //操作时间
	        cell = row.insertCell(k++);
	        cell.className = "time";
	        if(data.time){
	        	cell.innerHTML = '<span >' + data.time + '</span> ';
	        }else{
	        	cell.innerHTML = '<span ></span>';
	        }
	        

	        //操作
	        cell = row.insertCell(k++);
	        cell.className = "text-left toolsCell";
	        cell.innerHTML = '';
	    }
};

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

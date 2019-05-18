/*
 * cssreview v1.0 2017.8 by CSS Jiadw
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
	 * userId 上传用户Id
	 * time 文件上传时间
	 * </pre>
	 */
	$.fn.cssreview = function(o) {
		var defaults = {
			btnTitle : '添加意见',// 按钮标题
			btnAlign : 'pull-left', // pull-left 按钮居左, pull-right 按钮居右 
			btnClass : 'btn-primary btn-sm', // 上传按钮样式
			btnOnTop : true, // true按钮在上方, false按钮在下方
			optype : 'display', //edit,required,read,display,none,null
			confirm : true, // true 删除确认, false 直接删除
			addUrl : 'review/addReview.action',
			getUrl : 'review/getReview.action',
			updUrl : 'review/updReview.action',
			delUrl : 'review/delReview.action',
			loadUrl : 'review/dirReview.action',
			signType: '1',
			dataArray : null,
			extraData : { // 业务配置数据
				tableName : '',
				tableKey : '',
				tableUuid : '',
				workItemId : ''
			},
			dataType : 'json',
			method : 'POST',
			/**
			 * 自定义模式，默认为liMethod
			 */
			style : reviewMethod,
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
		var $this = $(this), $document = $(document);
		$this.addClass('jqReviewTemplate');
		$this.addClass(o.style.name);
		var nextIndex = 0;
		var files;
		var fileModel = [];
		var $pluginInfo = $('<div class="uploadInfo"></div>');
		var $btnDiv = $('<div class="btnUpload ' + o.btnAlign + '"></div>');
		var $btn = $('<button type="button" class="jquploadButton btn ' + o.btnClass + ' ' + o.btnAlign + '"> <i class="fa fa-comment-o"></i> ' + o.btnTitle + '</button>');
		var service = {
			getFiles : function() {
				return $this.find('.jquploadRow');
			},
			getFileInfo : function(id) {
				return "info";
			}
		};
		var on = {
				onInit : function(dataArray) {
					if (dataArray instanceof Array) {
						for (var i = 0; i < dataArray.length; i++)
							readJson(dataArray[i]);
					} else {
						if (!isnull(dataArray)) {
							readJson(dataArray);
						}
					}
					if (!isnull(o.onload))
						o.onload();
				},
				onNew: function(data) {
					o.style.addFile($this, data, 0, o);
					loadEnd(data);
				},
				onSuccess : function(id, data) {
					if (data.result == 0) {
						$('#review_' + id).attr('status', 1);
						updateStatus(id, 'success', '上传成功');
						updateTools(id, 1);
						extraEvent(id);
					} else
						on.onError(id, data.msg);
				},
				onError : function(id, message) {
					$('#review_' + id).attr('status', 2);
					updateMessage(id, 'danger', message);
					updateTools(id, 2);
				}
			};
		/**
		 * 自定义事件扩展，可以点击文件标题及图片触发
		 */
		var extraEvent = function(id) {
			if (o.extraEvent != null) {
				var $textFile = $('#review_' + id).find('.default-file-name, img');
				if ($textFile) {
					$textFile.unbind();
					$textFile.css("cursor", "pointer");
					$textFile.click(function() {
						//var data = service.getFileInfo(id);
						//o.extraEvent(data);
					})
				}
			}
		},
		/**
		 * 根据状态生成工具列按扭
		 */
		updateTools = function(id, status) {
			var $cell = $('#review_' + id).find(".timeline-item");
			var $footer = $('<div class="timeline-footer"></div>');
			
			var $tools = $('<div class="tools"></div>');
			
			var $del = $('<i class="fa fa-trash-o" title="删除" style="cursor:pointer"> 删除</i>');
			var $edit = $('<i class="fa fa-edit" title="编辑" style="cursor:pointer"> 编辑</i>');
			
			$footer.append($tools);
			$cell.append($footer);
			if (status == 1) { // 添加成功
				$tools.append($edit);
				$tools.append("&nbsp;&nbsp;");
				$tools.append($del);
			}
			$del.click(function() {
				del(id);
			});
			$edit.click(function() {
				edit(id);
				//renameFile(id);
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
		 * 根据状态生成工具列按扭
		 */
		updateTabs = function(id) {
			$('#review_' + id +'_a').on('click', function(){
				$(this).siblings().removeClass('btn-primary');
				$(this).addClass('btn-primary');
				$this.find('ul li').hide();
				$('#review_' + id).show();
			}).click();
        },

        /**
		 * 更新出错信息
		 */
		updateMessage = function(id, status, message) {
			var $msg = $('<code class="tipsCell" text-red">' + message + '</code>');
			var $cell = $('#review_' + id).find('.messageCell');
			$cell.find('.tipsCell').remove();
			$cell.append($msg);
			if (status == 'danger')
				updateStatus(id, status, '上传失败');
			if (isnull(message))
				message = '异常错误，上传失败!';
		},
        /**
		 * addFile完成后事件处理
		 */
		loadEnd = function(data) {
			//extraEvent(data.id);
		},
		/**
		 * 通过json列表加载意见
		 */
		readJson = function(data) {
			data.id = data.uuid;
			o.style.addReview($this, data, 1, o);
			$btnDiv.show();
            if (o.optype != '' && o.optype != 'display' && data.id == o.extraData.workItemId) {
            	updateTools(data.id, 1);
                $btnDiv.css("display","none");
            }
            updateTabs(data.id);
			loadEnd(data);
		},
		/**
		 * 添加意见
		 */
		edit = function(id) {
			if(o.signType=='2' && isIE8){
				var pars = '?uuid='+(isnull(id)?'':id)+'&tableName='+o.extraData.tableName+'&tableKey='+o.extraData.tableKey+'&tableUuid='+o.extraData.tableUuid
					+'&workItemId='+o.extraData.workItemId+'&signType=2&info='+($('#review_' + id).attr('info')==null?"":$('#review_' + id).attr('info'));
				var url = o.getUrl;
				window.open(url+pars);
				return;
			}
			var params = {};
			params.url = o.getUrl;
			params.rel = 'getReview';
			params.title = '填写意见';
			params.data = {
				uuid : id,
				signType : o.signType,
			};
			if(o.signType=='2'){
				params.data.info = ($('#review_' + id).attr('info')==null?"":$('#review_' + id).attr('info'));
			}
			params.data = $.extend(params.data, o.extraData);
			params.callback = function() {
				var $frm = $('#getReviewForm');
				$frm.find('#submit').click(function() {
					if (!$frm.valid())
						return false;
					var uuid = $frm.find('#uuid').val();
					var opUrl = isnull(uuid)? o.addUrl:o.updUrl;
					if(o.signType=='2'){
						var imgdata = window.frames['canFrame'].canvas.toDataURL("image/png");
					    $("#signInContent").val(imgdata);
					}
					$.post(opUrl, $frm.serialize(), function(data) {
						if (data.result == 0) {
							closeDialog();
							$css.tip("保存成功！");
							if(isnull(uuid))
								readJson(data.info);
							else{
								if(data.info.signType=='2')
									$('#review_' + id).find('.timeline-body').html('<img style="width:'+reviewMethod.imgWidth+'px;height:'+reviewMethod.imgHeight+'px;" src="'+data.info.content+'"/>');
								else
									$('#review_' + id).find('.timeline-body').html(data.info.content);
							}
						} else
							$css.alert(data.msg);
					}, o.dataType);
				});
			}
			$css.openDialog(params)
		},
		/**
		 * 删除列表中的记录
		 */
		del = function(id) {
			var $tr = $('#review_' + id);
			var $tra = $('#review_' + id+'_a');
			var _del = function() {
				var removeElement = function() {
					$tr.remove();
					$tra.remove();
					resort();
					$btnDiv.css("display","");
				};
				var a = {};
				a.ids = id;
				a.tSessionId = new Date().valueOf();
				var pars = $.param(a);
				$.post(o.delUrl, pars, function(data) {
					if (data.result == 0)
						removeElement();
					else
						$css.alert(data.msg);
				}, o.dataType);
			};
			if (o.confirm) {
				$css.confirm('确定要删除吗？', _del);
			} else
				_del();
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
		 * 初始化按钮事件
		 */
		initEvent = function() {
			initButton();
			$btn.click(function() {
				edit();
			});
		},
        initButton = function() {
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
		 * 初始化插件入口程序
		 */
		init = function() {
			$this.html('');
			$pluginInfo.append($btnDiv).append('<div style="clear: both;"></div>');
			if (o.btnOnTop) {
				if (o.optype != '' && o.optype != 'display')
					$this.append($pluginInfo);
				$this.append($(o.style.getTemplate(o)));
			} else {
				$this.append($(o.style.getTemplate(o)));
				if (o.optype != '' && o.optype != 'display')
					$this.append($pluginInfo);
			}
			if (o.optype != '' && o.optype != 'display')
				initEvent();
			on.onInit(o.dataArray);
		};
		init();
		return service;
	};
})(jQuery);

var reviewMethod = {
		name : 'reviewTemplate',
		sortable : false,
		dotFlag : false,
		imgWidth:900,
		imgHeight:400,
		getTemplate : function(config) {
			var tempStr = '<div style="clear: both;"></div>';
			tempStr += '<div class="btnTab" style="margin-bottom:0px;"></div>';
			tempStr += '<ul class="timeline" style="margin-bottom:0px;list-style:none;"></ul>';
			return tempStr;
		},
		addReview : function(el, data, status, config) {
//			画tab
			var id = data.id;
			var $tab = el.find('div.btnTab');
			var liStr ='<a id="review_' + id + '_a" class="btn btn-default btn-sm" style="margin-top:5px;" href="javascript:;"> '+data.userName+'</a>';
			$tab.append(liStr);
//			画li
			var $el = el.find('ul');
			if(data.signType=='2'){
				var liStr = '<li id="review_' + id + '" style="display:none;" info="'+data.userName+'('+data.createtime+')"><div class="timeline-item" style="margin-left:0px;margin-right:0px;">';
				liStr += '		<div class="timeline-header"><h4 class="pull-left"><i class="fa fa-user"></i> ' + data.userName + ':</h4><span class="time"><i class="fa fa-clock-o"></i>' + data.createtime + '</span><div class="clear-fix"></div></div>';
				liStr += '		<div class="timeline-body"><img style="width:'+reviewMethod.imgWidth+'px;height:'+reviewMethod.imgHeight+'px;" src="review/downloadReview.action?uuid=' + data.id + '&t='+Math.round(Math.random() * 10000)+'"/></div>';
				liStr += '	</div></li>';
			} else {
				var liStr = '<li id="review_' + id + '" style="display:none;margin:10px 0 10px 0;float: left;clear: both;"><div class="timeline-item" style="margin-left:0px;margin-right:0px;">';
				liStr += '		<div class="timeline-header"><h4 class="pull-left"><i class="fa fa-user"></i> ' + data.userName + ':</h4><span class="time"><i class="fa fa-clock-o"></i>' + data.createtime + '</span><div class="clear-fix"></div></div>';
				liStr += '		<div class="timeline-body">' + data.content + '</div>';
				//liStr += '		<div class="timeline-footer"></div>';
				liStr += '	</div></li>';
			}
			var $li = $(liStr);
			$el.append($li);
		}
};

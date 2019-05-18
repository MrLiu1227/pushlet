/**
 * CssDialog & $jqDialog v1.0 2017.6.1 by CSS WangWeidong
 * 
 * modal.js from bootstrap3.3.x
 * 
 */

;
(function($) {
	'use strict';
	var Modal = function(element, options) {
		this.options = options;
		this.$body = $(document.body);
		this.$element = $(element);
		this.$dialog = this.$element.find('.modal-dialog');
		this.isShown = null;
		
		if (this.options.remote) {
			this.$element.find('.modal-content').load(this.options.remote, $.proxy(function() {
				this.$element.trigger('loaded.bs.modal');
			}, this))
		}
	}

	Modal.VERSION = '3.3.7';
	Modal.TRANSITION_DURATION = 300;
	
	Modal.DEFAULTS = {
		keyboard : true,
		show : true
	}

	Modal.prototype.toggle = function(_relatedTarget) {
		return this.isShown ? this.hide() : this.show(_relatedTarget);
	}

	Modal.prototype.show = function(_relatedTarget) {
		var that = this;
		var e = $.Event('show.bs.modal', {
			relatedTarget : _relatedTarget
		})
		this.$element.trigger(e);
		if (this.isShown || e.isDefaultPrevented()) return;
		this.isShown = true;
		this.$body.addClass('modal-open');
		this.escape();
		this.resize();
		this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));
		this.$dialog.on('mousedown.dismiss.bs.modal', function() {
			that.$element.one('mouseup.dismiss.bs.modal', function(e) {
			})
		})

		var transition = $.support.transition && that.$element.hasClass('fade');
		if (!that.$element.parent().length) that.$element.appendTo(that.$body);
		that.$element.show().scrollTop(0);
		if (transition) that.$element[0].offsetWidth;
		that.$element.addClass('in');
		that.enforceFocus();
		var e = $.Event('shown.bs.modal', {
			relatedTarget : _relatedTarget
		})
		transition ? that.$dialog // wait for modal to slide in
		.one('bsTransitionEnd', function() {
			that.$element.trigger('focus').trigger(e)
		}).emulateTransitionEnd(Modal.TRANSITION_DURATION) : that.$element.trigger('focus').trigger(e)
	}

	Modal.prototype.hide = function(e) {
		if (e) e.preventDefault();
		e = $.Event('hide.bs.modal');
		this.$element.trigger(e);
		if (!this.isShown || e.isDefaultPrevented()) return;
		this.isShown = false;
		this.escape();
		this.resize();
		$(document).off('focusin.bs.modal');
		this.$element.removeClass('in').off('click.dismiss.bs.modal').off('mouseup.dismiss.bs.modal');
		this.$dialog.off('mousedown.dismiss.bs.modal');
		$.support.transition && this.$element.hasClass('fade') ? this.$element.one('bsTransitionEnd', $.proxy(this.hideModal, this)).emulateTransitionEnd(Modal.TRANSITION_DURATION) : this.hideModal();
	}

	Modal.prototype.enforceFocus = function() {
		$(document).off('focusin.bs.modal') // guard against infinite focus loop
		.on('focusin.bs.modal', $.proxy(function(e) {
			if (document !== e.target && this.$element[0] !== e.target && !this.$element.has(e.target).length) {
				this.$element.trigger('focus');
			}
		}, this))
	}

	Modal.prototype.escape = function() {
		if (this.isShown && this.options.keyboard) {
			this.$element.on('keydown.dismiss.bs.modal', $.proxy(function(e) {
				switch (e.which) {
					case 27:
						this.hide()
						break;
					case 13:
						var $element = $(':focus');
						if (!$element.is('textarea') && !$element.is('select')) {
							var dlg = $jqdialog.getTopDialog();
							var button = dlg.getContent().find('.submitButton');
							if (button.length == 1) {
								e.preventDefault();
								button.click();
							}
						}
						break;
					default:
						break;
				}
			}, this))
		}
		else if (!this.isShown) {
			this.$element.off('keydown.dismiss.bs.modal');
		}
	}

	Modal.prototype.resize = function() {
		if (this.isShown) {
			$(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this));
		}
		else {
			$(window).off('resize.bs.modal');
		}
	}

	Modal.prototype.hideModal = function() {
		var that = this;
		this.$element.hide();
		that.$body.removeClass('modal-open');
		that.resetAdjustments();
		that.$element.trigger('hidden.bs.modal');
	}

	// these following methods are used to handle overflowing modals
	Modal.prototype.handleUpdate = function() {
	}

	Modal.prototype.resetAdjustments = function() {
		this.$element.css({
			paddingLeft : '',
			paddingRight : ''
		})
	}

	// MODAL PLUGIN DEFINITION
	// =======================
	
	function Plugin(option, _relatedTarget) {
		return this.each(function() {
			var $this = $(this);
			var data = $this.data('bs.modal');
			var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option);
			
			if (!data) $this.data('bs.modal', (data = new Modal(this, options)));
			if (typeof option == 'string')
				data[option](_relatedTarget);
			else if (options.show) data.show(_relatedTarget);
		})
	}
	
	$.fn.modal = Plugin;
	$.fn.modal.Constructor = Modal;
	
})(jQuery)

;
(function($) {
	var CssDialog = function(opt) {
		this.defaults = {
			id : uuid(),
			title : '视窗', // 标题,默认'视窗'
			content : '<div class="ui_loading"><span>loading...</span></div>',
			showHeader : true, // 是否显示header
			showFooter : true, // 是否显示footer
			showEffect : 'fade',// 弹出框特效
			cssClass : '',
			btnStyle : 'btn-default btn-sm',
			btnClose : true, // 是否显示关闭按钮
			draggable : true, // 是否允许用户拖动位置
			top : 0.382, // Y轴坐标
			backdrop : false, // 是否支持按空白处关闭
			keyboard : true, // 是否支持Esc键关闭
			onshown : null, // 自定义弹出框弹出完成后加载
			onshow : null, // 自定义弹出框show时立即加载
			maxHeight : null,
			width : null,
			height : null,
			buttons : [],
			/**
			 * <pre>
			 * 每个button对象的结构如下：
			 * {
			 * 	icon: 按钮图标
			 * 	name: 按钮标题
			 * 	label: 按钮显示的文字，说明：在label为空时，label = icon +' '+ name
			 * 	cssClass: 按钮自定义样式，默认为 btn-default btn-sm
			 * 	action: 按下按钮执行的方法定义传入对象为dialog对象
			 * }
			 * </pre>
			 */
			
			data : {}
		};
		this.draggableData = {
			isMouseDown : false,
			mouseOffset : {}
		};
		this.options = $.extend(this.defaults, opt);
	}
	/**
	 * CssDialog方法
	 */
	CssDialog.prototype = {
		init : function() {
			this.createModal();
			this.createDialog();
			this.createMask();
			this.createContent();
			this.createHeader();
			this.createBody();
			this.createFooter();
			this.getModal().append(this.getDialog()).append(this.getMask());
			if (isIE6) {
				this.createIE6frame();
				this.getModal().append(this.getIE6frame());
			}
			this.getDialog().append(this.getContent());
			this.getContent().append(this.getHeader()).append(this.getBody()).append(this.getFooter());
			
		},
		createModal : function() {
			this.$modal = $('<div class="modal jqmodal" role="dialog" aria-hidden="true" tabindex="-1"></div>');
			this.$modal.prop('id', this.getId());
			if (!isnull(this.getCssClass())) this.$modal.addClass(this.getCssClass());
			if (!isnull(this.options.showEffect)) this.$modal.addClass(this.options.showEffect);
		},
		getModal : function() {
			return this.$modal;
		},
		createDialog : function() {
			this.$modalDialog = $('<div class="modal-dialog"></div>');
		},
		getDialog : function() {
			return this.$modalDialog;
		},
		createMask : function() {
			this.$modalMask = $('<div class="modal-mask"></div>');
		},
		getMask : function() {
			return this.$modalMask;
		},
		createIE6frame : function() {
			this.$modalMask = $('<iframe frameborder="0" src="about:blank" style="position:absolute;z-index:-1;width:100%;top:0px;left:0px;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0)"><\/iframe>');
		},
		getIE6frame : function() {
			return this.$modalMask;
		},
		createContent : function() {
			this.$modalContent = $('<div class="modal-content"></div>');
		},
		getContent : function() {
			return this.$modalContent;
		},
		createHeader : function() {
			this.$modalHeader = this.options.showHeader ? $('<div class="modal-header"></div>') : $('');
		},
		getHeader : function() {
			return this.$modalHeader;
		},
		createBody : function() {
			this.$modalBody = $('<div class="modal-body"></div>');
		},
		getBody : function() {
			return this.$modalBody;
		},
		createFooter : function() {
			this.$modalFooter = this.options.showFooter ? $('<div class="modal-footer"></div>') : $('');
		},
		getFooter : function() {
			return this.$modalFooter;
		},
		getId : function() {
			return this.options.id;
		},
		getCssClass : function() {
			return this.options.cssClass;
		},
		getButtons : function() {
			return this.options.buttons;
		},
		setButtons : function(buttons) { // 重置
			this.options.buttons = buttons;
		},
		addButton : function(button) {
			this.options.buttons.push(button);
		},
		addButtons : function(buttons) { // 追加
			var _that = this;
			$.each(buttons, function(index, button) {
				_that.addButton(button);
			});
		},
		getTitle : function() {
			return this.$modalTitle
		},
		getTitleInfo : function() {
			return this.$modalTitle.html();
		},
		setTitle : function(title) {
			title = isnull(title) ? '视窗' : title;
			this.options.title = title;
			this.getTitle().html(title);
		},
		setContent : function(content) {
			this.options.content = content;
			this.getBody().html(content);
		},
		createHeaderContent : function() {
			if (!this.options.showHeader) return;
			var _that = this;
			if (this.options.btnClose) {
				var $button = $('<button type="button" class="close" data-dismiss="modal" aria-hidden="true"><span aria-hidden="true">&times;</span></button>');
				this.getHeader().append($button);
			}
			this.$modalTitle = $('<h4 class="modal-title"></h4>');
			this.getHeader().append(this.$modalTitle);
			this.setTitle(this.options.title);
		},
		createBodyContent : function() {
			this.setContent(this.options.content);
		},
		createFooterContent : function() {
			if (!this.options.showFooter) return;
			var _that = this;
			$.each(_that.options.buttons, function(index, button) {
				var $button = $('<button class="btn"></button>');
				_that.getFooter().append($button);
				
				if (!isnull(button.label))
					$button.append(button.label);
				else
					$button.append(dealNull(button.icon) + ' ' + dealNull(button.name));
				
				if (!isnull(button.title)) $button.attr('title', button.title);
				
				if (!isnull(button.cssClass))
					$button.addClass(button.cssClass);
				else
					$button.addClass(_that.options.btnStyle);
				
				if (!isnull(button.data)) {
					$.each(button.data, function(key, value) {
						$button.attr(key, value);
					});
				}
				if (button.action) {
					$button.click(function() {
						button.action.call(this, _that);
					})
				}
			});
		},
		resizeSimple : function() {
			var top = ($(window).height() - this.getContent().height() - 80) * this.options.top;
			var left = ($(window).width() - this.getContent().width()) * 0.5;
			if (top < 0) top = 0;
			if (left < 0) left = 0;
			this.getDialog().css({
				"left" : px(left),
				"top" : px(top)
			});
			if (isnull(this.options.height)) {
				if (isnull(this.options.maxHeight)) this.options.maxHeight = $(window).height() - 60;
				this.getBody().css({
					"max-height" : px(this.options.maxHeight)
				});
			}
		},
		resize : function() {
			var _that = this;
			if (isIE6 || isIE7) {
				this.getDialog().css("width", px(this.getBody()[0].scrollWidth + 20));
				setTimeout(function() {
					_that.resizeSimple();
				}, 0);
			}
			else
				_that.resizeSimple();
		},
		initEvent : function() {
			var _that = this;
			_that.getModal().modal({
				backdrop : _that.options.backdrop,
				keyboard : _that.options.keyboard
			});
			_that.getModal().on('hide.bs.modal', function() {
				$jqdialog.remove(_that.getId());
				$(this).remove();
			});
			if (!isnull(_that.options.onshow)) {
				_that.getModal().on('show.bs.modal', function() {
					_that.options.onshow(_that);
				});
			}
			if (!isnull(_that.options.onshown)) {
				_that.getModal().on('shown.bs.modal', function() {
					_that.options.onshown(_that);
				});
			}
			
			if (!isnull(_that.options.width)) {
				this.getBody().css({
					"width" : px(_that.options.width)
				});
			}
			if (!isnull(_that.options.height)) {
				this.getBody().css({
					"height" : px(_that.options.height)
				});
			}
			
			_that.resizeSimple();
			_that.draggable();
		},
		draggable : function() {
			if (this.options.draggable) {
				this.getHeader().css("cursor", "move");
				this.getHeader().addClass('draggable').on('mousedown', {
					dialog : this
				}, function(event) {
					var dialog = event.data.dialog;
					dialog.draggableData.isMouseDown = true;
					var dialogOffset = dialog.getDialog().offset();
					dialog.draggableData.mouseOffset = {
						top : event.clientY - dialogOffset.top,
						left : event.clientX - dialogOffset.left
					};
				});
				this.getModal().on('mouseup mouseleave', {
					dialog : this
				}, function(event) {
					event.data.dialog.draggableData.isMouseDown = false;
				});
				$('body').on('mousemove', {
					dialog : this
				}, function(event) {
					var dialog = event.data.dialog;
					if (!dialog.draggableData.isMouseDown) {
						return;
					}
					dialog.getDialog().offset({
						top : event.clientY - dialog.draggableData.mouseOffset.top,
						left : event.clientX - dialog.draggableData.mouseOffset.left
					});
				});
			}
			return this;
		},
		close : function() {
			this.getModal().modal('hide');
		},
		show : function() {
			this.init();
			this.createHeaderContent();
			this.createBodyContent();
			this.createFooterContent();
			this.initEvent();
			this.getModal().modal('show');
			return this;
		}
	};
	var map = {};
	$jqdialog = {
		show : function(options) {
			var dlg = new CssDialog(options).show();
			delete map[dlg.getId()];
			map[dlg.getId()] = dlg;
			if ($navTab.options.shownCallback) $navTab.options.shownCallback.call(this, dlg.getBody());
			dlg.resize();
			return dlg;
		},
		getTopId : function() {
			var id = '';
			for (tmpKey in map)
				id = tmpKey;
			return id;
		},
		getDialogById : function(id) {
			return map[id];
		},
		getTopDialog : function(id) {
			var id = $jqdialog.getTopId();
			return map[id];
		},
		remove : function(id) {
			delete map[id];
		},
		closeById : function(id) {
			var instance = map[id];
			instance.close();
		},
		closeAll : function() {
			$.each(map, function(id, instance) {
				instance.close();
			});
		},
		closeTop : function() {
			var id = $jqdialog.getTopId();
			if (!isnull(id)) $jqdialog.closeById(id);
		},
		getButton : function(btnName, callback, autoClose) {
			var button = {};
			switch (btnName) {
				case '关闭':
				case '取消':
					button.label = '<i class="fa fa-close"></i> ' + btnName;
					break;
				case '保存':
					button.cssClass = 'btn-primary btn-sm submitButton';
					button.label = '<i class="fa fa-save"></i> ' + btnName;
					break;
				case '确定':
					button.cssClass = 'btn-primary btn-sm  submitButton';
					button.label = '<i class="fa fa-check"></i> ' + btnName;
					break;
			}
			button.action = function(dialog) {
				if (callback) callback.call(this, dialog);
				if (typeof autoClose == 'undefined' || autoClose == true) dialog.close();
			};
			return button;
		},
		getButtonNotClose : function(btnName, callback) {
			return $jqdialog.getButton(btnName, callback, false)
		},
		alert : function(content, callback) {
			$jqdialog.show({
				title : '提示',
				cssClass : 'alert_dialog',
				content : '<div class="dialogIcon"><i class="fa fa-info-circle"></i> </div>' + content,
				buttons : [ $jqdialog.getButton('关闭', callback) ]
			});
		},
		confirm : function(content, callbackOk, callbackCancel) {
			$jqdialog.show({
				title : '确认',
				cssClass : 'confirm_dialog',
				content : '<div class="dialogIcon"><i class="fa fa-question-circle"></i> </div>' + content,
				buttons : [ $jqdialog.getButton('确定', callbackOk), $jqdialog.getButton('取消', callbackCancel) ]
			})
		},
		open : function(params) {
			var url, title, rel, data, width, height, callback, srcForm = null;
			if (params instanceof jQuery) {
				var $target = params;
				url = dealNull($target.attr('href'));
				title = dealNull($target.attr('title'));
				rel = dealNull($target.attr('rel'));
				width = dealNull($target.attr('width'));
				height = dealNull($target.attr('height'));
				data = '';
				// 关闭对话框时要刷新该窗口
				var $sForm = $target.parents('form').first();
				srcForm = uuid();
				$sForm.attr('data-wwd-formid', srcForm);
			}
			else {
				if (typeof (params) === 'string') {
					url = params, title = '', rel = '', data = '';
				}
				else {
					url = dealNull(params.url), title = dealNull(params.title), rel = dealNull(params.rel), data = dealNull(params.data), callback = params.callback ? params.callback : null;
					width = dealNull(params.width), height = dealNull(params.height);
				}
			}
			if (isnull(rel)) rel = uuid();
			if (url.isExternalUrl()) {
				var dlg = $jqdialog.show({
					id : rel,
					title : title,
					cssClass : 'iframe_' + rel, // 可自定义 modal-frame 样式
					content : '<iframe src="' + url + '" class="modal-frame" frameborder="no" border="0" marginwidth="0" marginheight="0"></iframe>',
					showFooter : false
				});
			}
			else {
				var opt = {
					id : rel,
					title : title,
					showFooter : false
				};
				if (!isnull(width)) opt.width = width;
				if (!isnull(height)) opt.height = height;
				
				var dlg = $jqdialog.show(opt);
				$.ajax({
					url : url,
					data : data,
					type : 'POST',
					cache : false,
					success : function(content) {
						dlg.getBody().html(content);
						if (srcForm != null) {
							var form = dlg.getBody().find('form')[0];
							$(form).attr('data-wwd-srcformid', srcForm);
						}
						var $btns = $('#' + rel + ' .set-btn');
						if (!isnull($btns)) {
							$btns.css({
								'padding-top' : '15px',
								'padding-right' : '15px',
								'margin-top' : '15px',
								'margin-left' : '-15px',
								'margin-right' : '-15px',
								'border-top' : '1px solid #f4f4f4'
							});
						}
						if ($navTab.options.shownCallback) $navTab.options.shownCallback.call(this, dlg.getBody());
						dlg.resize();
						if (callback != null) callback(params);
						
					}
				});
			}
			return false;
		},
		tip : function(content, timer) {
			var dlg = $jqdialog.show({
				content : '<div class="dialogIcon"><i class="fa fa-check-circle-o"></i> </div>' + content,
				cssClass : 'tip_dialog',
				showHeader : false,
				showFooter : false
			});
			setTimeout(function() {
				dlg.close();
			}, isnull(timer) ? 1500 : timer);
		}
	// toDo
	}
})(jQuery)

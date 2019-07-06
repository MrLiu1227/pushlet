/**
 * SlwPlugins.SlwTree v1.0 2018.9 by CSS WangWeidong
 */
;
(function() {
	$.fn.slwTree = function(option) {
		var tree = new SlwPlugins.SlwTree(this, option);
		tree.init();
		return tree;
	};
	SlwPlugins.SlwTree = function(input, option) {
		var that = this;
		this.input = $(input);
		this.contentView = $('<div class="ac"></div>');
		this.treeView = $('<ul id="' + Slw.Utils.uuid() + '"class="ztree"></ul>');
		this.treeObj;
		
		this.defaults = {
			path : 'cssui/plugins/jqinput/images/', // downarrow.gif uparrow.gif
			debug : false,
			sortable : false,
			hideFlag : false,
			cssStyle : '',
			curNodeId : '',
			height : 200,
			width : 0,
			onClick : function(e, treeId, treeNode) {
				that.setValue(treeNode.value);
				that.setLabel(treeNode.name);
				that.hideMenu();
			},
			onLoad : function() {
				var value = that.input.val();
				var item = that.getNode(value);
				if (item) that.setLabel(item.name);
			}
		};
		this.option = $.extend(this.defaults, option);
		this.windowHeight = 500;
		this.showFlag = false;
	}
	/**
	 * SlwTree方法
	 */
	SlwPlugins.SlwTree.prototype = {
		init : function() {
			this.windowHeight = Slw.Utils.isnull(g_tabHeight) ? $(window).height() : g_tabHeight;
			this.initView();
			this.treeObj = this.treeView.jqztree('', this.option);
			this.initEvent();
		},
		initView : function() {
			var that = this;
			if (!that.option.debug) that.input.hide();
			that.inputView = $('<a href="javascript:void(0);"' + (that.option.hideFlag ? ' style="display:none"' : '') + ' class="form-control ac-select">　</a>');
			
			if (that.option.cssStyle != '') {
				this.inputView.addClass(that.option.cssStyle);
			}
			
			that.input.after(that.inputView);
			that.inputView.after(that.contentView);
			that.contentView.append(that.treeView);
			that.arrow('down');
		},
		initEvent : function() {
			var that = this;
			that.inputView.on('click', function(e) {
				that.initShow();
			});
		},
		initShow : function() {
			var that = this;
			if (that.showFlag != true) {
				that.showFlag = true;
				if (Slw.Utils.isIE() && Slw.Utils.ieVersion() < 8) {
					width -= 2;
				}
				var height = that.option.height;
				var width = that.getWidth();
				var left = that.inputView.position().left;
				var objLeft = that.inputView.offset().left;
				if (objLeft + width > $(window).width()) {
					left = left + that.inputView.outerWidth() - width;
				}
				var top = that.inputView.position().top + that.inputView.outerHeight();
				
				if (top + height > that.windowHeight) {
					top = that.inputView.position().top - height;
				}
				that.contentView.css({
					left : left + 'px',
					top : top + 'px',
					width : width + 'px',
					height : height + 'px'
				});
				that.treeView.css('height', that.contentView.height() + 'px');
				that.contentView.slideDown("fast");
				that.arrow('up');
				$("body").bind("mousedown.slwTree", function(e) {
					e.stopPropagation();
					e.preventDefault();
					var checkFlag = !(Slw.Event.onElement(e, that.treeView[0]) || Slw.Event.onElement(e, that.inputView[0]))
					if (checkFlag) {
						that.hideMenu();
					}
				});
				
				that.getNode(that.input.val());
			}
			else
				that.hideMenu();
		},
		getWidth : function() {
			return this.option.width > 0 ? this.option.width : this.inputView.outerWidth();
		},
		arrow : function(dir) {
			this.inputView.css('background-image', 'url(' + this.option.path + dir + 'arrow.gif)');
		},
		show : function(pos) {
			if (pos) {
				this.inputView.css({
					left : pos.left + 'px',
					top : pos.top + 'px',
					width : pos.width + 'px',
					height : pos.height + 'px',
					position : 'absolute',
					display : 'block'
				});
				this.inputView.focus();
				this.initShow();
			}
		},
		getNode : function(value) {
			return this.treeObj.focus(value);
		},
		find : function(key, value) {
			return this.treeObj.find(key, value);
		},
		setLabel : function(value) {
			this.inputView.html(value);
		},
		setValue : function(value) {
			this.input.val(value);
		},
		hideMenu : function() {
			this.showFlag = false;
			$('body').unbind('mousedown.slwTree');
			this.contentView.hide();
			this.arrow('down');
		},
		hide : function() {
			this.hideMenu();
			this.inputView.hide();
		}
	}

})(jQuery);

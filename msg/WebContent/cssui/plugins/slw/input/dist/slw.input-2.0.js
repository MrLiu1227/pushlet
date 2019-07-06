///<jscompress sourcefile="slw.tree.js" />
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
;
///<jscompress sourcefile="slw.complete.js" />
/**
 * SlwPlugins.SlwComplete v1.0 2017.10 by CSS WangWeidong
 */
;
(function() {
	$.fn.slwComplete = $.fn.jqComplete = function(option) {
		var list = new SlwPlugins.SlwComplete(this, option);
		list.init();
		return list;
	};
	SlwPlugins.SlwComplete = function(input, opt) {
		this.defaults = {
			path : 'cssui/plugins/jqinput/images/', // downarrow.gif uparrow.gif
			// data
			data : [], // array, string, function
			dataFilter : null, // function
			dataFormat : null, // 自定义数据格式化
			// style
			width : 'auto', // number, string 'auto'
			maxHeight : null, // number
			autoHeight : true, // 高度自适应，对于查询时，高度通常会随内容变化所以应设成true
			cssStyle : '', // border css style
			listStyle : 'normal', // 'normal', 'iconList', 'custom'
			createItemHandler : null, // function
			listClass : 'ac',
			selectInput : false,
			selectInputQuery : true,
			selectMultiple : false,
			maxItems : 0, // number
			// ajax
			ajaxDataType : 'json', // string 'json' or 'xml', 'dict'
			ajaxParams : {}, // function, string, object
			ajaxTimeout : 3000, // number
			ajaxType : 'GET', // string 'GET' or 'POST'
			// event
			afterDrawHandler : null, // function
			afterSelectedHandler : null, // function
			newTagHandler : null, // function
			onClose : null, // 单击事件自定义
			// debug
			onerror : function(msg) {
				alert(msg);
			}
		};
		this.option = $.extend(this.defaults, opt);
		this.loadDataFlag = false;
		this.data = [];
		this.dataSrc = [];
		this.input = $(input);
		this.showFlag = false;
		this.cancelBlur = false;
		this.curIndex = -1;
		this.beforeIndex = -1;
		this.selectIndex = -1;
		this.selectShift = false;
		this.selectCtrl = false;
		this.allFlag = true;
		this.windowHeight = 500;
		
	}

	/**
	 * SlwComplete方法
	 */
	SlwPlugins.SlwComplete.prototype = {
		init : function() {
			this.windowHeight = Slw.Utils.isnull(g_tabHeight) ? $(window).height() : g_tabHeight;
			this.initView();
			this.initEvent();
		},
		initView : function() {
			var that = this;
			that.searchView = $('<div class="' + that.option.listClass + '"></div>');
			if (that.option.selectInput == true) {
				that.inputView = $('<input class="ac-input" type="text"/>');
				that.inputContainer = $('<div class="ac-input-container"></div>').append(this.inputView)
				that.searchView.append(that.inputContainer);
				if (that.option.selectInputQuery == false) {
					that.inputContainer.css({
						"position" : "absolute",
						"display" : "",
						'width' : "0px",
						'height' : "0px",
						"z-index" : -100,
						"opacity" : 0
					});
				}
			}
			else
				that.inputView = that.input;
			that.ul = $("<ul></ul>");
			that.searchView.append(that.ul);
			that.input.after(that.searchView);
			that.arrow('down');
			if (that.option.cssStyle != '') {
				that.input.css(that.option.cssStyle);
			}
		},
		initEvent : function() {
			var that = this;
			that.input.on('click', function(e) {
				that.initShow();
			});
			
			// disable IE's auto complete feature
			that.inputView.attr('autocomplete', 'off')
			that.inputView.keydown(function(event) {
				// console.log('down2: ' + event.keyCode);
				switch (event.keyCode) {
					case 16:// shift
						that.selectShift = true;
						break;
					case 38: // up
					case 40: // down
						// 8.21
						event.stopPropagation();
						event.preventDefault();
						
						that.move(event.keyCode);
						break;
					case 13: // enter
						event.stopPropagation();
						event.preventDefault();
						that.select();
						break;
					case 17:// Ctrl
						that.selectCtrl = true;
						break;
					case 65:// ctrl+A 全选
						that.selectAll();
						break;
					break;
				case 9:// tab
				case 27: // esc
					that.hide();
					break;
			}
		})	;
			
			that.inputView.keyup(function(event) {
				// console.log('up2: ' + event.keyCode);
				switch (event.keyCode) {
					case 16:// shift
						that.selectShift = false;
						break;
					case 17:// shift
						that.selectCtrl = false;
						break;
					case 13: // enter
					case 38: // up
					case 40: // down
						break;
					case 9:// tab
					case 27: // esc
						that.hide();
						break;
					default:
						if (event.keyCode == 65 && that.selectCtrl)
							that.allFlag = !that.allFlag;
						else
							that.search();
				}
			});
			
			that.searchView.on('mouseenter', 'li', function() {
				that.searchView.find("li.selected").removeClass("selected");
				$(this).addClass('selected');
			}).on('mouseleave', 'li', function() {
				$(this).removeClass('selected');
			}).on('mousedown', 'li', function(e) {
				e.stopPropagation();
				e.preventDefault();
				that.select($(this));
			});
			
			that.inputView.blur(function(e) {
				if (that.cancelBlur)
					that.cancelBlur == false;
				else
					that.blurHide();
			});
			
		},
		extraEvent : function() {
			var that = this;
			that.input.keydown(function(event) {
				// console.log('down: ' + event.keyCode);
				switch (event.keyCode) {
					case 13: // enter
						event.stopPropagation();
						event.preventDefault();
						that.initShow();
						break;
				}
			});
			that.input.keyup(function(event) {
				// console.log('up: ' + event.keyCode);
				switch (event.keyCode) {
					case 13: // enter
						event.stopPropagation();
						event.preventDefault();
						break;
					case 37: // left
					case 39: // right
					case 38: // up
					case 40: // down
						// that.initShow();
						break;
				}
			});
		},
		initShow : function() {
			var that = this;
			if (that.option.selectInput == true) that.inputView.val('');
			that.showFlag = !that.showFlag;
			if (that.showFlag == true) {
				that.search();
				that.cancelBlur = true;
				$(window).on('resize.jqComplete', function(e) {
					that.show();
				});
				$(document).on('mousedown.jqComplete', function(e) {
					e.stopPropagation();
					e.preventDefault();
					that.cancelBlur = true;
					if (!$.contains(that.searchView[0], e.target) && !that.searchView.is(e.target)) {
						if (that.input.is(e.target) || $.contains(that.input[0], e.target))
							that.cancelBlur = true;
						else {
							that.cancelBlur = false;
							that.inputView.blur();
						}
					}
				});
				that.moveToActive();
				that.inputView.focus();
			}
			else
				that.hide();
		},
		hide : function() {
			this.blurHide();
			this.input.focus();
			if ($.isFunction(this.option.onClose)) {
				this.option.onClose.apply(this);
			}
		},
		blurHide : function() {
			$(document).unbind('mousedown.jqComplete');
			$(window).unbind('resize.jqComplete');
			this.showFlag = false;
			this.searchView.hide();
			this.arrow('down');
		},
		select : function(li) {
			var that = this;
			if (!(li instanceof jQuery)) li = that.searchView.find('li.selected');
			if (li.length > 0) {
				var item = li.data('data');
				if (that.option.selectInput == false) { // 非select组件
					if (li.size()) that.inputView.val(item.text);
					this.hide();
				}
				else {
					if (that.option.selectMultiple == true) // 多选
						that.selectMultiple(li);
					else { // 单选
						that.selectSingle(li);
					}
				}
				that.selectIndex = li.index();
				if (that.option.selectMultiple == false) that.afterSelected(item);
				that.beforeIndex = item.index;
			}
			if ($.isFunction(that.option.newTagHandler)) {
				that.option.newTagHandler.apply(that, [ li.length, that.inputView ]);
			}
		},
		afterSelected : function(item) {
			var that = this;
			if ($.isFunction(that.option.afterSelectedHandler)) {
				that.option.afterSelectedHandler.apply(that, [ item, that.beforeIndex ]);
			}
		},
		selectAll : function() {
			var that = this;
			if (that.option.selectMultiple && that.selectCtrl) {
				that.searchView.find('li').each(function() {
					that.selectItem($(this), that.allFlag);
				});
			}
		},
		selectSingle : function(li) {
			var that = this;
			var item = li.data('data');
			if (typeof (that.data[item.index].selected) == "undefined" || that.data[item.index].selected == false) {
				if (that.curIndex >= 0 && that.data.length > that.curIndex) {
					that.data[that.curIndex].selected = false;
				}
				that.data[item.index].selected = true;
				that.curIndex = item.index;
			}
			that.hide();
		},
		selectMultiple : function(li) {
			var that = this;
			var startIndex, endIndex = li.index();
			if (that.selectShift && that.selectIndex != -1 && that.selectIndex != endIndex) {
				// shift 连选
				if (endIndex > that.selectIndex)
					startIndex = that.selectIndex;
				else {
					startIndex = endIndex;
					endIndex = that.selectIndex;
				}
				var startLi = that.searchView.find('li').eq(that.selectIndex);
				var startLiSelected = startLi.hasClass('active')
				for (var index = startIndex; index <= endIndex; index++) {
					var tmpLi = that.searchView.find('li').eq(index);
					that.selectItem(tmpLi, startLiSelected);
				}
			}
			else { // 选中与取消选中切换
				that.selectItem(li, !li.hasClass('active'));
			}
		},
		selectItem : function(li, selected) {
			var that = this;
			var item = li.data('data');
			item.selected = selected;
			that.data[item.index] = item;
			li.data('data', item);
			if (item.selected == true)
				li.addClass('active');
			else
				li.removeClass('active');
			that.afterSelected(item);
		},
		loadData : function() {
			var that = this;
			if (!that.loadDataFlag) {
				if ($.isArray(that.option.data)) {
					that.data = that.option.data.concat();
				}
				else if ($.isFunction(that.option.data)) {
					that.data = that.option.data();
				}
				else if (typeof (that.option.data) === 'string') {
					if (that.option.ajaxDataType == 'dict') {
						var dict = Slw.Dict.getDictList(that.option.data);
						var index = 0;
						$.each(dict, function(key, item) {
							var tmp = {
								'label' : item.name,
								'text' : item.remark,
								'value' : item.code,
								'index' : index
							};
							that.data[index] = tmp;
							index++;
						});
					}
					else {
						try {
							that.data = that.ajaxSend();
						} catch (e) {
							that.error('ajax error: ' + e);
							return;
						}
					}
				}
				else {
					that.error('data error！');
					return;
				}
				that.formatJson();
				if ($.isFunction(that.option.dataFilter)) that.dataSrc = that.data.concat();
				that.loadDataFlag = true;
			}
			if ($.isFunction(that.option.dataFilter)) {
				that.data = that.option.dataFilter.apply(that, [ that.dataSrc ]);
				that.reIndex();
			}
		},
		reIndex : function() {
			var that = this;
			$.each(that.data, function(index, item) {
				item.index = index;
			});
		},
		refreshSelect : function() {
			var that = this;
			$.each(that.data, function(index, item) {
				item.selected = false;
			});
		},
		dataFormat : function(item) {
			if (!item.text) item.text = item.label
		},
		inArray : function(value) {
			var i = -1;
			var that = this;
			that.loadData();
			$.each(that.data, function(index, item) {
				if (item.value + '' == value + '') {
					i = index;
					return false;
				}
			});
			return i;
		},
		formatJson : function() {
			// if (this.option.ajaxDataType == 'dict') return;
			var that = this;
			var tmp;
			$.each(that.data, function(index, item) { // value必须有
				if ($.isPlainObject(item)) {
					item.index = index;
					if ($.isFunction(that.option.dataFormat)) {
						that.option.dataFormat.apply(that, [ item ]);
					}
					else
						that.dataFormat(item);
				}
				else if (typeof (item) === 'string') {
					tmp = {
						'label' : item,
						'text' : item,
						'value' : item,
						'index' : index
					};
					that.data[index] = tmp;
				}
			});
		},
		ajaxSend : function() {
			jQuery.support.cors = true;
			var that = this, data = [], ajaxOption = {
				'async' : false,
				'dataType' : that.option.ajaxDataType,
				'type' : that.option.ajaxType,
				'timeout' : that.option.ajaxTimeout,
				'data' : that.option.ajaxParams,
				'success' : function(theData, textStatus, jqXHR) {
					if (that.option.ajaxDataType === 'xml') {
						$(theData).find('item').each(function() {
							var item = {};
							for (var i = 0; i < this.attributes.length; i++) {
								var key = this.attributes[i].nodeName, value = this.attributes[i].nodeValue;
								item[key] = value;
							};
							if (!item.value) item.value = $(this).text();
							if (!item.text) item.text = $(this).text();
							if (!item.label) item.label = $(this).text();
							data.push(item);
						});
					}
					else if (that.option.ajaxDataType === 'json') {
						data = theData;
					}
					else {
						throw 'ajaxDataType error！';
					}
				},
				'error' : function(jqXHR, textStatus, errorThrown) {
					throw errorThrown;
				}
			};
			$.ajax(that.option.data, ajaxOption);
			return data;
		},
		getWidth : function() {
			if (typeof (this.option.width) === 'number') {
				return this.option.width;
			}
			else if (typeof (this.option.width) === 'string' && this.option.width.toLowerCase() === 'auto') {
				return this.input.outerWidth();
			}
		},
		move : function(dir) {// dir: 38 up, 40 down
			var selected = this.ul.find('li.selected');
			if (selected.size())
				var nextSelected = dir === 38 ? selected.prev() : selected.next();
			else
				var nextSelected = dir === 38 ? this.ul.find('li').last() : this.ul.find('li').first();
			
			if (nextSelected.size()) {
				this.ul.find('li').removeClass('selected');
				nextSelected.addClass("selected");
				this.moveTo(nextSelected);
			}
		},
		moveToActive : function() {
			var active = this.ul.find('li.active').first();
			this.moveTo(active);
		},
		moveTo : function(el) {
			if (el.length > 0) {
				var itemHeight = el.outerHeight();
				var itemTop = el.position().top - this.ul.position().top;
				if (itemHeight + itemTop > this.ul.height())
					this.ul.scrollTop(this.ul.scrollTop() + itemTop + itemHeight - this.ul.height());
				else if (itemTop < 0) this.ul.scrollTop(this.ul.scrollTop() + itemTop);
			}
		},
		show : function() {
			if (this.option.maxHeight == null || this.option.autoHeight == true) {
				this.searchView.css('height', 'auto');
				this.ul.css('height', 'auto');
			}
			
			if (this.option.maxHeight > 0) {
				this.searchView.css('max-height', this.option.maxHeight + 'px');
				if (isIE6 || isIE7 || isIE8 || isIE9) {
					var tmpHeight = (this.searchView.height() > this.option.maxHeight ? this.option.maxHeight + 'px' : 'auto')
					this.searchView.css('height', tmpHeight);
					this.ul.css('height', tmpHeight);
				}
			}
			
			var width = this.getWidth();
			if (isIE6 || isIE7) {
				width -= 2;
				if (this.option.selectInput == true) this.inputContainer.css('width', width - 18 + 'px');
			}
			var height = this.searchView.height() + 3;
			this.ul.css('height', (this.searchView.height() - (this.option.selectInput == true && this.option.selectInputQuery == true ? 37 : 0)) + 'px');
			
			var left = this.input.position().left;
			var top = this.input.position().top + this.input.outerHeight();
			
			if (top + height > this.windowHeight) {
				top = this.input.position().top - height;
			}
			this.searchView.css({
				left : left + 'px',
				top : top + 'px',
				width : width + 'px',
				height : height + 'px',
				display : 'block'
			});
			this.arrow('up');
			
		},
		arrow : function(dir) {
			if (this.option.selectInput == true && this.option.selectMultiple == false) {
				this.input.css('background-image', 'url(' + this.option.path + dir + 'arrow.gif)');
			}
		},
		search : function() {
			var that = this;
			that.loadData();
			that.selectIndex = -1;
			var keyword = this.inputView.val();
			var result = [];
			$.each(this.data, function(index, item) {
				if (that.option.maxItems > 0 && result.length >= that.option.maxItems) return false;
				item.label = item.text;
				if ($.trim(keyword).length == 0) {
					result.push(item);
				}
				else {
					if (that.match(keyword, item)) {
						result.push(item);
					}
				}
			});
			that.draw(result);
			that.show();
		},
		draw : function(result) {
			var that = this;
			var container = this.searchView.find('ul').empty();
			$.each(result, function(index, item) {
				var li = $('<li></li>').appendTo(container).data("data", item);
				var elDiv = $("<div></div>").appendTo(li);
				switch (that.option.listStyle) {
					case 'iconList':
						var img = $("<img></img>").attr('src', item.image);
						elDiv.append($("<span></span>").append(img)).append("<span>" + item.label + "</span>");
						break;
					case 'custom':
						elDiv.append(that.option.createItemHandler.apply(that, [ index, item ]));
						break;
					case 'normal':
					default:
						elDiv.append("<span>" + item.label + "</span>");
						break;
				}
				
				if ($.isFunction(that.option.afterDrawHandler)) {
					that.option.afterDrawHandler.apply(that, [ li, item ]);
				}
			});
		},
		match : function(keyword, data) {
			var regex = RegExp(keyword.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), 'i');
			var ret = regex.test(data.text);
			this.highlight(keyword, data);
			return ret;
		},
		highlight : function(keyword, data) {
			data.label = data.text;
			var regex = RegExp("(" + keyword.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1") + ")", 'ig');
			data.label = data.label.replace(regex, "<em>$1</em>");
		},
		error : function(msg) {
			if ($.isFunction(this.option.onerror)) {
				this.option.onerror.apply(this, [ msg ]);
			}
		}
	}
})(jQuery);
;
///<jscompress sourcefile="slw.select.js" />
/**
 * SlwPlugins.SlwSelect v1.0 2017.10 by CSS WangWeidong
 */
;
(function() {
	$.fn.slwSelect = $.fn.jqSelect = function(option) {
		var select = new SlwPlugins.SlwSelect(this, option);
		select.init();
		return select;
	};
	SlwPlugins.SlwSelect = function(input, option) {
		this.input = $(input);
		this.defaults = {
			maxItems : 0,
			selectInput : true,
			selectInputQuery : true,
			selectMultiple : false,
			separator : ',',
			onClick : null, // 单击事件自定义
			onClose : null, // 状态下拉框事件自定义
			onChange : null, // 选项变化事件自定义
			onLoad : null,// 数据加载完成事件自定义
			debug : false,
			cssStyle : '',
			hideFlag : false
		};
		this.option = $.extend(this.defaults, option);
		this.option.selectMultiple = this.input.prop('multiple');
		this.option.selectMultiple = !(typeof (this.option.selectMultiple) == "undefined" || this.option.selectMultiple == false);
		this.data = [];
		this.selectObj = null;
		this.inputCtrl = false;
	}
	/**
	 * SlwSelect方法
	 */
	SlwPlugins.SlwSelect.prototype = {
		init : function() {
			this.initView();
			this.initExec();
			this.selectObj.extraEvent();
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
				this.selectObj.refreshSelect();
				this.initInputTag();
			}
			else {
				this.inputView.show();
			}
		},
		hide : function() {
			this.inputView.hide();
			this.selectObj.hide();
		},
		initView : function() {
			var that = this;
			if (!that.option.debug) that.input.hide();
			that.inputView = $('<a href="javascript:void(0);"' + (that.option.hideFlag ? ' style="display:none"' : '') + ' class="form-control ac-select"></a>');
			
			if (that.option.cssStyle != '') {
				this.inputView.addClass(that.option.cssStyle);
			}
			
			that.input.after(that.inputView);
			if (that.option.selectMultiple) {
				that.multiUl = $('<ul></ul>').appendTo(that.inputView);
			}
			else {
				that.setLabel('');
			}
		},
		loadData : function() {
			var that = this;
			var options = that.input.find('option');
			var index = 0;
			$.each(options, function(index, el) {
				var item = {
					'value' : $(el).val(),
					'label' : $(el).text(),
					'text' : $(el).text(),
					'index' : index
				};
				item.selected = $(el).prop('selected');
				if (item.selected) that.addItem(item);
				that.data.push(item);
			});
		},
		refreshCtrl : function(item) {
			var that = this;
			var tags = [];
			if (that.inputCtrl == true) {
				that.inputView.find('li').each(function() {
					var data = $(this).data('data');
					tags.push(data.value);
				});
				that.input.val(tags.join(that.option.separator));
			}
			else
				that.input.find('option[value="' + item.value + '"]').prop("selected", item.selected);
		},
		addItem : function(item) {
			var that = this;
			item.selected = true;
			if (that.option.selectMultiple) {
				if (that.inputView.find('#index_' + item.index).length < 1) {
					var li = $('<li class="ac-choice" id="index_' + item.index + '"></li>').appendTo(that.multiUl);
					var span = $('<span class="ac-choice-remove">×</span>').appendTo(li);
					li.append(item.text);
					li.data('data', item);
					span.one('click', function(e) {
						e.stopPropagation();
						e.preventDefault();
						li.remove();
						that.selectObj.hide();
						item.selected = false;
						that.refreshCtrl(item);
					});
				}
			}
			else
				that.setLabel(item.label);
		},
		setLabel : function(value) {
			this.inputView.html(value + '&nbsp;');
		},
		initInputTag : function() {
			var that = this;
			if (that.inputCtrl == true) {
				if (that.option.selectMultiple) {
					var tags = that.input.val().split(that.option.separator);
					$.each(tags, function(i, tag) {
						if (!isnull(tag.trim())) {
							var index = that.selectObj.inArray(tag);
							if (index >= 0) that.addItem(that.selectObj.data[index]);
						}
					});
				}
				else {
					var curItem = null;
					if (that.input.val() == '') {
						that.dispPlaceholder();
					}
					else {
						var index = that.selectObj.inArray(that.input.val());
						if (index >= 0) {
							that.setLabel(that.selectObj.data[index].text);
							that.selectObj.data[index].selected = true;
							curItem = that.selectObj.data[index];
						}
						else {
							that.dispPlaceholder();
						}
					}
					if ($.isFunction(that.option.onLoad)) {
						that.option.onLoad.apply(that, [ curItem ]);
					}
				}
			}
			
		},
		dispPlaceholder : function() {
			var placeholder = this.input.attr('placeholder');
			if (typeof (placeholder) == 'undefined') placeholder = '';
			this.setLabel('<span class="placeholder-text">' + placeholder + '</span>')
		},
		refreshData : function(data, defaultValue) {
			this.selectObj.option.data = data;
			this.refresh(defaultValue);
		},
		refresh : function(defaultValue) {
			this.selectObj.loadDataFlag = false;
			if (typeof (defaultValue) == "undefined") defaultValue = '';
			this.input.val(defaultValue);
			this.selectObj.loadData();
			this.initInputTag();
		},
		initExec : function() {
			var that = this;
			if (typeof (that.option.data) == "undefined")
				that.loadData();
			else
				that.inputCtrl = true;
			
			var opt = $.extend({
				data : that.data,
				afterDrawHandler : function(li, item) {
					if (that.option.selectInput && item.selected) {
						that.selectObj.curIndex = item.index;
						if (that.selectObj.searchView.find('li.selected').length < 1) li.addClass("selected");
						li.addClass("active");
					}
				},
				afterSelectedHandler : function(item, beforeIndex) {
					if (that.option.selectMultiple) {
						if (item.selected)
							that.addItem(item);
						else
							that.inputView.find('#index_' + item.index).remove();
						that.refreshCtrl(item);
						that.selectObj.show();
					}
					else {
						that.input.val(item.value);
						that.setLabel(item.text);
					}
					if (item.index != beforeIndex && $.isFunction(that.option.onChange)) {
						that.option.onChange.apply(that, [ item ]);
					}
					
					if ($.isFunction(that.option.onClick)) {
						that.option.onClick.apply(that, [ item ]);
					}
				}
			}, that.option);
			that.selectObj = that.inputView.jqComplete(opt);
			that.initInputTag();
		}
	}

})(jQuery);
;
///<jscompress sourcefile="slw.tag.js" />
/**
 * SlwPlugins.SlwTag v1.0 2017.10 by CSS WangWeidong
 */
;
(function() {
	$.fn.slwTag = $.fn.jqTag = function(option) {
		var tag = new SlwPlugins.SlwTag(this, option);
		tag.init();
		return tag;
	};
	SlwPlugins.SlwTag = function(input, option) {
		this.input = $(input);
		this.defaults = {
			separator : ',',
			maxItems : 0,
			selectInput : true,
			selectInputQuery : true,
			selectMultiple : true,
			ignoreCase : true,
			newTagAllowed : true,
			debug : false
		};
		this.option = $.extend(this.defaults, option);
		this.tags = [];
		this.tagsLowerCase = [];
		this.selectObj = null;
	}
	/**
	 * SlwTag方法
	 */
	SlwPlugins.SlwTag.prototype = {
		init : function() {
			this.initView();
			this.initExec();
			this.selectObj.extraEvent();
		},
		initView : function() {
			var that = this;
			if (!that.option.debug) that.input.hide();
			that.inputView = $('<a href="javascript:void(0);" class="form-control ac-select"></a>');
			that.input.after(that.inputView);
			that.multiUl = $('<ul></ul>').appendTo(that.inputView);
		},
		refreshTags : function() {
			var that = this;
			that.tags = [];
			that.tagsLowerCase = [];
			that.inputView.find('li').each(function() {
				that.tags.push($(this).attr('tagValue'));
				that.tagsLowerCase.push($(this).attr('tagValue').toLowerCase());
			});
			that.input.val(that.tags.join(that.option.separator));
		},
		existTag : function(tag) {
			this.refreshTags();
			return this.option.ignoreCase ? $.inArray(tag.toLowerCase(), this.tagsLowerCase) >= 0 : $.inArray(tag, this.tags) >= 0;
		},
		initTag : function() {
			var that = this;
			var tags = that.input.val().split(that.option.separator);
			$.each(tags, function(index, tag) {
				if (!isnull(tag.trim())) that.addTag(tag);
			});
		},
		dealTag : function(tag) {
			return this.option.ignoreCase ? tag.toLowerCase() : tag;
		},
		addTag : function(tag) {
			var that = this;
			if (!that.existTag(tag)) {
				var li = $('<li class="ac-choice"></li>').appendTo(that.multiUl);
				var span = $('<span class="ac-choice-remove">×</span>').appendTo(li);
				li.append(tag);
				li.attr('tagValue', tag);
				li.attr('ignoreValue', that.dealTag(tag));
				that.refreshTags();
				span.one('click', function(e) {
					e.stopPropagation();
					e.preventDefault();
					li.remove();
					that.selectObj.hide();
					that.refreshTags();
				});
			}
		},
		delTag : function(tag) {
			this.inputView.find('li[ignoreValue="' + this.dealTag(tag) + '"]').remove();
		},
		initExec : function() {
			var that = this;
			var opt = $.extend({
				afterDrawHandler : function(li, item) {
					if (that.existTag(item.value)) li.addClass("active");
				},
				afterSelectedHandler : function(item, beforeIndex) {
					if (item.selected)
						that.addTag(item.value);
					else
						that.delTag(item.value);
					that.refreshTags();
					that.selectObj.show();
				},
				newTagHandler : function(size, inputEl) {
					if (that.option.newTagAllowed) {
						if (size < 1) {
							var tag = inputEl.val();
							if (!isnull(tag.trim())) that.addTag(tag);
						}
						inputEl.val('');
					}
				}
			}, that.option);
			that.selectObj = that.inputView.jqComplete(opt);
			that.initTag();
		}
	}

})(jQuery);
;
///<jscompress sourcefile="slw.cascadestep.js" />
/**
 * SlwPlugins.SlwCascadeStep v1.0 2018.7 by CSS WangWeidong
 */
;
(function() {
	SlwPlugins.SlwCascadeStep = function(elmentArray, option) {
		this.elmentArray = elmentArray;
		this.defaults = {
			url : '',
			data : [],
			ajaxDataType : 'json',
			maxHeight : 300,
			dataFormat : function(item) {
				item.label = item.name;
				item.text = item.name;
			},
			objectIndex : '',
			objectId : ''
		};
		this.option = $.extend(this.defaults, option);
		this.object;
		this.cacheData = {};
		var index = this.option.url.lastIndexOf("=");
		this.urlPath = this.option.url.substring(0, index + 1);
		this.option.objectId = this.option.url.substring(index + 1);
		
	};
	/**
	 * SlwCascadeStep方法
	 */
	SlwPlugins.SlwCascadeStep.prototype = {
		init : function() {
			var that = this;
			that.object = new Array(that.elmentArray.length);
			for (var i = that.elmentArray.length - 1; i >= 0; i--) {
				
				var objOption = $.extend(true, {}, that.option);
				objOption.objectIndex = i;
				// 每个都有onLoad事件，处理缓存
				objOption.onLoad = function(item) {
					that.loadUrl(this, item);
				};
				
				if (i < that.elmentArray.length - 1) {
					// 除了最后一个，其余都有onClick事件
					objOption.onClick = function(item) {
						that.loadUrl(this, item);
					};
					
					// 第一个要加载相应url
					if (i == 0) {
						objOption.data = that.option.url;
					}
				}
				
				that.object[i] = that.elmentArray[i].jqSelect(objOption);
			}
		},
		loadUrl : function(el, item) {
			this.addCache(el);
			// 获取下一级联对象
			var index = el.option.objectIndex + 1;
			if (index == this.elmentArray.length) return;
			var obj = this.object[index];
			// 级联加载
			if (isnull(item)) {
				obj.option.objectId = '';
				obj.refreshData([], '');
			}
			else {
				obj.option.objectId = item.value;
				var cData = this.cacheData[item.value];
				if (typeof cData == 'undefined') {
					var url = this.urlPath + item.value;
					obj.refreshData(url, '');
				}
				else {
					obj.refreshData(cData, '');
				}
			}
		},
		addCache : function(el) {
			var cData = this.cacheData[el.option.objectId];
			if (typeof cData == 'undefined') this.cacheData[el.option.objectId] = el.selectObj.data;
		}
	}

})(jQuery);
;
///<jscompress sourcefile="slw.cascade.js" />
/**
 * SlwPlugins.SlwCascade v1.0 2018.7 by CSS WangWeidong
 */
;
(function() {
	SlwPlugins.SlwCascade = function(elmentArray, option) {
		this.elmentArray = elmentArray;
		this.defaults = {
			url : '',
			data : [],
			ajaxDataType : 'json',
			maxHeight : 300,
			dataFormat : function(item) {
				item.label = item.name;
				item.text = item.name;
			},
			objectIndex : ''
		};
		this.option = $.extend(this.defaults, option);
		this.object;
	};
	/**
	 * SlwCascade方法
	 */
	SlwPlugins.SlwCascade.prototype = {
		init : function() {
			var that = this;
			that.object = new Array(that.elmentArray.length);
			for (var i = that.elmentArray.length - 1; i >= 0; i--) {
				
				var objOption = $.extend(true, {}, that.option);
				objOption.objectIndex = i;
				if (i < that.elmentArray.length - 1) {
					// 除了最后一个，其余都有onClick,onLoad 事件
					objOption.onClick = objOption.onLoad = function(item) {
						that.loadUrl(this, item);
					};
					
					// 第一个要加载相应url
					if (i == 0) objOption.data = that.option.url;
				}
				
				that.object[i] = that.elmentArray[i].jqSelect(objOption);
			}
		},
		loadUrl : function(el, item) {
			// 获取下一级联对象
			var index = el.option.objectIndex + 1;
			if (index == this.elmentArray.length) return;
			var obj = this.object[index];
			obj.refreshData((!isnull(item) && !item.isLeaf) ? item.child : [], '');
		}
	}

})(jQuery);
;
///<jscompress sourcefile="slw.spinner.js" />
/**
 * SlwPlugins.SlwSpinner v1.0 2017.10 by CSS WangWeidong
 */
;
(function() {
	$.fn.slwSpinner = $.fn.jqSpinner = function(option) {
		var spinner = new SlwPlugins.SlwSpinner(this, option);
		spinner.init();
		return spinner;
	}

	SlwPlugins.SlwSpinner = function(input, option) {
		this.input = $(input);
		this.defaults = {
			className : 'tbSpinner',
			style : 1, // 1: up, down; 2: minus, plus
			style_1_align : 'right', // right, left, both
			min : null,
			max : null,
			step : 1,
			precision : 0,
			width : '100%'
		};
		this.option = $.extend(this.defaults, option);
		this.oldValue = this.value();
		this.value(this.input.val());
	}
	/**
	 * SlwSpinner方法
	 */
	SlwPlugins.SlwSpinner.prototype = {
		init : function() {
			this.initView();
			this.initEvent();
		},
		initView : function() {
			var that = this;
			that.wrapper = $('<table class="' + that.option.className + '"></table>');
			that.wrapper.css("width", that.option.width);
			that.input.after(that.wrapper);
			
			var tbl, row, l_cell, m_cell, r_cell;
			tbl = that.wrapper[0];
			row = tbl.insertRow(0);
			var k = 0;
			if (!(that.option.style == 1 && that.option.style_1_align == 'right')) {
				l_cell = row.insertCell(k++);
				l_cell.className = "btnCell";
			}
			m_cell = row.insertCell(k++);
			if (!(that.option.style == 1 && that.option.style_1_align == 'left')) {
				r_cell = row.insertCell(k++);
				r_cell.className = "btnCell";
			}
			var upDown = '<a class="c_up" data-dir="up" href="javascript:;"><i class="fa fa-caret-up" /></a><div style="clear:both;height:0px;"></div><a class="c_down" data-dir="down" href="javascript:;"><i class="fa fa-caret-down" /></a>';
			var minus = '<a class="c_minus" data-dir="down" href="javascript:;"><i class="fa fa-minus" /></a>';
			var plus = '<a class="c_plus" data-dir="up" href="javascript:;"><i class="fa fa-plus" /></a>';
			
			if (that.option.style == 1) {
				switch (that.option.style_1_align) {
					case 'left':
						$(l_cell).append(upDown);
						break;
					case 'right':
						$(r_cell).append(upDown);
						break;
					case 'both':
						$(l_cell).append(upDown);
						$(r_cell).append(upDown);
						break;
				}
			}
			else {
				$(l_cell).append(minus);
				$(r_cell).append(plus);
			}
			$(m_cell).append(that.input);
		},
		initEvent : function() {
			var that = this;
			that.wrapper.find('a').on('click', function() {
				that.spin.apply(that, [ $(this).attr('data-dir') ]);
			});
		},
		spin : function(dir) {
			if (this.input.prop('disabled')) {
				return;
			}
			this.oldValue = this.value();
			var step = $.isFunction(this.option.step) ? this.option.step.call(this, dir) : this.option.step;
			var multipler = dir === 'up' ? 1 : -1;
			this.value(this.oldValue + Number(step) * multipler);
		},
		value : function(v) {
			if (v === null || v === undefined) {
				return this.numeric(this.input.val());
			}
			v = this.numeric(v);
			var valid = this.validate(v);
			if (valid !== 0) {
				v = (valid === -1) ? this.option.min : this.option.max;
			}
			this.input.val(v.toFixed(this.option.precision));
		},
		numeric : function(v) {
			v = this.option.precision > 0 ? parseFloat(v, 10) : parseInt(v, 10);
			if (isFinite(v)) {
				return v;
			}
			return v || this.option.min || 0;
		},
		validate : function(val) {
			if (this.option.min !== null && val < this.option.min) {
				return -1;
			}
			if (this.option.max !== null && val > this.option.max) {
				return 1;
			}
			return 0;
		}
	}
})(jQuery);
;

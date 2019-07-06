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

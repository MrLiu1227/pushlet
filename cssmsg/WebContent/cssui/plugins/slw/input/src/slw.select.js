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

/**
 * SlwGrid.Dict v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Dict = function(grid, config) {
		this.grid = grid;
		this.config = config;
		this.editable = true;
		this.defaults = {
			data : 'dictParent@dictTable',
			cssStyle : grid.gridClass,
			ajaxDataType : 'dict',
			autoHeight : false,
			hideFlag : true,
			onClose : function() {
				grid.defaultFocus();
			}
		};
		this.options = $.extend(this.defaults, config.options);
		this.select = null;
		this.inputObj = grid.textInput;
		
	};
	/**
	 * SlwGrid.Dict方法
	 */
	SlwGrid.Dict.prototype = {
		init : function() {
			var grid = this.grid;
			this.select = this.inputObj.jqSelect(this.options);
			this.select.hide();
		},
		inputObjFocus : function(value, focus) {
			if (value == '') {
				this.inputObj.val('');
				this.select.setLabel('');
			}
			else {
				var item = this.getItemByKey(value);
				if (item) {
					this.inputObj.val(value);
					this.select.setLabel(item[this.config.format]);
				}
			}
			if (focus) this.grid.defaultFocus();
		},
		getInputValue : function() {
			var grid = this.grid;
			var item = this.getItemByKey(this.inputObj.val());
			return (item) ? item.code : '';
		},
		getHtml : function(index) {
			var grid = this.grid;
			var data = grid.curArray.get(index);
			return this.getHtmlByData(data, index);
			
		},
		getHtmlByData : function(data, index) {
			var value = data[this.config.name];
			var item = this.getItemByKey(value);
			var html = '';
			if (!Slw.Utils.isUndefined(item))
				html = item[this.config.format];
			else
				data[this.config.name] = '';
			return html;
		},
		getCellData : function(_tr, col) {
			var grid = this.grid;
			var item = this.getItem(grid.getTdValue(_tr, col));
			return (item) ? item.code : '';
		},
		getItemByKey : function(key) {
			var item = Slw.Dict.getDictItem(this.options.data, key);
			return item;
		},
		getItem : function(value) {
			var map = Slw.Dict.getDictList(this.options.data);
			for ( var key in map) {
				var item = map[key];
				if (value == item[this.config.format]) return item;
			}
		},
		show : function(index) {
			var grid = this.grid;
			var data = grid.curArray.get(index);
			var value = data[this.config.name];
			var item = this.getItemByKey(value);
			if (!Slw.Utils.isUndefined(item)) {
				this.inputObj.val(item.code);
				this.select.setLabel(item[this.config.format]);
			}
			else {
				this.inputObj.val('');
				this.select.setLabel('');
			}
			this.select.inputView.css('text-align', this.config.txtAlign);
			this.select.show(grid.pos);
		},
		hide : function() {
			this.select.hide();
		},
		keyEvent : function() {
			this.select.selectObj.initShow();
			this.inputObj.focus();
		}
	};
	
})(jQuery);

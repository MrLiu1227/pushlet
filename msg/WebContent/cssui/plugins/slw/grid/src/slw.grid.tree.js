/**
 * SlwGrid.Tree v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Tree = function(grid, config) {
		this.grid = grid;
		this.config = config;
		this.editable = true;
		this.inputObj = grid.textInput;
		this.tree;
		
	};
	/**
	 * SlwGrid.Tree方法
	 */
	SlwGrid.Tree.prototype = {
		init : function() {
			var grid = this.grid;
			var that = this;
			this.defaults = {
				loadUrl : '',
				cssStyle : '',
				curNodeId : '',
				height : 200,
				width : 0,
				hideFlag : true,
				onLoad : function() {
					grid.refreshColumnCell(that.config);
				}
			};
			this.options = $.extend(this.defaults, this.config.options);
			this.tree = this.inputObj.slwTree(this.options);
			this.tree.hide();
		},
		inputObjFocus : function(value, focus) {
			if (value == '') {
				this.tree.setValue('');
				this.tree.setLabel('');
			}
			else {
				var item = this.tree.getNode(value);
				if (item) {
					this.tree.setValue(item.value);
					this.tree.setLabel(item.name);
				}
			}
			if (focus) this.grid.defaultFocus();
		},
		getInputValue : function() {
			var grid = this.grid;
			var item = this.tree.getNode(this.inputObj.val());
			return (item) ? item.value : '';
		},
		getHtml : function(index) {
			var grid = this.grid;
			var data = grid.curArray.get(index);
			return this.getHtmlByData(data, index);
		},
		getHtmlByData : function(data, index) {
			var value = data[this.config.name];
			var item = this.tree.getNode(value);
			var html = '';
			if (item) html = item.name;
			return html;
		},
		getCellData : function(_tr, col) {
			var grid = this.grid;
			var html = grid.getTdValue(_tr, col);
			var item = this.tree.find('name', html);
			return (item) ? item.name : '';
		},
		show : function(index) {
			var grid = this.grid;
			var data = grid.curArray.get(index);
			var value = data[this.config.name];
			var item = this.tree.getNode(value);
			if (item) {
				this.tree.setValue(item.value);
				this.tree.setLabel(item.name);
			}
			else {
				this.tree.setValue('');
				this.tree.setLabel('');
			}
			this.tree.inputView.css('text-align', this.config.txtAlign);
			this.tree.show(grid.pos);
			grid.defaultFocus();
		},
		hide : function() {
			this.tree.hide();
		},
		keyEvent : function() {
		}
	};
	
})(jQuery);

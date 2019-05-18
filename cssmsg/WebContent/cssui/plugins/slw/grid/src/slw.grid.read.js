/**
 * SlwGrid.Read v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Read = function(grid, config) {
		this.grid = grid;
		this.config = config;
		this.editable = false;
		this.render = null;
		this.valueRender = null;
	};
	/**
	 * SlwGrid.Read方法
	 */
	SlwGrid.Read.prototype = {
		init : function() {
			if (this.config.render) {
				if (typeof (this.config.render) === 'string') {
					this.render = Slw.template(this.config.render);
				}
			}
			if (this.config.valueRender) {
				if (typeof (this.config.valueRender) === 'string') {
					this.valueRender = Slw.template(this.config.valueRender);
				}
			}
		},
		getCellData : function(_tr, col) {
			var grid = this.grid;
			var text = Slw.Utils.toText(grid.getTdValue(_tr, col));
			return text;
		},
		getHtml : function(index) {
			var grid = this.grid;
			var data = grid.curArray.get(index);
			return this.getHtmlByData(data, index);
		},
		getHtmlByData : function(data, index) {
			var value = data[this.config.name];
			if (this.render != null) {
				value = this.render(data, index);
			}
			else if ($.isFunction(this.config.render)) {
				value = this.config.render.apply(this.grid, [ index, this.config.index, data, this.config]);
			}
			return Slw.Utils.toHtml(value);
		},
		setValueByRender : function(data, index) {
			var value;
			if (this.valueRender != null) {
				value = this.valueRender(data, index);
			}
			else if ($.isFunction(this.config.valueRender)) {
				value = this.config.valueRender.apply(this.grid, [ index, this.config.index, data, this.config ]);
			}
			data[this.config.name] = value;
		},
		hide : function() {
		}
	};
	
})(jQuery);

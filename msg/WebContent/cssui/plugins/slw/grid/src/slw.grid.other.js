/**
 * SlwGrid.Other v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Other = function(grid, config) {
		this.grid = grid;
		this.config = config;
		this.editable = true;
		this.inputObj = grid.textInput;
		this.render = null;
		this.valueRender = null;
	};
	/**
	 * SlwGrid.Other方法
	 */
	SlwGrid.Other.prototype = new SlwGrid.Text();
	SlwGrid.Other.prototype.show = function(index) {
		var grid = this.grid;
		var data = grid.curArray.get(index);
		if ($.isFunction(this.config.userShow)) {
			grid.isFocus = false;
			$SlwGrid.grid = grid;
			this.config.userShow.apply(grid, [ index, this.config.index, data, this.config ]);
		}
	};
	
})(jQuery);

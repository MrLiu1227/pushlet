/**
 * SlwGrid.Checkbox v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Checkbox = function(grid, config) {
		this.grid = grid;
		this.config = config;
		this.editable = true;
		this.inputObj = grid.textInput;
	};
	/**
	 * SlwGrid.Checkbox方法
	 */
	SlwGrid.Checkbox.prototype = new SlwGrid.Text();
	
	$.extend(SlwGrid.Checkbox.prototype, {
		init : function(index) {
			var grid = this.grid;
			var that = this;
			that.config.render = function(row, col, data) {
				var value = data[that.config.name];
				return (value == that.config.options.values[0]) ? '<i class="fa fa-check-square-o"></i>' : '<i class="fa fa-square-o"></i>';
				return icon;
			}
		},
		nextValue : function(value) {
			var i;
			for (i = 0; i < 2; i++) {
				if (value == this.config.options.values[i]) break;
			}
			i = i > 1 ? this.config.options.defaultIndex : i;
			return this.config.options.values[1 - i];
		},
		show : function(index) {
			var grid = this.grid;
			var value = grid.curArray.getData(index, this.config.name);
			var nextValue = this.nextValue(value);
			grid.setValue(nextValue);
		}
	});
})(jQuery);

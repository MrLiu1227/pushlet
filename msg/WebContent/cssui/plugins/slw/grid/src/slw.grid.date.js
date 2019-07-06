/**
 * SlwGrid.Date v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Date = function(grid, config) {
		this.grid = grid;
		this.config = config;
		this.editable = true;
		this.options = $.extend(this.defaults, config.options);
		this.inputObj = $('<input class="' + grid.gridClass + ' Wdate" style="background-color:#fff"></input>');
	};
	/**
	 * SlwGrid.Date方法
	 */
	SlwGrid.Date.prototype = new SlwGrid.Text();
	$.extend(SlwGrid.Date.prototype, {
		init : function() {
			var that = this;
			var grid = this.grid;
			grid.table.after(that.inputObj);
			that.options.el = that.inputObj[0];
			that.options.onpicking = function(dp) {
				grid.defaultFocus();
			}
			that.inputObj.focus(function() {
				WdatePicker(that.options);
			});
			that.inputObj.keydown(function(event) {
				event.stopPropagation();
				switch (event.keyCode) {
					case 13: // enter
						event.preventDefault();
						grid.defaultFocus();
						break;
				}
			});
		},
		show : function(index) {
			var grid = this.grid;
			var data = grid.curArray.get(index);
			var value = data[this.config.name];
			this.inputObj.val(value);
			this.inputObj.show();
			grid.defaultFocus();
		},
		hide : function() {
			this.inputObj.hide();
			$dp.hide();
		},
		keyEvent : function() {
			var that = this;
			that.inputObj.focus();
			$dp.show();
			setTimeout(function() {
				that.inputObj.focus();
			}, 50);
		}
	});
})(jQuery);

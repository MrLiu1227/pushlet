/**
 * SlwGrid.Color v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Color = function(grid, config) {
		this.grid = grid;
		this.config = config;
		this.editable = true;
		this.inputObj = $('<input class="' + grid.gridClass + '"></input>');
		this.color = null;
		this.defaults = {
			bgColor : true,
			documentClick : false,
			cssStyle : '',
			onClose : function() {
				grid.defaultFocus();
			}
		};
		this.options = $.extend(this.defaults, config.options);
		
	};
	/**
	 * SlwGrid.Color方法
	 */
	SlwGrid.Color.prototype = new SlwGrid.Text();
	$.extend(SlwGrid.Color.prototype, {
		init : function() {
			var grid = this.grid;
			grid.table.after(this.inputObj);
			if (this.config.render) {
				if (typeof (this.config.render) === 'string') {
					this.render = Slw.template(this.config.render);
				}
			}
			this.color = this.inputObj.slwColor(this.options);
		},
		checkData : function(data) {
			var value = this.color.testColor(data[this.config.name]);
			data[this.config.name] = value;
		},
		show : function(index) {
			var grid = this.grid;
			var data = grid.curArray.get(index);
			var value = data[this.config.name];
			this.inputObj.val(value);
			this.inputObj.show();
			this.color.focus(this.inputObj);
		},
		hide : function() {
			this.inputObj.hide();
			this.inputObj.css('background-color', '#FFFFFF');
			this.color.hide();
		},
		keyEvent : function(key) {
		}
	});
})(jQuery);

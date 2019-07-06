/**
 * SlwGrid.Border v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Border = function(grid) {
		this.grid = grid;
		this.defaults = {
			borderSize : 1,
			borderClass : 'slwGridSelArea'
		};
	};
	/**
	 * SlwGrid.Border方法
	 */
	SlwGrid.Border.prototype = {
		init : function(option) {
			var that = this;
			var grid = this.grid;
			that.options = $.extend(that.defaults, option);
			that.borderDiv = $('<div class="' + that.options.borderClass + '"></div>');
			that.beforeEl = that.borderDiv[0];
			
			that.lBorder = $('<div style="width: ' + that.options.borderSize + 'px; top: 0px; left: 0px"></div>');
			that.rBorder = $('<div style="width: ' + that.options.borderSize + 'px; top: 0px;"></div>');
			that.tBorder = $('<div style="height:' + that.options.borderSize + 'px; top: 0px; left: 0px;"></div>');
			that.bBorder = $('<div style="height:' + that.options.borderSize + 'px; left: 0px;"></div>');
			
			that.borderDiv.append(this.lBorder);
			that.borderDiv.append(this.rBorder);
			that.borderDiv.append(this.tBorder);
			that.borderDiv.append(this.bBorder);
			grid.table.after(this.borderDiv);
		},
		show : function(pos) {
			this.borderDiv.css({
				left : pos.left + 'px',
				top : pos.top + 'px',
				width : '0px',
				height : '0px'
			});
			
			this.lBorder.css({
				height : pos.height + 'px'
			});
			
			this.rBorder.css({
				left : pos.width + 'px',
				height : (pos.height + 1) + 'px'
			});
			
			this.tBorder.css({
				width : pos.width + 'px'
			});
			
			this.bBorder.css({
				top : pos.height + 'px',
				width : (pos.width + 1) + 'px'
			});
			this.borderDiv.show();
		},
		hide : function() {
			this.borderDiv.hide();
		}
	};
})(jQuery);

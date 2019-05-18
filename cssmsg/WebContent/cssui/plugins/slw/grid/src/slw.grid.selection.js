/**
 * SlwGrid.Selection v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Selection = function(grid) {
		this.grid = grid;
		this.cellBorder;
		this.areaBorder;
		this.beforeEl;
		this.preArea = {};
		this.selRow = -1;
		this.selCol = -1;
		
	};
	/**
	 * SlwGrid.Selection方法
	 */
	SlwGrid.Selection.prototype = {
		init : function() {
			var that = this;
			var grid = this.grid;
			that.areaBorder = new SlwGrid.Border(grid);
			that.cellBorder = new SlwGrid.Border(grid);
			that.areaBorder.init();
			that.cellBorder.init({
				borderSize : 2,
				borderClass : 'slwGridSelCell'
			});
			that.beforeEl = that.areaBorder.borderDiv[0];
		},
		inSelectionArea : function(row, col) {
			var area = this.getSelectionArea();
			return (area.startRow >= 0 && row >= area.startRow && row <= area.toRow && col >= area.startCol && col <= area.toCol);
		},
		getSelectionArea : function() {
			var area = {};
			var that = this;
			var grid = this.grid;
			area.startRow = grid.curRow;
			area.startCol = grid.curCol;
			area.toRow = that.selRow;
			area.toCol = that.selCol;
			
			if (area.startRow > that.selRow) {
				area.toRow = area.startRow;
				area.startRow = that.selRow;
			}
			if (area.startCol > that.selCol) {
				area.toCol = area.startCol;
				area.startCol = that.selCol;
			}
			return area;
		},
		beginDraw : function(td, type) {
			var grid = this.grid;
			var that = this;
			var tr = td.parent();
			that.selRow = tr.index();
			that.selCol = td.index();
			that.drawSelection();
			grid.defaultFocus();
		},
		checkTwiceClick : function() {
			var grid = this.grid;
			var that = this;
			grid.resetBeforeEl();
			if (that.selRow == grid.preRow && that.selCol == grid.preCol) {
				grid.cellFocus(true);
			}
		},
		shiftDraw : function(toRow, toCol) {
			var grid = this.grid;
			var that = this;
			that.selRow = toRow;
			that.selCol = (grid.curCol == 0 && grid.curCol == toCol) ? grid.cols - 1 : toCol;
			that.drawSelection();
			grid.defaultFocus();
		},
		drawSelection : function() {
			if (this.preArea) this.drawArea(this.preArea, false);
			var area = this.getSelectionArea();
			this.preArea = area;
			this.drawBorder(area);
			this.drawArea(area, true);
		},
		drawBorder : function(area) {
			var pos = {};
			var that = this;
			var grid = this.grid;
			
			var tdS = grid.trs.eq(area.startRow).find('td').eq(area.startCol);
			var tdE = grid.trs.eq(area.toRow).find('td').eq(area.toCol);
			
			pos.left = tdS.position().left;
			pos.top = tdS.position().top;
			pos.width = (tdE.position().left - pos.left) + tdE.outerWidth();
			pos.height = (tdE.position().top - pos.top) + tdE.outerHeight();
			that.areaBorder.show(pos);
		},
		drawArea : function(area, showFlag) {
			var grid = this.grid;
			for (var col = area.startCol; col < area.toCol + 1; col++) {
				for (var row = area.startRow; row < area.toRow + 1; row++) {
					var td = grid.getTdByRow(row, col);
					if (showFlag)
						td.addClass('area');
					else
						td.removeClass('area');
				}
			}
		},
		hide : function() {
			var area = this.getSelectionArea();
			this.drawArea(area, false);
			this.selRow = -1;
			this.selCol = -1;
			this.areaBorder.hide();
		},
		hideAll : function() {
			this.hide();
			this.cellBorder.hide();
		}
	};
	
})(jQuery);

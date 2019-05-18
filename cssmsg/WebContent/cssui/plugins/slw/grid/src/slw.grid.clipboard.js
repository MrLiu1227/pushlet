/**
 * SlwGrid.Clipboard v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Clipboard = function(grid) {
		this.grid = grid;
		this.cbTextarea = $('<textarea class="slwGridHiddenInput"></textarea>');
		this.gridMenu;
	};
	/**
	 * SlwGrid.Clipboard方法
	 */
	SlwGrid.Clipboard.prototype = {
		init : function() {
			var grid = this.grid;
			grid.table.after(this.cbTextarea);
		},
		setSelData : function(startRow, startCol, dataArray, hisObject) {
			var that = this.grid;
			that.hideEditor();
			
			var maxRow = that.getDataRows();
			if (that.option.autoAddRow) {
				for (var newRow = 0; newRow < startRow + dataArray.length - maxRow; newRow++)
					that.createNewRow(false);
			}
			
			var tmpArray = new Array();
			for (var row = 0; row < dataArray.length; row++)
				tmpArray[row] = new Array();
			
			var colIndex = 0;
			for (var col = startCol; col < that.cols; col++) {
				for (var row = 0; row < dataArray.length; row++) {
					var cfg = that.getCurConfig(row + startRow, col);
					var index = that.getDataIndex(row + startRow, col);
					tmpArray[row][colIndex] = that.curArray.getData(index, cfg.name);
					if (cfg && cfg.type != 'read') {
						that.setDataAndHtml(cfg, index, dataArray[row][colIndex]);
					}
				}
				colIndex++;
				if (colIndex >= dataArray[0].length) break;
			}
			that.refreshAll(startRow);
			that.removeEmptyFromRow(startRow);
			hisObject.setHistory('paste', startRow, startCol, tmpArray);
			that.moveBorder();
		},
		pasteData : function() {
			var that = this.grid;
			var value = this.grid.hiddenInput.val();
			that.hiddenInput.val('')
			var dataArray = [];
			var s = value.split('\n');
			for (var i = 0; i < s.length; i++) {
				if (s[i].trim() != '') {
					var ss = s[i].split('\t');
					dataArray.push(ss);
				}
			}
			this.setSelData(that.curRow, that.curCol, dataArray, that.zHistory);
		},
		delData : function() {
			var grid = this.grid;
			if (grid.selection.selRow < 0) return;
			var sel = grid.selection.getSelectionArea();
			
			var dataArray = new Array(sel.toRow - sel.startRow + 1);
			for (var row = 0; row < dataArray.length; row++)
				dataArray[row] = new Array(sel.toCol - sel.startCol + 1);
			for (var i = 0; i < dataArray.length; i++) {
				for (var j = 0; j < dataArray[0].length; j++) {
					dataArray[i][j] = ''
				}
			}
			this.setSelData(sel.startRow, sel.startCol, dataArray, grid.zHistory);
		},
		copyData : function() {
			var grid = this.grid;
			if (grid.selection.selRow < 0) return;
			var sel = grid.selection.getSelectionArea();
			
			var dataArray = new Array(sel.toRow - sel.startRow + 1);
			for (var row = 0; row < dataArray.length; row++)
				dataArray[row] = new Array(sel.toCol - sel.startCol + 1);
			
			for (var col = sel.startCol; col < sel.toCol + 1; col++) {
				for (var row = sel.startRow; row < sel.toRow + 1; row++) {
					var cfg = grid.getCurConfig(row, col);
					var value = '';
					if (cfg && cfg.name)
						value = grid.curArray.getData(grid.getDataIndex(row, col), cfg.name);
					else
						value = grid.getTdHtml(row, col);
					dataArray[row - sel.startRow][col - sel.startCol] = value;
				}
			}
			var str = '';
			for (var row = 0; row < dataArray.length; row++) {
				str += dataArray[row].join('\t');
				if (row < dataArray.length - 1) str += '\n';
			}
			this.copyValue(str);
		},
		copyValue : function(value) {
			this.cbTextarea.val(value);
			this.cbTextarea[0].select();
			document.execCommand("Copy");
			this.grid.hiddenInput.focus();
		}
	};
})(jQuery);

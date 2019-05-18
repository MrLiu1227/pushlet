/**
 * SlwGrid.Keyboard v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Keyboard = function(grid) {
		this.grid = grid;
		this.isInputZh = false;
	};
	/**
	 * SlwGrid.Keyboard方法
	 */
	SlwGrid.Keyboard.prototype = {
		inputEvent : function() {
			var that = this;
			var grid = this.grid;
			var input = grid.hiddenInput[0];
			grid.hiddenInput.on('compositionstart', function(e) {
				if (grid.pressCtrl) return;
				that.isInputZh = true;
			});
			grid.hiddenInput.on('compositionend', function(e) {
				if (grid.pressCtrl) return;
				that.isInputZh = false;
				grid.textObjectFocus(true);
			});
			
			grid.hiddenInput.on('input', function(e) {
				if (grid.pressCtrl) return;
				if (that.isInputZh) return;
				grid.textObjectFocus(true);
			});
			
			grid.hiddenInput.on('keydown', function(event) {
				var input = this;
				if (!that.moveEvent(event, null)) {
					switch (event.keyCode) {
						case 27: // esc
							event.preventDefault();
							grid.hideEditor();
							grid.defaultFocus();
							break;
						case 46: // del
							grid.clipboard.delData();
							break;
						case 16:// Shift
							grid.pressShift = true;
							break;
						case 17:// Ctrl
							grid.pressCtrl = true;
							break;
						case 13: // enter
							event.preventDefault();
							grid.cellFocus();
							grid.getEditor().keyEvent(event.keyCode);
							break;
						default:
							if (Slw.Utils.isIE() && Slw.Utils.ieVersion() < 9) {
								if (grid.pressCtrl) return;
								grid.textObjectFocus(true);
							}
							break;
					}
				}
			});
			
			grid.hiddenInput.on('keyup', function(event) {
				switch (event.keyCode) {
					case 16:// Shift
						grid.pressShift = false;
						break;
					case 17:// Ctrl
						grid.pressCtrl = false;
						break;
					case 67: // c
						grid.clipboard.copyData();
						break;
					case 86: // v
						grid.clipboard.pasteData();
						break;
					case 89: // y
						if (grid.pressCtrl) {
							event.preventDefault();
							grid.yHistory.history();
						}
						break;
					case 90: // z
						if (grid.pressCtrl) {
							event.preventDefault();
							grid.zHistory.history();
						}
						break;
				}
			});
		},
		moveEvent : function(event, obj) {
			// console.log((obj == null ? 'HiddenInput' : obj.tagName) + ',' +
			// event.keyCode)
			var grid = this.grid;
			event.stopPropagation();
			if (!grid.editable) return true;
			var execFlag = true;
			var bRet = false;
			switch (event.keyCode) {
				case 37: // ←
					grid.selection.hide();
					bRet = this.prevCol(obj);
					break;
				case 39: // →
					grid.selection.hide();
					bRet = this.nextCol(obj);
					break;
				case 38: // ↑
					grid.selection.hide();
					bRet = this.prevRow(obj);
					break;
				case 40: // ↓
					grid.selection.hide();
					bRet = this.nextRow(obj);
					break;
				default:
					execFlag = false;
					break;
			}
			grid.removeFlag = false;
			if (bRet) grid.moveBorder();
			return execFlag;
		},
		checkNext : function(obj) {
			return obj == null || (obj.selectionStart == obj.selectionEnd && obj.selectionStart == obj.value.length);
		},
		checkPrev : function(obj) {
			return obj == null || (obj.selectionStart == obj.selectionEnd && obj.selectionStart == 0);
		},
		nextRow : function(obj) {
			var grid = this.grid;
			grid.setCellData();
			if (grid.isColIndex())
				grid.curRow = (grid.curRow + 1) % grid.rows;
			else
				this.nextRowSub();
			return true;
		},
		prevRow : function(obj) {
			var grid = this.grid;
			grid.setCellData();
			if (grid.isColIndex()) {
				if (grid.removeFlag && grid.rows > 1) grid.curRow++;
				grid.curRow = (grid.rows + grid.curRow - 1) % grid.rows;
			}
			else
				this.prevRowSub();
			return true;
		},
		nextCol : function(obj) {
			var grid = this.grid;
			var bRet = true;
			if (grid.isColIndex()) {
				bRet = this.checkNext(obj);
				if (bRet) {
					grid.setCellData();
					this.nextColSub();
				}
			}
			else {
				grid.setCellData();
				grid.curCol = (grid.curCol + 1) % grid.cols;
				if (grid.curCol == 0) {
					grid.curCol = grid.option.indexStart;
					this.nextRow();
				}
			}
			return bRet;
		},
		prevCol : function(obj) {
			var grid = this.grid;
			var bRet = true;
			if (grid.isColIndex()) {
				bRet = this.checkPrev(obj);
				if (bRet) {
					grid.setCellData();
					this.prevColSub();
				}
			}
			else {
				grid.setCellData();
				grid.curCol = (grid.cols + grid.curCol - 1) % grid.cols;
				if (grid.curCol < grid.option.indexStart) {
					grid.curCol = grid.cols - 1;
					this.prevRow();
				}
			}
			return bRet;
		},
		nextColSub : function() {
			var grid = this.grid;
			grid.curCol = grid.curCol + 1;
			if (grid.curCol >= grid.cols) {
				this.nextRow();
				grid.curCol = 0;
			}
			while (!grid.cfgHelper.isEditable(grid.curCol)) {
				this.nextColSub();
			}
		},
		prevColSub : function() {
			var grid = this.grid;
			grid.curCol = grid.curCol - 1;
			if (grid.curCol < 0) {
				this.prevRow();
				grid.curCol = grid.cols - 1;
			}
			while (!grid.cfgHelper.isEditable(grid.curCol)) {
				this.prevColSub();
			}
		},
		nextRowSub : function() {
			var grid = this.grid;
			grid.curRow = (grid.curRow + 1) % grid.rows;
			while (!grid.cfgHelper.isEditable(grid.curRow)) {
				this.nextRowSub();
			}
		},
		prevRowSub : function() {
			var grid = this.grid;
			grid.curRow = (grid.rows + grid.curRow - 1) % grid.rows;
			while (!grid.cfgHelper.isEditable(grid.curRow)) {
				this.prevRowSub();
			}
		}
	};
})(jQuery);
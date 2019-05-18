/**
 * SlwGrid.History v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.History = function(grid) {
		this.grid = grid;
		this.hisObject = null;
		this.ctrlMap = [];
		/**
		 * {oper,row,col,data}
		 */
	};
	/**
	 * SlwGrid.History方法
	 */
	SlwGrid.History.prototype = {
		setHistory : function(oper, row, col, data) {
			var his = {};
			his.oper = oper;
			his.row = row;
			his.col = col;
			his.data = data;
			this.ctrlMap.push(his);
		},
		history : function() {
			var his = this.ctrlMap.pop();
			if (his) {
				this.grid.hideEditor();
				this.grid.selection.hideAll();
				if (his.oper == 'upd')
					this.updRollback(his);
				else if (his.oper == 'cut')
					this.cutRollback(his);
				else if (his.oper == 'del')
					this.delRollback(his);
				else if (his.oper == 'paste')
					this.pasteRollback(his);
				else if (his.oper == 'add') {
					this.addRollback(his);
				}
			}
		},
		pasteRollback : function(his) {
			this.grid.clipboard.setSelData(his.row, his.col, his.data, this.hisObject);
		},
		updRollback : function(his) {
			this.grid.setData(his.row, his.col, this.hisObject, his.data);
		},
		cutRollback : function(his) {
			this.grid.cutRows(his, this.hisObject);
		},
		delRollback : function(his) {
			this.grid.addRows(his, this.hisObject);
		},
		addRollback : function(his) {
			this.grid.delRows(his.row, his.row + his.data[0].length - 1, this.hisObject);
		},
		clear : function() {
			this.ctrlMap.length = 0;
		}
	};
	
})(jQuery);

/**
 * SlwGrid.CtxMenu v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.CtxMenu = function(grid) {
		this.grid = grid;
		this.oper = '';
		this.fromRow;
		this.toRow;
		this.operData = null;
	};
	/**
	 * SlwGrid.CtxMenu方法
	 */
	SlwGrid.CtxMenu.prototype = {
		init : function() {
			var str = '<ul class="dropdown-menu" id="slwGridMenu">';
			str = str.concat('<li rel="copy"><a href="javascript:;">复制</a></li>');
			str = str.concat('<li rel="cut"><a href="javascript:;">剪切</a></li>');
			str = str.concat('<li rel="paste"><a href="javascript:;">粘贴</a></li>');
			str = str.concat('<li rel="del"><a href="javascript:;">删除</a></li>');
			str = str.concat('</ul>');
			this.grid.table.after(str);
		},
		showMenu : function(el) {
			var that = this;
			var grid = this.grid;
			el.contextMenu('slwGridMenu', {
				init : function(el, menu) {
					that.fromRow = grid.curRow;
					that.toRow = grid.selection.selRow;
					if (that.toRow < 0) return;
					
					menu.find('[rel=paste]').css('display', that.oper == '' ? 'none' : '');
					var str = '';
					if (that.fromRow != that.toRow) {
						menu.find('[rel=paste]').css('display', that.oper == '' ? 'none' : '');
						str = '第' + (that.fromRow + 1) + '~' + (that.toRow + 1) + '行数据';
					}
					else {
						str = '第' + (that.fromRow + 1) + '行数据';
						if (that.oper != '') {
							var operName = that.oper == 'copy' ? '粘贴' : '剪切';
							menu.find('[rel=paste] a').html(operName + ' 数据到第 ' + (that.fromRow + 1) + '行前');
						}
					}
					menu.find('[rel=copy] a').html('复制 ' + str);
					menu.find('[rel=cut] a').html('剪切 ' + str);
					menu.find('[rel=del] a').html('删除 ' + str);
				},
				callback : {
					'del' : function(tr) {
						grid.delRows(that.fromRow, that.toRow, grid.zHistory);
						grid.resetBeforeEl();
					},
					'copy' : function(tr) {
						that.oper = 'copy';
						that.operData = grid.copyRows(that.fromRow, that.toRow);
					},
					'cut' : function(tr) {
						that.oper = 'cut';
						that.operData = {};
						that.operData.fromRow = that.fromRow;
						that.operData.toRow = that.toRow;
					},
					'paste' : function(tr) {
						if (that.oper == 'copy') {
							if (that.operData == null) return;
							var copyArray = [];
							copyArray[0] = new Array();
							copyArray[1] = new Array();
							
							for (var i = 0; i < that.operData.length; i++) {
								var copySrc = grid.initNewData();
								var copyCur = $.extend(true, {}, that.operData[i]);
								grid.copyUuid(copySrc, copyCur);
								if (Slw.Utils.isEqual(copySrc, copyCur)) continue;
								copyArray[0].push(copySrc);
								copyArray[1].push(copyCur);
							}
							var his = {};
							his.row = that.toRow;
							his.data = copyArray;
							grid.addRows(his, grid.zHistory);
						}
						else {
							if (that.toRow >= that.operData.fromRow && that.toRow <= that.operData.toRow) return;
							var his = {};
							his.row = that.toRow;
							his.data = {};
							his.data.fromRow = that.operData.fromRow
							his.data.num = that.operData.toRow - that.operData.fromRow + 1;
							grid.cutRows(his, grid.zHistory);
							that.oper = '';
						}
						grid.resetBeforeEl();
					}
				}
			});
		}
	};
	
})(jQuery);

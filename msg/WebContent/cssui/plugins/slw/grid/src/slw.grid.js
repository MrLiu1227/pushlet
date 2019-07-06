/**
 * SlwPlugins.SlwGrid v2.2 2018.8 by CSS WangWeidong
 */
var SlwGrid = {}
var $SlwGrid = { // 弹窗时,用于获取当前grid对象
	grid : null
};
(function() {
	$.fn.slwGrid = function(option) {
		var grid = new SlwPlugins.SlwGrid(this, option);
		grid.init();
		return grid;
	};
	SlwPlugins.SlwGrid = function(el, option) {
		this.version = 'slwGrid v1.0';
		this.debug = false;
		this.defaults = {
			data : null,
			formId : null,
			indexStart : 0,
			idName : 'uuid',
			container : 'box-body',
			scrollDiv : '.l-autoscroll',
			scrollOffsetTop : 15,
			scrollOffsetBottom : 60,
			paramName : 'jsonData',
			autoAddRow : true,
			contextMenu : true,
			columnResize : false,
			dictArray : [],
			columns : [],
			rows : [],
			afterColumnResize : null, // 列宽度变化事件自定义方法
			afterChange : null, // 内容变化事件自定义方法
			init : null
		// 表格初始化事件自定方法
		};
		/**
		 * <pre>
		 * columns/rows[//设置说明，参见SlwGrid.Config定义
		 * {
		 * 	type: text, textarea, checkbox, dict, date, read, order, group, tree, color,other
		 * 	name: 对应字段名称，对于read类型可以无
		 *  	index:  所在列索引, 可以全为不设置，默认从0顺序编号
		 * 	defaultValue: 创建新行时的默认值
		 *  	tdClass: td的样式
		 *  	options: 各类型的参数，见参考各类型定义中的this.defaults默认设置
		 *  	render: 数据显示渲染器 td中的html值的渲染规则，slw模板引擎: &lt;slw% %slw&gt;; &lt;slw%= %slw&gt;;支持data, index参数
		 *  	valueRednder: 数据赋值渲染器，curArray.data设置规则，可以是模板引擎，也可以是一个自定义的函数
		 *  	refresh: cell, column, 数据变化时是否自动刷新单元格，或整列。（当为column时，必须有valueRender，且是一个自定义的函数）
		 *  	formula: 公式，目前支持 sum, avg, min, max，当refresh='column'时，必须定义valueRender函数
		 *  	validator : {
		 * 					required : true, 是否必填
		 * 					test : 'url', 支持系统内置校验类型或自定义方法, 内置校验类型(char, chinese, number, numberAndStr, 
		 * 							digits, integer, double, email, phone, mobile, url, date, dateISO, zipCode, ip, creditcard)
		 * 					minLength : 最小长度 
		 * 					maxLength : 最大长度
		 * 					min : 最小值
		 * 					max : 最大值
		 * 				}
		 * }]
		 * </pre>
		 */
		this.option = $.extend(this.defaults, option);
		this.table = $(el);
		this.dataIndex = 'col';
		this.editable = true;
		this.rows = 0;
		this.cols = 0;
		this.preRow = -1;
		this.preCol = -1;
		this.curRow = 0;
		this.curCol = 0;
		this.srcArray = new SlwGrid.Data();
		this.curArray = new SlwGrid.Data();
		this.delData = {};
		this.editCols = {};
		this.isFocus = false;
		this.trs = null;
		this.gridClass = 'slwGridInput';
		this.textarea = $('<textarea class="' + this.gridClass + '"></textarea>');
		this.textInput = $('<input class="' + this.gridClass + '"></input>');
		this.hiddenInput = $('<textarea type="text" class="slwGridHiddenInput' + (this.debug ? '2' : '') + '"></textarea>');
		this.borderPos = {};
		this.pos = {};
		this.removeFlag = false;
		this.pressCtrl = false;
		this.pressShift = false;
		this.initEventFlag = false;
		this.cfgHelper = new SlwGrid.Config(this);
		this.zHistory = new SlwGrid.History(this);
		this.yHistory = new SlwGrid.History(this);
		this.zHistory.hisObject = this.yHistory;
		this.yHistory.hisObject = this.zHistory;
		this.ctxMenu = new SlwGrid.CtxMenu(this);
		this.formula = new SlwGrid.Formula(this);
		this.clipboard = new SlwGrid.Clipboard(this);
		this.selection = new SlwGrid.Selection(this);
		this.resizer = new SlwGrid.Resizer(this);
		this.keyboard = new SlwGrid.Keyboard(this);
		this.validator = new SlwGrid.Validator(this);
		this.newRowExceptCol = {};
		this.beforeEl = this.textarea[0];
	};
	/**
	 * SlwGrid方法
	 */
	SlwPlugins.SlwGrid.prototype = {
		init : function() {
			var that = this;
			$SlwGrid.grid = that;
			if (!that.isColIndex()) {
				that.option.contextMenu = false;
				that.option.autoAddRow = false;
			}
			that.table.addClass('slwGrid');
			that.table.after(that.textarea);
			that.table.after(that.textInput);
			that.table.after(that.hiddenInput);
			that.ctxMenu.init();
			that.clipboard.init();
			that.selection.init();
			that.resizer.init();
			that.validator.init();
			if (Slw.Utils.isIE() || Slw.Utils.isEdge()) {
				that.hiddenInput.css({
					'font-size' : '0px'
				});
			}
			if (that.option.columns.length > 0) {
				that.cfgHelper.init(that.option.columns);
			}
			else {
				that.dataIndex = 'row';
				that.cfgHelper.init(that.option.rows);
			}
			that.editCols = that.cfgHelper.configs;
			
			that.table.find('thead tr').eq(0).find('th').each(function() {
				var tmp = $(this).attr('colspan');
				if (Slw.Utils.isUndefined(tmp)) tmp = 1;
				that.cols += parseInt(tmp);
			});
			that.refreshTrs();
			
			Slw.Dict.loadDict(that.cfgHelper.dictArray, function() {
				if (that.option.data == null) {
					that.loadTableData();
					that.loadGridData(false);
				}
				else if ($.isArray(that.option.data)) {
					that.srcArray.data = that.option.data.concat();
					that.loadGridData(true);
				}
				else {
					that.submit({});
				}
			});
		},
		reload : function() {
			this.hideEditor();
			this.selection.hideAll();
			this.delData = {};
			this.isFocus = false;
			this.removeFlag = false;
			this.pressCtrl = false;
			this.pressShift = false;
			if (this.isColIndex()) this.getTBody().html('');
		},
		loadGridData : function(loadFlag) {
			var that = this;
			if (that.option.autoAddRow) {
				var newData = that.initNewData();
				that.srcArray.data.push(newData);
			}
			
			for (var index = 0; index < that.srcArray.size(); index++)
				that.createRowId(that.srcArray.get(index));
			
			that.curArray.data = that.srcArray.cloneAll();
			if (loadFlag) {
				for (var index = 0; index < that.srcArray.size(); index++)
					that.addRow(index, false);
			}
			that.refreshAll(0, loadFlag);
			that.initEvent();
			if ($.isFunction(that.option.init)) {
				that.option.init.apply(that);
			}
		},
		getTBody : function() {
			return this.table.find('tbody');
		},
		getTBodyTrs : function() {
			return this.table.find('tbody tr');
		},
		getTFoot : function(row, col) {
			return this.table.find('tfoot tr').eq(row).find('td').eq(col);
		},
		query : function() {
			var param = $('#' + this.option.formId).serialize();
			this.submit(param);
			return false;
		},
		submit : function(param) {
			var that = this;
			that.reload();
			$.post(that.option.data, param, function(data) {
				that.srcArray.data = data;
				that.loadGridData(true);
			}, 'json');
		},
		isColIndex : function() {
			return this.dataIndex == 'col';
		},
		getDataIndex : function(row, col) {
			if (Slw.Utils.isUndefined(row)) {
				row = this.curRow;
				col = this.curCol;
			}
			return this.isColIndex() ? row : col - this.option.indexStart;
		},
		getCurConfig : function(row, col) {
			if (Slw.Utils.isUndefined(row)) {
				row = this.curRow;
				col = this.curCol;
			}
			if (!this.isColIndex() && (col < this.option.indexStart || col >= this.option.indexStart + this.getDataRows())) {
				return undefined;
			}
			var index = this.isColIndex() ? col : row;
			return this.cfgHelper.getConfig(index);
		},
		getEditor : function() {
			var cfg = this.getCurConfig();
			return (cfg) ? cfg.editor : null;
		},
		initNewData : function() {
			var data = {};
			for ( var key in this.editCols) {
				var cfg = this.cfgHelper.getConfig(key);
				if (cfg && cfg.name) data[cfg.name] = cfg.defaultValue;
			}
			this.createUuid(data);
			return data;
		},
		createRowId : function(data) {
			data.slwRowId = Slw.Utils.uuid();
		},
		createUuid : function(data) {
			this.createRowId(data);
			data[this.option.idName] = '';
		},
		copyUuid : function(src, dest) {
			dest[this.option.idName] = src[this.option.idName];
			dest.slwRowId = src.slwRowId;
		},
		loadTableData : function() {
			var that = this;
			if (this.isColIndex()) {
				that.trs.each(function() {
					var data = that.getDataFromTd(that, $(this));
					that.srcArray.data.push(data);
				});
			}
			else {
				for (var col = that.option.indexStart; col < that.cols; col++) {
					var data = that.getDataFromTd(that, null, col);
					that.srcArray.data.push(data)
				}
			}
		},
		getDataFromTd : function(that, _tr, colIndex) {
			var data = {};
			if (_tr != null) {
				var slwid = _tr.attr('slwid');
				if (!Slw.Utils.isUndefined(slwid)) data[that.option.idName] = slwid;
			}
			for ( var key in that.editCols) {
				var cfg = that.cfgHelper.getConfig(key);
				if (Slw.Utils.isUndefined(cfg)) continue;
				var tr = (_tr != null) ? _tr : that.trs.eq(key);
				var col = (_tr != null) ? key : colIndex;
				data[cfg.name] = cfg.editor.getCellData(tr, col);
			}
			return data;
		},
		setEditable : function(flag) {
			this.editable = flag;
			this.hideEditor();
		},
		getDataRows : function() {
			return this.option.autoAddRow ? this.srcArray.size() - 1 : this.srcArray.size();
		},
		copyRows : function(fromRow, toRow) {
			if (toRow == this.rows - 1 && this.option.autoAddRow) toRow--;
			if (toRow < fromRow) return null;
			return this.curArray.cloneArray(fromRow, toRow);
		},
		afterEdit : function(row, col, value) {
			for ( var key in this.editCols) {
				var cfg = this.cfgHelper.getConfig(key);
				if (cfg) {
					if (cfg.refresh == 'cell') this.refreshCell(cfg, this.getDataIndex(row, col));
					if (this.rows >= this.curArray.size()) {
						if (cfg.refresh == 'column') this.refreshColumn(cfg, row, col);
						if (cfg.formula) this.formula.run(cfg);
					}
				}
			}
			if ($.isFunction(this.option.afterChange)) {
				this.option.afterChange.apply(this, [ row, col, value ]);
			}
		},
		refreshAll : function(start, loadFlag) {
			if (!start) start = 0;
			var maxRow = this.getDataRows();
			for ( var key in this.editCols) {
				var cfg = this.cfgHelper.getConfig(key);
				if (cfg && cfg.refresh == 'cell' || (loadFlag == false && cfg.type == 'checkbox')) {
					for (var index = start; index < maxRow; index++)
						this.refreshCell(cfg, index);
				}
			}
			for ( var key in this.editCols) {
				var cfg = this.cfgHelper.getConfig(key);
				if (cfg) {
					if (cfg.refresh == 'column') this.refreshColumn(cfg, start);
					if (cfg.formula) this.formula.run(cfg);
				}
			}
		},
		refreshCell : function(cfg, index) {
			if (cfg.name) {
				if (cfg.valueRender) {
					cfg.editor.setValueByRender(this.curArray.get(index), index);
				}
				this.setHtml(cfg, index);
			}
		},
		refreshColumnCell : function(cfg, start) {
			if (cfg) {
				if (Slw.Utils.isUndefined(start)) start = 0;
				var maxRow = this.getDataRows();
				for (var index = start; index < maxRow; index++)
					this.refreshCell(cfg, index);
			}
		},
		refreshColumn : function(cfg, row, col) {
			if ($.isFunction(cfg.valueRender)) {
				cfg.valueRender.apply(this, [ cfg, row, col ]);
			}
		},
		isNewRowNoChange : function(row) {
			var data = this.curArray.get(row);
			if (!this.isNewRow(row)) return false;
			if (row >= this.rows - 1) return false
			var bRet = true;
			for ( var key in this.editCols) {
				var cfg = this.cfgHelper.getConfig(key);
				if (cfg && cfg.name) {
					var has = cfg.name in this.newRowExceptCol;
					if (!has) {
						if (data[cfg.name] != this.srcArray.getData(row, cfg.name)) {
							bRet = false;
							break;
						}
					}
				}
			}
			return bRet;
		},
		isNewRow : function(row) {
			return this.curArray.getData(row, this.option.idName) == '';
		},
		removeEmptyFromRow : function(startRow) {
			this.isFocus = false;
			var maxRow = this.getDataRows();
			for (var row = maxRow - 1; row > startRow - 1; row--) {
				if (this.isNewRowNoChange(row)) {
					this.removeRows(row, row);
				}
			}
		},
		removeEmptyRow : function(row) {
			this.removeFlag = true;
			this.removeRows(row, row);
			if (this.curRow > 0) this.curRow--;
		},
		rowChanged : function(row) {
			return !Slw.Utils.isEqual(this.srcArray.get(row), this.curArray.get(row));
		},
		checkChanged : function(row) {
			if (this.isNewRowNoChange(row)) {
				this.removeEmptyRow(row);
			}
			else if (row == this.rows - 1 && this.option.autoAddRow && this.editable && this.rowChanged(row)) {
				this.createNewRow();
			}
		},
		checkAllChanged : function() {
			var bRet = Slw.Utils.isEqual(this.srcArray.data, this.curArray.data);
		},
		createNewRow : function(refresh) {
			var newData = this.initNewData();
			this.srcArray.data.push(newData);
			var copyData = $.extend(true, {}, newData);
			this.curArray.data.push(copyData);
			this.addRow(this.rows, refresh);
		},
		removeRow : function(el) {
			var tr = $(el).parents('tr');
			var row = tr.index();
			this.delRows(row, row, this.zHistory);
		},
		delRows : function(fromRow, toRow, hisObject) {
			this.hideAll();
			var delArray = this.removeRows(fromRow, toRow);
			if (delArray != null) hisObject.setHistory('del', fromRow, 0, delArray);
		},
		hideAll : function() {
			var grid = this;
			grid.hideEditor();
			grid.selection.hideAll();
		},
		removeRows : function(fromRow, toRow) {
			if (toRow == this.rows - 1 && this.option.autoAddRow) toRow--;
			if (toRow < fromRow) return null;
			var num = toRow - fromRow + 1;
			
			for (var i = toRow; i >= fromRow; i--) {
				if (!this.isNewRow(i)) {
					this.delData[this.srcArray.data[i].slwRowId] = this.srcArray.data[i];
				}
				this.trs.eq(i).remove();
			}
			var delArray = [];
			delArray[0] = this.srcArray.remove(fromRow, num);
			delArray[1] = this.curArray.remove(fromRow, num);
			
			this.refreshTrs();
			this.afterEdit(fromRow);
			return delArray;
		},
		cutRows : function(his, hisObject) {
			var grid = this;
			var fromRow = his.data.fromRow;
			var num = his.data.num;
			var toRow = his.row;
			if (toRow >= fromRow && toRow <= fromRow + num) return;
			var srcItem = grid.srcArray.remove(fromRow, num);
			var curItem = grid.curArray.remove(fromRow, num);
			var index = toRow < fromRow ? toRow : toRow - num;
			grid.srcArray.add(index, srcItem);
			grid.curArray.add(index, curItem);
			for (var i = num - 1; i >= 0; i--) {
				var fTd = (toRow < fromRow) ? grid.getTBodyTrs().eq(fromRow + num - 1) : grid.getTBodyTrs().eq(fromRow);
				grid.getTBodyTrs().eq(toRow).before(fTd);
			}
			grid.refreshTrs();
			var data = {};
			data.num = num;
			if (toRow < fromRow) {
				grid.afterEdit(toRow);
				data.fromRow = toRow;
				hisObject.setHistory('cut', fromRow + num, 0, data);
			}
			else {
				grid.afterEdit(fromRow);
				data.fromRow = toRow - num;
				hisObject.setHistory('cut', fromRow, 0, data);
			}
		},
		addRows : function(his, hisObject) {
			var grid = this;
			grid.hideAll();
			grid.srcArray.add(his.row, his.data[0]);
			grid.curArray.add(his.row, his.data[1]);
			
			for (var row = his.row; row < his.row + his.data[0].length; row++) {
				grid.addRow(row, false);
				if (!grid.isNewRow(row)) {
					delete grid.delData[grid.srcArray.data[row].slwRowId];
				}
			}
			grid.afterEdit(his.row);
			hisObject.setHistory('add', his.row, 0, his.data);
		},
		addRow : function(index, refresh) {
			if (this.isColIndex())
				this.addColIndex(index);
			else
				this.addRowIndex(index);
			if (Slw.Utils.isUndefined(refresh) || refresh == true) this.afterEdit(index);
			
		},
		addRowIndex : function(index) {
			var that = this;
			for (var row = 0; row < that.rows; row++) {
				var td = that.getTdByRow(row, index + that.option.indexStart);
				that.initTd(td, index, row)
			}
		},
		addColIndex : function(index) {
			var that = this;
			var data = that.curArray.get(index);
			var slwid = data[that.option.idName];
			var tr = $('<tr slwid="' + slwid + '"></tr>');
			for (var col = 0; col < that.cols; col++) {
				var td = $('<td></td>');
				tr.append(td)
				that.initTd(td, index, col)
			}
			if (index == 0)
				that.getTBody().prepend(tr);
			else
				that.getTBodyTrs().eq(index - 1).after(tr);
			that.refreshTrs();
		},
		initTd : function(td, dataIndex, key) {
			var cfg = this.cfgHelper.getConfig(key);
			var tdClass = '';
			var html = '';
			if (cfg) {
				if (!Slw.Utils.isUndefined(cfg.tdClass)) tdClass = cfg.tdClass;
				html = cfg.editor.getHtml(dataIndex);
			}
			if (tdClass != '') {
				td.addClass(tdClass);
				td.removeClass('text-left text-center text-right text-top text-middle text-bottom');
			}
			td.addClass('text-' + cfg.alignArray[0] + ' text-' + cfg.alignArray[1]);
			td.html(html);
		},
		resetBeforeEl : function() {
			this.beforeEl = this.textarea[0];
		},
		tBodyEvent : function() {
			var that = this;
			if (that.option.contextMenu) that.ctxMenu.showMenu(this.table.find('tbody'));
			this.table.find('tbody').on('mousedown', function(e) {
				if (!that.editable) return;
				var checkFlag = Slw.Event.checkHover(e, that.beforeEl);
				if (checkFlag) {
					that.beforeEl = e.target;
					var td = $(that.beforeEl);
					if ('TD' != td[0].tagName) {
						td = td.parent('td');
					}
					var tr = td.parent();
					var row = tr.index();
					var col = td.index();
					
					if (e.button == 2) {
						if (that.selection.inSelectionArea(row, col)) return;
					}
					
					that.setCellData();
					if (!that.pressShift) {
						that.preRow = that.curRow;
						that.preCol = that.curCol;
						that.tBodyMouseMove();
						that.moveBorder(row, col);
					}
					else {
						that.selection.shiftDraw(row, col);
						that.hiddenInputMoveTo(td);
					}
				}
			});
		},
		tBodyMouseMove : function() {
			var that = this;
			that.table.find('tbody').on('mousemove.slwGridSel', function(e) {
				var checkFlag = Slw.Event.checkHover(e, that.beforeEl);
				if (checkFlag) {
					that.beforeEl = e.target;
					var td = $(that.beforeEl);
					if ('TD' != td[0].tagName) {
						td = td.parent('td');
					}
					that.selection.beginDraw(td, 'move');
				}
			});
			$(document).on('mouseup.slwGridSel', function(e) {
				that.table.find('tbody').unbind('mousemove.slwGridSel');
				$(document).unbind('mouseup.slwGridSel');
				that.selection.checkTwiceClick();
			});
		},
		initEvent : function() {
			if (this.initEventFlag) return;
			this.initEventFlag = true;
			var that = this;
			$(window).on('resize.slwGrid', function(e) {
				that.moveBorder();
			});
			
			that.textInput.keydown(function(event) {
				if (event.keyCode == 13) {
					event.preventDefault();
					event.keyCode = 40;
				}
				that.keyboard.moveEvent(event, this);
			});
			that.textarea.keydown(function(event) {
				that.keyboard.moveEvent(event, this);
			});
			
			that.keyboard.inputEvent();
			
			that.table.find('thead, tfoot').click(function(e) {
				that.setCellData();
				that.hiddenInput.focus();
			});
			
			that.table.parents('.' + that.option.container).click(function(e) {
				var value = that.table[0].compareDocumentPosition(e.target);
				// console.log(value);
				if (value == 20 || value == 4) return;
				that.setCellData();
				that.pressCtrl = false;
				that.pressShift = false;
				that.selection.hideAll();
				that.hiddenInput.val('');
				that.hiddenInput.focus();
			});
			that.tBodyEvent();
		},
		refreshTrs : function() {
			this.trs = this.getTBodyTrs();
			this.rows = this.trs.size();
		},
		textObjectFocus : function(focus) {
			var that = this;
			setTimeout(function() {
				var value = that.hiddenInput.val();
				that.cellFocus();
				var editor = that.getEditor();
				if (editor) editor.inputObjFocus(value, focus);
				that.hiddenInput.val('');
			}, 10);
		},
		setValue : function(value, row, col) {
			if (Slw.Utils.isUndefined(row)) {
				row = this.curRow;
				col = this.curCol;
			}
			this.setData(row, col, this.zHistory, value);
		},
		setCellData : function() {
			if (!this.isFocus) return;
			// this.yHistory.clear();
			this.setData(this.curRow, this.curCol, this.zHistory);
		},
		setData : function(row, col, hisObject, value) {
			var setFlag = false; // false 正常更新值是从inputObj控件读，true 值 是设置的通常指ctrl+z
			if (!Slw.Utils.isUndefined(value)) {
				setFlag = true;
				this.hideEditor();
			}
			this.curRow = row;
			this.curCol = col;
			var cfg = this.getCurConfig();
			if (cfg && cfg.editor.editable) {
				if (setFlag)
					cfg.editor.inputObjFocus(value, false);
				else
					value = cfg.editor.getInputValue();
				var index = this.getDataIndex();
				var srcValue = this.curArray.getData(index, cfg.name);
				if (value != srcValue) {
					hisObject.setHistory('upd', row, col, srcValue);
					this.curArray.setData(index, cfg.name, value);
					var html = cfg.editor.getHtml(index);
					this.setTdValue(row, col, html);
					if (this.isColIndex()) this.checkChanged(index);
					this.afterEdit(row, col, value);
					if (!setFlag) this.yHistory.clear();
				}
				if (setFlag)
					this.moveBorder();
				else
					cfg.editor.hide();
			}
		},
		hideEditor : function() {
			this.isFocus = false;
			var editor = this.getEditor();
			if (editor != null && editor.editable) editor.hide();
		},
		moveBorder : function(row, col) {
			if (this.editable) {
				this.hideEditor();
				this.selection.hide();
				if (!Slw.Utils.isUndefined(row)) {
					this.curRow = row;
					this.curCol = col;
				}
				this.selection.selRow = this.curRow;
				this.selection.selCol = this.curCol;
				this.setPosition(row, col);
				this.selection.cellBorder.show(this.borderPos);
				this.hiddenInputMoveTo();
			}
		},
		hiddenInputMoveTo : function(td) {
			var that = this;
			var left = that.pos.left;
			var top = that.pos.top;
			if (!Slw.Utils.isUndefined(td)) {
				left = td.position().left;
				top = td.position().top;
			}
			
			if (!that.debug) {
				try {
					var content = that.table.parents(that.option.scrollDiv);
					var scrollTop = content.scrollTop();
					var height = content.height() - that.option.scrollOffsetBottom;
					if (top - (height + scrollTop) > 0) {
						content.scrollTop(top - height);
					}
					else if (top + that.option.scrollOffsetTop < scrollTop) {
						content.scrollTop(top + that.option.scrollOffsetTop);
					}
					
					var scrollLeft = content.scrollLeft();
					var width = content.width() - 10;
					if (left - (width + scrollLeft) > 0) {
						content.scrollLeft(left - width);
					}
					else if (left + that.option.scrollOffsetTop < scrollLeft) {
						content.scrollTop(left + 10);
					}
					
				} catch (e) {
				}
				that.hiddenInput.css({
					left : left + 'px',
					top : top + 'px'
				});
			}
			that.defaultFocus(2);
		},
		setPosition : function(row, col) {
			var that = this;
			if (!Slw.Utils.isUndefined(row)) {
				this.curRow = row;
				this.curCol = col;
			}
			var tr = that.trs.eq(that.curRow);
			var td = tr.find('td').eq(that.curCol);
			that.borderPos.left = td.position().left;
			that.borderPos.top = td.position().top;
			that.borderPos.width = td.outerWidth();
			that.borderPos.height = td.outerHeight();
			
			that.pos.left = that.borderPos.left + 2;
			that.pos.top = that.borderPos.top + 2;
			that.pos.width = that.borderPos.width - 2;
			that.pos.height = that.borderPos.height - 2;
			
			if (Slw.Utils.isIE() && Slw.Utils.ieVersion() == 7) {
				that.pos.width = that.borderPos.width - 14;
				that.pos.height = that.borderPos.height - 10;
			}
		},
		cellFocus : function(eventFlag) {
			var that = this;
			that.isFocus = true;
			var cfg = that.getCurConfig();
			if (cfg && cfg.editor.editable) {
				that.moveTo(cfg.editor.inputObj);
				cfg.editor.inputObj.css('text-align', cfg.alignArray[0]);
				var index = that.getDataIndex();
				cfg.editor.show(index);
				if (eventFlag) cfg.editor.keyEvent();
			}
		},
		getTd : function(_tr, col) {
			return _tr.find('td').eq(col);
		},
		getTdByRow : function(row, col) {
			return this.getTd(this.trs.eq(row), col);
		},
		getTdByIndex : function(index, cfg) {
			var td = null;
			if (this.isColIndex())
				td = this.getTdByRow(index, cfg.index);
			else
				td = this.getTdByRow(cfg.index, index + this.option.indexStart);
			return td;
		},
		getTdValue : function(_tr, col) {
			var td = this.getTd(_tr, col);
			return td.html();
		},
		setTdValue : function(row, col, value) {
			var td = this.getTdByRow(row, col);
			td.html(value);
			this.validator.testCell(td, row, col);
		},
		getTdHtml : function(row, col) {
			var td = this.getTdByRow(row, col);
			return td.html() + '';
		},
		setDataAndHtml : function(cfg, index, value) {
			if (cfg.name) {
				this.curArray.setData(index, cfg.name, value);
				this.setHtml(cfg, index);
			}
		},
		setHtml : function(cfg, index) {
			var html = cfg.editor.getHtml(index);
			if (this.isColIndex())
				this.setTdValue(index, cfg.index, html);
			else
				this.setTdValue(cfg.index, index + this.option.indexStart, html);
		},
		addOper : function(data, oper) {
			data[this.option.idName] = oper + data[this.option.idName];
		},
		getRowId : function(row) {
			return this.curArray.get(row).slwRowId;
		},
		moveTo : function(obj) {
			obj.css({
				left : this.pos.left + 'px',
				top : this.pos.top + 'px',
				width : this.pos.width + 'px',
				height : this.pos.height + 'px'
			});
		},
		defaultFocus : function(from) {
			var that = this;
			setTimeout(function() {
				that.hiddenInput.focus();
			}, 50);
		},
		toDataArray : function(data) {
			var dataArray = [];
			for (var i = 0; i < data.length; i++) {
				var tmp = this.toDataArraySub(data[i]);
				dataArray.push(tmp);
			}
			return dataArray
		},
		toDataArraySub : function(data) {
			var tmp = [];
			for ( var key in this.editCols) {
				var cfg = this.cfgHelper.getConfig(key);
				if (cfg && cfg.name) {
					tmp.push(data[cfg.name]);
				}
			}
			return tmp;
		},
		getDataArray : function() {
			var data = this.getData();
			return this.toDataArray(data);
		},
		getEditDataArray : function() {
			var data = this.getEditData();
			return this.toDataArray(data);
		},
		returnJson : function(params, data) {
			if (!params) params = {};
			params[this.option.paramName] = JSON.stringify(data);
			return params;
		},
		getData : function() {
			return this.option.autoAddRow ? this.curArray.getArray(0, this.curArray.size() - 1) : this.curArray.data;
		},
		getEditData : function() {
			var dataArray = [];
			var maxRow = this.getDataRows();
			for (var row = 0; row < maxRow; row++) {
				var data = this.curArray.get(row);
				if (this.rowChanged(row)) {
					var updCopy = $.extend(true, {}, data);
					if (updCopy[this.option.idName] != '') this.addOper(updCopy, 'u');
					dataArray.push(updCopy);
				}
			}
			for ( var key in this.delData) {
				var delCopy = $.extend(true, {}, this.delData[key]);
				this.addOper(delCopy, 'd');
				dataArray.push(delCopy);
			}
			return dataArray;
		},
		getDataJson : function(params) {
			var data = this.getData();
			return this.returnJson(params, data)
		},
		getEditDataJson : function(params) {
			return this.returnJson(params, this.getEditData())
		},
		validate : function() {
			return this.validator.check();
		},
		smallSize : function() {
			this.resizer.smallSize();
		},
		fitSize : function() {
			this.resizer.fitSize();
		},
		autoFit : function() {
			this.resizer.autoFit();
		},
		setWidth : function(col, width) {
			var trs = this.table.find('thead tr');
			var tr = trs.eq(trs.length - 1);
			this.resizer.setWidth(tr.find('th').eq(col), width);
		},
		getAlignArray : function() {
			var alignArray = new Array(2);
			alignArray[0] = [];
			alignArray[1] = [];
			for (var col = 0; col < this.cols; col++) {
				var tmp = this.getAlign(col);
				alignArray[0].push(tmp[0]);
				alignArray[1].push(tmp[1]);
			}
			return alignArray
		},
		getAlign : function(col) {
			var cfg = this.cfgHelper.getConfig(col);
			return cfg.alignArray;
		},
		printData : function() {
			console.log(this.preRow + ',' + this.preCol + ',' + this.curRow + ',' + this.curCol);
			console.log(this.srcArray.data);
			console.log(this.curArray.data);
		}
	};
})(jQuery);

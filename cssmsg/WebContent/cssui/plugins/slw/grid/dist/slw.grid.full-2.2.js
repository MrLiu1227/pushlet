///<jscompress sourcefile="slw.grid.js" />
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
;
///<jscompress sourcefile="slw.grid.text.js" />
/**
 * SlwGrid.Text v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Text = function(grid, config) {
		this.grid = grid;
		this.config = config;
		this.inputObj;
		this.editable = true;
		this.render = null;
	};
	/**
	 * SlwGrid.Text方法
	 */
	SlwGrid.Text.prototype = {
		init : function() {
			var grid = this.grid;
			this.inputObj = ('textarea' == this.config.type) ? grid.textarea : grid.textInput;
			if (this.config.render) {
				if (typeof (this.config.render) === 'string') {
					this.render = Slw.template(this.config.render);
				}
			}
		},
		inputObjFocus : function(value, focus) {
			if (focus) this.inputObj.focus();
			this.inputObj.val(value);
		},
		getInputValue : function() {
			return this.inputObj.val();
		},
		getHtml : function(index) {
			var grid = this.grid;
			var data = grid.curArray.get(index);
			this.checkData(data);
			return this.getHtmlByData(data, index);
		},
		checkData : function(data) {
		},
		getHtmlByData : function(data, index) {
			var value = data[this.config.name];
			if (this.render != null) {
				value = this.render(data, index);
			}
			else if ($.isFunction(this.config.render)) {
				value = this.config.render.apply(this.grid, [ index, this.config.index, data, this.config ]);
			}
			return Slw.Utils.toHtml(value);
		},
		getCellData : function(_tr, col) {
			var grid = this.grid;
			var text = Slw.Utils.toText(grid.getTdValue(_tr, col));
			return text;
		},
		show : function(index) {
			var grid = this.grid;
			var data = grid.curArray.get(index);
			var value = data[this.config.name];
			this.inputObj.val(value);
			this.inputObj.show();
			this.initFormat();
		},
		hide : function() {
			this.endFormat();
			this.inputObj.hide();
		},
		keyEvent : function() {
			this.inputObj.focus();
			var obj = this.inputObj[0];
			var len = obj.value.length;
			if (document.selection) {
				var sel = obj.createTextRange();
				sel.moveStart('character', len);
				sel.collapse();
				sel.select();
			}
			else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
				obj.selectionStart = obj.selectionEnd = len;
			}
			setTimeout(function() {
				this.inputObj.focus();
			}, 50);
		},
		initFormat : function() {
			var fmt = this.config.options;
			if (fmt) {
				if (fmt.input && fmt.input != 'char') {
					this.inputObj.on('keyup blur', function(event) {
						if (event.keyCode != 37) {
							this.value = this.value.replace(Slw.Input[fmt.input], '');
						}
					});
				}
				if (fmt.maxlength) this.inputObj.attr('maxlength', fmt.maxlength)
			}
		},
		endFormat : function() {
			this.inputObj.removeAttr('maxlength');
			var fmt = this.config.options;
			if (fmt && fmt.input) {
				this.inputObj.unbind('keyup blur');
			}
		}
	};
	
})(jQuery);
;
///<jscompress sourcefile="slw.grid.read.js" />
/**
 * SlwGrid.Read v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Read = function(grid, config) {
		this.grid = grid;
		this.config = config;
		this.editable = false;
		this.render = null;
		this.valueRender = null;
	};
	/**
	 * SlwGrid.Read方法
	 */
	SlwGrid.Read.prototype = {
		init : function() {
			if (this.config.render) {
				if (typeof (this.config.render) === 'string') {
					this.render = Slw.template(this.config.render);
				}
			}
			if (this.config.valueRender) {
				if (typeof (this.config.valueRender) === 'string') {
					this.valueRender = Slw.template(this.config.valueRender);
				}
			}
		},
		getCellData : function(_tr, col) {
			var grid = this.grid;
			var text = Slw.Utils.toText(grid.getTdValue(_tr, col));
			return text;
		},
		getHtml : function(index) {
			var grid = this.grid;
			var data = grid.curArray.get(index);
			return this.getHtmlByData(data, index);
		},
		getHtmlByData : function(data, index) {
			var value = data[this.config.name];
			if (this.render != null) {
				value = this.render(data, index);
			}
			else if ($.isFunction(this.config.render)) {
				value = this.config.render.apply(this.grid, [ index, this.config.index, data, this.config]);
			}
			return Slw.Utils.toHtml(value);
		},
		setValueByRender : function(data, index) {
			var value;
			if (this.valueRender != null) {
				value = this.valueRender(data, index);
			}
			else if ($.isFunction(this.config.valueRender)) {
				value = this.config.valueRender.apply(this.grid, [ index, this.config.index, data, this.config ]);
			}
			data[this.config.name] = value;
		},
		hide : function() {
		}
	};
	
})(jQuery);
;
///<jscompress sourcefile="slw.grid.dict.js" />
/**
 * SlwGrid.Dict v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Dict = function(grid, config) {
		this.grid = grid;
		this.config = config;
		this.editable = true;
		this.defaults = {
			data : 'dictParent@dictTable',
			cssStyle : grid.gridClass,
			ajaxDataType : 'dict',
			autoHeight : false,
			hideFlag : true,
			onClose : function() {
				grid.defaultFocus();
			}
		};
		this.options = $.extend(this.defaults, config.options);
		this.select = null;
		this.inputObj = grid.textInput;
		
	};
	/**
	 * SlwGrid.Dict方法
	 */
	SlwGrid.Dict.prototype = {
		init : function() {
			var grid = this.grid;
			this.select = this.inputObj.jqSelect(this.options);
			this.select.hide();
		},
		inputObjFocus : function(value, focus) {
			if (value == '') {
				this.inputObj.val('');
				this.select.setLabel('');
			}
			else {
				var item = this.getItemByKey(value);
				if (item) {
					this.inputObj.val(value);
					this.select.setLabel(item[this.config.format]);
				}
			}
			if (focus) this.grid.defaultFocus();
		},
		getInputValue : function() {
			var grid = this.grid;
			var item = this.getItemByKey(this.inputObj.val());
			return (item) ? item.code : '';
		},
		getHtml : function(index) {
			var grid = this.grid;
			var data = grid.curArray.get(index);
			return this.getHtmlByData(data, index);
			
		},
		getHtmlByData : function(data, index) {
			var value = data[this.config.name];
			var item = this.getItemByKey(value);
			var html = '';
			if (!Slw.Utils.isUndefined(item))
				html = item[this.config.format];
			else
				data[this.config.name] = '';
			return html;
		},
		getCellData : function(_tr, col) {
			var grid = this.grid;
			var item = this.getItem(grid.getTdValue(_tr, col));
			return (item) ? item.code : '';
		},
		getItemByKey : function(key) {
			var item = Slw.Dict.getDictItem(this.options.data, key);
			return item;
		},
		getItem : function(value) {
			var map = Slw.Dict.getDictList(this.options.data);
			for ( var key in map) {
				var item = map[key];
				if (value == item[this.config.format]) return item;
			}
		},
		show : function(index) {
			var grid = this.grid;
			var data = grid.curArray.get(index);
			var value = data[this.config.name];
			var item = this.getItemByKey(value);
			if (!Slw.Utils.isUndefined(item)) {
				this.inputObj.val(item.code);
				this.select.setLabel(item[this.config.format]);
			}
			else {
				this.inputObj.val('');
				this.select.setLabel('');
			}
			this.select.inputView.css('text-align', this.config.txtAlign);
			this.select.show(grid.pos);
		},
		hide : function() {
			this.select.hide();
		},
		keyEvent : function() {
			this.select.selectObj.initShow();
			this.inputObj.focus();
		}
	};
	
})(jQuery);
;
///<jscompress sourcefile="slw.grid.checkbox.js" />
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
;
///<jscompress sourcefile="slw.grid.date.js" />
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
;
///<jscompress sourcefile="slw.grid.tree.js" />
/**
 * SlwGrid.Tree v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Tree = function(grid, config) {
		this.grid = grid;
		this.config = config;
		this.editable = true;
		this.inputObj = grid.textInput;
		this.tree;
		
	};
	/**
	 * SlwGrid.Tree方法
	 */
	SlwGrid.Tree.prototype = {
		init : function() {
			var grid = this.grid;
			var that = this;
			this.defaults = {
				loadUrl : '',
				cssStyle : '',
				curNodeId : '',
				height : 200,
				width : 0,
				hideFlag : true,
				onLoad : function() {
					grid.refreshColumnCell(that.config);
				}
			};
			this.options = $.extend(this.defaults, this.config.options);
			this.tree = this.inputObj.slwTree(this.options);
			this.tree.hide();
		},
		inputObjFocus : function(value, focus) {
			if (value == '') {
				this.tree.setValue('');
				this.tree.setLabel('');
			}
			else {
				var item = this.tree.getNode(value);
				if (item) {
					this.tree.setValue(item.value);
					this.tree.setLabel(item.name);
				}
			}
			if (focus) this.grid.defaultFocus();
		},
		getInputValue : function() {
			var grid = this.grid;
			var item = this.tree.getNode(this.inputObj.val());
			return (item) ? item.value : '';
		},
		getHtml : function(index) {
			var grid = this.grid;
			var data = grid.curArray.get(index);
			return this.getHtmlByData(data, index);
		},
		getHtmlByData : function(data, index) {
			var value = data[this.config.name];
			var item = this.tree.getNode(value);
			var html = '';
			if (item) html = item.name;
			return html;
		},
		getCellData : function(_tr, col) {
			var grid = this.grid;
			var html = grid.getTdValue(_tr, col);
			var item = this.tree.find('name', html);
			return (item) ? item.name : '';
		},
		show : function(index) {
			var grid = this.grid;
			var data = grid.curArray.get(index);
			var value = data[this.config.name];
			var item = this.tree.getNode(value);
			if (item) {
				this.tree.setValue(item.value);
				this.tree.setLabel(item.name);
			}
			else {
				this.tree.setValue('');
				this.tree.setLabel('');
			}
			this.tree.inputView.css('text-align', this.config.txtAlign);
			this.tree.show(grid.pos);
			grid.defaultFocus();
		},
		hide : function() {
			this.tree.hide();
		},
		keyEvent : function() {
		}
	};
	
})(jQuery);
;
///<jscompress sourcefile="slw.grid.color.js" />
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
;
///<jscompress sourcefile="slw.grid.other.js" />
/**
 * SlwGrid.Other v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Other = function(grid, config) {
		this.grid = grid;
		this.config = config;
		this.editable = true;
		this.inputObj = grid.textInput;
		this.render = null;
		this.valueRender = null;
	};
	/**
	 * SlwGrid.Other方法
	 */
	SlwGrid.Other.prototype = new SlwGrid.Text();
	SlwGrid.Other.prototype.show = function(index) {
		var grid = this.grid;
		var data = grid.curArray.get(index);
		if ($.isFunction(this.config.userShow)) {
			grid.isFocus = false;
			$SlwGrid.grid = grid;
			this.config.userShow.apply(grid, [ index, this.config.index, data, this.config ]);
		}
	};
	
})(jQuery);
;
///<jscompress sourcefile="slw.grid.ctxmenu.js" />
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
;
///<jscompress sourcefile="slw.grid.history.js" />
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
;
///<jscompress sourcefile="slw.grid.formula.js" />
/**
 * SlwGrid.Formula v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Formula = function(grid) {
		this.grid = grid;
		this.datas = [];
		this.cfg;
		this.index = 0;
		this.rows = 0;
		this.cache = {};
	};
	
	/**
	 * SlwGrid.Formula方法
	 */
	SlwGrid.Formula.prototype = {
		run : function(cfg) {
			this.init(cfg);
			for (var i = 0; i < cfg.formula.length; i++) {
				this.index = i;
				this.initData();
				if (cfg.formula[i] != '') this.parseFormula(cfg.formula[i]);
			}
		},
		init : function(cfg) {
			this.cfg = cfg;
			this.result = {
				max : null,
				min : null,
				sum : 0,
				ok : false
			};
			this.rows = this.grid.getDataRows();
		},
		getBasicResult : function(cfg) {
			this.init(cfg);
			this.basicComputation();
			return this.result;
		},
		/**
		 * 可支持的公式方法 {sum, avg, render, max, min}
		 * 
		 * 常用算法{percent, order, group}
		 */
		percent : function(cfg, colNam) {
			var result = this.cache[colNam];
			if (!result) {
				var percentCfg = this.grid.cfgHelper.getConfigByName(colNam);
				result = this.getBasicResult(percentCfg);
				this.cache[colNam] = result;
			}
			if (!result.sum || result.sum == 0) return;
			var maxRow = this.grid.getDataRows();
			for (var i = 0; i < maxRow; i++) {
				var value = (parseFloat(this.grid.curArray.getData(i, colNam)) * 100) / result.sum;
				this.grid.setDataAndHtml(cfg, i, value);
			}
		},
		order : function(cfg, changedRow, changedCol) {
			var that = this.grid;
			var has = cfg.name in that.newRowExceptCol;
			if (!has) {
				that.newRowExceptCol[cfg.name] = cfg.name;
			}
			if (!changedCol) {
				var maxRow = this.grid.curArray.size();
				for (var i = changedRow; i < maxRow; i++) {
					this.grid.setDataAndHtml(cfg, i, i + 1);
				}
			}
		},
		group : function(cfg, changedRow, changedCol) {
			var that = this.grid;
			var oldHtml = that.getTdHtml(changedRow, cfg.index);
			var html = cfg.editor.getHtml(changedRow);
			if (changedCol && oldHtml == html) return;
			that.setTdValue(changedRow, cfg.index, html);
			var _tdStart = null;
			var _value = '';
			var _rowspan = 1;
			var maxRow = that.getDataRows();
			for (var row = 0; row < maxRow; row++) {
				var tr = that.trs.eq(row);
				var td = tr.find('td').eq(cfg.index);
				td.css('display', '');
				td.attr('rowspan', 1);
				
				var html = cfg.editor.getHtml(row);
				td.html(html);
				
				if (_tdStart == null || _value != td.html()) {
					if (_rowspan > 1) {
						_tdStart.attr('rowspan', _rowspan);
						_tdStart.addClass('text-middle');
					}
					_tdStart = td;
					_value = html + '';
					_rowspan = 1;
				}
				else {
					td.css('display', 'none');
					_rowspan++;
				}
			}
			if (_rowspan > 1) {
				_tdStart.attr('rowspan', _rowspan);
				_tdStart.addClass('text-middle');
			}
		},
		render : function() {
			this.drawHtml();
		},
		sum : function() {
			this.basicComputation();
			this.setData(this.result.sum);
		},
		avg : function(precision) {
			if (Slw.Utils.isUndefined(precision)) precision = 2;
			if (this.rows > 0) {
				this.basicComputation();
				var value = this.result.sum / this.rows;
				value = Slw.Format.toFixed(value, precision);
				this.setData(value);
			}
		},
		max : function() {
			this.basicComputation();
			this.setData(this.result.max);
		},
		min : function() {
			this.basicComputation();
			this.setData(this.result.min);
		},
		parseFormula : function(args) {
			var formula = args, param;
			var p = /\((.+?)\)/g;
			var r = p.exec(args);
			if (r != null) {
				formula = args.substring(0, r.index);
				param = r[1];
			}
			this[formula](param);
		},
		initData : function() {
			if (this.datas.length == this.index) {
				var data = {};
				this.datas.push(data);
			}
		},
		basicComputation : function() {
			if (this.result.ok == true) return;
			for (var row = 0; row < this.rows; row++) {
				var value = parseFloat(this.grid.curArray.getData(row, this.cfg.name));
				this.result.sum += value;
				this.result.max = this.result.max == null ? value : Math.max(this.result.max, value);
				this.result.min = this.result.min == null ? value : Math.min(this.result.min, value);
			}
			this.result.ok = true;
			var has = this.cfg.name in this.cache;
			if (has) {
				this.cache[this.cfg.name] = this.result;
			}
		},
		setData : function(value) {
			this.datas[this.index][this.cfg.name] = value;
			this.drawHtml();
		},
		getData : function() {
			return this.datas[this.index];
		},
		drawHtml : function() {
			try {
				var grid = this.grid;
				var html = this.cfg.editor.getHtmlByData(this.getData(), grid.getDataRows() + this.index);
				var td;
				if (grid.isColIndex())
					td = grid.getTFoot(this.index, this.cfg.index);
				else
					td = grid.getTdByRow(this.cfg.index, this.index + grid.option.indexStart + grid.getDataRows());
				td.html(html);
			} catch (e) {
			}
		}
	};
	
})(jQuery);
;
///<jscompress sourcefile="slw.grid.selection.js" />
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
;
///<jscompress sourcefile="slw.grid.border.js" />
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
;
///<jscompress sourcefile="slw.grid.keyboard.js" />
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
})(jQuery);;
///<jscompress sourcefile="slw.grid.clipboard.js" />
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
;
///<jscompress sourcefile="slw.grid.data.js" />
/**
 * SlwGrid.Data v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Data = function() {
		this.data = [];
	};
	
	/**
	 * SlwGrid.Data方法
	 */
	SlwGrid.Data.prototype = {
		getData : function(index, name) {
			return this.data[index][name];
		},
		setData : function(index, name, value) {
			this.data[index][name] = value;
		},
		size : function() {
			return this.data.length;
		},
		get : function(index) {
			return this.data[index];
		},
		clone : function(index) {
			return $.extend(true, {}, this.get(index))
		},
		getArray : function(startIndex, toIndex) {
			toIndex = Slw.Utils.isUndefined(toIndex) ? startIndex + 1 : toIndex + 1;
			return this.data.slice(startIndex, toIndex);
		},
		cloneArray : function(startIndex, toIndex) {
			return $.extend(true, [], this.getArray(startIndex, toIndex))
		},
		cloneAll : function() {
			return $.extend(true, [], this.data);
		},
		add : function(index, array) {
			for (var i = 0; i < array.length; i++) {
				this.data.splice(index + i, 0, array[i]);
			}
		},
		remove : function(index, num) {
			return this.data.splice(index, num);
		}
	};
	
})(jQuery);
;
///<jscompress sourcefile="slw.grid.config.js" />
/**
 * SlwGrid.Config v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Config = function(grid) {
		this.grid = grid;
		this.type = {
			'text' : {
				className : SlwGrid.Text,
				config : {
					options : {
						input : 'char', // char, number, double
						maxlength : 20
					},
					defaultValue : '',
					tdClass : 'text-center'
				}
			},
			'textarea' : {
				className : SlwGrid.Text,
				config : {
					options : {
						input : 'char', // char, number, double
						maxlength : 100
					},
					defaultValue : '',
					tdClass : 'text-left'
				}
			},
			'dict' : {
				className : SlwGrid.Dict,
				config : {
					options : {
						data : 'dictParent@dictTable',
						selectInputQuery : false
					},
					format : 'name',
					defaultValue : '',
					tdClass : 'text-center'
				}
			},
			'checkbox' : {
				className : SlwGrid.Checkbox,
				config : {
					options : {
						// 默认第一个为checked
						values : [ '1', '2' ]
					},
					defaultValue : '2',
					tdClass : 'text-center'
				}
			},
			'tree' : {
				className : SlwGrid.Tree,
				config : {
					options : {
						loadUrl : ''
					},
					defaultValue : '',
					tdClass : 'text-center'
				}
			},
			'date' : {
				className : SlwGrid.Date,
				config : {
					options : {
						dateFmt : 'yyyy-MM-dd',
						readOnly : true
					},
					defaultValue : '',
					tdClass : 'text-center'
				}
			},
			'read' : {
				className : SlwGrid.Read,
				config : {
					defaultValue : '',
					tdClass : 'tdRead text-center'
				}
			},
			'order' : {
				className : SlwGrid.Read,
				config : {
					valueRender : function(cfg, changedRow, changedCol) {
						this.formula.order(cfg, changedRow, changedCol);
					},
					refresh : 'column',
					render : '<slw%=(index+1)%slw>',
					defaultValue : '',
					tdClass : 'tdRead text-center'
				}
			},
			'group' : {
				className : SlwGrid.Read,
				config : {
					valueRender : function(cfg, changedRow, changedCol) {
						return this.formula.group(cfg, changedRow, changedCol);
					},
					refresh : 'column',
					defaultValue : '',
					tdClass : 'tdRead text-center'
				}
			},
			'other' : {
				className : SlwGrid.Other,
				config : {
					userShow : function(row, col, data) {
					},
					defaultValue : '',
					tdClass : 'tdRead text-center'
				}
			},
			'color' : {
				className : SlwGrid.Color,
				config : {
					defaultValue : '#000000',
					tdClass : 'text-center',
					options : {
						bgColor : true,
						cssStyle : '', //slw-color-btn
		            lang: 1 //0:en, 1,中文
					},
					validator : {
						required : false,
						test : 'color'
					}
				}
			}
		};
		this.dictMap = {};
		this.dictArray = [];
		this.configs = {};
	};
	
	/**
	 * SlwGrid.Config方法
	 */
	SlwGrid.Config.prototype = {
		getConfig : function(key) {
			return this.configs[key];
		},
		getConfigByName : function(name) {
			var cfg;
			for ( var key in this.configs) {
				if (this.configs[key].name == name) {
					cfg = this.configs[key];
					break;
				}
			}
			return cfg;
		},
		isEditable : function(key) {
			var cfg = this.getConfig(key);
			var bRet = (Slw.Utils.isUndefined(cfg) ? false : cfg.editor.editable);
			return bRet;
		},
		getOptions : function(type) {
			return this.type[type]['config'];
		},
		init : function(columnOptions) {
			var grid = this.grid;
			for (var i = 0; i < columnOptions.length; i++) {
				var cfg = columnOptions[i];
				if (!cfg.index) cfg.index = i;
				this.initOptions(cfg);
			}
			for (var i = 0; i < grid.option.dictArray.length; i++) {
				var dict = grid.option.dictArray[i];
				if (!(dict in this.dictMap)) {
					this.dictMap[dict] = dict;
					this.dictArray.push(dict);
				}
			}
		},
		initOptions : function(cfg) {
			var grid = this.grid;
			var options = this.getOptions(cfg.type);
			var optionsCopy = $.extend(true, {}, options);
			cfg.options = $.extend(optionsCopy.options, cfg.options);
			cfg = $.extend(optionsCopy, cfg);
			cfg.alignArray = [ 'center', 'middle' ];
			this.initTxtAlign(cfg);
			cfg.editor = this.initEditor(grid, cfg);
			if (cfg.type == 'dict') {
				if (!(cfg.options.data in this.dictMap)) {
					this.dictMap[cfg.options.data] = cfg.options.data;
					this.dictArray.push(cfg.options.data);
				}
			}
			this.configs[cfg.index] = cfg;
		},
		initTxtAlign : function(cfg) {
			if (cfg.tdClass) {
				if (cfg.tdClass.indexOf('text-left') >= 0)
					cfg.alignArray[0] = 'left';
				else if (cfg.tdClass.indexOf('text-right') >= 0)
					cfg.alignArray[0] = 'right';
				else
					cfg.alignArray[0] = 'center';
				
				if (cfg.tdClass.indexOf('text-top') >= 0)
					cfg.alignArray[1] = 'top';
				else if (cfg.tdClass.indexOf('text-bottom') >= 0)
					cfg.alignArray[1] = 'bottom';
				else
					cfg.alignArray[1] = 'middle';
			}
		},
		initEditor : function(grid, cfg) {
			var editor = new this.type[cfg.type]['className'](grid, cfg);
			editor.init();
			return editor;
		}
	};
	
})(jQuery);
;
///<jscompress sourcefile="slw.grid.resizer.js" />
/**
 * SlwGrid.Resizer v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Resizer = function(grid) {
		this.grid = grid;
		this.guide = $('<div class="slwGridcolumnResizerGuide"></div>');
		this.resizer = $('<div class="slwGridcolumnResizer"></div>');
		this.size = 6;
		this.dragFlag = false;
		this.preLeft = 0;
		this.curTh = null;
	};
	/**
	 * SlwGrid.Resizer方法
	 */
	SlwGrid.Resizer.prototype = {
		init : function(option) {
			var grid = this.grid;
			if (grid.option.columnResize) {
				grid.table.css({
					'width' : 'auto'
				});
				grid.table.after(this.guide);
				grid.table.after(this.resizer);
				this.initEvent();
				this.initMenu();
			}
		},
		initEvent : function() {
			var grid = this.grid;
			var that = this;
			grid.table.find('thead tr th').on('mousemove', function(e) {
				if (that.dragFlag) return;
				var th = $(this);
				var bRet = false;
				if ((th.outerWidth() - (e.clientX - th.offset().left)) < that.size) {
					var pos = {};
					pos.left = th.offset().left + th.outerWidth() - that.size;
					pos.top = th.offset().top;
					pos.height = th.outerHeight();
					that.curTh = th;
					that.show(pos);
				}
				else {
					that.hide();
				}
			});
			that.resizer.on('mousedown.slwGridResize', function(e) {
				that.dragFlag = true;
				e.preventDefault();
				that.preLeft = that.guide.position().left;
				that.startEvent();
			});
		},
		startEvent : function() {
			var that = this;
			$(document).on('mousemove.slwGridResize', function(e) {
				e.preventDefault();
				that.move(e.clientX);
			});
			$(document).on('mouseup.slwGridResize', function(e) {
				e.preventDefault();
				that.resize();
				that.stopEvent();
			});
		},
		stopEvent : function() {
			$(document).unbind('mousemove.slwGridResize mouseup.slwGridResize');
		},
		move : function(left) {
			var that = this;
			this.guide.css({
				left : (left - 2 + that.size - 1) + 'px'
			});
			this.resizer.css({
				left : (left - 2) + 'px'
			});
		},
		resize : function() {
			var width = Math.round(this.curTh.outerWidth() + this.guide.position().left - this.preLeft);
			this.setWidth(this.curTh, width);
		},
		show : function(pos) {
			var grid = this.grid;
			var that = this;
			this.guide.css({
				left : (pos.left + that.size - 1) + 'px',
				top : pos.top + 'px',
				height : (grid.table.height() - (that.curTh.offset().top - grid.table.offset().top)) + 'px'
			});
			this.resizer.css({
				left : pos.left + 'px',
				top : pos.top + 'px',
				height : pos.height + 'px'
			});
			this.guide.show();
			this.resizer.show();
		},
		hide : function() {
			this.guide.hide();
			this.resizer.hide();
		},
		hideAll : function() {
			this.dragFlag = false;
			this.grid.selection.hideAll();
			this.hide();
		},
		initMenu : function() {
			var grid = this.grid;
			var str = '<ul class="dropdown-menu" id="slwGridThMenu">';
			str = str.concat('<li rel="left"><a href="javascript:;">居左(Left)</a></li>');
			str = str.concat('<li rel="center"><a href="javascript:;">居中(Center)</a></li>');
			str = str.concat('<li rel="right"><a href="javascript:;">居右(Right)</a></li>');
			str = str.concat('<li class="divider"></li>');
			str = str.concat('<li rel="top"><a href="javascript:;">上对齐(Top)</a></li>');
			str = str.concat('<li rel="middle"><a href="javascript:;">中对齐(Middle)</a></li>');
			str = str.concat('<li rel="bottom"><a href="javascript:;">下对齐(Bottom)</a></li>');
			str = str.concat('</ul>');
			grid.table.after(str);
			this.showMenu(grid.table.find('thead tr th'));
		},
		showMenu : function(obj) {
			var that = this;
			var grid = this.grid;
			obj.each(function() {
				$(this).contextMenu('slwGridThMenu', {
					init : function(el, menu) {
						var key = el.index();
						var cfg = grid.cfgHelper.getConfig(key);
						that.clearCheck(menu);
						that.checkItem(cfg.alignArray[0], menu);
						that.checkItem(cfg.alignArray[1], menu);
					},
					callback : {
						'left' : function(el, align) {
							that.setAlign(el, align, 0)
						},
						'center' : function(el, align) {
							that.setAlign(el, align, 0)
						},
						'right' : function(el, align) {
							that.setAlign(el, align, 0)
						},
						'top' : function(el, align) {
							that.setAlign(el, align, 1)
						},
						'middle' : function(el, align) {
							that.setAlign(el, align, 1)
						},
						'bottom' : function(el, align) {
							that.setAlign(el, align, 1)
						}
					}
				});
			});
		},
		clearCheck : function(menu) {
			menu.find('a').each(function() {
				$(this).html($(this).text());
			});
		},
		checkItem : function(key, menu) {
			var item;
			if (key != '') {
				item = menu.find('[rel=' + key + '] a');
				var txt = item.text();
				item.html('<i class="fa fa-check text-red"></i> ' + txt);
			}
		},
		setAlign : function(el, align, index) {
			var grid = this.grid;
			var key = el.index();
			var cfg = grid.cfgHelper.getConfig(key);
			cfg.alignArray[index] = align;
			grid.trs.each(function() {
				var td = $(this).find('td').eq(key);
				td.removeClass('text-left text-center text-right text-top text-middle text-bottom');
				td.addClass('text-' + cfg.alignArray[0] + ' text-' + cfg.alignArray[1]);
			});
		},
		smallSize : function() {
			var grid = this.grid;
			grid.table.css({
				'width' : 'auto',
				'max-width' : 'auto'
			});
			grid.table.find('td, th').css({
				'white-space' : 'nowrap',
				'text-overflow' : 'ellipsis',
				'-o-text-overflow' : 'ellipsis'
			});
			grid.table.find('thead tr th').each(function() {
				$(this).css('width', '0px');
			});
			this.hide();
		},
		fitSize : function() {
			var grid = this.grid;
			grid.table.css({
				'width' : '100%',
				'max-width' : '100%'
			});
			grid.table.find('td, th').css({
				'white-space' : '',
				'text-overflow' : '',
				'-o-text-overflow' : ''
			});
			grid.table.find('thead tr th').each(function() {
				var th = $(this);
				var width = th.attr('width');
				if (Slw.Utils.isUndefined(width)) width = '0px';
				th.css('width', width);
			});
			this.hide();
		},
		autoFit : function() {
			var grid = this.grid;
			grid.table.css({
				'width' : '100%',
				'max-width' : '100%'
			});
			grid.table.find('td, th').css({
				'white-space' : '',
				'text-overflow' : '',
				'-o-text-overflow' : ''
			});
			grid.table.find('thead tr th').each(function() {
				$(this).css('width', '0px');
			});
			this.hide();
		},
		setWidth : function(el, width) {
			if (el.length > 0 && width != el.outerWidth()) {
				el.css('width', width + 'px');
				this.hideAll();
				if ($.isFunction(this.grid.option.afterColumnResize)) {
					this.grid.option.afterColumnResize.apply(this.grid, [ el.index(), width ]);
				}
			}
			this.hide();
		}
	};
	
})(jQuery);
;
///<jscompress sourcefile="slw.grid.validator.js" />
/**
 * SlwGrid.Validator v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Validator = function(grid) {
		this.grid = grid;
		this.beforeEl = grid.hiddenInput[0];
		this.validTip = $('<div class="slwGridTip"></div>');
		this.tipName = 'slwErrorTip';
	};
	/**
	 * SlwGrid.Validator方法
	 */
	SlwGrid.Validator.prototype = {
		init : function() {
			var that = this;
			var grid = this.grid;
			grid.table.after(that.validTip);
			grid.table.find('tbody').on('mousemove.slwGridValidator', function(e) {
				if (!grid.editable) return;
				var checkFlag = Slw.Event.checkHover(e, that.beforeEl);
				if (checkFlag) {
					that.beforeEl = e.target;
					var td = $(that.beforeEl);
					if ('TD' != td[0].tagName) {
						td = td.parent('td');
					}
					if (td.hasClass('error')) {
						var tr = td.parent();
						var row = tr.index();
						var col = td.index();
						var msg = td.data(that.tipName);
						if (msg != '') {
							that.validTip.css({
								'left' : 0,
								'top' : 0
							});
							that.validTip.html(msg);
							var left = td.offset().left + td.outerWidth() - that.validTip.outerWidth();
							var top = td.offset().top + td.outerHeight() - that.validTip.outerHeight();
							that.validTip.css({
								'left' : left,
								'top' : top
							}).show();
						}
					}
					else
						that.validTip.hide();
				}
			});
		},
		check : function() {
			var allOk = true;
			var grid = this.grid;
			var data = this.grid.getData();
			for ( var key in grid.editCols) {
				var cfg = grid.cfgHelper.getConfig(key);
				if (cfg && cfg.name && cfg.validator) {
					for (index = 0; index < data.length; index++) {
						var value = data[index][cfg.name];
						var ret = Slw.Valid.check(cfg.validator, value);
						if (!ret.result) allOk = false;
						this.setTip(cfg, index, ret);
					}
				}
			}
			return allOk;
		},
		testCell : function(td, row, col) {
			var grid = this.grid;
			var cfg = grid.getCurConfig(row, col);
			if (cfg && cfg.name && cfg.validator) {
				var index = grid.getDataIndex(row, col);
				var value = grid.curArray.getData(index, cfg.name);
				var ret = Slw.Valid.check(cfg.validator, value);
				this.setTdTip(td, ret);
			}
		},
		setTip : function(cfg, index, ret) {
			this.setTdTip(this.grid.getTdByIndex(index, cfg), ret);
		},
		setTdTip : function(td, ret) {
			if (ret.result) {
				td.removeClass('error');
				td.data(this.tipName, '')
			}
			else {
				td.addClass('error');
				td.data(this.tipName, ret.message)
			}
		}
	};
})(jQuery);
;

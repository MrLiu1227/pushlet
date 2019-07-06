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

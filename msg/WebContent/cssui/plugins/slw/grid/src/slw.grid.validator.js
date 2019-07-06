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

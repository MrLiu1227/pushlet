/**
 * SlwPlugins.SlwSpinner v1.0 2017.10 by CSS WangWeidong
 */
;
(function() {
	$.fn.slwSpinner = $.fn.jqSpinner = function(option) {
		var spinner = new SlwPlugins.SlwSpinner(this, option);
		spinner.init();
		return spinner;
	}

	SlwPlugins.SlwSpinner = function(input, option) {
		this.input = $(input);
		this.defaults = {
			className : 'tbSpinner',
			style : 1, // 1: up, down; 2: minus, plus
			style_1_align : 'right', // right, left, both
			min : null,
			max : null,
			step : 1,
			precision : 0,
			width : '100%'
		};
		this.option = $.extend(this.defaults, option);
		this.oldValue = this.value();
		this.value(this.input.val());
	}
	/**
	 * SlwSpinner方法
	 */
	SlwPlugins.SlwSpinner.prototype = {
		init : function() {
			this.initView();
			this.initEvent();
		},
		initView : function() {
			var that = this;
			that.wrapper = $('<table class="' + that.option.className + '"></table>');
			that.wrapper.css("width", that.option.width);
			that.input.after(that.wrapper);
			
			var tbl, row, l_cell, m_cell, r_cell;
			tbl = that.wrapper[0];
			row = tbl.insertRow(0);
			var k = 0;
			if (!(that.option.style == 1 && that.option.style_1_align == 'right')) {
				l_cell = row.insertCell(k++);
				l_cell.className = "btnCell";
			}
			m_cell = row.insertCell(k++);
			if (!(that.option.style == 1 && that.option.style_1_align == 'left')) {
				r_cell = row.insertCell(k++);
				r_cell.className = "btnCell";
			}
			var upDown = '<a class="c_up" data-dir="up" href="javascript:;"><i class="fa fa-caret-up" /></a><div style="clear:both;height:0px;"></div><a class="c_down" data-dir="down" href="javascript:;"><i class="fa fa-caret-down" /></a>';
			var minus = '<a class="c_minus" data-dir="down" href="javascript:;"><i class="fa fa-minus" /></a>';
			var plus = '<a class="c_plus" data-dir="up" href="javascript:;"><i class="fa fa-plus" /></a>';
			
			if (that.option.style == 1) {
				switch (that.option.style_1_align) {
					case 'left':
						$(l_cell).append(upDown);
						break;
					case 'right':
						$(r_cell).append(upDown);
						break;
					case 'both':
						$(l_cell).append(upDown);
						$(r_cell).append(upDown);
						break;
				}
			}
			else {
				$(l_cell).append(minus);
				$(r_cell).append(plus);
			}
			$(m_cell).append(that.input);
		},
		initEvent : function() {
			var that = this;
			that.wrapper.find('a').on('click', function() {
				that.spin.apply(that, [ $(this).attr('data-dir') ]);
			});
		},
		spin : function(dir) {
			if (this.input.prop('disabled')) {
				return;
			}
			this.oldValue = this.value();
			var step = $.isFunction(this.option.step) ? this.option.step.call(this, dir) : this.option.step;
			var multipler = dir === 'up' ? 1 : -1;
			this.value(this.oldValue + Number(step) * multipler);
		},
		value : function(v) {
			if (v === null || v === undefined) {
				return this.numeric(this.input.val());
			}
			v = this.numeric(v);
			var valid = this.validate(v);
			if (valid !== 0) {
				v = (valid === -1) ? this.option.min : this.option.max;
			}
			this.input.val(v.toFixed(this.option.precision));
		},
		numeric : function(v) {
			v = this.option.precision > 0 ? parseFloat(v, 10) : parseInt(v, 10);
			if (isFinite(v)) {
				return v;
			}
			return v || this.option.min || 0;
		},
		validate : function(val) {
			if (this.option.min !== null && val < this.option.min) {
				return -1;
			}
			if (this.option.max !== null && val > this.option.max) {
				return 1;
			}
			return 0;
		}
	}
})(jQuery);

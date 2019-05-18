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

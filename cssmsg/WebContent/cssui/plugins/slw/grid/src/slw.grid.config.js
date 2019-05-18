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

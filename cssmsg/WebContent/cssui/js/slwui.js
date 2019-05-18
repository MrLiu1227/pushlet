///<jscompress sourcefile="slw.js" />
/**
 * Slw/SlwPlugins v3.0 2018.8 by CSS WangWeidong
 */

var Slw = {}, SlwPlugins = {};
;
(function() {
	$.extend(Slw, {
		cascade : function(elmentArray, option) {
			new SlwPlugins.SlwCascade(elmentArray, option).init();
		},
		cascadeStep : function(elmentArray, option) {
			new SlwPlugins.SlwCascadeStep(elmentArray, option).init();
		},
		checkboxClick : function(el, clickCallback) {
			var icon = $(el).find('i');
			var checkFlag = ($(el).find('.fa-check-square-o').length > 0);
			checkFlag = !checkFlag;
			icon.removeClass(checkFlag ? "fa-square-o" : "fa-check-square-o");
			icon.addClass(checkFlag ? "fa-check-square-o" : "fa-square-o");
			if ($.isFunction(clickCallback)) {
				clickCallback.call(this, checkFlag);
			}
		}
	});
	Slw.Utils = {
		toHtml : function(s) {
			s = (s + '').replace(/(\r\n)|(\n)/g, '<br>');
			return s;
		},
		toText : function(s) {
			return s.replace(/(<br>|<br\/>)/ig, '\n');
		},
		formatJson : function(s) {
			return s.replace(/(\},\{)/ig, '\},<br>\{');
		},
		uuid : function() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		},
		isnull : function(str) {
			return (str == null || (typeof str == 'undefined') || str == '');
		},
		isNumber : function(n) {
			return typeof n === 'number' && !isNaN(n);
		},
		isUndefined : function(n) {
			return typeof n === 'undefined';
		},
		trim : function(str) {
			return str.replace(/(^\s*)|(\s*$)/g, "");
		},
		length : function(str) {
			return str.length;
		},
		lengthB : function(str) {
			return str.replace(/[^\x00-\xff]/g, "**").length;
		},
		px : function(n) {
			return Slw.Utils.isNumber(n) ? n + 'px' : n;
		},
		isEqual : function(a, b) {
			var _a = {}, _b = {};
			_a.d = a;
			_b.d = b;
			var _as = $.param(_a);
			var _bs = $.param(_b);
			return _as == _bs;
		},
		isOpera : function() {
			var userAgent = navigator.userAgent;
			return userAgent.indexOf("Opera") > -1;
		},
		isEdge : function() {
			var userAgent = navigator.userAgent;
			return (userAgent.indexOf("Edge") > -1);
		},
		isFF : function() {
			var userAgent = navigator.userAgent;
			return userAgent.indexOf("Firefox") > -1;
		},
		isSafari : function() {
			var userAgent = navigator.userAgent;
			return userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1;
		},
		isChrome : function() {
			var userAgent = navigator.userAgent;
			return userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1;
		},
		isIE : function() {
			var userAgent = navigator.userAgent;
			if (userAgent.toLowerCase().match(/rv:([\d.]+)\) like gecko/)) return true;
			var isOpera = userAgent.indexOf("Opera") > -1;
			return userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera;
		},
		ieVersion : function() {
			var userAgent = navigator.userAgent;
			if (userAgent.toLowerCase().match(/rv:([\d.]+)\) like gecko/)) return 11;
			var version = -1;
			var isOpera = userAgent.indexOf("Opera") > -1;
			var ie = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera;
			if (ie) {
				var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
				reIE.test(userAgent);
				version = parseFloat(RegExp["$1"]);
			}
			return version;
		},
		toJson : function(jsonStr) {
			if (Slw.Utils.isnull(jsonStr)) return '';
			var json = {};
			try {
				json = eval('(' + jsonStr + ')');
			} catch (e) {
				json = '';
			}
			return json;
		},
		substr : function(str, len) {
			if (!str || !len) return '';
			var a = 0;
			var temp = '';
			for (var i = 0; i < str.length; i++) {
				a += str.charCodeAt(i) > 255 ? 2 : 1;
				if (a > len) return temp;
				temp += str.charAt(i);
			}
			return str;
		}
	};
	Slw.Color = {
		basicColor : function(c) {
			var r = parseInt(c.substr(1, 2), 16) * 0.299 + parseInt(c.substr(3, 2), 16) * 0.578 + parseInt(c.substr(5, 2), 16) * 0.114;
			return r > 192 ? '#000000' : '#FFFFFF';
		},
		reverseColor : function(c) {
			var r = (0xFFFFFF - parseInt(c.slice(-6), 16)).toString(16);
			return "#" + ("000000" + r).slice(-6).toUpperCase();
		},
		code : function(color) {
			return '<code style="background-color:' + color + '; color:' + Slw.Color.basicColor(color) + '">' + color + '</code>';
		}
	};
	Slw.Format = {
		// Slw.Format.format("长度介于 {0} 和 {1} 之间的字符串",[1,20])
		format : function(source, params) {
			if (!$.isArray(params)) {
				params = [ params ];
			}
			$.each(params, function(i, n) {
				source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function() {
					return n;
				});
			});
			return source;
		},
		// 格式: 0 | 0.0 | 0,0.00
		numeral : function(value, format) {
			if (!format) format = '0,0.00';
			var precision = format.split('.')[1];
			var thousands = format.indexOf(',');
			var d, w;
			if (precision)
				w = Slw.Format.toFixed(value, precision.length);
			else
				w = Slw.Format.toFixed(value, null);
			
			if (thousands > -1) {
				w = w.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + ',');
			}
			return w;
		},
		toFixed : function(value, precision) {
			var power = Math.pow(10, precision), output;
			output = (Math.round(value * power) / power).toFixed(precision);
			return output;
		}
	};
	Slw.Image = {
		trumbImage : function(img, o) {
			var naturalWidth = img.width;
			var naturalHeight = img.height;
			var imgRatio = naturalWidth / naturalHeight;
			var canvasRatio = o.thumbW / o.thumbH;
			var width, height;
			if (o.fitType == 'scale') {
				if (imgRatio > canvasRatio) {
					width = o.thumbW;
					height = width / imgRatio;
				}
				else {
					height = o.thumbH;
					width = imgRatio * height;
				}
			}
			else {
				if (imgRatio > canvasRatio) {
					height = o.thumbH;
					width = imgRatio * height;
				}
				else {
					width = o.thumbW;
					height = width / imgRatio;
				}
			}
			width = (width > naturalWidth) ? naturalWidth : width;
			height = (height > naturalHeight) ? naturalHeight : height;
			$(img).css({
				'width' : width + 'px',
				'height' : height + 'px'
			});
			if (o.fitType == 'fixed') {
				if (width > o.thumbW) $(img).css('margin-left', -(width - o.thumbW) / 2 + 'px');
				if (height > o.thumbH) $(img).css('margin-top', -(height - o.thumbH) / 2 + 'px');
			}
		},
		loadImage : function(imgUrl, callback) {
			var img = document.createElement('img');
			img.onload = function() {
				callback(img);
			};
			img.src = imgUrl;
		}
	};
	Slw.Event = {
		checkHover : function(e, target) {
			if (Slw.Event.getEvent(e).type == "mouseover") {
				return !Slw.Event.contains(target, Slw.Event.getEvent(e).relatedTarget || Slw.Event.getEvent(e).fromElement) && !((Slw.Event.getEvent(e).relatedTarget || Slw.Event.getEvent(e).fromElement) === target);
			}
			else {
				return !Slw.Event.contains(target, Slw.Event.getEvent(e).relatedTarget || Slw.Event.getEvent(e).toElement) && !((Slw.Event.getEvent(e).relatedTarget || Slw.Event.getEvent(e).toElement) === target);
			}
		},
		contains : function(parentNode, childNode) {
			if (parentNode.contains) {
				return parentNode == childNode || parentNode.contains(childNode);
			}
			else {
				return !!(parentNode.compareDocumentPosition(childNode) & 16);
			}
		},
		onElement : function(e, el) {
			return ($.contains(el, e.target) || $(el).is(e.target));
		},
		getEvent : function(e) {
			return e || window.event;
		},
		hasClass : function(e, className) {
			return $(Slw.Event.getEvent(e).toElement).hasClass(className);
		}
	};
	
	Slw.Element = {
		clear : '<div style="clear:both"></div>'
	};
	
	Slw.Input = {
		'number' : /\D/g,
		'double' : /[^-/+0-9.]/g
	};
	
})(jQuery);
;
///<jscompress sourcefile="slw.template.js" />
/**
 * Slw.template v1.0 2018.8 by CSS WangWeidong
 */

Slw.templateSettings = {
	evaluate : /<slw%([\s\S]+?)%slw>/g,
	interpolate : /<slw%=([\s\S]+?)%slw>/g
};
Slw.noMatch = /(.)^/;

Slw.escapes = {
	"'" : "'",
	'\\' : '\\',
	'\r' : 'r',
	'\n' : 'n',
	'\u2028' : 'u2028',
	'\u2029' : 'u2029'
};
Slw.escaper = /\\|'|\r|\n|\u2028|\u2029/g;

Slw.escapeChar = function(match) {
	return '\\' + Slw.escapes[match];
};

Slw.template = function(text) {
	var settings = Slw.templateSettings;
	var matcher = RegExp([ (settings.interpolate || Slw.noMatch).source, (settings.evaluate || Slw.noMatch).source ].join('|') + '|$', 'g');
	
	var index = 0;
	var source = "var _t,_s='';\n";
	source += "try{\n_s+='";
	text.replace(matcher, function(match, interpolate, evaluate, offset) {
		source += text.slice(index, offset).replace(Slw.escaper, Slw.escapeChar);
		index = offset + match.length;
		
		if (interpolate) {
			source += "'+\n((_t=(" + interpolate + "))==null?'':_t)+\n'";
		}
		else if (evaluate) {
			source += "';\n" + evaluate + "\n_s+='";
		}
		return match;
	});
	source += "';\n}catch(e){_s=''}\n";
	source += 'return _s;\n';
	var render = new Function('data', 'index', source);
	var template = function(data, index) {
		return render.call(this, data, index);
	};
	template.source = 'function(data,index){\n' + source + '}';
	return template;
};
;
///<jscompress sourcefile="slw.validator.js" />
/**
 * Slw.Validator v1.0 2018.8 by CSS WangWeidong
 */
;
(function() {
	Slw.Validator = function() {
		this.checkMap = {
			'char' : {
				message : '只能输入字母',
				regExp : /^[A-Za-z]+$/
			},
			'chinese' : {
				message : '只能输入中文',
				regExp : /^[\u0391-\uFFE5]+$/
			},
			'number' : {
				message : '请输入合法的数字',
				regExp : /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
			},
			'numberAndStr' : {
				message : '只能输入字母和数字',
				regExp : /^[a-zA-Z0-9]+$/
			},
			'digits' : {
				message : '只能输入数字',
				regExp : /^\d+$/
			},
			'integer' : {
				message : '只能输入整数',
				regExp : /^[-\+]?\d+$/
			},
			'double' : {
				message : '请输入合法的浮点数',
				regExp : /^[-\+]?\d+(\.\d+)?$/
			},
			'email' : {
				message : '请输入正确格式的电子邮件',
				regExp : /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
			},
			'phone' : {
				message : '请输入合法的电话',
				regExp : /^\d{3,4}-?\d{7,9}$/
			},
			'mobile' : {
				message : '请输入合法的手机号',
				regExp : /^((\(\d{3}\))|(\d{3}\-))?(((13)|(15)|(18))+\d{9})$/
			},
			'color' : {
				message : '请输入有效的颜色值, 如#FFFFFF',
				regExp : /^#([0-9a-fA-F]{6})$/
			},
			'url' : {
				message : '请输入合法的网址',
				test : function(value) {
					return value.toLowerCase().indexOf("//localhost") != -1 || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
						.test(value);
				}
			},
			'date' : {
				message : '请输入合法的日期 ',
				test : function(value) {
					return !/Invalid|NaN/.test(new Date(value).toString());
				}
			},
			'dateISO' : {
				message : '请输入合法的日期 (ISO)',
				regExp : /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/
			},
			'zipCode' : {
				message : '请输入6位邮编',
				regExp : /^(\d{6})?$/
			},
			'ip' : {
				message : '请输入合法的IP地址',
				regExp : /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
			},
			'creditcard' : {
				message : '请输入合法的信用卡号 ',
				test : function(value) {
					if (/[^0-9 \-]+/.test(value)) {
						return false;
					}
					var nCheck = 0, nDigit = 0, bEven = false, n, cDigit;
					value = value.replace(/\D/g, "");
					if (value.length < 13 || value.length > 19) {
						return false;
					}
					for (n = value.length - 1; n >= 0; n--) {
						cDigit = value.charAt(n);
						nDigit = parseInt(cDigit, 10);
						if (bEven) {
							if ((nDigit *= 2) > 9) {
								nDigit -= 9;
							}
						}
						nCheck += nDigit;
						bEven = !bEven;
					}
					return (nCheck % 10) === 0;
				}
			},
			// 上述为检测的各种不同类型的输入，之后为独立检测的属性
			'required' : {
				message : '不能为空',
				regExp : /.+/
			},
			'minLength' : {
				message : '长度最小为：{0} ',
				test : function(value, param) {
					return $.trim(value).length >= param;
				}
			},
			'maxLength' : {
				message : '长度最大为：{0}',
				test : function(value, param) {
					return $.trim(value).length <= param;
				}
			},
			'min' : {
				message : '请输入一个最小为 {0} 的值 ',
				test : function(value, param) {
					return value >= param;
				}
			},
			'max' : {
				message : '请输入一个最大为 {0} 的值 ',
				test : function(value, param) {
					return value <= param;
				}
			}
		};
		this.checkKey = [ 'minLength', 'maxLength', 'min', 'max' ];
	}

	/**
	 * SlwGrid.Validator方法
	 */
	Slw.Validator.prototype = {
		check : function(option, value) {
			var type = 'required';
			var params = [];
			var ret = {
				result : true,
				message : ''
			};
			if (Slw.Utils.isnull(value))
				ret.result = !option.required;
			else {
				type = option.test;
				if ($.isFunction(option.test))
					ret.result = option.test(value);
				else if (option.test) {
					ret.result = this.test(option.test, value);
				}
				if (ret.result) {
					for (var i = 0; i < this.checkKey.length; i++) {
						type = this.checkKey[i];
						var param = option[type];
						if (param) {
							params.push(param);
							ret.result = this.checkMap[type].test(value, param);
							if (!ret.result) break;
						}
					}
				}
			}
			if (!ret.result) ret.message = this.message(type, option.message, params);
			return ret;
		},
		test : function(type, value) {
			var checkCfg = this.checkMap[type];
			if (checkCfg) {
				if ($.isFunction(checkCfg.test))
					return checkCfg.test(value);
				else
					return new RegExp(checkCfg.regExp).test(value);
			}
			return false;
		},
		message : function(type, msg, param) {
			if (msg) return msg;
			if ($.isFunction(type)) return '';
			var checkCfg = this.checkMap[type];
			if (checkCfg) return Slw.Format.format(checkCfg.message, param);
		}
	}
	Slw.Valid = new Slw.Validator();
})(jQuery);
;
///<jscompress sourcefile="slw.dict.js" />
/**
 * $jqdict Slw.Dictionary v1.1 2017.7 by CSS WangWeidong
 */
;
(function($) {
	Slw.Dictionary = function() {
		this.dictMap = {};
	}
	/**
	 * SlwGrid.Dictionary方法
	 */
	Slw.Dictionary.prototype = {
		getParam : function(dictArray) {
			var that = this;
			var arr = [];
			$(dictArray).each(function(i, item) {
				if (!(item in that.dictMap)) arr.push(item);
			});
			return arr;
		},
		getParamStr : function(dictArray) {
			var param = {};
			var arr = this.getParam(dictArray);
			param.dictArray = arr.join(",");
			return param;
		},
		initMap : function(dicts) {
			var map = {};
			$(dicts).each(function(i, item) {
				map[item.code] = item;
			});
			return map;
		},
		loadDict : function(dictArray, callback) {
			var that = this;
			var param = that.getParamStr(dictArray);
			if (Slw.Utils.isnull(param.dictArray)) {
				if (callback) callback.call(that);
				return;
			}
			$.post('loadDict.action', param, function(data) {
				switch (data.result) {
					case 0:
						for ( var key in data.msg)
							that.dictMap[key] = that.initMap(data.msg[key]);
						break;
					default:
						break;
				}
				if (callback) callback.call(that);
			}, 'json');
		},
		getDictList : function(table) {
			return this.dictMap[table];
		},
		getDictItem : function(table, key) {
			return this.dictMap[table][key];
		},
		/**
		 * <pre>
		 * $jqdict.put('dictKey', [
		 * 	{code : '1', name : '是', remark : ''},
		 * 	{code : '2', name : '否', remark : ''}]
		 * });
		 * </pre>
		 */
		put : function(key, dictItems) {
			this.dictMap[key] = this.initMap(dictItems);
		}
	}
	$jqdict = Slw.Dict = new Slw.Dictionary();
})(jQuery)
;
///<jscompress sourcefile="slw.menu.js" />
/**
 * SlwPlugins.SlwMenu v1.0 2018.7 by CSS WangWeidong
 */
;
(function() {
	$.fn.slwMenu = function(option) {
		var menu = new SlwPlugins.SlwMenu(this, option);
		menu.init();
		return menu;
	};
	
	SlwPlugins.SlwMenu = function(el, option) {
		this.defaults = {
			direction : 'horizontal', // vertical, horizontal
			url : null, // url非空则请求此url，返回上述json格式，如果为空则处理html代码片断
			methodType : 'POST', // url请求方式
			params : {}, // url请求额外参数
			className : [ 'slwMenu', 'slwMenu-ul', 'slwMenu-sub-ul' ], // div、菜单父级ul、子级ul样式，非默认值需用户自定义样式
			target : 'cssTab', // 超链接target
			overflow : 'hidden', // 宽度超长：'hidden'隐藏或'visible'换行
			borderWidth : '0px 0px 1px 0px', // 框线宽度设置
			moreThanOne : false, // 三级菜单是否一行显示多个
			separator : null, // 菜单项之间是否有分隔线
			width : 200, // 下拉菜单宽度
			menuHeight : 33, // 菜单工具条高度
			labelInline : true, // 标题与图标在一行显示
			labelClass : 'collapse75',// 分行显示样式
			iconColor : 'text', // 图标着色方式，'bg'背景着色,'text'文字着色
			activeOpen : false, // 就否开启菜单激活状态
			activeItem : null
		// 当前激活的菜单项
		};
		this.option = $.extend(this.defaults, option);
		this.object = $(el);
		this.ul;
		this.data = [];
		this.floatMenu = $('<div class="' + this.option.className[0] + 'FloatMenu" style="display: none"></div>');
		this.object.after(this.floatMenu);
		this.beforeEl = this.floatMenu[0];
	};
	/**
	 * json:
	 * [{"id":"","value":"","name":"","isLeaf":false,"icon":"","iconColor":"","path":"","child":[]}...]
	 */
	
	/**
	 * SlwPlugins.SlwMenu方法
	 */
	SlwPlugins.SlwMenu.prototype = {
		init : function() {
			var that = this;
			that.object.addClass(that.option.className[0]);
			if (that.option.labelInline == false) {
				that.object.addClass(that.option.labelClass);
			}
			that.object.attr('unselectable', 'on');
			that.object.attr('onselectstart', 'retrun false;');
			that.object.css('border-width', that.option.borderWidth);
			that.floatMenu.css({
				'width' : that.option.width + 'px',
			});
			if (that.option.url != null) {
				$.ajax({
					url : that.option.url,
					type : that.option.methodType,
					data : that.option.params,
					cache : false,
					success : function(content) {
						that.data = content;
						that.initData(that.data, that.object, false);
						that.initEvent();
					}
				});
			}
			else
				that.initEvent();
		},
		initEvent : function() {
			var that = this;
			that.ul = that.object.children("ul").eq(0);
			if (that.option.direction == 'horizontal') {
				that.ul.css({
					'height' : that.option.menuHeight + 'px'
				});
			}
			that.object.append(Slw.Element.clear);
			if (that.option.overflow != 'hidden') {
				that.ul.css({
					'overflow' : that.option.overflow
				});
			}
			
			if (that.option.separator != null) {
				that.object.find('.' + that.option.className[1] + ' li a').css({
					'border-right' : that.option.separator
				});
			}
			if (that.option.activeOpen == true) {
				if (that.option.activeItem != null) {
					that.ul.children('li').each(function() {
						if ($(this).find('a').attr('rel') == that.option.activeItem) {
							$(this).addClass('active');
							return false;
						}
					});
				}
				that.ul.children('li').on('click', function(e) {
					that.ul.children('li').removeClass('active');
					$(this).addClass('active');
				});
			}
			
			this.object.find('>ul>li>a').on('mousemove touchmove', function(e) {
				e.preventDefault();
				e.stopPropagation();
				$this = $(this);
				var $ul = $this.next()
				var $sub = that.floatMenu;
				var checkFlag = Slw.Event.checkHover(e, that.beforeEl);
				if (checkFlag) {
					that.unbindEvent();
					that.beforeEl = this;
					if ($ul.attr('class') == that.option.className[2]) {
						var $newUl = $('<ul class="' + that.option.className[1] + ' ' + that.option.className[2] + '">' + $ul.html() + '</ul>');
						$sub.html('');
						$sub.append($newUl);
						var $subUl = $newUl.find('ul');
						if ($subUl.length > 0) {
							$subUl.append(Slw.Element.clear);
							$subUl.after(Slw.Element.clear);
						}
						if (that.option.moreThanOne && $subUl.length > 0) {
							$subUl.addClass("moreThanOne");
						}
						$sub.find(that.option.className[2]).css({
							'display' : 'block'
						});
						var objLeft = that.object.offset().left;
						var objTop = that.object.offset().top;
						var left = $this.offset().left;
						var top = $this.position().top;
						var offset = 5;
						if (that.option.direction == 'horizontal') {
							left = left - objLeft + that.object.position().left;
							top = top + that.option.menuHeight;
							if (left + $sub.width() + offset > that.object.width()) left = that.object.width() - $sub.width() - offset;
						}
						else {// vertical
							offset = isIE ? 3 : 25;
							left = $this.position().left + that.object.width() + that.object.position().left;
							top = $this.offset().top - objTop + that.object.position().top;
							if (top + $sub.height() + offset > g_tabHeight) top = g_tabHeight - $sub.height() - offset;
						}
						$sub.css({
							left : left + 'px',
							top : top + 'px'
						});
						$sub.show();
						$(document).on('click', function() {
							that.hide();
						});
						
						$sub.on('mouseleave', function(e) {
							e.preventDefault();
							that.hide();
						});
					}
					else
						that.hide();
					
				}
			})
		},
		hide : function() {
			this.floatMenu.hide();
			this.unbindEvent();
			this.beforeEl = this.floatMenu[0];
		},
		unbindEvent : function() {
			this.floatMenu.unbind();
		},
		initData : function(dataArray, el, subFlag) {
			var that = this;
			/**
			 * [{"id":"","value":"","name":"","isLeaf":false,"icon":"","iconColor":"","path":"","child":[]}...]
			 */
			var $ul = $('<ul class="' + (subFlag ? that.option.className[2] : that.option.className[1]) + '">');
			el.append($ul);
			for (var i = 0; i < dataArray.length; i++) {
				var data = dataArray[i];
				var $a = $('<a></a>');
				var href = isnull(data.path) ? 'javascript:;' : data.path;
				$a.attr('href', href);
				$a.attr('rel', data.value);
				$a.attr('title', data.name);
				if (href.indexOf('javascript:') < 0 || href == 'javascript:;') {
					$a.attr('target', this.option.target);
				}
				if (data.icon) {
					var colorStyle = subFlag ? 'text' : that.option.iconColor;
					$a.append('<i class="' + data.icon + ' color' + colorStyle + ' ' + colorStyle + '-' + data.iconColor + '"></i>');
				}
				$a.append('<span class="menuLabel">' + data.name + '</span>');
				var $li = $('<li></li>');
				$li.append($a);
				$ul.append($li);
				if (!data.isLeaf) {
					this.initData(data.child, $li, true);
				}
			}
		}
	}
})(jQuery);
;
///<jscompress sourcefile="slw.file.js" />
(function($, window, undefined) {
	var iconMap = {};
	iconMap['accdb'] = 'accdb.png';
	iconMap['avi'] = 'avi.png';
	iconMap['bmp'] = 'bmp.png';
	iconMap['css'] = 'css.png';
	iconMap['docx'] = 'docx.png';
	iconMap['doc'] = 'docx.png';
	iconMap['dot'] = 'docx.png';
	iconMap['eml'] = 'eml.png';
	iconMap['eps'] = 'eps.png';
	iconMap['fla'] = 'fla.png';
	iconMap['gif'] = 'gif.png';
	iconMap['html'] = 'html.png';
	iconMap['ind'] = 'ind.png';
	iconMap['ini'] = 'ini.png';
	iconMap['jpeg'] = 'jpeg.png';
	iconMap['jpg'] = 'jpeg.png';
	iconMap['jsf'] = 'jsf.png';
	iconMap['midi'] = 'midi.png';
	iconMap['mov'] = 'mov.png';
	iconMap['mp3'] = 'mp3.png';
	iconMap['m4a'] = 'mpeg.png';
	iconMap['mpeg'] = 'mpeg.png';
	iconMap['mp4'] = 'mpeg.png';
	iconMap['pdf'] = 'pdf.png';
	iconMap['png'] = 'png.png';
	iconMap['ppt'] = 'pptx.png';
	iconMap['pptx'] = 'pptx.png';
	iconMap['proj'] = 'proj.png';
	iconMap['psd'] = 'psd.png';
	iconMap['pst'] = 'pst.png';
	iconMap['pub'] = 'pub.png';
	iconMap['rar'] = 'rar.png';
	iconMap['readme'] = 'readme.png';
	iconMap['settings'] = 'settings.png';
	iconMap['txt'] = 'txt.png';
	iconMap['tiff'] = 'tiff.png';
	iconMap['url'] = 'url.png';
	iconMap['vsd'] = 'vsd.png';
	iconMap['wav'] = 'wav.png';
	iconMap['wma'] = 'wma.png';
	iconMap['wmv'] = 'wmv.png';
	iconMap['xls'] = 'xlsx.png';
	iconMap['xlsx'] = 'xlsx.png';
	iconMap['zip'] = 'zip.png';
	
	Slw.File = {
		sizeUnit : [ 'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ],
		toFileSize : function(value) {
			var size = {
				value : 0,
				unit : 'B'
			};
			if (value && value >= 0) {
				var i = Math.floor(Math.log(value) / Math.log(1024));
				size.value = Slw.Format.toFixed(value / Math.pow(1024, i), 2) * 1;
				size.unit = Slw.File.sizeUnit[i];
			}
			return size;
		},
		getFileSize : function(value) {
			if (value && value >= 0) {
				var i = Math.floor(Math.log(value) / Math.log(1024));
				return (value / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + Slw.File.sizeUnit[i];
			}
			return '';
		},
		getFileName : function(file) {
			return file.replace(/.*(\/|\\)/, "");
		},
		getFileExt : function(fileName) {
			if (fileName.indexOf('.') < 0) return '';
			return fileName.toLowerCase().split('.').pop();
		},
		getFullName : function(data) {
			var fullName = data.fileName;
			if (!isnull(data.fileExt)) fullName += '.' + data.fileExt;
			return fullName;
		},
		getIcon : function(ext) {
			var icon = iconMap[ext];
			return (icon) ? icon : 'other.png'
		},
		getIconImg : function(size, ext) {
			return '<img src="cssui/plugins/cssuploader/images/' + size + '/' + Slw.File.getIcon(ext) + '" class="file-icon" />';
		},
		checkExt : function(ext, okFile) { // ('jpg', 'jpg,doc,rar')
			var rgx = '(' + okFile.replace(/(,)/g, '|') + ')$';
			var re = new RegExp(rgx, 'i');
			return re.test(ext);
		}
	};
	$.file = Slw.File;
	
})(jQuery, this);
;
///<jscompress sourcefile="slw.input-2.0.js" />
///<jscompress sourcefile="slw.tree.js" />
/**
 * SlwPlugins.SlwTree v1.0 2018.9 by CSS WangWeidong
 */
;
(function() {
	$.fn.slwTree = function(option) {
		var tree = new SlwPlugins.SlwTree(this, option);
		tree.init();
		return tree;
	};
	SlwPlugins.SlwTree = function(input, option) {
		var that = this;
		this.input = $(input);
		this.contentView = $('<div class="ac"></div>');
		this.treeView = $('<ul id="' + Slw.Utils.uuid() + '"class="ztree"></ul>');
		this.treeObj;
		
		this.defaults = {
			path : 'cssui/plugins/jqinput/images/', // downarrow.gif uparrow.gif
			debug : false,
			sortable : false,
			hideFlag : false,
			cssStyle : '',
			curNodeId : '',
			height : 200,
			width : 0,
			onClick : function(e, treeId, treeNode) {
				that.setValue(treeNode.value);
				that.setLabel(treeNode.name);
				that.hideMenu();
			},
			onLoad : function() {
				var value = that.input.val();
				var item = that.getNode(value);
				if (item) that.setLabel(item.name);
			}
		};
		this.option = $.extend(this.defaults, option);
		this.windowHeight = 500;
		this.showFlag = false;
	}
	/**
	 * SlwTree方法
	 */
	SlwPlugins.SlwTree.prototype = {
		init : function() {
			this.windowHeight = Slw.Utils.isnull(g_tabHeight) ? $(window).height() : g_tabHeight;
			this.initView();
			this.treeObj = this.treeView.jqztree('', this.option);
			this.initEvent();
		},
		initView : function() {
			var that = this;
			if (!that.option.debug) that.input.hide();
			that.inputView = $('<a href="javascript:void(0);"' + (that.option.hideFlag ? ' style="display:none"' : '') + ' class="form-control ac-select">　</a>');
			
			if (that.option.cssStyle != '') {
				this.inputView.addClass(that.option.cssStyle);
			}
			
			that.input.after(that.inputView);
			that.inputView.after(that.contentView);
			that.contentView.append(that.treeView);
			that.arrow('down');
		},
		initEvent : function() {
			var that = this;
			that.inputView.on('click', function(e) {
				that.initShow();
			});
		},
		initShow : function() {
			var that = this;
			if (that.showFlag != true) {
				that.showFlag = true;
				if (Slw.Utils.isIE() && Slw.Utils.ieVersion() < 8) {
					width -= 2;
				}
				var height = that.option.height;
				var width = that.getWidth();
				var left = that.inputView.position().left;
				var objLeft = that.inputView.offset().left;
				if (objLeft + width > $(window).width()) {
					left = left + that.inputView.outerWidth() - width;
				}
				var top = that.inputView.position().top + that.inputView.outerHeight();
				
				if (top + height > that.windowHeight) {
					top = that.inputView.position().top - height;
				}
				that.contentView.css({
					left : left + 'px',
					top : top + 'px',
					width : width + 'px',
					height : height + 'px'
				});
				that.treeView.css('height', that.contentView.height() + 'px');
				that.contentView.slideDown("fast");
				that.arrow('up');
				$("body").bind("mousedown.slwTree", function(e) {
					e.stopPropagation();
					e.preventDefault();
					var checkFlag = !(Slw.Event.onElement(e, that.treeView[0]) || Slw.Event.onElement(e, that.inputView[0]))
					if (checkFlag) {
						that.hideMenu();
					}
				});
				
				that.getNode(that.input.val());
			}
			else
				that.hideMenu();
		},
		getWidth : function() {
			return this.option.width > 0 ? this.option.width : this.inputView.outerWidth();
		},
		arrow : function(dir) {
			this.inputView.css('background-image', 'url(' + this.option.path + dir + 'arrow.gif)');
		},
		show : function(pos) {
			if (pos) {
				this.inputView.css({
					left : pos.left + 'px',
					top : pos.top + 'px',
					width : pos.width + 'px',
					height : pos.height + 'px',
					position : 'absolute',
					display : 'block'
				});
				this.inputView.focus();
				this.initShow();
			}
		},
		getNode : function(value) {
			return this.treeObj.focus(value);
		},
		find : function(key, value) {
			return this.treeObj.find(key, value);
		},
		setLabel : function(value) {
			this.inputView.html(value);
		},
		setValue : function(value) {
			this.input.val(value);
		},
		hideMenu : function() {
			this.showFlag = false;
			$('body').unbind('mousedown.slwTree');
			this.contentView.hide();
			this.arrow('down');
		},
		hide : function() {
			this.hideMenu();
			this.inputView.hide();
		}
	}

})(jQuery);
;
///<jscompress sourcefile="slw.complete.js" />
/**
 * SlwPlugins.SlwComplete v1.0 2017.10 by CSS WangWeidong
 */
;
(function() {
	$.fn.slwComplete = $.fn.jqComplete = function(option) {
		var list = new SlwPlugins.SlwComplete(this, option);
		list.init();
		return list;
	};
	SlwPlugins.SlwComplete = function(input, opt) {
		this.defaults = {
			path : 'cssui/plugins/jqinput/images/', // downarrow.gif uparrow.gif
			// data
			data : [], // array, string, function
			dataFilter : null, // function
			dataFormat : null, // 自定义数据格式化
			// style
			width : 'auto', // number, string 'auto'
			maxHeight : null, // number
			autoHeight : true, // 高度自适应，对于查询时，高度通常会随内容变化所以应设成true
			cssStyle : '', // border css style
			listStyle : 'normal', // 'normal', 'iconList', 'custom'
			createItemHandler : null, // function
			listClass : 'ac',
			selectInput : false,
			selectInputQuery : true,
			selectMultiple : false,
			maxItems : 0, // number
			// ajax
			ajaxDataType : 'json', // string 'json' or 'xml', 'dict'
			ajaxParams : {}, // function, string, object
			ajaxTimeout : 3000, // number
			ajaxType : 'GET', // string 'GET' or 'POST'
			// event
			afterDrawHandler : null, // function
			afterSelectedHandler : null, // function
			newTagHandler : null, // function
			onClose : null, // 单击事件自定义
			// debug
			onerror : function(msg) {
				alert(msg);
			}
		};
		this.option = $.extend(this.defaults, opt);
		this.loadDataFlag = false;
		this.data = [];
		this.dataSrc = [];
		this.input = $(input);
		this.showFlag = false;
		this.cancelBlur = false;
		this.curIndex = -1;
		this.beforeIndex = -1;
		this.selectIndex = -1;
		this.selectShift = false;
		this.selectCtrl = false;
		this.allFlag = true;
		this.windowHeight = 500;
		
	}

	/**
	 * SlwComplete方法
	 */
	SlwPlugins.SlwComplete.prototype = {
		init : function() {
			this.windowHeight = Slw.Utils.isnull(g_tabHeight) ? $(window).height() : g_tabHeight;
			this.initView();
			this.initEvent();
		},
		initView : function() {
			var that = this;
			that.searchView = $('<div class="' + that.option.listClass + '"></div>');
			if (that.option.selectInput == true) {
				that.inputView = $('<input class="ac-input" type="text"/>');
				that.inputContainer = $('<div class="ac-input-container"></div>').append(this.inputView)
				that.searchView.append(that.inputContainer);
				if (that.option.selectInputQuery == false) {
					that.inputContainer.css({
						"position" : "absolute",
						"display" : "",
						'width' : "0px",
						'height' : "0px",
						"z-index" : -100,
						"opacity" : 0
					});
				}
			}
			else
				that.inputView = that.input;
			that.ul = $("<ul></ul>");
			that.searchView.append(that.ul);
			that.input.after(that.searchView);
			that.arrow('down');
			if (that.option.cssStyle != '') {
				that.input.css(that.option.cssStyle);
			}
		},
		initEvent : function() {
			var that = this;
			that.input.on('click', function(e) {
				that.initShow();
			});
			
			// disable IE's auto complete feature
			that.inputView.attr('autocomplete', 'off')
			that.inputView.keydown(function(event) {
				// console.log('down2: ' + event.keyCode);
				switch (event.keyCode) {
					case 16:// shift
						that.selectShift = true;
						break;
					case 38: // up
					case 40: // down
						// 8.21
						event.stopPropagation();
						event.preventDefault();
						
						that.move(event.keyCode);
						break;
					case 13: // enter
						event.stopPropagation();
						event.preventDefault();
						that.select();
						break;
					case 17:// Ctrl
						that.selectCtrl = true;
						break;
					case 65:// ctrl+A 全选
						that.selectAll();
						break;
					break;
				case 9:// tab
				case 27: // esc
					that.hide();
					break;
			}
		})	;
			
			that.inputView.keyup(function(event) {
				// console.log('up2: ' + event.keyCode);
				switch (event.keyCode) {
					case 16:// shift
						that.selectShift = false;
						break;
					case 17:// shift
						that.selectCtrl = false;
						break;
					case 13: // enter
					case 38: // up
					case 40: // down
						break;
					case 9:// tab
					case 27: // esc
						that.hide();
						break;
					default:
						if (event.keyCode == 65 && that.selectCtrl)
							that.allFlag = !that.allFlag;
						else
							that.search();
				}
			});
			
			that.searchView.on('mouseenter', 'li', function() {
				that.searchView.find("li.selected").removeClass("selected");
				$(this).addClass('selected');
			}).on('mouseleave', 'li', function() {
				$(this).removeClass('selected');
			}).on('mousedown', 'li', function(e) {
				e.stopPropagation();
				e.preventDefault();
				that.select($(this));
			});
			
			that.inputView.blur(function(e) {
				if (that.cancelBlur)
					that.cancelBlur == false;
				else
					that.blurHide();
			});
			
		},
		extraEvent : function() {
			var that = this;
			that.input.keydown(function(event) {
				// console.log('down: ' + event.keyCode);
				switch (event.keyCode) {
					case 13: // enter
						event.stopPropagation();
						event.preventDefault();
						that.initShow();
						break;
				}
			});
			that.input.keyup(function(event) {
				// console.log('up: ' + event.keyCode);
				switch (event.keyCode) {
					case 13: // enter
						event.stopPropagation();
						event.preventDefault();
						break;
					case 37: // left
					case 39: // right
					case 38: // up
					case 40: // down
						// that.initShow();
						break;
				}
			});
		},
		initShow : function() {
			var that = this;
			if (that.option.selectInput == true) that.inputView.val('');
			that.showFlag = !that.showFlag;
			if (that.showFlag == true) {
				that.search();
				that.cancelBlur = true;
				$(window).on('resize.jqComplete', function(e) {
					that.show();
				});
				$(document).on('mousedown.jqComplete', function(e) {
					e.stopPropagation();
					e.preventDefault();
					that.cancelBlur = true;
					if (!$.contains(that.searchView[0], e.target) && !that.searchView.is(e.target)) {
						if (that.input.is(e.target) || $.contains(that.input[0], e.target))
							that.cancelBlur = true;
						else {
							that.cancelBlur = false;
							that.inputView.blur();
						}
					}
				});
				that.moveToActive();
				that.inputView.focus();
			}
			else
				that.hide();
		},
		hide : function() {
			this.blurHide();
			this.input.focus();
			if ($.isFunction(this.option.onClose)) {
				this.option.onClose.apply(this);
			}
		},
		blurHide : function() {
			$(document).unbind('mousedown.jqComplete');
			$(window).unbind('resize.jqComplete');
			this.showFlag = false;
			this.searchView.hide();
			this.arrow('down');
		},
		select : function(li) {
			var that = this;
			if (!(li instanceof jQuery)) li = that.searchView.find('li.selected');
			if (li.length > 0) {
				var item = li.data('data');
				if (that.option.selectInput == false) { // 非select组件
					if (li.size()) that.inputView.val(item.text);
					this.hide();
				}
				else {
					if (that.option.selectMultiple == true) // 多选
						that.selectMultiple(li);
					else { // 单选
						that.selectSingle(li);
					}
				}
				that.selectIndex = li.index();
				if (that.option.selectMultiple == false) that.afterSelected(item);
				that.beforeIndex = item.index;
			}
			if ($.isFunction(that.option.newTagHandler)) {
				that.option.newTagHandler.apply(that, [ li.length, that.inputView ]);
			}
		},
		afterSelected : function(item) {
			var that = this;
			if ($.isFunction(that.option.afterSelectedHandler)) {
				that.option.afterSelectedHandler.apply(that, [ item, that.beforeIndex ]);
			}
		},
		selectAll : function() {
			var that = this;
			if (that.option.selectMultiple && that.selectCtrl) {
				that.searchView.find('li').each(function() {
					that.selectItem($(this), that.allFlag);
				});
			}
		},
		selectSingle : function(li) {
			var that = this;
			var item = li.data('data');
			if (typeof (that.data[item.index].selected) == "undefined" || that.data[item.index].selected == false) {
				if (that.curIndex >= 0 && that.data.length > that.curIndex) {
					that.data[that.curIndex].selected = false;
				}
				that.data[item.index].selected = true;
				that.curIndex = item.index;
			}
			that.hide();
		},
		selectMultiple : function(li) {
			var that = this;
			var startIndex, endIndex = li.index();
			if (that.selectShift && that.selectIndex != -1 && that.selectIndex != endIndex) {
				// shift 连选
				if (endIndex > that.selectIndex)
					startIndex = that.selectIndex;
				else {
					startIndex = endIndex;
					endIndex = that.selectIndex;
				}
				var startLi = that.searchView.find('li').eq(that.selectIndex);
				var startLiSelected = startLi.hasClass('active')
				for (var index = startIndex; index <= endIndex; index++) {
					var tmpLi = that.searchView.find('li').eq(index);
					that.selectItem(tmpLi, startLiSelected);
				}
			}
			else { // 选中与取消选中切换
				that.selectItem(li, !li.hasClass('active'));
			}
		},
		selectItem : function(li, selected) {
			var that = this;
			var item = li.data('data');
			item.selected = selected;
			that.data[item.index] = item;
			li.data('data', item);
			if (item.selected == true)
				li.addClass('active');
			else
				li.removeClass('active');
			that.afterSelected(item);
		},
		loadData : function() {
			var that = this;
			if (!that.loadDataFlag) {
				if ($.isArray(that.option.data)) {
					that.data = that.option.data.concat();
				}
				else if ($.isFunction(that.option.data)) {
					that.data = that.option.data();
				}
				else if (typeof (that.option.data) === 'string') {
					if (that.option.ajaxDataType == 'dict') {
						var dict = Slw.Dict.getDictList(that.option.data);
						var index = 0;
						$.each(dict, function(key, item) {
							var tmp = {
								'label' : item.name,
								'text' : item.remark,
								'value' : item.code,
								'index' : index
							};
							that.data[index] = tmp;
							index++;
						});
					}
					else {
						try {
							that.data = that.ajaxSend();
						} catch (e) {
							that.error('ajax error: ' + e);
							return;
						}
					}
				}
				else {
					that.error('data error！');
					return;
				}
				that.formatJson();
				if ($.isFunction(that.option.dataFilter)) that.dataSrc = that.data.concat();
				that.loadDataFlag = true;
			}
			if ($.isFunction(that.option.dataFilter)) {
				that.data = that.option.dataFilter.apply(that, [ that.dataSrc ]);
				that.reIndex();
			}
		},
		reIndex : function() {
			var that = this;
			$.each(that.data, function(index, item) {
				item.index = index;
			});
		},
		refreshSelect : function() {
			var that = this;
			$.each(that.data, function(index, item) {
				item.selected = false;
			});
		},
		dataFormat : function(item) {
			if (!item.text) item.text = item.label
		},
		inArray : function(value) {
			var i = -1;
			var that = this;
			that.loadData();
			$.each(that.data, function(index, item) {
				if (item.value + '' == value + '') {
					i = index;
					return false;
				}
			});
			return i;
		},
		formatJson : function() {
			// if (this.option.ajaxDataType == 'dict') return;
			var that = this;
			var tmp;
			$.each(that.data, function(index, item) { // value必须有
				if ($.isPlainObject(item)) {
					item.index = index;
					if ($.isFunction(that.option.dataFormat)) {
						that.option.dataFormat.apply(that, [ item ]);
					}
					else
						that.dataFormat(item);
				}
				else if (typeof (item) === 'string') {
					tmp = {
						'label' : item,
						'text' : item,
						'value' : item,
						'index' : index
					};
					that.data[index] = tmp;
				}
			});
		},
		ajaxSend : function() {
			jQuery.support.cors = true;
			var that = this, data = [], ajaxOption = {
				'async' : false,
				'dataType' : that.option.ajaxDataType,
				'type' : that.option.ajaxType,
				'timeout' : that.option.ajaxTimeout,
				'data' : that.option.ajaxParams,
				'success' : function(theData, textStatus, jqXHR) {
					if (that.option.ajaxDataType === 'xml') {
						$(theData).find('item').each(function() {
							var item = {};
							for (var i = 0; i < this.attributes.length; i++) {
								var key = this.attributes[i].nodeName, value = this.attributes[i].nodeValue;
								item[key] = value;
							};
							if (!item.value) item.value = $(this).text();
							if (!item.text) item.text = $(this).text();
							if (!item.label) item.label = $(this).text();
							data.push(item);
						});
					}
					else if (that.option.ajaxDataType === 'json') {
						data = theData;
					}
					else {
						throw 'ajaxDataType error！';
					}
				},
				'error' : function(jqXHR, textStatus, errorThrown) {
					throw errorThrown;
				}
			};
			$.ajax(that.option.data, ajaxOption);
			return data;
		},
		getWidth : function() {
			if (typeof (this.option.width) === 'number') {
				return this.option.width;
			}
			else if (typeof (this.option.width) === 'string' && this.option.width.toLowerCase() === 'auto') {
				return this.input.outerWidth();
			}
		},
		move : function(dir) {// dir: 38 up, 40 down
			var selected = this.ul.find('li.selected');
			if (selected.size())
				var nextSelected = dir === 38 ? selected.prev() : selected.next();
			else
				var nextSelected = dir === 38 ? this.ul.find('li').last() : this.ul.find('li').first();
			
			if (nextSelected.size()) {
				this.ul.find('li').removeClass('selected');
				nextSelected.addClass("selected");
				this.moveTo(nextSelected);
			}
		},
		moveToActive : function() {
			var active = this.ul.find('li.active').first();
			this.moveTo(active);
		},
		moveTo : function(el) {
			if (el.length > 0) {
				var itemHeight = el.outerHeight();
				var itemTop = el.position().top - this.ul.position().top;
				if (itemHeight + itemTop > this.ul.height())
					this.ul.scrollTop(this.ul.scrollTop() + itemTop + itemHeight - this.ul.height());
				else if (itemTop < 0) this.ul.scrollTop(this.ul.scrollTop() + itemTop);
			}
		},
		show : function() {
			if (this.option.maxHeight == null || this.option.autoHeight == true) {
				this.searchView.css('height', 'auto');
				this.ul.css('height', 'auto');
			}
			
			if (this.option.maxHeight > 0) {
				this.searchView.css('max-height', this.option.maxHeight + 'px');
				if (isIE6 || isIE7 || isIE8 || isIE9) {
					var tmpHeight = (this.searchView.height() > this.option.maxHeight ? this.option.maxHeight + 'px' : 'auto')
					this.searchView.css('height', tmpHeight);
					this.ul.css('height', tmpHeight);
				}
			}
			
			var width = this.getWidth();
			if (isIE6 || isIE7) {
				width -= 2;
				if (this.option.selectInput == true) this.inputContainer.css('width', width - 18 + 'px');
			}
			var height = this.searchView.height() + 3;
			this.ul.css('height', (this.searchView.height() - (this.option.selectInput == true && this.option.selectInputQuery == true ? 37 : 0)) + 'px');
			
			var left = this.input.position().left;
			var top = this.input.position().top + this.input.outerHeight();
			
			if (top + height > this.windowHeight) {
				top = this.input.position().top - height;
			}
			this.searchView.css({
				left : left + 'px',
				top : top + 'px',
				width : width + 'px',
				height : height + 'px',
				display : 'block'
			});
			this.arrow('up');
			
		},
		arrow : function(dir) {
			if (this.option.selectInput == true && this.option.selectMultiple == false) {
				this.input.css('background-image', 'url(' + this.option.path + dir + 'arrow.gif)');
			}
		},
		search : function() {
			var that = this;
			that.loadData();
			that.selectIndex = -1;
			var keyword = this.inputView.val();
			var result = [];
			$.each(this.data, function(index, item) {
				if (that.option.maxItems > 0 && result.length >= that.option.maxItems) return false;
				item.label = item.text;
				if ($.trim(keyword).length == 0) {
					result.push(item);
				}
				else {
					if (that.match(keyword, item)) {
						result.push(item);
					}
				}
			});
			that.draw(result);
			that.show();
		},
		draw : function(result) {
			var that = this;
			var container = this.searchView.find('ul').empty();
			$.each(result, function(index, item) {
				var li = $('<li></li>').appendTo(container).data("data", item);
				var elDiv = $("<div></div>").appendTo(li);
				switch (that.option.listStyle) {
					case 'iconList':
						var img = $("<img></img>").attr('src', item.image);
						elDiv.append($("<span></span>").append(img)).append("<span>" + item.label + "</span>");
						break;
					case 'custom':
						elDiv.append(that.option.createItemHandler.apply(that, [ index, item ]));
						break;
					case 'normal':
					default:
						elDiv.append("<span>" + item.label + "</span>");
						break;
				}
				
				if ($.isFunction(that.option.afterDrawHandler)) {
					that.option.afterDrawHandler.apply(that, [ li, item ]);
				}
			});
		},
		match : function(keyword, data) {
			var regex = RegExp(keyword.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), 'i');
			var ret = regex.test(data.text);
			this.highlight(keyword, data);
			return ret;
		},
		highlight : function(keyword, data) {
			data.label = data.text;
			var regex = RegExp("(" + keyword.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1") + ")", 'ig');
			data.label = data.label.replace(regex, "<em>$1</em>");
		},
		error : function(msg) {
			if ($.isFunction(this.option.onerror)) {
				this.option.onerror.apply(this, [ msg ]);
			}
		}
	}
})(jQuery);
;
///<jscompress sourcefile="slw.select.js" />
/**
 * SlwPlugins.SlwSelect v1.0 2017.10 by CSS WangWeidong
 */
;
(function() {
	$.fn.slwSelect = $.fn.jqSelect = function(option) {
		var select = new SlwPlugins.SlwSelect(this, option);
		select.init();
		return select;
	};
	SlwPlugins.SlwSelect = function(input, option) {
		this.input = $(input);
		this.defaults = {
			maxItems : 0,
			selectInput : true,
			selectInputQuery : true,
			selectMultiple : false,
			separator : ',',
			onClick : null, // 单击事件自定义
			onClose : null, // 状态下拉框事件自定义
			onChange : null, // 选项变化事件自定义
			onLoad : null,// 数据加载完成事件自定义
			debug : false,
			cssStyle : '',
			hideFlag : false
		};
		this.option = $.extend(this.defaults, option);
		this.option.selectMultiple = this.input.prop('multiple');
		this.option.selectMultiple = !(typeof (this.option.selectMultiple) == "undefined" || this.option.selectMultiple == false);
		this.data = [];
		this.selectObj = null;
		this.inputCtrl = false;
	}
	/**
	 * SlwSelect方法
	 */
	SlwPlugins.SlwSelect.prototype = {
		init : function() {
			this.initView();
			this.initExec();
			this.selectObj.extraEvent();
		},
		show : function(pos) {
			if (pos) {
				this.inputView.css({
					left : pos.left + 'px',
					top : pos.top + 'px',
					width : pos.width + 'px',
					height : pos.height + 'px',
					position : 'absolute',
					display : 'block'
				});
				this.inputView.focus();
				this.selectObj.refreshSelect();
				this.initInputTag();
			}
			else {
				this.inputView.show();
			}
		},
		hide : function() {
			this.inputView.hide();
			this.selectObj.hide();
		},
		initView : function() {
			var that = this;
			if (!that.option.debug) that.input.hide();
			that.inputView = $('<a href="javascript:void(0);"' + (that.option.hideFlag ? ' style="display:none"' : '') + ' class="form-control ac-select"></a>');
			
			if (that.option.cssStyle != '') {
				this.inputView.addClass(that.option.cssStyle);
			}
			
			that.input.after(that.inputView);
			if (that.option.selectMultiple) {
				that.multiUl = $('<ul></ul>').appendTo(that.inputView);
			}
			else {
				that.setLabel('');
			}
		},
		loadData : function() {
			var that = this;
			var options = that.input.find('option');
			var index = 0;
			$.each(options, function(index, el) {
				var item = {
					'value' : $(el).val(),
					'label' : $(el).text(),
					'text' : $(el).text(),
					'index' : index
				};
				item.selected = $(el).prop('selected');
				if (item.selected) that.addItem(item);
				that.data.push(item);
			});
		},
		refreshCtrl : function(item) {
			var that = this;
			var tags = [];
			if (that.inputCtrl == true) {
				that.inputView.find('li').each(function() {
					var data = $(this).data('data');
					tags.push(data.value);
				});
				that.input.val(tags.join(that.option.separator));
			}
			else
				that.input.find('option[value="' + item.value + '"]').prop("selected", item.selected);
		},
		addItem : function(item) {
			var that = this;
			item.selected = true;
			if (that.option.selectMultiple) {
				if (that.inputView.find('#index_' + item.index).length < 1) {
					var li = $('<li class="ac-choice" id="index_' + item.index + '"></li>').appendTo(that.multiUl);
					var span = $('<span class="ac-choice-remove">×</span>').appendTo(li);
					li.append(item.text);
					li.data('data', item);
					span.one('click', function(e) {
						e.stopPropagation();
						e.preventDefault();
						li.remove();
						that.selectObj.hide();
						item.selected = false;
						that.refreshCtrl(item);
					});
				}
			}
			else
				that.setLabel(item.label);
		},
		setLabel : function(value) {
			this.inputView.html(value + '&nbsp;');
		},
		initInputTag : function() {
			var that = this;
			if (that.inputCtrl == true) {
				if (that.option.selectMultiple) {
					var tags = that.input.val().split(that.option.separator);
					$.each(tags, function(i, tag) {
						if (!isnull(tag.trim())) {
							var index = that.selectObj.inArray(tag);
							if (index >= 0) that.addItem(that.selectObj.data[index]);
						}
					});
				}
				else {
					var curItem = null;
					if (that.input.val() == '') {
						that.dispPlaceholder();
					}
					else {
						var index = that.selectObj.inArray(that.input.val());
						if (index >= 0) {
							that.setLabel(that.selectObj.data[index].text);
							that.selectObj.data[index].selected = true;
							curItem = that.selectObj.data[index];
						}
						else {
							that.dispPlaceholder();
						}
					}
					if ($.isFunction(that.option.onLoad)) {
						that.option.onLoad.apply(that, [ curItem ]);
					}
				}
			}
			
		},
		dispPlaceholder : function() {
			var placeholder = this.input.attr('placeholder');
			if (typeof (placeholder) == 'undefined') placeholder = '';
			this.setLabel('<span class="placeholder-text">' + placeholder + '</span>')
		},
		refreshData : function(data, defaultValue) {
			this.selectObj.option.data = data;
			this.refresh(defaultValue);
		},
		refresh : function(defaultValue) {
			this.selectObj.loadDataFlag = false;
			if (typeof (defaultValue) == "undefined") defaultValue = '';
			this.input.val(defaultValue);
			this.selectObj.loadData();
			this.initInputTag();
		},
		initExec : function() {
			var that = this;
			if (typeof (that.option.data) == "undefined")
				that.loadData();
			else
				that.inputCtrl = true;
			
			var opt = $.extend({
				data : that.data,
				afterDrawHandler : function(li, item) {
					if (that.option.selectInput && item.selected) {
						that.selectObj.curIndex = item.index;
						if (that.selectObj.searchView.find('li.selected').length < 1) li.addClass("selected");
						li.addClass("active");
					}
				},
				afterSelectedHandler : function(item, beforeIndex) {
					if (that.option.selectMultiple) {
						if (item.selected)
							that.addItem(item);
						else
							that.inputView.find('#index_' + item.index).remove();
						that.refreshCtrl(item);
						that.selectObj.show();
					}
					else {
						that.input.val(item.value);
						that.setLabel(item.text);
					}
					if (item.index != beforeIndex && $.isFunction(that.option.onChange)) {
						that.option.onChange.apply(that, [ item ]);
					}
					
					if ($.isFunction(that.option.onClick)) {
						that.option.onClick.apply(that, [ item ]);
					}
				}
			}, that.option);
			that.selectObj = that.inputView.jqComplete(opt);
			that.initInputTag();
		}
	}

})(jQuery);
;
///<jscompress sourcefile="slw.tag.js" />
/**
 * SlwPlugins.SlwTag v1.0 2017.10 by CSS WangWeidong
 */
;
(function() {
	$.fn.slwTag = $.fn.jqTag = function(option) {
		var tag = new SlwPlugins.SlwTag(this, option);
		tag.init();
		return tag;
	};
	SlwPlugins.SlwTag = function(input, option) {
		this.input = $(input);
		this.defaults = {
			separator : ',',
			maxItems : 0,
			selectInput : true,
			selectInputQuery : true,
			selectMultiple : true,
			ignoreCase : true,
			newTagAllowed : true,
			debug : false
		};
		this.option = $.extend(this.defaults, option);
		this.tags = [];
		this.tagsLowerCase = [];
		this.selectObj = null;
	}
	/**
	 * SlwTag方法
	 */
	SlwPlugins.SlwTag.prototype = {
		init : function() {
			this.initView();
			this.initExec();
			this.selectObj.extraEvent();
		},
		initView : function() {
			var that = this;
			if (!that.option.debug) that.input.hide();
			that.inputView = $('<a href="javascript:void(0);" class="form-control ac-select"></a>');
			that.input.after(that.inputView);
			that.multiUl = $('<ul></ul>').appendTo(that.inputView);
		},
		refreshTags : function() {
			var that = this;
			that.tags = [];
			that.tagsLowerCase = [];
			that.inputView.find('li').each(function() {
				that.tags.push($(this).attr('tagValue'));
				that.tagsLowerCase.push($(this).attr('tagValue').toLowerCase());
			});
			that.input.val(that.tags.join(that.option.separator));
		},
		existTag : function(tag) {
			this.refreshTags();
			return this.option.ignoreCase ? $.inArray(tag.toLowerCase(), this.tagsLowerCase) >= 0 : $.inArray(tag, this.tags) >= 0;
		},
		initTag : function() {
			var that = this;
			var tags = that.input.val().split(that.option.separator);
			$.each(tags, function(index, tag) {
				if (!isnull(tag.trim())) that.addTag(tag);
			});
		},
		dealTag : function(tag) {
			return this.option.ignoreCase ? tag.toLowerCase() : tag;
		},
		addTag : function(tag) {
			var that = this;
			if (!that.existTag(tag)) {
				var li = $('<li class="ac-choice"></li>').appendTo(that.multiUl);
				var span = $('<span class="ac-choice-remove">×</span>').appendTo(li);
				li.append(tag);
				li.attr('tagValue', tag);
				li.attr('ignoreValue', that.dealTag(tag));
				that.refreshTags();
				span.one('click', function(e) {
					e.stopPropagation();
					e.preventDefault();
					li.remove();
					that.selectObj.hide();
					that.refreshTags();
				});
			}
		},
		delTag : function(tag) {
			this.inputView.find('li[ignoreValue="' + this.dealTag(tag) + '"]').remove();
		},
		initExec : function() {
			var that = this;
			var opt = $.extend({
				afterDrawHandler : function(li, item) {
					if (that.existTag(item.value)) li.addClass("active");
				},
				afterSelectedHandler : function(item, beforeIndex) {
					if (item.selected)
						that.addTag(item.value);
					else
						that.delTag(item.value);
					that.refreshTags();
					that.selectObj.show();
				},
				newTagHandler : function(size, inputEl) {
					if (that.option.newTagAllowed) {
						if (size < 1) {
							var tag = inputEl.val();
							if (!isnull(tag.trim())) that.addTag(tag);
						}
						inputEl.val('');
					}
				}
			}, that.option);
			that.selectObj = that.inputView.jqComplete(opt);
			that.initTag();
		}
	}

})(jQuery);
;
///<jscompress sourcefile="slw.cascadestep.js" />
/**
 * SlwPlugins.SlwCascadeStep v1.0 2018.7 by CSS WangWeidong
 */
;
(function() {
	SlwPlugins.SlwCascadeStep = function(elmentArray, option) {
		this.elmentArray = elmentArray;
		this.defaults = {
			url : '',
			data : [],
			ajaxDataType : 'json',
			maxHeight : 300,
			dataFormat : function(item) {
				item.label = item.name;
				item.text = item.name;
			},
			objectIndex : '',
			objectId : ''
		};
		this.option = $.extend(this.defaults, option);
		this.object;
		this.cacheData = {};
		var index = this.option.url.lastIndexOf("=");
		this.urlPath = this.option.url.substring(0, index + 1);
		this.option.objectId = this.option.url.substring(index + 1);
		
	};
	/**
	 * SlwCascadeStep方法
	 */
	SlwPlugins.SlwCascadeStep.prototype = {
		init : function() {
			var that = this;
			that.object = new Array(that.elmentArray.length);
			for (var i = that.elmentArray.length - 1; i >= 0; i--) {
				
				var objOption = $.extend(true, {}, that.option);
				objOption.objectIndex = i;
				// 每个都有onLoad事件，处理缓存
				objOption.onLoad = function(item) {
					that.loadUrl(this, item);
				};
				
				if (i < that.elmentArray.length - 1) {
					// 除了最后一个，其余都有onClick事件
					objOption.onClick = function(item) {
						that.loadUrl(this, item);
					};
					
					// 第一个要加载相应url
					if (i == 0) {
						objOption.data = that.option.url;
					}
				}
				
				that.object[i] = that.elmentArray[i].jqSelect(objOption);
			}
		},
		loadUrl : function(el, item) {
			this.addCache(el);
			// 获取下一级联对象
			var index = el.option.objectIndex + 1;
			if (index == this.elmentArray.length) return;
			var obj = this.object[index];
			// 级联加载
			if (isnull(item)) {
				obj.option.objectId = '';
				obj.refreshData([], '');
			}
			else {
				obj.option.objectId = item.value;
				var cData = this.cacheData[item.value];
				if (typeof cData == 'undefined') {
					var url = this.urlPath + item.value;
					obj.refreshData(url, '');
				}
				else {
					obj.refreshData(cData, '');
				}
			}
		},
		addCache : function(el) {
			var cData = this.cacheData[el.option.objectId];
			if (typeof cData == 'undefined') this.cacheData[el.option.objectId] = el.selectObj.data;
		}
	}

})(jQuery);
;
///<jscompress sourcefile="slw.cascade.js" />
/**
 * SlwPlugins.SlwCascade v1.0 2018.7 by CSS WangWeidong
 */
;
(function() {
	SlwPlugins.SlwCascade = function(elmentArray, option) {
		this.elmentArray = elmentArray;
		this.defaults = {
			url : '',
			data : [],
			ajaxDataType : 'json',
			maxHeight : 300,
			dataFormat : function(item) {
				item.label = item.name;
				item.text = item.name;
			},
			objectIndex : ''
		};
		this.option = $.extend(this.defaults, option);
		this.object;
	};
	/**
	 * SlwCascade方法
	 */
	SlwPlugins.SlwCascade.prototype = {
		init : function() {
			var that = this;
			that.object = new Array(that.elmentArray.length);
			for (var i = that.elmentArray.length - 1; i >= 0; i--) {
				
				var objOption = $.extend(true, {}, that.option);
				objOption.objectIndex = i;
				if (i < that.elmentArray.length - 1) {
					// 除了最后一个，其余都有onClick,onLoad 事件
					objOption.onClick = objOption.onLoad = function(item) {
						that.loadUrl(this, item);
					};
					
					// 第一个要加载相应url
					if (i == 0) objOption.data = that.option.url;
				}
				
				that.object[i] = that.elmentArray[i].jqSelect(objOption);
			}
		},
		loadUrl : function(el, item) {
			// 获取下一级联对象
			var index = el.option.objectIndex + 1;
			if (index == this.elmentArray.length) return;
			var obj = this.object[index];
			obj.refreshData((!isnull(item) && !item.isLeaf) ? item.child : [], '');
		}
	}

})(jQuery);
;
///<jscompress sourcefile="slw.spinner.js" />
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
;
;
///<jscompress sourcefile="slw.upload.util.js" />
/**
 * SlwUpload.Utils v1.1 2017.6 by CSS WangWeidong
 */
;
(function($, window, undefined) {
	Slw.UploadUtil = {
		getIconImg : function(data, size) {
			return '<img class="file-icon" title="' + Slw.File.getFullName(data) + '" src="cssui/plugins/cssuploader/images/' + size + '/' + Slw.File.getIcon(data.fileExt) + '" />';
		},
		getUrlImg : function(data) {
			var ext = (data.id == 'defaultImageId' ? '' : '.' + data.fileExt)
			return '<img class="pic-element"  data-original="' + data.fileUrlFull + '" title="' + Slw.File.getFullName(data) + '" src="' + data.fileUrlFull + ext + '" />';
		},
		getUrl : function(data) {
			return data.id == 'defaultImageId' ? '' : data.fileUrlFull + '.' + data.fileExt;
		},
		getLocalImg : function(img, file) {
			if (file.type.match('image/*')) {
				if (typeof FileReader !== "undefined") {
					var reader = new FileReader();
					reader.onload = function(e) {
						img.attr('src', e.target.result);
					}
					reader.readAsDataURL(file);
				}
			}
		},
		currentDate : function() {
			var date = new Date();
			var y = date.getFullYear() + '';
			var m = date.getMonth() + 1;
			m = m < 10 ? ('0' + m) : m;
			var d = date.getDate();
			d = d < 10 ? ('0' + d) : d;
			var h = date.getHours();
			h = h < 10 ? ('0' + h) : h;
			var minute = date.getMinutes();
			minute = minute < 10 ? ('0' + minute) : minute;
			var second = date.getSeconds();
			second = second < 10 ? ('0' + second) : second;
			return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
		},
		formatDate : function(dateStr, from, to) {
			return dateStr.substring(from, to);
		},
		download : function(trId, fId, mod, o) {
			var _down = function() {
				var a = {};
				a.uuid = fId;
				a.mod = mod;
				a.tSessionId = new Date().valueOf();
				var pars = $.param(a);
				var formObj = $('#hiddenformwwd');
				if (formObj.length == 0) {
					var hiddenForm = '<form id="hiddenformwwd" target="_blank" method="post"></form>';
					$("body").append(hiddenForm);
					formObj = $('#hiddenformwwd');
				}
				formObj.attr('action', o.downUrl + '?' + pars);
				formObj.submit();
			};
			var fileName = $('#' + trId).find('.default-file-name').html();
			fileName = isnull(fileName) ? '' : '“' + fileName + '”';
			if (o.confirm)
				$css.confirm('确定要下载文件' + fileName + '到本地吗？', _down);
			else
				_down();
		},
		del : function(trId, fId, delCallback, o, extraData) {
			var _del = function() {
				var $el = $('#' + trId);
				var a = {};
				a.ids = fId;
				a.tSessionId = new Date().valueOf();
				var pars = $.param(a);
				$.post(o.delUrl, pars, function(data) {
					if (data.result == 0) {
						$el.remove();
						if (delCallback) delCallback.call(this, trId, o, extraData);
					}
					else
						$css.alert(data.msg);
				}, o.dataType);
			}
			if (o.confirm)
				$css.confirm('确定要删除文件吗？', _del);
			else
				_del();
		},
		initTools : function(id, o, delCallback, form) {
			var $el = $('#' + id, form);
			var $cell = $el.find('.toolsCell');
			var $tools = $('<div class="tools"></div>');
			var $del = $('<i class="fa fa-trash-o" title="删除"> </i>');
			var $edit = $('<i class="fa fa-edit" title="编辑"> </i>');
			var $down = $('<i class="fa fa-download" title="下载"> </i>');
			$cell.html('').append($tools);
			
			if (!o.readonly) { // 编辑模式
				$tools.append($edit);
				$tools.append($down);
				$tools.append($del);
			}
			else {// 查看模式
				$tools.append($down);
			}
			var extraData = $.extend(true, {}, o.extraData);
			if (extraData.tableKey == '') {
				extraData.tableKey = $el.attr('data-key');
			}
			$del.click(function() {
				Slw.UploadUtil.del(id, id, delCallback, o, extraData);
			});
			
			$edit.click(function() {
				var params = {};
				params.url = o.getUrl;
				params.data = {
					uuid : id
				};
				params.rel = 'attachmentRename';
				params.title = '重命名';
				params.callback = function() {
					var $frm = $('#getAttachmentForm');
					$frm.find('button').click(function() {
						if (!$frm.valid()) return false;
						$.post(o.updUrl, $frm.serialize(), function(data) {
							if (data.result == 0) {
								data.fileExt = Slw.File.getFileExt($('#' + id).find('.default-file-name').html());
								data.fileName = $frm.find('#fileName').val();
								closeDialog();
								$css.tip("保存成功！");
								$('#' + id).find('.default-file-name').html(Slw.File.getFullName(data));
							}
							else
								$css.alert(data.msg);
						}, o.dataType);
					});
				}
				$css.openDialog(params)
			});
			
			$down.click(function() {
				Slw.UploadUtil.download(id, id, 2, o);
			});
		}
	};
	$.jquploadUtil = Slw.UploadUtil;
	
})(jQuery, this);
;
///<jscompress sourcefile="slw.upload.ajax.js" />
/**
 * SlwAjaxUpload v1.1 2017.8 by CSS WangWeidong
 */
;
(function() {
	$.fn.slwAjaxUpload = function(option) {
		var ajaxUpload = new SlwPlugins.SlwAjaxUpload(this, option);
		ajaxUpload.init();
		return ajaxUpload;
	};
	
	SlwPlugins.SlwAjaxUpload = function(el, options) {
		this.defaults = {
			action : 'upload.action',
			name : 'userfile',
			allowedTypes : '*',
			fileNumber : 1,
			// image/*很慢，建议用'image/jpg,image/jpeg,image/png,image/gif'
			data : {},
			responseType : 'json',
			onSubmit : function(file, extension) {
			},
			onComplete : function(file, response) {
			},
			onSuccess : function(file, response) {
			},
			onError : function(file, response, textSatus) {
			}
		};
		this.option = $.extend(this.defaults, options);
		this.btn = $(el);
		this.input = null;
	}
	SlwPlugins.SlwAjaxUpload.prototype = {
		init : function() {
			this.btn.css({
				"cursor" : "pointer"
			});
			this._createInput();
		},
		submit : function() {
			var that = this;
			var o = that.option;
			if (that.input.val() == '') return;
			var file = Slw.File.getFileName(that.input.val());
			if (o.onSubmit.call(this, file, Slw.File.getFileExt(file))) {
				var iframe = this._createIframe();
				var form = this._createForm(iframe);
				form.appendChild(that.input[0]);
				form.submit();
				document.body.removeChild(form);
				form = null;
				that.input = null;
				var toDeleteFlag = false;
				var complete = function(response) {
					toDeleteFlag = true;
					iframe.src = "javascript:'<html></html>';";
					that._createInput();
					o.onComplete.call(that, file, response);
				};
				$(iframe).on('load', function(e) {
					if (iframe.src == "javascript:'%3Chtml%3E%3C/html%3E';" || iframe.src == "javascript:'<html></html>';") {
						if (toDeleteFlag) {
							setTimeout(function() {
								document.body.removeChild(iframe);
							}, 0);
						}
						return;
					}
					var doc = iframe.contentDocument ? iframe.contentDocument : frames[iframe.id].document;
					if (doc.readyState && doc.readyState != 'complete') {
						return;
					}
					if (doc.body && doc.body.innerHTML == "false") {
						return;
					}
					var response;
					if (doc.XMLDocument) {
						response = doc.XMLDocument;
					}
					else if (doc.body) {
						response = doc.body.innerHTML;
						if (o.responseType && o.responseType.toLowerCase() == 'json') {
							if (doc.body.firstChild && doc.body.firstChild.nodeName.toUpperCase() == 'PRE') {
								response = doc.body.firstChild.firstChild.nodeValue;
							}
							if (response) {
								var _tmp = response;
								response = Slw.Utils.toJson(response);
								if (response == '') {
									var info = $('<div>' + _tmp + '</div>');
									var textSatus = '';
									var h1 = info.find('h1');
									if (h1.length > 0) textSatus = h1.text();
									o.onError.call(that, file, _tmp, textSatus);
									complete(textSatus);
									return;
								}
							}
							else {
								response = {};
							}
						}
					}
					else {
						var response = doc;
					}
					o.onSuccess.call(that, file, response);
					complete(response);
				});
			}
			else {
				that.input.remove();
				that._createInput();
			}
		},
		hide : function() {
			this.btn.unbind();
			this.input.css({
				"display" : "none"
			});
		},
		show : function() {
			this._iepositionFix();
		},
		_createInput : function() {
			var o = this.option;
			var that = this;
			
			var acceptType = (o.allowedTypes != '*' ? 'accept="' + o.allowedTypes + '"' : '');
			that.input = $('<input type="file" name="' + o.name + '" style="display:none" unselectable="on" ' + acceptType + (o.fileNumber != 1 ? ' multiple="multiple"' : ' ') + '/>');
			that.btn.after(that.input);
			that._iepositionFix();
			
			that.input.on('change', function(evt) {
				if (that.input.val() == '') return;
				that.btn.attr("disabled", true);
				that.submit();
			});
			that.btn.attr("disabled", false);
		},
		_iepositionFix : function() {
			var o = this.option;
			var that = this;
			if (Slw.Utils.isIE() && Slw.Utils.ieVersion() < 10) {
				var btnLen = that.btn.outerWidth();
				var fontSize = btnLen * 19.001 / 100;
				that.input.css({
					"position" : "absolute",
					"display" : "",
					"width" : that.btn.outerWidth() + 'px',
					"height" : that.btn.outerHeight() + 'px',
					"left" : that.btn.position().left + 'px',
					"top" : that.btn.position().top + 'px',
					"cursor" : "pointer",
					"color" : "transparent",
					"font-size" : fontSize + 'px',
					"z-index" : 201707,
					"overflow" : "hidden",
					"opacity" : 0
				});
				
				that.btn.unbind();
				that.btn.hover(function() {
					that._iepositionFix();
				});
			}
			else {
				that.btn.unbind();
				that.btn.click(function() {
					that.input.click();
				});
			}
		},
		_createIframe : function() {
			var id = Slw.Utils.uuid();
			var $iframe = $('<iframe src="javascript:false;" name="' + id + '" />');
			$('body').append($iframe);
			var iframe = $iframe[0];
			iframe.id = id;
			iframe.style.display = 'none';
			return iframe;
		},
		_createForm : function(iframe) {
			var o = this.option;
			var $form = $('<form method="post" enctype="multipart/form-data"></form>');
			$('body').append($form);
			var form = $form[0];
			form.style.display = 'none';
			form.action = o.action;
			form.target = iframe.name;
			for ( var prop in o.data) {
				var el = document.createElement("input");
				el.type = 'hidden';
				el.name = prop;
				el.value = o.data[prop];
				form.appendChild(el);
			}
			return form;
		}
	};
})(jQuery);
;

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

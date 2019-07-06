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

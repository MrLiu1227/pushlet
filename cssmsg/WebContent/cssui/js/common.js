var userAgent = navigator.userAgent;
var isIE11 = userAgent.toLowerCase().match(/rv:([\d.]+)\) like gecko/) ? true : false;
var isOpera = userAgent.indexOf("Opera") > -1;
var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera;
var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE;
var isFF = userAgent.indexOf("Firefox") > -1;
var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1;
var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1;
var isIE6 = false, isIE7 = false, isIE8 = false, isIE9 = false, isIE10 = false;
if (isIE) {
	var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
	reIE.test(userAgent);
	var fIEVersion = parseFloat(RegExp["$1"]);
	if (fIEVersion == 7)
		isIE7 = true;
	else if (fIEVersion == 8)
		isIE8 = true;
	else if (fIEVersion == 9)
		isIE9 = true;
	else if (fIEVersion == 10)
		isIE10 = true;
	else
		isIE6 = true;
}
if (isIE11)
	isIE = true;

function isnull(str) {
	return (str == null || (typeof str == 'undefined') || str == "");
}
function isNumber(n) {
	return typeof n === 'number' && !isNaN(n);
}
function px(n) {
	return isNumber(n) ? n + 'px' : n;
}
function dealNull(str) {
	return isnull(str) ? '' : str;
}

function dealNullNum(str) {
	return isnull(str) ? 0 : str;
}

function uuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
};
// 解决IE8 Object.keys()问题
var DONT_ENUM = "propertyIsEnumerable,isPrototypeOf,hasOwnProperty,toLocaleString,toString,valueOf,constructor".split(","), hasOwn = ({}).hasOwnProperty;
for ( var i in {
	toString : 1
}) {
	DONT_ENUM = false;
}

Object.keys = Object.keys || function(obj) {// ecma262v5 15.2.3.14
	var result = [];
	for ( var key in obj)
		if (hasOwn.call(obj, key)) {
			result.push(key);
		}
	if (DONT_ENUM && obj) {
		for (var i = 0; key = DONT_ENUM[i++];) {
			if (hasOwn.call(obj, key)) {
				result.push(key);
			}
		}
	}
	return result;
};

function extend(dst) {
	var h = dst.$$hashKey;
	for (var i = 1, ii = arguments.length; i < ii; i++) {
		var obj = arguments[i];
		if (obj) {
			var keys = Object.keys(obj);
			for (var j = 0, jj = keys.length; j < jj; j++) {
				var key = keys[j];
				dst[key] = obj[key];
			}
		}
	}
	setHashKey(dst, h);
	return dst;
}

function logo_bbs(obj) {
	try {
		obj.onerror = null;
		obj.src = 'images/forum.gif';
	} catch (ex) {
	}
}

function logo_user(obj) {
	try {
		obj.onerror = null;
		obj.src = 'bbs/images/bklogo.jpg';
	} catch (ex) {
	}
}
function killErrors() {
	return true;
}
window.onerror = killErrors;

function substr(str, len) {
	if (!str || !len) {
		return '';
	}
	var a = 0;
	var temp = '';
	for (var i = 0; i < str.length; i++) {
		a += str.charCodeAt(i) > 255 ? 2 : 1;
		if (a > len)
			return temp;
		temp += str.charAt(i);
	}
	return str;
};

function getExt(file) {
	return (/[.]/.exec(file)) ? /[^.]+$/.exec(file.toLowerCase()) : '';
}
function strReverse(s) {
	return s.replace(/(<BR>|<BR\/>)/ig, "\n");
}

function strRemoveBr(s) {
	return s.replace(/(<BR>|<BR\/>)/ig, "");
}
function strConvert(s) {
	s = s.replace(/(<)/ig, "&lt;");
	s = s.replace(/(\n)/g, "<BR>");
	return s;
}

/*
 * 处理过长的字符串  注：半角长度为1，全角长度为2 pStr:字符串 pLen:截取长度 return: 截取后的字符串
 */
function autoAddEllipsis(pStr, pLen) {
	var _ret = cutString(pStr, pLen);
	var _cutFlag = _ret.cutflag;
	var _cutStringn = _ret.cutstring;
	return _cutStringn;
}
/*
 * 取得指定长度的字符串 注：半角长度为1，全角长度为2 pStr:字符串 pLen:截取长度 return: 截取后的字符串
 */
function cutString(pStr, pLen) {
	// 原字符串长度
	var _strLen = pStr.length;
	var _tmpCode;
	var _cutString;
	// 默认情况下，返回的字符串是原字符串的一部分
	var _cutFlag = "1";
	var _lenCount = 0;
	var _ret = false;
	if (_strLen <= pLen / 2) {
		_cutString = pStr;
		_ret = true;
	}
	if (!_ret) {
		for (var i = 0; i < _strLen; i++) {
			if (isFull(pStr.charAt(i))) {
				_lenCount += 2;
			}
			else {
				_lenCount += 1;
			}
			if (_lenCount > pLen) {
				_cutString = pStr.substring(0, i);
				_ret = true;
				break;
			}
			else if (_lenCount == pLen) {
				_cutString = pStr.substring(0, i + 1);
				_ret = true;
				break;
			}
		}
	}
	if (!_ret) {
		_cutString = pStr;
		_ret = true;
	}
	if (_cutString.length == _strLen) {
		_cutFlag = "0";
	}
	return {
		"cutstring" : _cutString,
		"cutflag" : _cutFlag
	};
}
/*
 * 判断是否为全角
 * 
 * pChar:长度为1的字符串 return: true:全角 false:半角
 */
function isFull(pChar) {
	if ((pChar.charCodeAt(0) > 128)) {
		return true;
	}
	else {
		return false;
	}
}

;
(function() {
	// Private array of chars to use
	var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	Math.uuid = function(len, radix) {
		var chars = CHARS, uuid = [], i;
		radix = radix || chars.length;
		
		if (len) {
			for (i = 0; i < len; i++)
				uuid[i] = chars[0 | Math.random() * radix];
		} else {
			var r;
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';
			for (i = 0; i < 36; i++) {
				if (!uuid[i]) {
					r = 0 | Math.random() * 16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}
		return uuid.join('');
	};
})();

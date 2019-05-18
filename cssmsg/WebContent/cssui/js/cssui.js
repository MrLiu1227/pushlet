///<jscompress sourcefile="common.js" />
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
;
///<jscompress sourcefile="css.core.js" />
$.extend(String.prototype, {
	isPositiveInteger : function() {
		return (new RegExp(/^[1-9]\d*$/).test(this));
	},
	isInteger : function() {
		return (new RegExp(/^\d+$/).test(this));
	},
	isNumber : function(value, element) {
		return (new RegExp(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/).test(this));
	},
	trim : function() {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	},
	trimEnter : function() {
		return this.replace(/(^\s*)|(\s*$)|\r|\n/g, "");
	},
	startsWith : function(pattern) {
		return this.indexOf(pattern) === 0;
	},
	endsWith : function(pattern) {
		var d = this.length - pattern.length;
		return d >= 0 && this.lastIndexOf(pattern) === d;
	},
	replaceSuffix : function(index) {
		return this.replace(/\[[0-9]+\]/, '[' + index + ']').replace('#index#', index);
	},
	trans : function() {
		return this.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
	},
	replaceAll : function(os, ns) {
		return this.replace(new RegExp(os, "gm"), ns);
	},
	replaceTm : function($data) {
		if (!$data) return this;
		return this.replace(RegExp("({[A-Za-z_]+[A-Za-z0-9_]*})", "g"), function($1) {
			return $data[$1.replace(/[{}]+/g, "")];
		});
	},
	replaceTmById : function(_box) {
		var $parent = _box || $(document);
		return this.replace(RegExp("({[A-Za-z_]+[A-Za-z0-9_]*})", "g"), function($1) {
			var $input = $parent.find("#" + $1.replace(/[{}]+/g, ""));
			return $input.val() ? $input.val() : $1;
		});
	},
	isFinishedTm : function() {
		return !(new RegExp("{[A-Za-z_]+[A-Za-z0-9_]*}").test(this));
	},
	skipChar : function(ch) {
		if (!this || this.length === 0) {
			return '';
		}
		if (this.charAt(0) === ch) {
			return this.substring(1).skipChar(ch);
		}
		return this;
	},
	isValidPwd : function() {
		return (new RegExp(/^([_]|[a-zA-Z0-9]){6,32}$/).test(this));
	},
	isValidMail : function() {
		return (new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(this.trim()));
	},
	isSpaces : function() {
		for (var i = 0; i < this.length; i += 1) {
			var ch = this.charAt(i);
			if (ch != ' ' && ch != "\n" && ch != "\t" && ch != "\r") {
				return false;
			}
		}
		return true;
	},
	isPhone : function() {
		return (new RegExp(/(^([0-9]{3,4}[-])?\d{3,8}(-\d{1,6})?$)|(^\([0-9]{3,4}\)\d{3,8}(\(\d{1,6}\))?$)|(^\d{3,8}$)/).test(this));
	},
	isUrl : function() {
		return (new RegExp(/^[a-zA-z]+:\/\/([a-zA-Z0-9\-\.]+)([-\w .\/?%&=:]*)$/).test(this));
	},
	isExternalUrl : function() {
		return this.isUrl() && this.indexOf("://" + document.domain) == -1;
	},
	lenCn : function() {
		return this.replace(/[^\x00-\xff]/g, "xx").length;
	}
});

jQuery.extend({
	minValue : function(array) {
		return Math.min.apply(null, array);
	},
	maxValue : function(array) {
		return Math.max.apply(null, array);
	},
	equals : function(object1, object2) {
		for (propName in object1) {
			if (object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
				return false;
			}
			else if (typeof object1[propName] != typeof object2[propName]) {
				return false;
			}
		}
		for (propName in object2) {
			if (object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
				return false;
			}
			else if (typeof object1[propName] != typeof object2[propName]) {
				return false;
			}
			if (!object1.hasOwnProperty(propName)) continue;
			if (object1[propName] instanceof Array && object2[propName] instanceof Array) {
				if (!object1[propName].equals(object2[propName])) return false;
			}
			else if (object1[propName] instanceof Object && object2[propName] instanceof Object) {
				if (!object1[propName].equals(object2[propName])) return false;
			}
			else if (object1[propName] != object2[propName]) {
				return false;
			}
		}
		return true;
	}
});
;
///<jscompress sourcefile="contextmenu.js" />
/*
 * contextmenu 2016.6 by CSS WeidongWang
 */
(function($) {
	var menuMap = {};
	$.fn.contextMenu = function(id, options) {
		if (!(id in menuMap)) menuMap[id] = $('#' + id).clone(true).appendTo('body');
		var menu = menuMap[id];
		var a = $(this);
		a.contextmenu(function(e) {
			var that = this;
			$.each(options.callback, function(id, func) {
				menu.find('[rel=' + id + ']').off().on('click', function() {
					func(a, id);
				})
			});
			if (options.init) options.init(a, menu);
			var top = e['pageY'] + menu.height();
			var topOffset = $(window).height() - top - 10;
			top = topOffset > 0 ? e['pageY'] : e['pageY'] + topOffset;
			var left = e['pageX'] + menu.width();
			var leftOffset = $(window).width() - left - 10;
			left = leftOffset > 0 ? e['pageX'] : e['pageX'] + leftOffset;
			menu.css({
				'left' : left,
				'top' : top
			}).show();
			$(document).one('click', function() {
				menu.hide();
			});
			return false;
		});
	};
})(jQuery);
;
///<jscompress sourcefile="table.js" />
/*
 * $newTable v1.0
 */
function submitForm(form,currentPage){
	 form.find('.page-current').val(currentPage);
    form.find('.page-size').val(form.find('.page-num').val());
    $navTab.submitForm(form[0]);
    //form.submit();
    return false;

}
;(function($){
 	$newTable = {
 		initFlag:false,
 		getCurrentForm:function(el){
 			return $(el).parents('.table-form');
 		},
 		getCheckbox:function(el){
 			return $css.checkedVal('ids',$newTable.getCurrentForm(el));
 		},
 		event: function(){
 			if($newTable.initFlag==true) return;
 			else
 				$newTable.initFlag =true;
 			$('body').on('click','.table-pagination .page-prev',function(){
	        var $form=$(this).parents('.table-form'),
	            prevPage=parseInt($form.find('.page-current').val())-1;
	        if(prevPage==0)
	        		prevPage=1; 
	        submitForm($form,prevPage);   
	    })
	    $('body').on('click','.table-pagination .page-next',function(){
	        var $form=$(this).parents('.table-form'),
	            pageCount=parseInt($form.find('.page-count').val()),
	            nextPage=parseInt($form.find('.page-current').val())+1;
	        if(nextPage>pageCount)
	            nextPage=pageCount;
	        submitForm($form,nextPage);   
	    })
	    $('body').on('click','.table-pagination .page-first',function(){
	        $form=$(this).parents('.table-form');
	        submitForm($form,1);   
	    })
	    $('body').on('click','.table-pagination .page-last',function(){
	        $form=$(this).parents('.table-form');
	        submitForm($form,$form.find('.page-count').val());   
	    })
	    $('body').on('click','.table-pagination .page-go',function(){
	        var $form=$(this).parents('.table-form'),
	            pageNum=parseInt($form.find('.page-jump').val());
	            pageCount=parseInt($form.find('.page-count').val());
	        if(pageNum>pageCount)
	            pageNum=pageCount;  
	        if(pageNum==0)
	            pageNum=1;      
	        $form=$(this).parents('.table-form');
	        submitForm($form,pageNum);   
	    })
	    $('body').on('keydown','.table-pagination .page-jump',function(event){
	    	var ENTER = 13;
	    	if(event.keyCode==ENTER){
	    		$form=$(this).parents('.table-form');
	    		$form.find('.page-current').val($form.find('.page-jump').val());
	        $form.submit();
	    	}
	    })
	    $('body').on('keydown','.table-pagination .page-num',function(){
	    	var ENTER = 13;
	    	if(event.keyCode==ENTER){
	    		$form=$(this).parents('.table-form');
	    		$form.find('.page-size').val($form.find('.page-num').val());
	        $form.submit();
	    	}
	    })
	    $('body').on('click','th[order-field]',function(){
	        var $this=$(this),
	            $form=$this.parents('.table-form'),
	            orderFlag=$form.find('.order-flag').val();
	        $form.find('.order-flag').val(1-orderFlag);
	        $form.find('.order-string').val($this.attr('order-field'));
	        $form.submit();
	    })
	    $('body').on('click','.cleck-all',function(){
	        var $this=$(this),
	            $form=$this.parents('.table-form');
	            group=$this.attr('group');
	        $form.find('input[name="'+group+'"]').prop('checked',$this.prop("checked"));
	    })
		//form表单右侧小tab注册click事件
		$('body').on('click','.btnTab a',function(){
			var $this=$(this),
				$form=$this.parents('.table-form');
			$this.parent().find('input').val($this.attr('value'));
			$form.submit();
		})
 		}
  };
})(jQuery);
///<jscompress sourcefile="navtab.js" />
/*
 * $navTab v1.0 Copyright(c) 2016.6 by CSS WangWeidong
 */
function navTabSearch(form, navTabId) {
	$navTab.submitForm(form);
	return false;
}
function tabModel() {
	id = "";
	title = "";
	url = "";
	formParams = "";
	extraFlag = false;
	tabWidth = 0;
	timestamp = -1;
	loaded = false;
};
(function($) {
	var map = {}, maxLength = 30, homeTabId, $ul, $module, $more, curTab, curForm;
	var methods = {
		initHomeTab : function() {
			var homeTab = $navTab.options.homeTab;
			if (homeTab == null) return;
			homeTabId = homeTab.id;
			curTab = homeTab;
			map[curTab.id] = curTab;
			methods.initClick(curTab);
		},
		initTab : function(tabInfo) {
			var $li = $('<li id="myTabli' + tabInfo.id + '"><a href="#' + tabInfo.id + '" tabid="' + tabInfo.id + '"><span>' + tabInfo.title + '</span> <i class="fa fa-times-circle remove"></i></a></li>');
			$ul.append($li);
			$li.find('.remove').on('click', methods.event.close);
			return;
		},
		refreshTitle : function() {
			var $li = $ul.find('#myTabli' + curTab.id);
			var $span = $li.find('span');
			$span.html(curTab.title);
		},
		initClick : function(tabInfo) {
			var $li = $ul.find('#myTabli' + tabInfo.id);
			var $a = $li.find('a');
			$a.on('click', methods.event.click);
			tabInfo.tabWidth = $a.outerWidth(true);
			methods.reseizeUl();
			$more.each(function() {
				var $menuLi = $('<li class="moreBtnLi' + tabInfo.id + '"><a href="javascript:;">' + tabInfo.title + '</a></li>');
				$(this).next().append($menuLi);
				$menuLi.click(function() {
					methods.activeTab(tabInfo.id);
				});
			});
			methods.contextMenu($a);
		},
		event : {
			click : function(e) {
				var key = $(this).attr('tabid');
				methods.activeTab(key);
				return false;
			},
			close : function(e) {
				var key = $(this).parent().attr('tabid');
				$navTab.closeTab(key);
				methods.reseizeUl();
				return false;
			}
		},
		activeTab : function(key) {
			if (key == curTab.id) return false;
			methods.hideTab();
			methods.getCurTab(key);
			methods.showTab();
		},
		loadTab : function(tabInfo) {
			$('#' + tabInfo.id).remove();
			if (tabInfo.extraFlag) {
				var ih = $content.height() - 5;
				$content.append('<div id="' + tabInfo.id + '" class="tab-pane"><iframe src="' + tabInfo.url + '" style="margin:0;padding0;overflow:hidden;width:100%;height:' + ih + 'px;" frameborder="no" border="0" marginwidth="0" marginheight="0"></iframe></div>');
				tabInfo.loaded = true;
				if (tabInfo.id == curTab.id) methods.showTab();
			}
			else
				methods.ajaxFun(tabInfo);
		},
		ajaxFun : function(tabInfo) {
			var reqPara = $action.getUrlParams(tabInfo.url);
			var frmPara = $action.getUrlParams(tabInfo.formParams);
			var param = $.extend(frmPara, reqPara);
			if (tabInfo.id == curTab.id) blockUI($content);
			$.post($action.getUrl(tabInfo.url), param, function(data) {
				if (tabInfo.id == curTab.id) unblockUI($content);
				$content.append('<div id="' + tabInfo.id + '" class="tab-pane"><div id="scroll_' + tabInfo.id + '" class="l-autoscroll">' + data + '</div></div>');
				tabInfo.loaded = true;
				if (tabInfo.id == curTab.id) methods.showTab();
			})
		},
		hideTab : function() {
			$('#' + curTab.id).hide();
		},
		showTab : function() {
			if (curTab.loaded) {
				var $li = $ul.find('#myTabli' + curTab.id);
				$ul.find('li').eq($li.index()).addClass("active").siblings().removeClass('active');
				$('#' + curTab.id).show();
				methods.scrollCurrent();
				if ($navTab.options.sidebarCallback) $navTab.options.sidebarCallback.call(this);
				$more.next().find(".active").removeClass("active");
				$('.moreBtnLi' + curTab.id).addClass("active");
				if ($navTab.options.shownCallback) $navTab.options.shownCallback.call(this, curTab.id);
			}
			else
				$navTab.refreshCurrentTab();
		},
		getCurTab : function(key) {
			curTab = map[key];
			delete map[key];
			map[key] = curTab;
		},
		closeOther : function(key) {
			for (tmpKey in map) {
				if (tmpKey != key) $navTab.closeTab(tmpKey);
			}
		},
		closeAll : function() {
			for (tmpKey in map)
				$navTab.closeTab(tmpKey);
		},
		contextMenu : function($obj) {
			$obj.contextMenu($ul.attr('context-menu'), {
				callback : {
					'close' : function(t) {
						$navTab.closeTab(t.attr('tabid'));
					},
					'closeOther' : function(t) {
						methods.closeOther(t.attr('tabid'));
					},
					'closeAll' : function(t) {
						methods.closeAll();
					},
					'reload' : function(t) {
						var tId = t.attr('tabid');
						$navTab.refreshTab(tId);
					}
				}
			});
		},
		getNextTab : function() {
			var nextTabId = '';
			for (tmpKey in map)
				nextTabId = tmpKey;
			return nextTabId;
		},
		scrollTab : function(left) {
			$menu.scrollLeft(left);
		},
		currentPos : function() {
			var cw = $('#myTabli' + curTab.id).outerWidth(true);
			$('#myTabli' + curTab.id).prevAll().each(function() {
				var id = $(this).attr('id').substring(7);
				cw += map[id].tabWidth + 2;
			});
			return cw;
		},
		reseizeUl : function() {
			var cw = 3;
			$ul.find('li').each(function() {
				var id = $(this).attr('id').substring(7);
				cw += map[id].tabWidth + 3;
			});
			$ul.css('width', cw);
		},
		scrollCurrent : function() {
			var barw = $module.width() - 50;
			var cw = methods.currentPos();
			var ulw = $menu.outerWidth();
			if ($menu.scrollLeft() + barw > cw && cw - map[curTab.id].tabWidth > $menu.scrollLeft())
				return;
			else {
				ulw = $menu.outerWidth();
				methods.scrollTab(cw < ulw ? 0 : cw - ulw);
			}
		}
	};
	$navTab = {
		options : {
			homeTab : null,
			shownCallback : null,
			sidebarCallback : null
		},
		event : function() {
			$('body').on('click', '[target=cssTab]', function() {
				var $this = $(this), tab = new tabModel();
				tab.url = $this.attr('href');
				if (tab.url == '' || tab.url.indexOf('javascript:') == 0) return false;
				tab.id = $this.attr('rel');
				tab.title = $this.attr('title') ? $this.attr('title') : $this.html();
				var hideFlag = $this.attr('refresh');
				if (hideFlag && hideFlag != 'hide') hideFlag = 'show';
				$navTab.openTab(tab, hideFlag);
				return false;
			});
			$('body').on('click', '[target=cssTabNewPage]', function() {
				var $this = $(this);
				var para = {};
				para.url = $this.attr('href');
				para.id = $this.attr('rel');
				para.title = $this.attr('title');
				var $form = $('<form method="post"></form>');
				$('body').append($form);
				$form[0].style.display = 'none';
				$form[0].action = 'toUrl.action';
				$form[0].target = '_blank';
				$.each(para, function(key, val) {
					var el = document.createElement("input");
					el.type = 'hidden';
					el.name = key;
					el.value = val;
					$form[0].appendChild(el);
				});
				$form.submit();
				$form.remove();
				return false;
			});
		},
		hasTimestamp : function(timestamp) {
			if (curTab.timestamp == timestamp)
				return true;
			else {
				curTab.timestamp = timestamp
				return false;
			}
		},
		init : function(el, options) {
			$navTab.options = $.extend($navTab.options, options);
			$module = $(el);
			$ul = $module.find('.tabMenu-ul');
			$menu = $module.find('.tabMenu-body');
			$more = $module.find('.more'), $content = $('#tab-content');
			methods.initHomeTab();
			$navTab.event();
		},
		resize : function() {
			methods.scrollCurrent();
		},
		openA : function(el) {
			$this = el;
			var tab = new tabModel();
			tab.id = $this.attr('rel');
			tab.title = $this.attr('title') ? $this.attr('title') : $this.html();
			tab.url = $this.attr('href');
			var hideFlag = $this.attr('refresh');
			if (hideFlag && hideFlag != 'hide') hideFlag = 'show';
			$navTab.openTab(tab, hideFlag);
		},
		openTab : function(tabInfo, hideFlag) {
			if (!hideFlag || hideFlag == 'show') methods.hideTab();
			var has = tabInfo.id in map;
			if (has) {
				if (hideFlag == 'hide') return;
				methods.getCurTab(tabInfo.id);
				if (tabInfo.title != curTab.title) {
					curTab.title = tabInfo.title;
					methods.refreshTitle();
				}
				curTab.url = tabInfo.url;
				curTab.formParams = "";
			}
			else {
				var length = Object.keys(map).length;
				if (length >= maxLength) {
					alert("最多可以打开" + maxLength + "个标签！");
					return;
				}
				map[tabInfo.id] = tabInfo;
				methods.initTab(tabInfo);
				methods.initClick(tabInfo);
			}
			if (!hideFlag || hideFlag == 'show') curTab = tabInfo;
			methods.loadTab(tabInfo);
		},
		openTabById : function(tabId) {
			if (!(tabId in map)) return;
			var tab = map[tabId];
			$navTab.openTab(tab);
		},
		closeCurrentTab : function() {
			$navTab.closeTab(curTab.id);
		},
		closeOther : function() {
			methods.closeOther(curTab.id);
		},
		closeAll : function() {
			methods.closeAll();
		},
		closeTab : function(tabId) {
			if (tabId == homeTabId) return;
			if (!(tabId in map)) return;
			delete map[tabId];
			var nextTabId = methods.getNextTab();
			$('#myTabli' + tabId).remove();
			$('.moreBtnLi' + tabId).remove();
			$('#' + tabId).remove();
			if (nextTabId != '') {
				curTab = map[nextTabId];
				methods.showTab();
			}
		},
		activeTab : function(tabId) {
			if (!(tabId in map)) return;
			methods.activeTab(tabId);
		},
		refreshTab : function(tabId) {
			if (!(tabId in map)) return;
			methods.hideTab();
			methods.getCurTab(tabId);
			curTab.timestamp = -1;
			methods.loadTab(curTab);
		},
		refreshCurrentTab : function() {
			curTab.timestamp = -1;
			methods.loadTab(curTab);
		},
		refreshCurrentTabForm : function(tabId, form) {
			var tId = isnull(tabId) ? curTab.id : tabId;
			var $form = null;
			if (form instanceof jQuery)
				$form = form;
			else if (!isnull(form)) {
				var srcForm = $(form).attr('data-wwd-srcformid');
				if (!isnull(srcForm)) $form = $('[data-wwd-formid=' + srcForm + ']');
			}
			if ($form == null || $form.length == 0) $form = $("#" + tId).find('.table-form')[0];
			$navTab.submitForm($form);
		},
		getCurrentTab : function() {
			return curTab;
		},
		getTab : function(tabId) {
			if (!(tabId in map)) return '';
			return map[tabId];
		},
		submitForm : function(form) {
			curTab.formParams = '?' + $(form).serialize();
			$navTab.ajaxLoadForm($(form).attr('action'), $(form).serialize(), $(form).parent());
			$(form).parent().scrollTop(0);
		},
		ajaxLoadForm : function(url, param, parent) {
			blockUI(parent);
			$.post(url, param, function(data) {
				unblockUI(parent)
				parent.html(data);
				if ($navTab.options.shownCallback) $navTab.options.shownCallback.call(this, parent);
			})
		}
	};
})(jQuery)
;
///<jscompress sourcefile="action.js" />
/*
 * $action v1.0 Copyright(c) 2016.6 by CSS WeidongWang
 */
function isnull(str) {
	return (str == null || str == "" || str == "undefined");
};
function closeDialog() {
	// $css.closeAllDialog();
	$css.closeDialog();
}
function closeDialogCloseTab(tabId) {
	closeTab(tabId)
	closeDialog();
}
function closeDialogRefreshTabForm(tabId, form) {
	$navTab.refreshCurrentTabForm(tabId, form);
	closeDialog();
}
function refreshCurrentTabForm(tabId, form) {
	$navTab.refreshCurrentTabForm(tabId, form);
}
function refreshCurrentTab() {
	$navTab.refreshCurrentTab();
}
function refreshTab(tabId) {
	if (tabId)
		$navTab.refreshTab(tabId);
	else
		$navTab.refreshCurrentTab();
}
function closeDialogRefreshTab(tabId) {
	if (tabId)
		$navTab.refreshTab(tabId);
	else
		$navTab.refreshCurrentTab();
	closeDialog();
}
function closeTab(tabId) {
	if (tabId)
		$navTab.closeTab(tabId);
	else
		$navTab.closeCurrentTab();
}
function noCloseNoRefresh() {
}
function actionModel() {
	url = "";
	title = "";
	callback = "";
	tabId = "";
	afterExec = "";
	tip = true;
};
(function($) {
	var actMessage = {
		act : '你确定要操作这条记录吗？',
		batch : '你确定要操作这些记录吗？',
		alertBatch : '请选中一条数据！'
	}, methods = {
		template : function(data, params, form) {
			if (params.callback) {
				params.callback(data, form, params);
				return;
			}
			if (data.result == 0) {
				// refreshCurrentTabForm,refreshCurrentTab
				if (isnull(params.afterExec)) params.afterExec = refreshCurrentTabForm;
				params.afterExec(params.tabId, form);
				if (params.tip != false) $css.tip(data.msg);
			}
			else {
				$css.alert(data.msg);
			}
		}
	};
	$action = {
		// params={url:''必须, callback:''有则调用, data:{json参数}, afterExec:''有则调用,
		// title:'' 不传默认为'你确定要操作这些记录吗？'}
		execBatch : function(el, params) {
			var ids = $newTable.getCheckbox(el);
			var $sForm = $(el).parents('form').first()
			if (ids.length > 0) {
				var url = params.url, title = params.title;
				if (isnull(title)) title = actMessage.batch;
				$css.confirm(title, function() {
					$css.post(url, {
						'ids' : ids
					}, function(data) {
						methods.template(data, params, $sForm);
					}, 'json');
				});
			}
			else {
				$css.alert(actMessage.alertBatch);
			}
			return false;
		},
		exec : function(el, params) {
			var url = params.url, title = params.title;
			if (isnull(title)) title = actMessage.act;
			var $sForm = $(el).parents('form').first()
			$css.confirm(title, function() {
				$css.post(url, params.data, function(data) {
					methods.template(data, params, $sForm);
				}, 'json');
			});
		},
		execCall : function(params) {
			if (isnull(params.title))
				$action.execCallSub(params);
			else {
				$css.confirm(params.title, function() {
					$action.execCallSub(params);
				});
			}
		},
		execCallSub : function(params) {
			$css.post(params.url, params.data, function(data) {
				if (data.result == 0) {
					if (params.callback) {
						params.callback(data);
						return;
					}
				}
				else {
					$css.alert(data.msg);
				}
			}, 'json');
		},
		execNoTip : function(params, form) {
			$css.post(params.url, params.data, function(data) {
				if (form instanceof jQuery)
					methods.template(data, params, form);
				else
					methods.template(data, params);
			}, 'json');
		},
		submit : function(form, callback, tabId, afterExec) {
			var $form = $(form);
			if (!$form.valid()) return false;
			var btn = $('.submitButton', $form);
			blockButton(btn);
			$action.submitChild(form, callback, tabId, afterExec);
			return false;
		},
		submitChild : function(form, callback, tabId, afterExec) {
			var $form = $(form);
			var btn = $('.submitButton', $form);
			$css.post($form.attr("action"), $form.serialize(), function(data) {
				if (data.result && data.result == 9999) {
					var tokenEl = $('#css\\.tokenId', $form);
					if (tokenEl.length == 1) {
						tokenEl.val(data.msg);
						$action.submitChild(form, callback, tabId, afterExec);
					}
					else {
						$css.alert("请正确设置cssTokenTag");
						unblockButton(btn);
					}
				}
				else {
					unblockButton(btn);
					var params = new actionModel();
					params.callback = callback;
					params.tabId = tabId;
					params.afterExec = afterExec;
					// closeDialogRefreshTabForm ,closeDialogRefreshTab
					if (isnull(params.afterExec)) params.afterExec = closeDialogRefreshTabForm;
					methods.template(data, params, form);
				}
			}, 'json', btn);
		},
		query : function(form) {
			$navTab.submitForm(form);
			return false;
		},
		ajaxSubmit : function(url, param, $el) {
			// $el.html('<center><div class="ptLoading">加载中...</div></center>');
			blockUI($el);
			$.post(url, param, function(data) {
				unblockUI($el);
				$el.html(data);
			}).error(function(xhr, status, errMsg) {
				unblockUI($el);
				$el.html(xhr.responseText);
			});
		},
		getUrlParams : function(queryStr) {
			if (isnull(queryStr)) return {};
			var urlParams = {};
			var e, d = function(s) {
				return decodeURIComponent(s.replace(/\+/g, " "));
			}, r = /([^&=]+)=?([^&]*)/g;
			var i = queryStr.indexOf('?');
			if (i < 0) return {};
			q = queryStr.substring(i + 1)
			while (e = r.exec(q))
				urlParams[d(e[1])] = d(e[2]);
			return urlParams;
		},
		getUrl : function(queryStr) {
			var i = queryStr.indexOf('?');
			return i < 0 ? queryStr : queryStr.substring(0, i);
		}
	};
})(jQuery)
;
///<jscompress sourcefile="myapp.js" />
function isnull(str) {
	if (str == null || str == "" || str == "undefined") return true;
}
_webroot = (function(script, i, me) {
	for (var i = 0; i < script.length; ++i) {
		var src = script.item(i).src;
		if (src) {
			var index = src.indexOf("jquery");
			if (index >= 0) {
				index = src.indexOf("cssui");
				return src.substring(0, index);
			}
		}
	}
	return;
})(document.getElementsByTagName('script'), 0);

function logo_other(obj) {
	try {
		obj.onerror = null;
		obj.src = _webroot + 'cssui/images/error_icon.png';
		obj.title = '未上传';
	} catch (ex) {
	}
}

function blockUI(el, centerY) {
	jQuery(el).block({
		message : '<img src="' + _webroot + 'cssui/images/ajax-loading50.gif" align="">&nbsp;&nbsp;正在加载,请稍等......',
		centerY : centerY != undefined ? centerY : true,
		fadeIn : 0,
		fadeOut : 0,
		css : {
			top : '10%',
			width : '100%',
			border : 'none',
			padding : '30px',
			backgroundColor : 'none'
		},
		overlayCSS : {
			backgroundColor : '#000',
			opacity : 0.05,
			cursor : 'wait'
		}
	});
}
function unblockUI(el) {
	jQuery(el).unblock();
}

function blockButton(btn) {
	var d = 'disabled';
	var loading = '提交 ...';
	btn.each(function() {
		$el = $(this);
		$el.data('resetText', $el.html())
		$el.addClass(d).attr(d, d).prop(d, true)
		$el.html(loading);
	});
}
function unblockButton(btn) {
	var d = 'disabled';
	btn.each(function() {
		$el = $(this);
		$el.removeClass(d).removeAttr(d).prop(d, false)
		$el.html($el.data('resetText'));
	});
}

var g_tabHeight = 0;
var g_bodyHeight = 0;
var initLayoutTimestamp = 0;

function initLayout() {
	initLayoutTimestamp = new Date().getTime();
	g_bodyHeight = $(window).height() - $('.wrapper-header').outerHeight() - $('.wrapper-footer').outerHeight();
	$('.wrapper .wrapper-content').height(g_bodyHeight);
	g_tabHeight = g_bodyHeight - 39;
	$css.init();
	$navTab.resize();
	$jqsplit.resize();
}

/**
 * 2017.7 CSS WangWeidong
 * 
 * ie6,7
 * 
 * 1: 栅格系统修正 <div class="col-md-x col-ie" ie-size="10" ie-cols="1"/> ie-size:
 * 修正尺寸px ie-cols: 修正栅格列数1-12
 * 
 * ie6,7,8,9
 * 
 * 2: placeholder
 */
$ieFix = {
	resizeCondition : isIE6 || isIE7,
	condition : isIE6 || isIE7 || isIE8 || isIE9,
	initElement : function(element) {
		var $el = element;
		if (isnull(element))
			$el = $('#' + $navTab.getCurrentTab().id)
		else if (typeof (element) === 'string') {
			$el = $('#' + element);
		}
		return $el;
	},
	timeline : function(el, timer) {
		if (isIE6) {
			el = $ieFix.initElement(el);
			timer = isnull(timer) ? 10 : timer;
			setTimeout(function() {
				el.find('.timeline-before').each(function() {
					var $this = $(this);
					var $timeline = $this.parent();
					$this.css("height", $timeline.height() + 'px');
				});
			}, timer);
		}
	},
	resize : function(el, timer) {
		if ($ieFix.resizeCondition) {
			el = $ieFix.initElement(el);
			timer = isnull(timer) ? 10 : timer;
			setTimeout(function() {
				el.find('.col-ie').each(function() {
					var $this = $(this);
					var size = $this.attr('ie-size');
					size = (size == undefined) ? 10 : size;
					var cols = $this.attr('ie-cols');
					cols = (cols == undefined) ? 12 : cols;
					var percent = cols * 100 / 12;
					$this.css("width", percent + '%');
					$this.css("width", ($this.width() - size) + 'px');
				});
			}, timer);
		}
	},
	placeholder : function(el, timer) {
		if ($ieFix.condition) {
			el = $ieFix.initElement(el);
			timer = timer == undefined ? 10 : timer;
			setTimeout(function() {
				el.find('.placeholder-text').remove();
				el.find('[placeholder]').each(function() {
					var $input = $(this);
					var $txt = $('<div class="placeholder-text" unselectable="on" onselectstart="return false;">' + $(this).attr('placeholder') + '</div>');
					$input.after($txt);
					$txt.bind('click', function() {
						$input.focus();
					});
					var pos = $input.position();
					$txt.css({
						"position" : "absolute",
						"display" : isnull($input.val()) ? "" : "none",
						"left" : px(pos.left + 10),
						"top" : px(pos.top + $input.height() / 2 - (isIE8 || isIE9 ? 5 : 0))
					});
					$input.keyup(function() {
						if (isnull($input.val()))
							$txt.show();
						else
							$txt.hide();
					});
				});
			}, timer);
		}
	},
	fixed : function(el, timer) {
		if ($ieFix.condition) {
			$ieFix.resize(el, timer);
			$ieFix.placeholder(el, timer);
			$ieFix.timeline(el, timer);
		}
	}
};

/**
 * scroll v1.0 2017.6 CSS WangWeidong
 * 
 * 设 g_tabHeight = 800
 * 
 * el: class="l-autoscroll" sizeScale="0.5" scrollSize="40" fixedSize="-200"
 * 
 * if(fixedSize<=0)
 * 
 * el.height = (g_tabHeight + fixedSize) * sizeScale - scrollSize
 * 
 * if(fixedSize>0) el.height = fixedSize * sizeScale - scrollSize
 * 
 */
var scroll_options = {
	disableFadeOut : true,
	color : (isIE6 || isIE7 || isIE8) ? "#888" : "rgba(0,0,0,0.2)",
	size : "10px"
};
$scroll = {
	setScroll : function(element, initHeight) {
		var contentHeight = isnull(initHeight) ? g_tabHeight : initHeight;
		if (!(isIE6 || isIE7)) {
			element.find(".l-autoscroll, .s-autoscroll").slimScroll({
				destroy : true
			});
		}
		element.find(".l-autoscroll").each(function() {
			$this = $(this);
			var $el = $this.find('.l-autoscroll');
			if ($el.length < 1) {
				var opt = {};
				opt.height = (isnull(initHeight) ? $scroll.getHeight($this, contentHeight) : $scroll.getHeightDrag($this, contentHeight)) + "px";
				if (isIE6 || isIE7) {
					$this.css({
						"height" : opt.height,
						"overflow" : "auto"
					});
				}
				else {
					$this.slimScroll($.extend({}, scroll_options, opt));
				}
			}
			else {
				$this.css("overflow", "hidden");
			}
		});
		if (isIE6 || isIE7) {
			element.find(".s-autoscroll").css({
				"height" : (contentHeight - 41) + "px",
				"overflow" : "auto"
			});
		}
		else {
			element.find(".s-autoscroll").slimScroll($.extend({}, scroll_options, {
				height : (contentHeight - 39) + "px"
			}));
		}
	},
	getHeightDrag : function(el, height) {
		var size = el.attr('scrollSize');
		size = (size == undefined) ? 0 : size;
		return height - size;
	},
	getHeight : function(el, height) {
		var fixedSize = el.attr('fixedSize');
		if (fixedSize != undefined) {
			fixedSize = parseInt(fixedSize);
			height = (fixedSize < 0) ? height + fixedSize : fixedSize;
		}
		var scale = el.attr('sizeScale');
		scale = (scale == undefined) ? 1 : scale;
		height = Math.round(height * scale);
		
		var size = el.attr('scrollSize');
		size = (size == undefined) ? 0 : size;
		return height - size;
	},
	init : function(element) {
		if (g_tabHeight == 0) return;
		if (isnull(element)) {
			element = $('.wrapper-left, #' + $navTab.getCurrentTab().id);
			$navTab.hasTimestamp(initLayoutTimestamp)
		}
		else if (typeof (element) === 'string') {
			var bRet = $navTab.hasTimestamp(initLayoutTimestamp);
			if (bRet)
				return;
			else
				element = $('#' + element);
		}
		$scroll.setScroll(element);
	}
}

/**
 * BoxWidget ========= BoxWidget is a plugin to handle collapsing and removing
 */

var boxWidgetOptions = {
	boxWidgetIcons : {
		collapse : 'fa-minus',
		open : 'fa-plus',
		remove : 'fa-times'
	},
	boxWidgetSelectors : {
		remove : '[data-widget="remove"]',
		collapse : '[data-widget="collapse"]'
	},
	animationSpeed : 200
};

$box = {
	selectors : boxWidgetOptions.boxWidgetSelectors,
	icons : boxWidgetOptions.boxWidgetIcons,
	animationSpeed : boxWidgetOptions.animationSpeed,
	activate : function(_box) {
		var _this = this;
		if (!_box) {
			_box = document; // activate all boxes per default
		}
		$(_box).on('click', _this.selectors.collapse, function(e) {
			e.preventDefault();
			_this.collapse($(this));
		});
		$(_box).on('click', _this.selectors.remove, function(e) {
			e.preventDefault();
			_this.remove($(this));
		});
	},
	collapse : function(element) {
		var _this = this;
		var box = element.parents(".box").first();
		var box_content = box.find("> .box-body, > .box-footer, > form  >.box-body, > form > .box-footer");
		if (!box.hasClass("collapsed-box")) {
			element.children(":first").removeClass(_this.icons.collapse).addClass(_this.icons.open);
			box_content.slideUp(_this.animationSpeed, function() {
				box.addClass("collapsed-box");
			});
		}
		else {
			element.children(":first").removeClass(_this.icons.open).addClass(_this.icons.collapse);
			box_content.slideDown(_this.animationSpeed, function() {
				box.removeClass("collapsed-box");
			});
		}
	},
	remove : function(element) {
		var box = element.parents(".box").first();
		box.slideUp(this.animationSpeed);
	}
};
/**
 * sidebar v1.0 2017.6 CSS WangWeidong
 */

$sidebar = {
	obj : null,
	collapseWidth : '48', // 75
	floatMenu : $('#sidebarFloatMenu'),
	beforeEl : $('#sidebarFloatMenu'),
	isExpand : true,
	hide : function() {
		if (!$sidebar.isExpand) $sidebar.floatMenu.hide();
	},
	activeByTabId : function() {
		var tabId = $navTab.getCurrentTab().id;
		var parent = $sidebar.obj;
		var $this = parent.find("[rel='" + tabId + "']");
		var parent_li = $this.parent("li");
		parent.find('li.active').removeClass('active');
		parent_li.addClass('active');
		// 折叠打开的ul
		$sidebar.close(parent.find('.menu-open'));
		// 打开当前的ul
		$sidebar.open($this.parents('.treeview-menu'));
	},
	activeTopLi : function() {
		var el = $sidebar.obj.find('li.active');
		el.parents('li:last').addClass('active');
	},
	open : function(el) {
		if ($sidebar.isExpand) {
			el.addClass('menu-open').show();
			var arrow = el.parent().find('.pull-right-container i');
			arrow.removeClass('fa-angle-left').addClass('fa-angle-down');
		}
		else {
			el.parents('li:last').addClass('active');
		}
	},
	close : function(el) {
		if ($sidebar.isExpand) {
			el.removeClass('menu-open').hide();
			var arrow = $sidebar.obj.find('.pull-right-container i');
			arrow.removeClass('fa-angle-down').addClass('fa-angle-left');
		}
		else {
			el.parent().removeClass('active');
		}
	},
	toggle : function() {
		$sidebar.obj.find('.menu-open').removeClass('menu-open').hide();
		$sidebar.isExpand = !$sidebar.isExpand;
		if ($sidebar.isExpand)
			$sidebar.expand();
		else
			$sidebar.collapse();
		$ieFix.fixed(null, 100);
	},
	expand : function() {
		$sidebar.isExpand = true;
		$sidebar.stopEvent();
		$sidebar.obj.removeClass('collapse48 collapse75');
		$sidebar.obj.find('span').css("display", "");
		$(".wrapper-left").animate({
			"width" : "210px"
		}, 100);
		$(".wrapper-body-2").animate({
			"margin" : "0 0 0 210px"
		}, 100);
		$sidebar.activeByTabId();
	},
	collapse : function() {
		$sidebar.isExpand = false;
		$sidebar.obj.addClass('collapse' + $sidebar.collapseWidth);
		$('.wrapper-left').css('width', $sidebar.collapseWidth + 'px');
		$('.wrapper-body-2').css('margin', '0 0 0 ' + $sidebar.collapseWidth + 'px');
		$sidebar.startEvent();
		$sidebar.activeTopLi();
	},
	startEvent : function() {
		$sidebar.obj.find('>ul>li>a').on('mousemove touchmove', function(e) {
			e.preventDefault();
			var checkFlag = Slw.Event.checkHover(e, $sidebar.beforeEl);
			if (checkFlag) {
				$sidebar.unbindEvent();
				$sidebar.beforeEl = this;
				$this = $(this);
				var $ul = $this.next()
				var $sub = $sidebar.floatMenu;
				if ($ul.attr('class') == 'treeview-menu') {
					$sub.html('<ul class="sidebar-menu treeview-menu">' + $ul.html() + '</ul>');
					$sub.find('span').css("display", "");
					$sub.find('.treeview-menu').css("display", "block");
					var top = $this.offset().top - 1;
					var offset = isIE ? 3 : 25;
					if (top + $sub.height() + offset > $(window).height()) top = $(window).height() - $sub.height() - offset;
					$sub.css({
						left : $sidebar.collapseWidth + 'px',
						top : top + 'px'
					});
					$sub.show();
					
					$(document).one('click', function() {
						$sidebar.hide();
					});
					
					$sub.on('mouseleave', function(e) {
						e.preventDefault();
						$sidebar.hide();
					});
				}
				else
					$sub.hide();
				
			}
		})
	},
	hide : function() {
		$sidebar.floatMenu.hide();
		$sidebar.unbindEvent();
		$sidebar.beforeEl = $sidebar.floatMenu[0];
	},
	unbindEvent : function() {
		$sidebar.floatMenu.unbind();
	},
	stopEvent : function() {
		$sidebar.obj.find('>ul>li>a').unbind('mousemove touchmove mouseleave mouseout');
	},
	addLabel : function(id, label, color, valign) {
		var $el = $sidebar.obj.find('a[rel=' + id + ']').find('.menuLabel');
		var $item = $('<small class="label ' + valign + 'Label ' + color + '">' + label + '</small>');
		$el.after($item);
		return $item;
	},
	removeLabel : function(id, label) {
		$sidebar.obj.find('a[rel=' + id + ']').find('small').remove();
	},
	set : function(collapseWidth) {
		$sidebar.collapseWidth = collapseWidth;
		$sidebar.toggle();
	},
	init : function(menu, collapseWidth, isExpand) {
		$sidebar.obj = $(menu);
		$sidebar.obj.removeClass('collapse48 collapse75');
		if (!isnull(collapseWidth)) $sidebar.collapseWidth = collapseWidth;
		$sidebar.isExpand = !(typeof (isExpand) != "undefined" && isExpand == false);
		if (!$sidebar.isExpand) $sidebar.collapse();
		$(menu + ':not(.sidebar-menu)').bind('dblclick', function(e) {
			var $target = $(e.target);
			if ($target.hasClass('sidebar l-autoscroll')) $sidebar.toggle();
		});
		
		$sidebar.obj.find('li a').bind('click', function(e) {
			var $this = $(this);
			var checkElement = $this.next();
			if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible'))) {
				$sidebar.close(checkElement);
				checkElement.parent("li").removeClass("active");
			}
			else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
				var parent = $this.parents('ul').first();
				var ul = parent.find('ul:visible');
				$sidebar.close(ul);
				if ($sidebar.isExpand) $sidebar.open(checkElement);
			}
			if (checkElement.is('.treeview-menu')) e.preventDefault();
		});
	}
}

function initTreeLayout() {
}
$.fn.extend({
	isTag : function(tn) {
		if (!tn) return false;
		return $(this)[0].tagName.toLowerCase() == tn ? true : false;
	}
})
_path = (function(script, i, me) {
	var l = script.length;
	
	for (; i < l; i++) {
		me = !!document.querySelector ? script[i].src : script[i].getAttribute('src', 4);
		
		if (me.substr(me.lastIndexOf('/')).indexOf('lhgdialog') !== -1) break;
	}
	
	me = me.split('?');
	_args = me[1];
	
	return me[0].substr(0, me[0].lastIndexOf('/') + 1);
})(document.getElementsByTagName('script'), 0);

var lhgdialogFun = {
	openDialog : function(params) {
		var url, title, rel, lock, data, callback;
		if (params instanceof jQuery) {
			var $target = params, url = $target.attr('href') ? $target.attr('href') : '', title = $target.attr('title') ? $target.attr('title') : '', rel = $target.attr('rel') ? $target.attr('rel') : '', lock = $target.attr('lock') ? $target.attr('lock') : true, data = '';
		}
		else {
			if (typeof (params) === 'string') {
				url = params, title = '', rel = '', lock = true, data = '';
			}
			else {
				url = params.url ? params.url : '', title = params.title ? params.title : '', rel = params.rel ? params.rel : '', lock = params.lock == null ? true : params.lock, data = params.data ? params.data : '', callback = params.callback ? params.callback : null;
			}
		}
		if (url.isExternalUrl()) {
			$.dialog({
				id : rel,
				title : title,
				lock : true,
				width : 500,
				height : 300,
				content : 'url:' + url
			});
		}
		else {
			var a = {
				id : rel,
				title : title,
				lock : lock,
				resize : false,
				max : false,
				min : false,
				padding : 0
			}
			var api = $.dialog(a);
			$.ajax({
				url : url,
				data : data,
				type : 'POST',
				success : function(content) {
					api.content(content);
					api.position('50%', '38.2%');
					if (callback != null) callback(params);
				},
				cache : false
			});
		}
		return false;
	},
	focusDialog : function() {
		return $.dialog.focus.DOM.main[0];
	},
	closeDialog : function() {
		$.dialog.focus.close();
	},
	closeAllDialog : function() {
		var list = $.dialog.list;
		for ( var i in list) {
			list[i].close();
		}
	},
	tip : function(content) {
		$.dialog.tips(content, 1, 'success.gif');
	},
	alert : function(content, callback) {
		$.dialog.alert('<div style="min-width:300px;">' + content + '</div>', callback);
	},
	confirm : function(content, callback1, callback2) {
		$.dialog.confirm('<div style="min-width:300px;">' + content + '</div>', callback1, callback2);
	},
	show : function(options) {
		var opt = {
			fixed : true,
			max : false,
			min : false,
			button : []
		};
		if (!isnull(options.buttons)) {
			$.each(options.buttons, function(index, button) {
				var lhgBut = {};
				lhgBut.name = button.name;
				lhgBut.callback = button.action;
				opt.button.push(lhgBut);
			});
		}
		options = $.extend(options, opt);
		return $.dialog(options);
	}
};

var jqdialogFun = {
	openDialog : function(params) {
		return $jqdialog.open(params);
	},
	focusDialog : function() {
		return $jqdialog.getTopDialog();
	},
	closeDialog : function() {
		$jqdialog.closeTop();
	},
	closeAllDialog : function() {
		$jqdialog.closeAll();
	},
	tip : function(content) {
		$jqdialog.tip(content);
	},
	alert : function(content, callback) {
		$jqdialog.alert(content, callback);
	},
	confirm : function(content, callback1, callback2) {
		$jqdialog.confirm(content, callback1, callback2);
	},
	show : function(options) {
		return $jqdialog.show(options);
	},
	closeById : function(id) {
		$jqdialog.closeById(id);
	}
};
$css = {
	navTabInit : function(el) {
		if (initLayoutTimestamp == 0)
			initLayout();
		else
			$css.init(el);
	},
	init : function(el) {
		$scroll.init(el);
		$ieFix.fixed(el);
		$sidebar.hide();
	},
	timestampUrl : function(url) {
		if (url.indexOf('?') < 0) {
			url += '?';
		}
		else {
			url += '&';
		}
		url += '_=' + new Date().getTime();
		return url;
	},
	post : function(url, data, callback, type, el) {
		if (jQuery.isFunction(data)) {
			callback = data;
			data = {};
		}
		return jQuery.ajax({
			type : "POST",
			url : $css.timestampUrl(url),
			data : data,
			success : function(data) {
				if (jQuery.isFunction(callback)) callback(data);
			},
			dataType : type,
			error : function(xhr, status, errMsg) {
				if (el) unblockButton(el);
				$css.alert(xhr.responseText);
			}
		});
	},
	get : function(url, data, callback, type) {
		if (jQuery.isFunction(data)) {
			callback = data;
			data = null;
		}
		return jQuery.ajax({
			type : "GET",
			url : $css.timestampUrl(url),
			data : data,
			success : function(data) {
				if (jQuery.isFunction(callback)) callback(data);
			},
			dataType : type,
			error : function() {
				
			}
		});
	},
	load : function(selector, url, data, callback, type) {
		$.post(url, data, function(m) {
			$(selector).html(m);
			callback();
		})
	},
	checkedVal : function(name, parent, split) {
		if (isnull(split)) split = ',';
		var s = [];
		$('input[name="' + name + '"]:checked', $(parent)).each(function(i, t) {
			s.push($(t).val());
		})
		return s.join(split);
	},
	parseUrl : function(b, a) {
		var c = b ? b : document.location.href;
		b = {};
		a = a || "?";
		if (!c.indexOf(a)) return b;
		a = c.split(a)[1].split("&");
		for (c = 0; c < a.length; c++) {
			var e = a[c].replace(/#.*$/g, "").split("=");
			e[1] || (e[1] = "");
			// b[e[0]] = UI.B.ie ? e[1] : UI.decode(e[1])
			b[e[0]] = e[1];
		}
		return b
	}
}
;

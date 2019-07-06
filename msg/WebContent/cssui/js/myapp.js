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

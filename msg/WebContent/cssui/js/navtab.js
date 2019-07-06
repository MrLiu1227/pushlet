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

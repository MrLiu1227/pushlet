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

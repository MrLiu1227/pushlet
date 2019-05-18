/*
 * jqtab v1.0 2017.6 by CSS WangWeidong
 * bootstrap3-tab组件扩展
 */
;
(function($) {
	$.fn.jqtab = function(opt) {
		var defaults = {
			focusId : '',	//通过id定位，最高优先级
			focusIndex : 0,//通过索引序号定位（从0开始）
			extraPara : {} //业务参数
		};
		var o = $.extend(defaults, opt);
		return this.each(function() {
			var $this = $(this)
			var init = function() {
				$this.on('click.tab.data-api', '[data-toggle="tab"]', function(e) {
					var $tab = $(this);
					var id = $tab.attr('id');
					if (isnull(id))
						id = uuid();
					$tab.attr('id', id);
					$tab.attr('href', '#tab' + id);
					var $content = $this.find('.tab-content #tab' + id);
					if ($content.attr('id') == undefined) {
						$content = $('<div class="tab-pane" id="tab' + id + '"></div>');
						$this.find('.tab-content').append($content);
						var url = $tab.attr('data-url');
						$navTab.ajaxLoadForm(url, o.extraPara, $content);
					}
					e.preventDefault();
				});
				var $a = null;
				if (!isnull(o.focusId)) {
					$a = $this.find('#' + o.focusId).first();
					if ($a.length != 1)
						$a = null;
				}
				if ($a == null) {
					$a = $this.find('ul li a');
					if ($a.length < o.focusIndex)
						o.focusIndex = 0;
					$a = $this.find('ul li a').eq(o.focusIndex);
				}
				$a.click();
			};
			init();
		});
	};
})(jQuery);
/**
 * textarea-api v1.0 2017.9 by CSS WangWeidong textarea-api: maxlength
 */
;
(function($) {
	'use strict';
	var textareaMaxlen = function() {
		var $this = $(this);
		var $parent = $this.parent();
		var name = $this.attr('name');
		var $next = $parent.find('#' + name + '-textarea-api');
		if ($next.length == 0) {
			$next = $('<div id="' + name + '-textarea-api" class="pull-right maxlenCls"></div>');
			$this.after($next);
		}
		var count_input = $('<em style="color:red"></em>')
		var count_total = $this.attr('maxlen');
		var count_max = $('<span>' + count_total + '</span>');
		var area_val = $this.val();
		if (area_val.lenCn() > count_total) {
			area_val = autoAddEllipsis(area_val, count_total);// 根据字节截内容
			$this.val(area_val);
			count_input.text(0);
		}
		else {
			count_input.text(count_total - area_val.lenCn());// 显示可输入数
		}
		$next.html('');
		$next.append(count_input).append('/').append(count_max);
	}
	$(document).on('keyup.css.textarea-api keydown.css.textarea-api', '[textarea-api="maxlen"]', textareaMaxlen);
	
})(jQuery);

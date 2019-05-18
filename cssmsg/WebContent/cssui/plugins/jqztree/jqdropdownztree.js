/**
 * jqdropdownztree v1.0 2017.8 by CSS WangWeidong 下拉ztree组件扩展
 */
;
(function($) {
	$.fn.jqdropdownztree = function(formId, optZtree, opt) {
		var defaults = {
			offsetLeft : null,
			offsetTop : null,
			height : 300,
			className : 'input-large'
		};
		var o = $.extend(defaults, opt);
		var $input = $(this);
		var contentId = uuid();
		var $content = $('<div id="' + contentId + '" class="' + o.className + '" style="display: none; position: absolute; background-color: #fff; border: 1px solid #CCCCCC; overflow: auto; height: ' + o.height + 'px;"></div>');
		var $tree = $('<ul class="ztree"></ul>');
		$input.after($content);
		$content.append($tree);
		
		var service = {
			showMenu : function() {
				var pos = $input.position();
				if (isnull(o.offsetLeft)) o.offsetLeft = 0;
				if (isnull(o.offsetTop)) o.offsetTop = $input.outerHeight();
				console.log($input.outerWidth());
				$content.css({
					left : (pos.left + o.offsetLeft) + "px",
					top : (pos.top + o.offsetTop) + "px",
					width : $input.outerWidth() + "px"
				}).slideDown("fast");
				$("body").bind("mousedown", service.onBodyDown);
			},
			onBodyDown : function(event) {
				if (!(event.target.id == contentId || $(event.target).parents("#" + contentId).length > 0)) service.hideMenu();
			},
			hideMenu : function() {
				$content.fadeOut("fast");
				$('body').unbind('mousedown', service.onBodyDown);
			},
			setValue : function(data) {
				$input.val(data);
			}
		};
		var init = function() {
			$input.css({
				"cursor" : "pointer",
				"background-color" : "#fff"
			});
			
			$input.bind('click', function() {
				service.showMenu();
			});
			
			$tree.jqztree(formId, optZtree);
		}
		init();
		return service;
	};
})(jQuery);

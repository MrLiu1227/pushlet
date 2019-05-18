/**
 * SlwPlugins.SlwTag v1.0 2017.10 by CSS WangWeidong
 */
;
(function() {
	$.fn.slwTag = $.fn.jqTag = function(option) {
		var tag = new SlwPlugins.SlwTag(this, option);
		tag.init();
		return tag;
	};
	SlwPlugins.SlwTag = function(input, option) {
		this.input = $(input);
		this.defaults = {
			separator : ',',
			maxItems : 0,
			selectInput : true,
			selectInputQuery : true,
			selectMultiple : true,
			ignoreCase : true,
			newTagAllowed : true,
			debug : false
		};
		this.option = $.extend(this.defaults, option);
		this.tags = [];
		this.tagsLowerCase = [];
		this.selectObj = null;
	}
	/**
	 * SlwTag方法
	 */
	SlwPlugins.SlwTag.prototype = {
		init : function() {
			this.initView();
			this.initExec();
			this.selectObj.extraEvent();
		},
		initView : function() {
			var that = this;
			if (!that.option.debug) that.input.hide();
			that.inputView = $('<a href="javascript:void(0);" class="form-control ac-select"></a>');
			that.input.after(that.inputView);
			that.multiUl = $('<ul></ul>').appendTo(that.inputView);
		},
		refreshTags : function() {
			var that = this;
			that.tags = [];
			that.tagsLowerCase = [];
			that.inputView.find('li').each(function() {
				that.tags.push($(this).attr('tagValue'));
				that.tagsLowerCase.push($(this).attr('tagValue').toLowerCase());
			});
			that.input.val(that.tags.join(that.option.separator));
		},
		existTag : function(tag) {
			this.refreshTags();
			return this.option.ignoreCase ? $.inArray(tag.toLowerCase(), this.tagsLowerCase) >= 0 : $.inArray(tag, this.tags) >= 0;
		},
		initTag : function() {
			var that = this;
			var tags = that.input.val().split(that.option.separator);
			$.each(tags, function(index, tag) {
				if (!isnull(tag.trim())) that.addTag(tag);
			});
		},
		dealTag : function(tag) {
			return this.option.ignoreCase ? tag.toLowerCase() : tag;
		},
		addTag : function(tag) {
			var that = this;
			if (!that.existTag(tag)) {
				var li = $('<li class="ac-choice"></li>').appendTo(that.multiUl);
				var span = $('<span class="ac-choice-remove">×</span>').appendTo(li);
				li.append(tag);
				li.attr('tagValue', tag);
				li.attr('ignoreValue', that.dealTag(tag));
				that.refreshTags();
				span.one('click', function(e) {
					e.stopPropagation();
					e.preventDefault();
					li.remove();
					that.selectObj.hide();
					that.refreshTags();
				});
			}
		},
		delTag : function(tag) {
			this.inputView.find('li[ignoreValue="' + this.dealTag(tag) + '"]').remove();
		},
		initExec : function() {
			var that = this;
			var opt = $.extend({
				afterDrawHandler : function(li, item) {
					if (that.existTag(item.value)) li.addClass("active");
				},
				afterSelectedHandler : function(item, beforeIndex) {
					if (item.selected)
						that.addTag(item.value);
					else
						that.delTag(item.value);
					that.refreshTags();
					that.selectObj.show();
				},
				newTagHandler : function(size, inputEl) {
					if (that.option.newTagAllowed) {
						if (size < 1) {
							var tag = inputEl.val();
							if (!isnull(tag.trim())) that.addTag(tag);
						}
						inputEl.val('');
					}
				}
			}, that.option);
			that.selectObj = that.inputView.jqComplete(opt);
			that.initTag();
		}
	}

})(jQuery);

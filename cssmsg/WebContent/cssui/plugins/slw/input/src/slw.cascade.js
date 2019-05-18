/**
 * SlwPlugins.SlwCascade v1.0 2018.7 by CSS WangWeidong
 */
;
(function() {
	SlwPlugins.SlwCascade = function(elmentArray, option) {
		this.elmentArray = elmentArray;
		this.defaults = {
			url : '',
			data : [],
			ajaxDataType : 'json',
			maxHeight : 300,
			dataFormat : function(item) {
				item.label = item.name;
				item.text = item.name;
			},
			objectIndex : ''
		};
		this.option = $.extend(this.defaults, option);
		this.object;
	};
	/**
	 * SlwCascade方法
	 */
	SlwPlugins.SlwCascade.prototype = {
		init : function() {
			var that = this;
			that.object = new Array(that.elmentArray.length);
			for (var i = that.elmentArray.length - 1; i >= 0; i--) {
				
				var objOption = $.extend(true, {}, that.option);
				objOption.objectIndex = i;
				if (i < that.elmentArray.length - 1) {
					// 除了最后一个，其余都有onClick,onLoad 事件
					objOption.onClick = objOption.onLoad = function(item) {
						that.loadUrl(this, item);
					};
					
					// 第一个要加载相应url
					if (i == 0) objOption.data = that.option.url;
				}
				
				that.object[i] = that.elmentArray[i].jqSelect(objOption);
			}
		},
		loadUrl : function(el, item) {
			// 获取下一级联对象
			var index = el.option.objectIndex + 1;
			if (index == this.elmentArray.length) return;
			var obj = this.object[index];
			obj.refreshData((!isnull(item) && !item.isLeaf) ? item.child : [], '');
		}
	}

})(jQuery);

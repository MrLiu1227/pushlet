/**
 * SlwPlugins.SlwCascadeStep v1.0 2018.7 by CSS WangWeidong
 */
;
(function() {
	SlwPlugins.SlwCascadeStep = function(elmentArray, option) {
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
			objectIndex : '',
			objectId : ''
		};
		this.option = $.extend(this.defaults, option);
		this.object;
		this.cacheData = {};
		var index = this.option.url.lastIndexOf("=");
		this.urlPath = this.option.url.substring(0, index + 1);
		this.option.objectId = this.option.url.substring(index + 1);
		
	};
	/**
	 * SlwCascadeStep方法
	 */
	SlwPlugins.SlwCascadeStep.prototype = {
		init : function() {
			var that = this;
			that.object = new Array(that.elmentArray.length);
			for (var i = that.elmentArray.length - 1; i >= 0; i--) {
				
				var objOption = $.extend(true, {}, that.option);
				objOption.objectIndex = i;
				// 每个都有onLoad事件，处理缓存
				objOption.onLoad = function(item) {
					that.loadUrl(this, item);
				};
				
				if (i < that.elmentArray.length - 1) {
					// 除了最后一个，其余都有onClick事件
					objOption.onClick = function(item) {
						that.loadUrl(this, item);
					};
					
					// 第一个要加载相应url
					if (i == 0) {
						objOption.data = that.option.url;
					}
				}
				
				that.object[i] = that.elmentArray[i].jqSelect(objOption);
			}
		},
		loadUrl : function(el, item) {
			this.addCache(el);
			// 获取下一级联对象
			var index = el.option.objectIndex + 1;
			if (index == this.elmentArray.length) return;
			var obj = this.object[index];
			// 级联加载
			if (isnull(item)) {
				obj.option.objectId = '';
				obj.refreshData([], '');
			}
			else {
				obj.option.objectId = item.value;
				var cData = this.cacheData[item.value];
				if (typeof cData == 'undefined') {
					var url = this.urlPath + item.value;
					obj.refreshData(url, '');
				}
				else {
					obj.refreshData(cData, '');
				}
			}
		},
		addCache : function(el) {
			var cData = this.cacheData[el.option.objectId];
			if (typeof cData == 'undefined') this.cacheData[el.option.objectId] = el.selectObj.data;
		}
	}

})(jQuery);

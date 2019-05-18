/**
 * $jqdict Slw.Dictionary v1.1 2017.7 by CSS WangWeidong
 */
;
(function($) {
	Slw.Dictionary = function() {
		this.dictMap = {};
	}
	/**
	 * SlwGrid.Dictionary方法
	 */
	Slw.Dictionary.prototype = {
		getParam : function(dictArray) {
			var that = this;
			var arr = [];
			$(dictArray).each(function(i, item) {
				if (!(item in that.dictMap)) arr.push(item);
			});
			return arr;
		},
		getParamStr : function(dictArray) {
			var param = {};
			var arr = this.getParam(dictArray);
			param.dictArray = arr.join(",");
			return param;
		},
		initMap : function(dicts) {
			var map = {};
			$(dicts).each(function(i, item) {
				map[item.code] = item;
			});
			return map;
		},
		loadDict : function(dictArray, callback) {
			var that = this;
			var param = that.getParamStr(dictArray);
			if (Slw.Utils.isnull(param.dictArray)) {
				if (callback) callback.call(that);
				return;
			}
			$.post('loadDict.action', param, function(data) {
				switch (data.result) {
					case 0:
						for ( var key in data.msg)
							that.dictMap[key] = that.initMap(data.msg[key]);
						break;
					default:
						break;
				}
				if (callback) callback.call(that);
			}, 'json');
		},
		getDictList : function(table) {
			return this.dictMap[table];
		},
		getDictItem : function(table, key) {
			return this.dictMap[table][key];
		},
		/**
		 * <pre>
		 * $jqdict.put('dictKey', [
		 * 	{code : '1', name : '是', remark : ''},
		 * 	{code : '2', name : '否', remark : ''}]
		 * });
		 * </pre>
		 */
		put : function(key, dictItems) {
			this.dictMap[key] = this.initMap(dictItems);
		}
	}
	$jqdict = Slw.Dict = new Slw.Dictionary();
})(jQuery)

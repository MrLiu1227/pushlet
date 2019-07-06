/**
 * jqdict v1.0 2017.7 by CSS WangWeidong
 * 
 */
;
(function($) {
	var dictMap = {};
	var getParam = function(dictArray) {
		var arr = [];
		$(dictArray).each(function(i, item) {
			if (!(item in dictMap)) arr.push(item);
		});
		return arr;
	},

	getParamStr = function(dictArray) {
		var arr = getParam(dictArray);
		var param = {};
		param.dictArray = arr.join(",");
		return param;
	},

	initMap = function(dicts) {
		var map = {};
		$(dicts).each(function(i, item) {
			map[item.code] = item;
		});
		return map;
	};
	
	$jqdict = {
		loadDict : function(dictArray, callback) {
			var param = getParamStr(dictArray);
			if (isnull(param.dictArray)) {
				if (callback) callback.call(this);
				return;
			}
			$.post('loadDict.action', param, function(data) {
				switch (data.result) {
					case 0:
						var tmpArray = data.msg.map[0].entry;
						if (tmpArray instanceof Array) {
							$(tmpArray).each(function(i, item) {
								if (!(item.key in dictMap)) {
									var dicts = item.list[0].dict;
									dictMap[item.key] = initMap(dicts);
								}
							});
						}
						else {
							var item = tmpArray;
							if (!(item.key in dictMap)) {
								var dicts = item.list[0].dict;
								dictMap[item.key] = initMap(dicts);
							}
						}
						break;
					default:
						break;
				}
				if (callback) callback.call(this);
			}, 'json');
		},
		getDictList : function(table) {
			return dictMap[table];
		},
		getDictItem : function(table, key) {
			return dictMap[table][key];
		},
		arrayModel : function(table) {
			var b = {
				"result" : 0,
				"msg" : {
					"map" : [ {
						"entry" : [ {
							"key" : "d_root@d_truefalse",
							"list" : [ {
								"dict" : [ {
									"name" : "是",
									"code" : 1,
									"remark" : "<font color=red>是<\/font>"
								}, {
									"name" : "否",
									"code" : 2,
									"remark" : "否"
								} ]
							} ]
						} ]
					} ]
				}
			};
			
		}
	
	};
})(jQuery)

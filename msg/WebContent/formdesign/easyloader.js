(function() {
	var _1 = {
		common: {
		    css:"../../../../../dform/css/bootstrap/css/bootstrap.css?821;../../../../cssui/layout/default.css;../../../../cssui/layout/document.css;../../../../cssui/themes/metro/style.css"
		},
		jquery: {
			js: "../../../../cssui/plugins/jquery-1.10.2.min.js;"
		},
		dialog: {
			js: "../../../../cssui/plugins/lhgdialog/lhgdialog.js?skin=add",
			dependencies: ["jquery"]
		},
		tree: {
			js: "../../../../cssui/plugins/ztree/js/jquery.ztree.all-3.5.js",
			css: "../../../../../cssui/plugins/ztree/css/zTreeStyle/zTreeStyle.css"
		},
		commontree:{
			js: "../../../../acl/common/tree/js/ztree.js;../../../../acl/common/tree/js/jquery.ztree.ext.js;",
			dependencies: ["dialog","tree"]
		},
		file: {
			js: "../third-party/ajaxupload/ajaxupload.3.6.js",
			dependencies: ["dialog"]
		},
		date: {
			js: "../../../../cssui/plugins/My97DatePicker/WdatePicker.js",
			css: "../../../../../cssui/plugins/My97DatePicker/skin/WdatePicker.css"
		}
	};
	var _2 = {};
	var _3 = {};
	
	var hasCss = function(doc,src){
		src = src.substr(src.lastIndexOf("/")+1,src.lastIndexOf(".css")+4);
		var cssObjs = doc.getElementsByTagName("link");
		for (var i = 0; i < cssObjs.length; i++) {
			var str = cssObjs[i].attributes["href"] && cssObjs[i].attributes["href"].value;
			if (!str) {
				continue;
			}
			var m = str.indexOf(src)!=-1;
			if (m) {
				return true;
			}
		}
		return false
	}
	var hasJs = function(doc,src){
		src = src.substr(src.lastIndexOf("/")+1,src.lastIndexOf(".js")+3);
		var jsObjs = doc.getElementsByTagName("script");
		for (var i = 0; i < jsObjs.length; i++) {
			var str = jsObjs[i].attributes["src"] && jsObjs[i].attributes["src"].value;
			if (!str) {
				continue;
			}
			var m = str.indexOf(src)!=-1;
			if (m) {
				return true;
			}
		}
		return false;
	}

	function _4(_5, _6) {
		if(!_5)return;
		var _5s = _5.split(';');
		for(var i=0;i<_5s.length;i++){
			var __5 = _5s[i] && _5s[i].trim();
			if(!__5)continue;
			__5 = easyloader.base + __5;
			var _7 = false;
			var _8 = document.createElement("script");
			_8.type = "text/javascript";
			_8.language = "javascript";
			_8.src = __5;
			_8.onload = _8.onreadystatechange = function() {
				if (!_7 && (!_8.readyState || _8.readyState == "loaded" || _8.readyState == "complete")) {
					_7 = true;
					_8.onload = _8.onreadystatechange = null;
					if (_6) {
						_6.call(_8);
					}
				}
			};
			if(!hasJs(document,__5)){
				document.getElementsByTagName("head")[0].appendChild(_8);
			}else{
				if (_6) {
					_6.call(_8);
				}
			}
		}
	};

	function _9(_a, _b) {
		_4(_a, function() {
			document.getElementsByTagName("head")[0].removeChild(this);
			if (_b) {
				_b();
			}
		});
	};

	function _c(_d, _e) {
		if(!_d)return;
		var _ds = _d.split(';');
		for(var i=0;i<_ds.length;i++){
			var __d = _ds[i] && _ds[i].trim();
			if(!__d)continue;
			__d = easyloader.base + __d;
			var _f = document.createElement("link");
			_f.rel = "stylesheet";
			_f.type = "text/css";
			_f.media = "screen";
			_f.href = __d;
			if(!hasCss(document,__d)){
				document.getElementsByTagName("head")[0].appendChild(_f);
			}
			if (_e) {
				_e.call(_f);
			}
		}
	};

	function _10(_11, _12) {
		_3[_11] = "loading";
		var _13 = _1[_11];
		var _14 = "loading";
		var _15 = (easyloader.css && _13["css"]) ? "loading" : "loaded";
		if (easyloader.css && _13["css"]) {
			if (/^http/i.test(_13["css"])) {
				var url = _13["css"];
			} else {
				var url = easyloader.theme + "/" + _13["css"];
			}
			_c(url, function() {
				_15 = "loaded";
				if (_14 == "loaded" && _15 == "loaded") {
					_16();
				}
			});
		}
		if (/^http/i.test(_13["js"])) {
			var url = _13["js"];
		} else {
			var url = _13["js"];
		}
		_4(url, function() {
			_14 = "loaded";
			if (_14 == "loaded" && _15 == "loaded") {
				_16();
			}
		});

		function _16() {
			_3[_11] = "loaded";
			easyloader.onProgress(_11);
			if (_12) {
				_12();
			}
		};
	};

	function _17(_18, _19) {
		var mm = [];
		var _1a = false;
		if (typeof _18 == "string") {
			add(_18);
		} else {
			for (var i = 0; i < _18.length; i++) {
				add(_18[i]);
			}
		}

		function add(_1b) {
			if (!_1[_1b]) {
				return;
			}
			var d = _1[_1b]["dependencies"];
			if (d) {
				for (var i = 0; i < d.length; i++) {
					add(d[i]);
				}
			}
			mm.push(_1b);
		};

		function _1c() {
			if (_19) {
				_19();
			}
			easyloader.onLoad(_18);
		};
		var _1d = 0;

		function _1e() {
			if (mm.length) {
				var m = mm[0];
				if (!_3[m]) {
					_1a = true;
					_10(m, function() {
						mm.shift();
						_1e();
					});
				} else {
					if (_3[m] == "loaded") {
						mm.shift();
						_1e();
					} else {
						if (_1d < easyloader.timeout) {
							_1d += 10;
							setTimeout(arguments.callee, 10);
						}
					}
				}
			} else {
				if (easyloader.locale && _1a == true && _2[easyloader.locale]) {
					var url = "locale/" + _2[easyloader.locale];
					_9(url, function() {
						_1c();
					});
				} else {
					_1c();
				}
			}
		};
		_1e();
	};
	easyloader = {
		modules: _1,
		locales: _2,
		base: ".",
		theme: "default",
		css: true,
		locale: null,
		timeout: 2000,
		load: function(_1f, _20) {
			if (/\.css$/i.test(_1f)) {
				if (/^http/i.test(_1f)) {
					_c(_1f, _20);
				} else {
					_c(_1f, _20);
				}
			} else {
				if (/\.js$/i.test(_1f)) {
					if (/^http/i.test(_1f)) {
						_4(_1f, _20);
					} else {
						_4( _1f, _20);
					}
				} else {
					_17(_1f, _20);
				}
			}
		},
		onProgress: function(_21) {},
		onLoad: function(_22) {}
	};
	var _23 = document.getElementsByTagName("script");
	for (var i = 0; i < _23.length; i++) {
		var src = _23[i].src;
		if (!src) {
			continue;
		}
		var m = src.match(/easyloader\.js(\W|$)/i);
		if (m) {
			easyloader.base = src.substring(0, m.index);
		}
	}
	window.using = easyloader.load;
})();
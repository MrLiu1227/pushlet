/*
 * $urlloader v2.0 update from jquery.easyloader 2016.6 by CSS WangWeidong
 * remove undersocre.js
 */
(function() {
	var modules = {
		tree : {
			js : [ '../plugins/ztree/js/jquery.ztree.all-3.5.js' ],
			css : [ '../plugins/ztree/css/zTreeStyle/zTreeStyle.css?v=2' ]
		},
		slwGrid : {
			js : [ '../plugins/slw/grid/dist/slw.grid.full-2.2.min.js' ],
			dependencies : [ 'tree','slwColor' ]
		},
		jqupload : {
			js : [ '../plugins/slw/upload/dist/slw.upload.full-1.3.min.js' ],
			css : [ '../plugins/slw/upload/style/upload.css' ],
			dependencies : [ 'sortable', 'jqcropper', 'cssviewer' ]
		},
		selectUser : {
			js : [ '../../base/user/js/selectuser.js' ]
		},
		tableTools : {
			js : [ '../../demo/table/js/edittable.js', '../../demo/table/js/beautify.js', '../../demo/table/js/tabletree.js', '../../demo/table/js/tablecellsselection.js' ],
			dependencies : [ 'tree' ]
		},
		category : {
			js : [ '../../file/js/category.js?v=5' ],
			css : [ '../../file/css/category.css' ],
			dependencies : [ 'cloudfile', 'cssviewer' ]
		},
		cloudfile : {
			js : [ '../../file/js/cloudfile.js?v=3' ],
			css : [ '../../file/css/file.css?v=1' ],
			dependencies : [ 'cssuploader', 'fileTree' ]
		},
		fileTree : {
			js : [ '../../file/js/filetree.js?v=1' ],
			dependencies : [ 'tree' ]
		},
		portal : {
			js : [ '../../portal/js/addportlet.js?v=4', '../plugins/cssslider/cssslider.js' ],
			css : [ '../../portal/css/portal.css', '../plugins/cssslider/dark.css' ],
			dependencies : [ 'kindeditor', 'ajaxupload', 'sortable' ]
		},
		bbs : {
			js : [ '../../bbs/js/bbs.js?v=7', '../../bbs/js/attach.js', '../../bbs/js/addbbs.js?v=1', '../../bbs/js/bbstree.js?v=1' ],
			css : [ '../../bbs/css/bbs.css?v=2' ],
			dependencies : [ 'tree', 'kindeditor', 'ajaxupload', 'usercard' ]
		},
		tiku : {
			js : [ '../../tiku/js/tikutypetree.js', '../../tiku/js/addtiku.js?v=2' ],
			css : [ '../../tiku/css/tiku.css?v=1' ],
			dependencies : [ 'tree', 'ajaxupload', 'sortable' ]
		},
		usercard : {
			js : [ '../../bbs/jsplugin/usercard/usercard.js?v=1' ],
			css : [ '../../bbs/jsplugin/usercard/usercard.css?v=4' ]
		},
		cssuploader : {
			js : [ '../plugins/cssuploader/js/cssuploader.js?v=4', '../plugins/cssuploader/js/default.js?v=2' ],
			css : [ '../plugins/cssuploader/css/default.css?v=2' ],
			dependencies : [ 'sparkmd5' ]
		},
		orgchart : {
			js : [ '../plugins/orgchart/js/jquery.orgchart.js' ],
			css : [ '../plugins/orgchart/css/jquery.orgchart.css' ]
		},
		cssThumb : {
			js : [ '../plugins/slw/thumb/slw.thumb.min.js' ],
			css : [ '../plugins/slw/thumb/style/thumb.css' ]
		},
		cssviewer : {
			js : [ '../plugins/slw/viewer/dist/slw.viewer.full-2.1.min.js' ],
			css : [ '../plugins/slw/viewer/style/viewer.css' ]
		},
		cssSlider : {
			js : [ '../plugins/slw/slider/slw.slider.min.js' ],
			css : [ '../plugins/slw/slider/style/slider.css' ]
		},
		slwColor : {
			js : [ '../plugins/slw/color/slw.color.js' ],
			css : [ '../plugins/slw/color/style/color.css' ]
		},
		kindeditor : {
			js : [ '../../bbs/jsplugin/kindeditor-4.1.2/kindeditor.js?v=1', '../../bbs/jsplugin/kindeditor-4.1.2/lang/zh_CN.js', '../../bbs/jsplugin/kindeditor-4.1.2/plugins/code/sh/sh.js' ],
			css : [ '../../bbs/jsplugin/kindeditor-4.1.2/plugins/code/sh/sh.css' ]
		},
		ajaxupload : {
			js : [ '../../bbs/jsplugin/ajaxupload/ajaxupload.3.6.min.js' ]
		},
		sortable : {
			js : [ '../plugins/sortable/jquery.sortable.js?v=1' ]
		},
		jqcropper : {
			js : [ '../plugins/jqcropper/jqcropper.min.js' ],
			css : [ '../plugins/jqcropper/jqcropper.css' ]
		},
		jqslider : {
			// skin: skinModern.css, skinHTML5.css, skinFlat.css, skinNice.css,
			// skinSimple.css
			js : [ '../plugins/slider/js/ion.rangeSlider.js' ],
			css : [ '../plugins/slider/css/ion.rangeSlider.css', '../plugins/slider/css/ion.rangeSlider.skinModern.css' ],
			dependencies : [ 'moment' ]
		},
		moment : {
			js : [ '../plugins/moment/moment-2.5.min.js' ]
		},
		sparkmd5 : {
			js : [ '../plugins/spark-md5/spark-md5.js' ]
		}
	
	};
	var queues = {};
	function loadJs(url, callback) {
		var done = false;
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.language = 'javascript';
		script.src = url;
		script.onload = script.onreadystatechange = function() {
			if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete')) {
				done = true;
				script.onload = script.onreadystatechange = null;
				if (callback) {
					callback.call(script);
				}
			}
		}
		document.getElementsByTagName("head")[0].appendChild(script);
	}
	function loadCss(url, callback) {
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.media = 'screen';
		link.href = url;
		document.getElementsByTagName('head')[0].appendChild(link);
		if (callback) {
			callback.call(link);
		}
	}
	function loadSingle(urlInfo, callback) {
		queues[urlInfo.url] = 'loading';
		var url = (/^http/i.test(urlInfo.url)) ? urlInfo.url : (urlloader.base + urlInfo.url);
		if (urlInfo.type == 1) { // css
			loadCss(url, function() {
				finish();
			});
		}
		else { // js
			loadJs(url, function() {
				finish();
			});
		}
		function finish() {
			queues[urlInfo.url] = 'loaded';
			if (callback) {
				callback();
			}
		}
	}
	function loadModule(name, callback) {
		var mm = [];
		if (typeof name == 'string') {
			add(name);
		}
		else {
			for (var i = 0; i < name.length; i++) {
				add(name[i]);
			}
		}
		var urls = getUrls(mm);
		function getUrls(module) {
			var urls = [];
			var tmpMap = {};
			var type = [ 'js', 'css' ];
			var x = 0;
			for (var i = 0; i < module.length; i++) {
				for (var j = 0; j < type.length; j++) {
					var urlArray = modules[module[i]][type[j]];
					if (typeof (urlArray) != "undefined") {
						for (var k = 0; k < urlArray.length; k++) {
							var url = urlArray[k];
							if (!tmpMap[url]) {
								tmpMap[url] = url;
								urls[x++] = {
									url : url,
									type : j
								};
							}
						}
					}
				}
			}
			return urls;
		}
		function add(name) {
			if (!modules[name]) return;
			var d = modules[name]['dependencies'];
			if (d) {
				for (var i = 0; i < d.length; i++) {
					add(d[i]);
				}
			}
			mm.push(name);
		}
		function finish() {
			if (callback) {
				callback();
			}
		}
		var time = 0;
		function loadUrls() {
			if (urls.length) {
				var urlInfo = urls[0];
				if (!queues[urlInfo.url]) {
					loadSingle(urlInfo, function() {
						urls.shift();
						loadUrls();
					});
				}
				else if (queues[urlInfo.url] == 'loaded') {
					urls.shift();
					loadUrls();
				}
				else {
					if (time < urlloader.timeout) {
						time += 10;
						setTimeout(arguments.callee, 10);
					}
				}
			}
			else {
				finish();
			}
		}
		loadUrls();
	}
	urlloader = {
		modules : modules,
		base : '.',
		timeout : 2000,
		load : function(names, callback) {
			loadModule(names, callback);
		}
	};
	var scripts = document.getElementsByTagName('script');
	for (var i = 0; i < scripts.length; i++) {
		var src = scripts[i].src;
		if (!src) continue;
		var m = src.match(/urlloader\.js(\W|$)/i);
		if (m) {
			urlloader.base = src.substring(0, m.index);
		}
	}
	window.using = urlloader.load;
})();

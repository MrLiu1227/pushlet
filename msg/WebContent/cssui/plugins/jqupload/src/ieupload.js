;
(function() {
	var d = document, w = window;
	function addEvent(el, type, fn) {
		if (w.addEventListener) {
			el.addEventListener(type, fn, false);
		} else if (w.attachEvent) {
			var f = function() {
				fn.call(el, w.event);
			};
			el.attachEvent('on' + type, f)
		}
	}
	var toElement = function() {
		var div = d.createElement('div');
		return function(html) {
			div.innerHTML = html;
			var el = div.childNodes[0];
			div.removeChild(el);
			return el;
		}
	}();
	function hasClass(ele, cls) {
		return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	}
	function addClass(ele, cls) {
		if (!hasClass(ele, cls))
			ele.className += " " + cls;
	}
	function removeClass(ele, cls) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		ele.className = ele.className.replace(reg, ' ');
	}
	var getUID = function() {
		var id = 0;
		return function() {
			return 'ValumsIEUpload' + id++;
		}
	}();
	function fileFromPath(file) {
		return file.replace(/.*(\/|\\)/, "");
	}
	
	IEUpload = function(options) {
		this._input = null;
		this._submitting = false;
		this._parentDialog = d.body;
		this._settings = {
			action : 'upload.action',
			name : 'userfile',
			file : null,
			data : {},
			responseType : false,
			onChange : function(file, extension) {
			},
			onSubmit : function(file, extension) {
			},
			onComplete : function(file, response) {
			}
		};
		for ( var i in options) {
			this._settings[i] = options[i];
		}
		this._input = this._settings.file;
		this.submit();
	}
	IEUpload.prototype = {
		setData : function(data) {
			this._settings.data = data;
		},
		destroy : function() {
			if (this._input) {
				if (this._input.parentNode) {
					this._input.parentNode.removeChild(this._input);
				}
				this._input = null;
			}
		},
		_createIframe : function() {
			var id = getUID();
			var iframe = toElement('<iframe src="javascript:false;" name="' + id + '" />');
			iframe.id = id;
			iframe.style.display = 'none';
			d.body.appendChild(iframe);
			return iframe;
		},
		submit : function() {
			var self = this, settings = this._settings;
			this._input = settings.file;
			if (this._input.value === '') {
				return;
			}
			var file = fileFromPath(this._input.value);
			if (!(settings.onSubmit.call(this, file, getFileExt(file)) == false)) {
				var iframe = this._createIframe();
				var form = this._createForm(iframe);
				form.appendChild(this._input);
				form.submit();
				d.body.removeChild(form);
				form = null;
				this._input = null;
				var toDeleteFlag = false;
				addEvent(iframe, 'load', function(e) {
					if (iframe.src == "javascript:'%3Chtml%3E%3C/html%3E';" || iframe.src == "javascript:'<html></html>';") {
						if (toDeleteFlag) {
							setTimeout(function() {
								d.body.removeChild(iframe);
							}, 0);
						}
						return;
					}
					var doc = iframe.contentDocument ? iframe.contentDocument : frames[iframe.id].document;
					if (doc.readyState && doc.readyState != 'complete') {
						return;
					}
					if (doc.body && doc.body.innerHTML == "false") {
						return;
					}
					var response;
					if (doc.XMLDocument) {
						response = doc.XMLDocument;
					} else if (doc.body) {
						response = doc.body.innerHTML;
						if (settings.responseType && settings.responseType.toLowerCase() == 'json') {
							if (doc.body.firstChild && doc.body.firstChild.nodeName.toUpperCase() == 'PRE') {
								response = doc.body.firstChild.firstChild.nodeValue;
							}
							if (response) {
								response = window["eval"]("(" + response + ")");
							} else {
								response = {};
							}
						}
					} else {
						var response = doc;
					}
					settings.onComplete.call(self, file, response);
					toDeleteFlag = true;
					iframe.src = "javascript:'<html></html>';";
				});
			} else {
				d.body.removeChild(this._input);
				this._input = null;
			}
		},
		_createForm : function(iframe) {
			var settings = this._settings;
			var form = toElement('<form method="post" enctype="multipart/form-data"></form>');
			form.style.display = 'none';
			form.action = settings.action;
			form.target = iframe.name;
			d.body.appendChild(form);
			for ( var prop in settings.data) {
				var el = d.createElement("input");
				el.type = 'hidden';
				el.name = prop;
				el.value = settings.data[prop];
				form.appendChild(el);
			}
			return form;
		}
	};
})(jQuery);

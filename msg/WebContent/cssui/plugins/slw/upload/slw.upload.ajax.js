/**
 * SlwAjaxUpload v1.1 2017.8 by CSS WangWeidong
 */
;
(function() {
	$.fn.slwAjaxUpload = function(option) {
		var ajaxUpload = new SlwPlugins.SlwAjaxUpload(this, option);
		ajaxUpload.init();
		return ajaxUpload;
	};
	
	SlwPlugins.SlwAjaxUpload = function(el, options) {
		this.defaults = {
			action : 'upload.action',
			name : 'userfile',
			allowedTypes : '*',
			fileNumber : 1,
			// image/*很慢，建议用'image/jpg,image/jpeg,image/png,image/gif'
			data : {},
			responseType : 'json',
			onSubmit : function(file, extension) {
			},
			onComplete : function(file, response) {
			},
			onSuccess : function(file, response) {
			},
			onError : function(file, response, textSatus) {
			}
		};
		this.option = $.extend(this.defaults, options);
		this.btn = $(el);
		this.input = null;
	}
	SlwPlugins.SlwAjaxUpload.prototype = {
		init : function() {
			this.btn.css({
				"cursor" : "pointer"
			});
			this._createInput();
		},
		submit : function() {
			var that = this;
			var o = that.option;
			if (that.input.val() == '') return;
			var file = Slw.File.getFileName(that.input.val());
			if (o.onSubmit.call(this, file, Slw.File.getFileExt(file))) {
				var iframe = this._createIframe();
				var form = this._createForm(iframe);
				form.appendChild(that.input[0]);
				form.submit();
				document.body.removeChild(form);
				form = null;
				that.input = null;
				var toDeleteFlag = false;
				var complete = function(response) {
					toDeleteFlag = true;
					iframe.src = "javascript:'<html></html>';";
					that._createInput();
					o.onComplete.call(that, file, response);
				};
				$(iframe).on('load', function(e) {
					if (iframe.src == "javascript:'%3Chtml%3E%3C/html%3E';" || iframe.src == "javascript:'<html></html>';") {
						if (toDeleteFlag) {
							setTimeout(function() {
								document.body.removeChild(iframe);
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
					}
					else if (doc.body) {
						response = doc.body.innerHTML;
						if (o.responseType && o.responseType.toLowerCase() == 'json') {
							if (doc.body.firstChild && doc.body.firstChild.nodeName.toUpperCase() == 'PRE') {
								response = doc.body.firstChild.firstChild.nodeValue;
							}
							if (response) {
								var _tmp = response;
								response = Slw.Utils.toJson(response);
								if (response == '') {
									var info = $('<div>' + _tmp + '</div>');
									var textSatus = '';
									var h1 = info.find('h1');
									if (h1.length > 0) textSatus = h1.text();
									o.onError.call(that, file, _tmp, textSatus);
									complete(textSatus);
									return;
								}
							}
							else {
								response = {};
							}
						}
					}
					else {
						var response = doc;
					}
					o.onSuccess.call(that, file, response);
					complete(response);
				});
			}
			else {
				that.input.remove();
				that._createInput();
			}
		},
		hide : function() {
			this.btn.unbind();
			this.input.css({
				"display" : "none"
			});
		},
		show : function() {
			this._iepositionFix();
		},
		_createInput : function() {
			var o = this.option;
			var that = this;
			
			var acceptType = (o.allowedTypes != '*' ? 'accept="' + o.allowedTypes + '"' : '');
			that.input = $('<input type="file" name="' + o.name + '" style="display:none" unselectable="on" ' + acceptType + (o.fileNumber != 1 ? ' multiple="multiple"' : ' ') + '/>');
			that.btn.after(that.input);
			that._iepositionFix();
			
			that.input.on('change', function(evt) {
				if (that.input.val() == '') return;
				that.btn.attr("disabled", true);
				that.submit();
			});
			that.btn.attr("disabled", false);
		},
		_iepositionFix : function() {
			var o = this.option;
			var that = this;
			if (Slw.Utils.isIE() && Slw.Utils.ieVersion() < 10) {
				var btnLen = that.btn.outerWidth();
				var fontSize = btnLen * 19.001 / 100;
				that.input.css({
					"position" : "absolute",
					"display" : "",
					"width" : that.btn.outerWidth() + 'px',
					"height" : that.btn.outerHeight() + 'px',
					"left" : that.btn.position().left + 'px',
					"top" : that.btn.position().top + 'px',
					"cursor" : "pointer",
					"color" : "transparent",
					"font-size" : fontSize + 'px',
					"z-index" : 201707,
					"overflow" : "hidden",
					"opacity" : 0
				});
				
				that.btn.unbind();
				that.btn.hover(function() {
					that._iepositionFix();
				});
			}
			else {
				that.btn.unbind();
				that.btn.click(function() {
					that.input.click();
				});
			}
		},
		_createIframe : function() {
			var id = Slw.Utils.uuid();
			var $iframe = $('<iframe src="javascript:false;" name="' + id + '" />');
			$('body').append($iframe);
			var iframe = $iframe[0];
			iframe.id = id;
			iframe.style.display = 'none';
			return iframe;
		},
		_createForm : function(iframe) {
			var o = this.option;
			var $form = $('<form method="post" enctype="multipart/form-data"></form>');
			$('body').append($form);
			var form = $form[0];
			form.style.display = 'none';
			form.action = o.action;
			form.target = iframe.name;
			for ( var prop in o.data) {
				var el = document.createElement("input");
				el.type = 'hidden';
				el.name = prop;
				el.value = o.data[prop];
				form.appendChild(el);
			}
			return form;
		}
	};
})(jQuery);

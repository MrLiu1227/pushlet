/*
 * jqcropper v1.0 2017.6 by CSS WangWeidong
 */
;
(function($) {
	$.fn.jqcropper = function(o) {
		var defaults = {
			aspectRatio : 180 / 100,
			preview : null,
			fileInput : true,
			pos : null,
			autoFit : 0.8,
			userListener : null
		};
		var o = $.extend(defaults, o);
		var inBox = false, onBorder = false;
		var firstFlag = true;
		var $d = $(document);
		var $img = $(this);
		var url = $img.attr('src');
		var $wrapper = $img.parent();
		var $parent = $wrapper.parent();
		var $container = $('<div class="cropper-container"></div>');
		var $e = $('<div class="cropper-dragger"></div>');
		var imgCache = document.createElement('img');
		var cur = {}, pos = {}, naturalPos = {}, previewPos = {}, cropPos = {};
		var dirMap = {};
		var $preview = o.preview;
		var lineDir = '';
		var canvas;
		var ctx;
		var file = null;
		var $line;
		var $cropInput;
		var $cropFile;
		var service = {
			getNaturalPos : function() {
				return naturalPos;
			},
			getPreviewPos : function() {
				previewPos.width = $img.width();
				previewPos.height = $img.height();
				previewPos.x = 0
				previewPos.y = 0
				return previewPos;
			},
			getCropPos : function() {
				previewToCrop();
				return cropPos;
			},
			setCropPos : function(data) {
				cropPos = data;
				cropToPreview();
				moveToCheck();
			},
			getCropPosData : function() {
				previewToCrop();
				clearImage();
				canvas.width = cropPos.width;
				canvas.height = cropPos.height;
				console.log(canvas);
				ctx.drawImage($img[0], cropPos.x, cropPos.y, cropPos.width, cropPos.height, 0, 0, cropPos.width, cropPos.height);
				console.log(ctx);
				return canvas.toDataURL("image/png");
			},
			setUrl : function(newUrl) {
				if (!isnull(newUrl)) {
					url = newUrl;
					$img.attr('src', url);
					$img.show();
					loadImage(initCropper);
				}
			},
			getFile : function() {
				return file;
			},
			getPos : function() {
				return pos;
			},
			setPos : function(data) {
				pos = data;
				previewToCrop();
				moveToCheck();
			}
		};
		var getTemplate = function() {
			if (isnull(url))
				$img = $('<img style="display:none;" />');
			var tmpStr = '<canvas id="cropCanvas" style="display:none;" /><span class="cropper-viewer"><img /></span>';
			tmpStr += '<span class="cropper-dashed dashed-h"></span>';
			tmpStr += '<span class="cropper-dashed dashed-v"></span>';
			tmpStr += '<span class="cropper-face" data-dir="all"></span>';
			tmpStr += '<span class="cropper-line line-e" data-dir="e"></span>';
			tmpStr += '<span class="cropper-line line-n" data-dir="n"></span>';
			tmpStr += '<span class="cropper-line line-w" data-dir="w"></span>';
			tmpStr += '<span class="cropper-line line-s" data-dir="s"></span>';
			tmpStr += '<span class="cropper-point point-e" data-dir="e"></span>';
			tmpStr += '<span class="cropper-point point-n" data-dir="n"></span>';
			tmpStr += '<span class="cropper-point point-w" data-dir="w"></span>';
			tmpStr += '<span class="cropper-point point-s" data-dir="s"></span>';
			tmpStr += '<span class="cropper-point point-ne" data-dir="ne"></span>';
			tmpStr += '<span class="cropper-point point-nw" data-dir="nw"></span>';
			tmpStr += '<span class="cropper-point point-sw" data-dir="sw"></span>';
			tmpStr += '<span class="cropper-point point-se" data-dir="se"></span>';
			if (showButton()) {
				var fileStr = '';
				fileStr += '<div class="crop-upload">';
				fileStr += '	<button type="button" class="btn btn-primary crop-file">';
				fileStr += '		<i class="fa fa-folder-open-o"> 请选择图片</i>';
				fileStr += '	</button>';
				fileStr += '	<input type="file" class="crop-input" accept="image/jpg,image/jpeg,image/png,image/gif" name="crop_file" style="display: none">';
				fileStr += '</div>';
				$wrapper.before(fileStr);
				$cropInput = $parent.find('.crop-input');
				$cropFile = $parent.find('.crop-file');
			}
			$wrapper.empty().append($container);
			$e.append(tmpStr)
			$container.append($img).append('<div class="cropper-canvas cropper-modal cropper-crop"></div>').append($e);
			try {
				canvas = $e.find('#cropCanvas')[0];
				ctx = canvas.getContext("2d");
			} catch (e) {
			}
			$line = $e.find('.cropper-line, .cropper-point');
		}, showButton = function() {
			return o.fileInput && !(isIE6 || isIE7 || isIE8 || isIE9);
			
		}, clearImage = function() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			
		}, previewToCrop = function() {
			var ratio = naturalPos.width / previewPos.width;
			if (naturalPos.height > naturalPos.width)
				ratio = naturalPos.height / previewPos.height;
			cropPos = toPosByRatio(ratio, pos);
			
		}, cropToPreview = function() {
			var ratio = previewPos.width / naturalPos.width;
			if (naturalPos.height > naturalPos.width)
				ratio = previewPos.height / naturalPos.height;
			pos = toPosByRatio(ratio, cropPos);
			
		}, toPosByRatio = function(ratio, srcPos) {
			return {
				x : Math.round(ratio * srcPos.x),
				y : Math.round(ratio * srcPos.y),
				width : Math.round(ratio * srcPos.width),
				height : Math.round(ratio * srcPos.height)
			}

		}, logPos = function(pos) {
			console.log('pos', pos.x + ',' + pos.y + ',' + pos.width + ',' + pos.height);
			
		}, getCursor = function(e) {
			var x = (e.originalEvent) ? e.originalEvent.pageX : e.pageX;
			var y = (e.originalEvent) ? e.originalEvent.pageY : e.pageY;
			if (isIE6 || isIE7 || isIE8) {
				x = e.pageX;
				y = e.pageY;
			}
			return {
				'x' : x,
				'y' : y
			};
			
		}, px = function(n) {
			return isNumber(n) ? n + 'px' : n;
			
		}, moveTo = function() {
			$e.css({
				"left" : px(pos.x),
				"top" : px(pos.y),
				"width" : px(pos.width),
				"height" : px(pos.height)
			});
			$e.find('img').css({
				"margin-left" : '-' + px(pos.x),
				"margin-top" : '-' + px(pos.y)
			});
			refreshPreview();
			if (!isnull(o.userListener)) {
				previewToCrop();
				o.userListener(cropPos);
			}
			
		}, loadImage = function(callback) {
			if (isnull(url))
				callback();
			else {
				imgCache.onerror = function() {
					callback();
				};
				imgCache.onload = function() {
					callback();
				};
				imgCache.src = url;
			}
			
		}, setPrevewImg = function(_pre, _img) {
			_pre.css("height", pos.height * _pre.width() / pos.width);
			var tmpW = _pre.width();
			var tmpH = _pre.height();
			var ratio = tmpW / pos.width;
			if (pos.height > pos.width)
				ratio = tmpH / pos.height;
			var tmpPos = toPosByRatio(ratio, pos);
			_img.css({
				"width" : px(Math.round(ratio * previewPos.width)),
				"height" : px(Math.round(ratio * previewPos.height)),
				"margin-left" : '-' + px(tmpPos.x),
				"margin-top" : '-' + px(tmpPos.y)
			});
			
		}, dragEW = function(curNew, leftFixed) {
			var d = curNew.x - cur.x;
			var p = pos.x + d;
			pos.width = pos.width + d * (leftFixed ? 1 : -1);
			if (!leftFixed)
				pos.x = p;
			if (pos.width < 0) {
				pos.width = -pos.width;
				pos.x -= pos.width;
				dragDir(1);
			}
			if (!isnull(o.aspectRatio)) {
				if (lineDir.length == 1) {
					var h = pos.width / o.aspectRatio;
					pos.y -= (h - pos.height) / 2;
					pos.height = h;
					if (pos.y + pos.height > $container.height()) {
						pos.y = $container.height() - pos.height;
						if (pos.y < 0) {
							pos.y = 0;
							pos.height = $container.height();
							pos.width = pos.height * o.aspectRatio;
						}
					} else if (pos.y < 0)
						pos.y = 0;
					else if (pos.x < 0)
						pos.x = 0;
				}
			}
		}, dragSN = function(curNew, topFixed) {
			var d = curNew.y - cur.y;
			var p = pos.y + d;
			pos.height = pos.height + d * (topFixed ? 1 : -1);
			if (!topFixed)
				pos.y = p;
			if (pos.height < 0) {
				pos.height = -pos.height;
				pos.y -= pos.height;
				dragDir(0);
			}
			if (!isnull(o.aspectRatio)) {
				if (lineDir.length == 1) {
					var w = pos.height * o.aspectRatio;
					pos.x -= (w - pos.width) / 2;
					pos.width = w;
					if (pos.x + pos.width > $container.width()) {
						pos.x = $container.width() - pos.width;
						if (pos.x < 0) {
							pos.x = 0;
							pos.width = $container.width();
							pos.height = pos.width / o.aspectRatio;
						}
					} else if (pos.x < 0)
						pos.x = 0;
					else if (pos.y < 0)
						pos.y = 0
				}
			}
		}, fitRatio = function() {
			var newH, newW;
			if (!isNumber(pos.x) || pos.x < 0)
				pos.x = 0;
			if (!isNumber(pos.y) || pos.y < 0)
				pos.y = 0;
			if (!isnull(o.aspectRatio)) {
				if (lineDir.length == 2) {
					if (lineDir == 'ne') {
						newW = pos.height * o.aspectRatio;
						if (newW + pos.x > $container.width()) {
							pos.width = $container.width() - pos.x;
							newH = pos.width / o.aspectRatio;
							pos.y += pos.height - newH;
							pos.height = newH;
						} else
							pos.width = newW;
					} else if (lineDir == 'nw') {
						if (pos.x < 0) {
							pos.width += pos.x;
							newH = pos.x / o.aspectRatio;
							pos.x = 0;
							pos.y -= newW;
						} else {
							newH = pos.width / o.aspectRatio;
							pos.y += pos.height - newH;
							pos.height = newH;
						}
					} else if (lineDir == 'se') {
						if (pos.height + pos.y > $container.height()) {
							pos.height = $container.height() - pos.y;
							pos.width = pos.height * o.aspectRatio;
						} else
							pos.height = pos.width / o.aspectRatio;
					} else if (lineDir == 'sw') {
						if (pos.height + pos.y > $container.height()) {
							pos.height = $container.height() - pos.y;
							newW = pos.height * o.aspectRatio
							pos.x += pos.width - newW;
							pos.width = newW;
						} else
							pos.height = pos.width / o.aspectRatio;
					}
				}
			}
		}, dragmove = function(curNew) {
			if (onBorder)
				dragFun(curNew);
			else if (inBox)
				moveFun(curNew);
			else
				return;
			moveTo();
			cur = curNew;
		}, dragDir = function(index) {
			if (lineDir.length == 1)
				lineDir = dirMap[lineDir][0];
			else {
				var s = [];
				s[0] = lineDir.substring(0, 1);
				s[1] = lineDir.substring(1, 2);
				s[index] = dirMap[s[index]][0];
				lineDir = s[0] + s[1];
			}
		}, dragFun = function(curNew) {
			var s = [];
			for (var i = 0; i < lineDir.length; i++) {
				s[i] = lineDir.substring(i, i + 1)
				dirMap[s[i]][1](curNew, dirMap[s[i]][2]);
			}
			fitRatio();
		}, moveFun = function(curNew) {
			var l = pos.x + (curNew.x - cur.x);
			var t = pos.y + (curNew.y - cur.y);
			if (l < 0)
				pos.x = 0;
			else if ((l + pos.width) > $container.width())
				pos.x = $container.width() - pos.width;
			else
				pos.x = l;
			if (t < 0)
				pos.y = 0;
			else if ((t + pos.height) > $container.height())
				pos.y = $container.height() - pos.height;
			else
				pos.y = t;
		}, moveToCheck = function() {
			if (pos.x >= 0 && pos.y >= 0 && pos.width > 0 && pos.height > 0)
				if (pos.x + pos.width <= $container.width())
					if (pos.y + pos.height <= $container.height()) {
						moveTo();
						return;
					}
			initCropPos();
			
		}, startEvent = function() {
			$container.on('mousemove touchmove', function(e) {
				e.preventDefault();
				dragmove(getCursor(e));
			});
			$d.on('mouseup.jqcropper', function(e) {
				e.preventDefault();
				inBox = false;
				onBorder = false;
				stopEvent();
			});
			
		}, stopEvent = function() {
			$d.unbind('mouseup.jqcropper');
			$container.unbind();
			
		}, unbindEvent = function() {
			$d.unbind('mouseup.jqcropper');
			$container.unbind();
			$e.unbind();
			$line.unbind();
			if (showButton()) {
				$cropInput.unbind();
				$cropFile.unbind();
			}
		}, initEvent = function() {
			unbindEvent();
			if (showButton()) {
				$cropInput.on('change', function(evt) {
					var files = evt.target.files;
					if (isIE6 || isIE7 || isIE8 || isIE9) {
						var fileUrl = this.value;
						service.setUrl(fileUrl);
					} else {
						if (files.length > 0) {
							file = files[0];
							var fileUrl = URL.createObjectURL(file);
							service.setUrl(fileUrl);
						}
					}
					$(this).val('');
				});
				$cropFile.click(function() {
					$cropInput.click();
				});
			}
			$line.on('mousedown touchstart', function(e) {
				e.preventDefault();
				onBorder = true;
				startEvent();
				cur = getCursor(e);
				lineDir = $(this).attr('data-dir');
			});
			$e.on('mousedown touchstart', function(e) {
				e.preventDefault();
				inBox = true;
				startEvent();
				cur = getCursor(e);
			});
			
		}, initPreview = function() {
			$preview.each(function() {
				var imgStr = isnull(url) ? '' : '" src="' + url + '"';
				var $tmp = $('<img ' + imgStr + ' style="min-width: 0px !important; min-height: 0px !important; max-width: none !important; max-height: none !important;">');
				$(this).html('');
				$(this).append($tmp);
				setPrevewImg($(this), $tmp);
			});
			
		}, refreshPreview = function() {
			$preview.each(function() {
				var $tmp = $(this).find('img');
				setPrevewImg($(this), $tmp);
			});
			
		}, initCropPos = function() {
			var w = $container.width();
			var h = $container.height();
			var ratio = o.aspectRatio;
			if (isnull(ratio))
				ratio = w / h;
			if (ratio > 1) {
				pos.width = w * o.autoFit;
				pos.height = pos.width / ratio;
				if (pos.height > h) {
					pos.height = h * o.autoFit;
					pos.width = pos.height * ratio;
				}
			} else {
				pos.height = h * o.autoFit;
				pos.width = pos.height * ratio;
				if (pos.width > w) {
					pos.width = w * o.autoFit;
					pos.height = pos.width / ratio;
				}
			}
			pos.x = (w - pos.width) / 2;
			pos.y = (h - pos.height) / 2;
			moveTo();
			
		}, initPosition = function() {
			service.getPreviewPos();
			if (firstFlag && !isnull(o.pos)) {
				firstFlag = false;
				service.setCropPos(o.pos);
			} else
				initCropPos();
			
		}, initContainer = function() {
			var w = $wrapper.width();
			var h = $wrapper.height();
			var imgW = w;
			var imgH = w * naturalPos.height / naturalPos.width;
			if (imgH > h) {
				imgH = h;
				imgW = h * naturalPos.width / naturalPos.height;
				$container.css({
					"width" : px(imgW),
					"height" : px(imgH),
					"left" : px((w - imgW) / 2),
					"top" : px(0)
				})
			} else {
				$container.css({
					"width" : px(imgW),
					"height" : px(imgH),
					"left" : px(0),
					"top" : px((h - imgH) / 2)
				})
			}
			$img.css({
				"width" : px(imgW),
				"height" : px(imgH)
			});
			$e.find('.cropper-viewer img').css({
				"width" : px(imgW),
				"height" : px(imgH)
			});
		}, initNatural = function() {
			$e.find('.cropper-viewer img').attr('src', url);
			naturalPos.x = 0;
			naturalPos.y = 0;
			naturalPos.width = imgCache.width;
			naturalPos.height = imgCache.height;
			
		}, initCropper = function() {
			initNatural();
			initContainer();
			initPosition();
			initPreview();
			initEvent();
		}, init = function() {
			getTemplate();
			dirMap['e'] = [ 'w', dragEW, true ];
			dirMap['w'] = [ 'e', dragEW, false ];
			dirMap['s'] = [ 'n', dragSN, true ];
			dirMap['n'] = [ 's', dragSN, false ];
			loadImage(initCropper);
		};
		init();
		return service;
	};
	function isnull(str) {
		return (str == null || str == "" || str == "undefined");
	}
	function isNumber(n) {
		return typeof n === 'number' && !isNaN(n);
	}
})(jQuery);
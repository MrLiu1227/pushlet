;
(function($) {

	$.fn.handWrite = function(options) {

		$.defaults = {
			color : '#000' // 描画色
			,
			lineWidth : 5 // 太さ
			,
			output : null
			// base64出力先
		};

		// var element = null;
		var offset = 0;
		var flg = false;
		var posX = 0;
		var posY = 0;
		var context = null;
		var element = this;

		context = $(element).get(0).getContext('2d');

		if (options === 'clear') {
			context.clearRect(0, 0, $(element).width(), $(element).height());
			return false;
		}

		var settings = $.extend($.defaults, options);

		$(element).on('mousedown touchstart', function(e) {
					e.preventDefault();
					flg = true;
					var pX = (e.originalEvent)
							? e.originalEvent.pageX
							: e.pageX;
					var pY = (e.originalEvent)
							? e.originalEvent.pageY
							: e.pageY;
					posX = pX - $(element).offset().left - offset;
					posY = pY - $(element).offset().top - offset;
					return false;
				});

		$(element).on('mousemove touchmove', function(e) {
					e.preventDefault();
					if (flg) {
						var pX = (e.originalEvent)
								? e.originalEvent.pageX
								: e.pageX;
						var pY = (e.originalEvent)
								? e.originalEvent.pageY
								: e.pageY;
						var endX = pX - $(element).offset().left - offset;
						var endY = pY - $(element).offset().top - offset;
						context.lineWidth = settings.lineWidth;
						context.beginPath();
						context.moveTo(posX, posY);
						context.lineTo(endX, endY);
						context.lineCap = 'round';
						context.strokeStyle = settings.color;
						context.stroke();
						context.closePath();
						posX = endX;
						posY = endY;
					}
				});

		$(element).on('mouseup mouseleave touchend touchcancel', function(e) {
					e.preventDefault();
					flg = false;
					outputBase64(element, settings.output);
				});

		return this;

	};

	function outputBase64(element, output) {
		if (typeof $(output) !== 'undefined') {
			$(output).val($(element).get(0).toDataURL('image/png'))
					.trigger('change');
		}
	};

})(jQuery);
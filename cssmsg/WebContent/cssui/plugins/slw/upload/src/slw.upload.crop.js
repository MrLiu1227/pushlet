/**
 * $crop v1.0 Copyright(c) 2017.6 by CSS WangWeidong
 */
;
(function($) {
	var $cropForm; // = $('#getCropAttachmentForm');
	var $cropPreview;// = $cropForm.find('.crop-preview');
	var imgCrop;
	var cropData = {};
	var srcPos = {};
	$cropApp = {
		checkPos : function(toPos) {
			if (isnull(srcPos)) return true;
			if (srcPos.x == toPos.x && srcPos.y == toPos.y && srcPos.width == toPos.width && srcPos.height == toPos.height)
				return false;
			else
				return true;
		},
		saveClick : function() {
			var toPos = imgCrop.getCropPos();
			if (toPos.x < 0 || toPos.y < 0) {
				$css.alert("剪裁框不要超出图片！");
				return null;
			}
			cropData.e = toPos;
			cropData.file = imgCrop.getFile();
			if (cropData.file == null && !$cropApp.checkPos(toPos)) {
				$css.closeDialog();
				$css.tip('保存成功');
				return null;
			}
			return cropData;
		},
		options : {
			extraPara : null,
			extraData : null,
			cropForm : null,
			cropPreview : null
		},
		init : function(options) {
			var extraPara = options.extraPara;
			var extraData = options.extraData;
			$cropForm = $(options.cropForm);
			$cropPreview = $cropForm.find(options.cropPreview);
			
			srcPos = extraData;
			if (isnull(extraPara.previewWidth)) $css.alert('参数配置错误', $css.closeDialog());
			var i = 0;
			for (i = 0; i < extraPara.previewWidth.length; i++) {
				$cropForm.find('.crop-preview.preview' + i).css({
					"width" : extraPara.previewWidth[i] + "px",
					"height" : (0.01 * Math.ceil(extraPara.previewWidth[i] * extraPara.height * 100 / extraPara.width)) + "px"
				});
			}
			for (var index = i; index < 3; index++)
				$cropForm.find('.preview' + index).remove();
			imgCrop = $cropForm.find('.crop-wrapper img').jqcropper({
				aspectRatio : extraPara.width / extraPara.height,
				preview : $cropPreview,
				pos : srcPos
			});
		}
	};
})(jQuery)

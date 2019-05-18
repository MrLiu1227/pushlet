(function($, window, undefined) {
	var iconMap = {};
	iconMap['accdb'] = 'accdb.png';
	iconMap['avi'] = 'avi.png';
	iconMap['bmp'] = 'bmp.png';
	iconMap['css'] = 'css.png';
	iconMap['docx'] = 'docx.png';
	iconMap['doc'] = 'docx.png';
	iconMap['dot'] = 'docx.png';
	iconMap['eml'] = 'eml.png';
	iconMap['eps'] = 'eps.png';
	iconMap['fla'] = 'fla.png';
	iconMap['gif'] = 'gif.png';
	iconMap['html'] = 'html.png';
	iconMap['ind'] = 'ind.png';
	iconMap['ini'] = 'ini.png';
	iconMap['jpeg'] = 'jpeg.png';
	iconMap['jpg'] = 'jpeg.png';
	iconMap['jsf'] = 'jsf.png';
	iconMap['midi'] = 'midi.png';
	iconMap['mov'] = 'mov.png';
	iconMap['mp3'] = 'mp3.png';
	iconMap['m4a'] = 'mpeg.png';
	iconMap['mpeg'] = 'mpeg.png';
	iconMap['mp4'] = 'mpeg.png';
	iconMap['pdf'] = 'pdf.png';
	iconMap['png'] = 'png.png';
	iconMap['ppt'] = 'pptx.png';
	iconMap['pptx'] = 'pptx.png';
	iconMap['proj'] = 'proj.png';
	iconMap['psd'] = 'psd.png';
	iconMap['pst'] = 'pst.png';
	iconMap['pub'] = 'pub.png';
	iconMap['rar'] = 'rar.png';
	iconMap['readme'] = 'readme.png';
	iconMap['settings'] = 'settings.png';
	iconMap['txt'] = 'txt.png';
	iconMap['tiff'] = 'tiff.png';
	iconMap['url'] = 'url.png';
	iconMap['vsd'] = 'vsd.png';
	iconMap['wav'] = 'wav.png';
	iconMap['wma'] = 'wma.png';
	iconMap['wmv'] = 'wmv.png';
	iconMap['xls'] = 'xlsx.png';
	iconMap['xlsx'] = 'xlsx.png';
	iconMap['zip'] = 'zip.png';
	
	$.file = $.extend({}, {
		getFileSize : function(size) {
			if (size && size >= 0) {
				var i = Math.floor(Math.log(size) / Math.log(1024));
				return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + [ 'B', 'kB', 'MB', 'GB', 'TB' ][i];
			}
			return '';
		},
		getIcon : function(ext) {
			var icon = iconMap[ext];
			return (icon) ? icon : 'other.png'
		}
	}, $.file);
})(jQuery, this);

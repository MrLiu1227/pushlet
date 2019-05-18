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
	
	Slw.File = {
		sizeUnit : [ 'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ],
		toFileSize : function(value) {
			var size = {
				value : 0,
				unit : 'B'
			};
			if (value && value >= 0) {
				var i = Math.floor(Math.log(value) / Math.log(1024));
				size.value = Slw.Format.toFixed(value / Math.pow(1024, i), 2) * 1;
				size.unit = Slw.File.sizeUnit[i];
			}
			return size;
		},
		getFileSize : function(value) {
			if (value && value >= 0) {
				var i = Math.floor(Math.log(value) / Math.log(1024));
				return (value / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + Slw.File.sizeUnit[i];
			}
			return '';
		},
		getFileName : function(file) {
			return file.replace(/.*(\/|\\)/, "");
		},
		getFileExt : function(fileName) {
			if (fileName.indexOf('.') < 0) return '';
			return fileName.toLowerCase().split('.').pop();
		},
		getFullName : function(data) {
			var fullName = data.fileName;
			if (!isnull(data.fileExt)) fullName += '.' + data.fileExt;
			return fullName;
		},
		getIcon : function(ext) {
			var icon = iconMap[ext];
			return (icon) ? icon : 'other.png'
		},
		getIconImg : function(size, ext) {
			return '<img src="cssui/plugins/cssuploader/images/' + size + '/' + Slw.File.getIcon(ext) + '" class="file-icon" />';
		},
		checkExt : function(ext, okFile) { // ('jpg', 'jpg,doc,rar')
			var rgx = '(' + okFile.replace(/(,)/g, '|') + ')$';
			var re = new RegExp(rgx, 'i');
			return re.test(ext);
		}
	};
	$.file = Slw.File;
	
})(jQuery, this);

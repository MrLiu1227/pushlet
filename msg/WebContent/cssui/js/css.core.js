$.extend(String.prototype, {
	isPositiveInteger : function() {
		return (new RegExp(/^[1-9]\d*$/).test(this));
	},
	isInteger : function() {
		return (new RegExp(/^\d+$/).test(this));
	},
	isNumber : function(value, element) {
		return (new RegExp(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/).test(this));
	},
	trim : function() {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	},
	trimEnter : function() {
		return this.replace(/(^\s*)|(\s*$)|\r|\n/g, "");
	},
	startsWith : function(pattern) {
		return this.indexOf(pattern) === 0;
	},
	endsWith : function(pattern) {
		var d = this.length - pattern.length;
		return d >= 0 && this.lastIndexOf(pattern) === d;
	},
	replaceSuffix : function(index) {
		return this.replace(/\[[0-9]+\]/, '[' + index + ']').replace('#index#', index);
	},
	trans : function() {
		return this.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
	},
	replaceAll : function(os, ns) {
		return this.replace(new RegExp(os, "gm"), ns);
	},
	replaceTm : function($data) {
		if (!$data) return this;
		return this.replace(RegExp("({[A-Za-z_]+[A-Za-z0-9_]*})", "g"), function($1) {
			return $data[$1.replace(/[{}]+/g, "")];
		});
	},
	replaceTmById : function(_box) {
		var $parent = _box || $(document);
		return this.replace(RegExp("({[A-Za-z_]+[A-Za-z0-9_]*})", "g"), function($1) {
			var $input = $parent.find("#" + $1.replace(/[{}]+/g, ""));
			return $input.val() ? $input.val() : $1;
		});
	},
	isFinishedTm : function() {
		return !(new RegExp("{[A-Za-z_]+[A-Za-z0-9_]*}").test(this));
	},
	skipChar : function(ch) {
		if (!this || this.length === 0) {
			return '';
		}
		if (this.charAt(0) === ch) {
			return this.substring(1).skipChar(ch);
		}
		return this;
	},
	isValidPwd : function() {
		return (new RegExp(/^([_]|[a-zA-Z0-9]){6,32}$/).test(this));
	},
	isValidMail : function() {
		return (new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(this.trim()));
	},
	isSpaces : function() {
		for (var i = 0; i < this.length; i += 1) {
			var ch = this.charAt(i);
			if (ch != ' ' && ch != "\n" && ch != "\t" && ch != "\r") {
				return false;
			}
		}
		return true;
	},
	isPhone : function() {
		return (new RegExp(/(^([0-9]{3,4}[-])?\d{3,8}(-\d{1,6})?$)|(^\([0-9]{3,4}\)\d{3,8}(\(\d{1,6}\))?$)|(^\d{3,8}$)/).test(this));
	},
	isUrl : function() {
		return (new RegExp(/^[a-zA-z]+:\/\/([a-zA-Z0-9\-\.]+)([-\w .\/?%&=:]*)$/).test(this));
	},
	isExternalUrl : function() {
		return this.isUrl() && this.indexOf("://" + document.domain) == -1;
	},
	lenCn : function() {
		return this.replace(/[^\x00-\xff]/g, "xx").length;
	}
});

jQuery.extend({
	minValue : function(array) {
		return Math.min.apply(null, array);
	},
	maxValue : function(array) {
		return Math.max.apply(null, array);
	},
	equals : function(object1, object2) {
		for (propName in object1) {
			if (object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
				return false;
			}
			else if (typeof object1[propName] != typeof object2[propName]) {
				return false;
			}
		}
		for (propName in object2) {
			if (object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
				return false;
			}
			else if (typeof object1[propName] != typeof object2[propName]) {
				return false;
			}
			if (!object1.hasOwnProperty(propName)) continue;
			if (object1[propName] instanceof Array && object2[propName] instanceof Array) {
				if (!object1[propName].equals(object2[propName])) return false;
			}
			else if (object1[propName] instanceof Object && object2[propName] instanceof Object) {
				if (!object1[propName].equals(object2[propName])) return false;
			}
			else if (object1[propName] != object2[propName]) {
				return false;
			}
		}
		return true;
	}
});

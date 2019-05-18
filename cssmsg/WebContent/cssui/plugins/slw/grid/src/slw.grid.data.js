/**
 * SlwGrid.Data v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Data = function() {
		this.data = [];
	};
	
	/**
	 * SlwGrid.Data方法
	 */
	SlwGrid.Data.prototype = {
		getData : function(index, name) {
			return this.data[index][name];
		},
		setData : function(index, name, value) {
			this.data[index][name] = value;
		},
		size : function() {
			return this.data.length;
		},
		get : function(index) {
			return this.data[index];
		},
		clone : function(index) {
			return $.extend(true, {}, this.get(index))
		},
		getArray : function(startIndex, toIndex) {
			toIndex = Slw.Utils.isUndefined(toIndex) ? startIndex + 1 : toIndex + 1;
			return this.data.slice(startIndex, toIndex);
		},
		cloneArray : function(startIndex, toIndex) {
			return $.extend(true, [], this.getArray(startIndex, toIndex))
		},
		cloneAll : function() {
			return $.extend(true, [], this.data);
		},
		add : function(index, array) {
			for (var i = 0; i < array.length; i++) {
				this.data.splice(index + i, 0, array[i]);
			}
		},
		remove : function(index, num) {
			return this.data.splice(index, num);
		}
	};
	
})(jQuery);

(function(factory) {
	if (typeof define === "function" && define.amd) {
		define([ "jquery" ], factory); // AMD
	} else if (typeof exports === "object") {
		module.exports = factory; // Browserify
	} else {
		factory(jQuery); // globals
	}
}(function($) {
	/**
	 * 调用方法:
	 * 
	 * <pre>
	 * $('el').on('mresize', function() {
	 * 	
	 * });
	 * </pre>
	 */
	
	$.event.special.mresize = {
		add : function() {
			var el = $(this);
			if (el.data("mresize"))
				return;
			if (el.css("position") === "static")
				el.css("position", "relative");
			el.append("<div class='resize' style='position:absolute; width:auto; height:auto; top:0; right:0; bottom:0; left:0; margin:0; padding:0; overflow:hidden; visibility:hidden; z-index:-1'><iframe style='width:100%; height:0; border:0; visibility:visible; margin:0' /><iframe style='width:0; height:100%; border:0; visibility:visible; margin:0' /></div>").data("mresize", {
				"w" : el.width(),
				"h" : el.height(),
				t : null,
				throttle : 100
			}).find(".resize iframe").each(function() {
				$(this.contentWindow || this).on("resize", function() {
					var d = el.data("mresize");
					if (d.w !== el.width() || d.h !== el.height()) {
						if (d.t)
							clearTimeout(d.t);
						d.t = setTimeout(function() {
							el.triggerHandler("mresize");
							d.w = el.width();
							d.h = el.height();
						}, d.throttle);
					}
				});
			});
		},
		remove : function() {
			$(this).removeData("mresize").find(".resize").remove();
		}
	};
}));
/**
 * SlwPlugins.SlwMenu v1.0 2018.7 by CSS WangWeidong
 */
;
(function() {
	$.fn.slwMenu = function(option) {
		var menu = new SlwPlugins.SlwMenu(this, option);
		menu.init();
		return menu;
	};
	
	SlwPlugins.SlwMenu = function(el, option) {
		this.defaults = {
			direction : 'horizontal', // vertical, horizontal
			url : null, // url非空则请求此url，返回上述json格式，如果为空则处理html代码片断
			methodType : 'POST', // url请求方式
			params : {}, // url请求额外参数
			className : [ 'slwMenu', 'slwMenu-ul', 'slwMenu-sub-ul' ], // div、菜单父级ul、子级ul样式，非默认值需用户自定义样式
			target : 'cssTab', // 超链接target
			overflow : 'hidden', // 宽度超长：'hidden'隐藏或'visible'换行
			borderWidth : '0px 0px 1px 0px', // 框线宽度设置
			moreThanOne : false, // 三级菜单是否一行显示多个
			separator : null, // 菜单项之间是否有分隔线
			width : 200, // 下拉菜单宽度
			menuHeight : 33, // 菜单工具条高度
			labelInline : true, // 标题与图标在一行显示
			labelClass : 'collapse75',// 分行显示样式
			iconColor : 'text', // 图标着色方式，'bg'背景着色,'text'文字着色
			activeOpen : false, // 就否开启菜单激活状态
			activeItem : null
		// 当前激活的菜单项
		};
		this.option = $.extend(this.defaults, option);
		this.object = $(el);
		this.ul;
		this.data = [];
		this.floatMenu = $('<div class="' + this.option.className[0] + 'FloatMenu" style="display: none"></div>');
		this.object.after(this.floatMenu);
		this.beforeEl = this.floatMenu[0];
	};
	/**
	 * json:
	 * [{"id":"","value":"","name":"","isLeaf":false,"icon":"","iconColor":"","path":"","child":[]}...]
	 */
	
	/**
	 * SlwPlugins.SlwMenu方法
	 */
	SlwPlugins.SlwMenu.prototype = {
		init : function() {
			var that = this;
			that.object.addClass(that.option.className[0]);
			if (that.option.labelInline == false) {
				that.object.addClass(that.option.labelClass);
			}
			that.object.attr('unselectable', 'on');
			that.object.attr('onselectstart', 'retrun false;');
			that.object.css('border-width', that.option.borderWidth);
			that.floatMenu.css({
				'width' : that.option.width + 'px',
			});
			if (that.option.url != null) {
				$.ajax({
					url : that.option.url,
					type : that.option.methodType,
					data : that.option.params,
					cache : false,
					success : function(content) {
						that.data = content;
						that.initData(that.data, that.object, false);
						that.initEvent();
					}
				});
			}
			else
				that.initEvent();
		},
		initEvent : function() {
			var that = this;
			that.ul = that.object.children("ul").eq(0);
			if (that.option.direction == 'horizontal') {
				that.ul.css({
					'height' : that.option.menuHeight + 'px'
				});
			}
			that.object.append(Slw.Element.clear);
			if (that.option.overflow != 'hidden') {
				that.ul.css({
					'overflow' : that.option.overflow
				});
			}
			
			if (that.option.separator != null) {
				that.object.find('.' + that.option.className[1] + ' li a').css({
					'border-right' : that.option.separator
				});
			}
			if (that.option.activeOpen == true) {
				if (that.option.activeItem != null) {
					that.ul.children('li').each(function() {
						if ($(this).find('a').attr('rel') == that.option.activeItem) {
							$(this).addClass('active');
							return false;
						}
					});
				}
				that.ul.children('li').on('click', function(e) {
					that.ul.children('li').removeClass('active');
					$(this).addClass('active');
				});
			}
			
			this.object.find('>ul>li>a').on('mousemove touchmove', function(e) {
				e.preventDefault();
				e.stopPropagation();
				$this = $(this);
				var $ul = $this.next()
				var $sub = that.floatMenu;
				var checkFlag = Slw.Event.checkHover(e, that.beforeEl);
				if (checkFlag) {
					that.unbindEvent();
					that.beforeEl = this;
					if ($ul.attr('class') == that.option.className[2]) {
						var $newUl = $('<ul class="' + that.option.className[1] + ' ' + that.option.className[2] + '">' + $ul.html() + '</ul>');
						$sub.html('');
						$sub.append($newUl);
						var $subUl = $newUl.find('ul');
						if ($subUl.length > 0) {
							$subUl.append(Slw.Element.clear);
							$subUl.after(Slw.Element.clear);
						}
						if (that.option.moreThanOne && $subUl.length > 0) {
							$subUl.addClass("moreThanOne");
						}
						$sub.find(that.option.className[2]).css({
							'display' : 'block'
						});
						var objLeft = that.object.offset().left;
						var objTop = that.object.offset().top;
						var left = $this.offset().left;
						var top = $this.position().top;
						var offset = 5;
						if (that.option.direction == 'horizontal') {
							left = left - objLeft + that.object.position().left;
							top = top + that.option.menuHeight;
							if (left + $sub.width() + offset > that.object.width()) left = that.object.width() - $sub.width() - offset;
						}
						else {// vertical
							offset = isIE ? 3 : 25;
							left = $this.position().left + that.object.width() + that.object.position().left;
							top = $this.offset().top - objTop + that.object.position().top;
							if (top + $sub.height() + offset > g_tabHeight) top = g_tabHeight - $sub.height() - offset;
						}
						$sub.css({
							left : left + 'px',
							top : top + 'px'
						});
						$sub.show();
						$(document).on('click', function() {
							that.hide();
						});
						
						$sub.on('mouseleave', function(e) {
							e.preventDefault();
							that.hide();
						});
					}
					else
						that.hide();
					
				}
			})
		},
		hide : function() {
			this.floatMenu.hide();
			this.unbindEvent();
			this.beforeEl = this.floatMenu[0];
		},
		unbindEvent : function() {
			this.floatMenu.unbind();
		},
		initData : function(dataArray, el, subFlag) {
			var that = this;
			/**
			 * [{"id":"","value":"","name":"","isLeaf":false,"icon":"","iconColor":"","path":"","child":[]}...]
			 */
			var $ul = $('<ul class="' + (subFlag ? that.option.className[2] : that.option.className[1]) + '">');
			el.append($ul);
			for (var i = 0; i < dataArray.length; i++) {
				var data = dataArray[i];
				var $a = $('<a></a>');
				var href = isnull(data.path) ? 'javascript:;' : data.path;
				$a.attr('href', href);
				$a.attr('rel', data.value);
				$a.attr('title', data.name);
				if (href.indexOf('javascript:') < 0 || href == 'javascript:;') {
					$a.attr('target', this.option.target);
				}
				if (data.icon) {
					var colorStyle = subFlag ? 'text' : that.option.iconColor;
					$a.append('<i class="' + data.icon + ' color' + colorStyle + ' ' + colorStyle + '-' + data.iconColor + '"></i>');
				}
				$a.append('<span class="menuLabel">' + data.name + '</span>');
				var $li = $('<li></li>');
				$li.append($a);
				$ul.append($li);
				if (!data.isLeaf) {
					this.initData(data.child, $li, true);
				}
			}
		}
	}
})(jQuery);

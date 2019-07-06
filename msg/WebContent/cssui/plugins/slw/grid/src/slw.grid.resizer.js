/**
 * SlwGrid.Resizer v2.1 2018.8 by CSS WangWeidong
 */
;
(function() {
	SlwGrid.Resizer = function(grid) {
		this.grid = grid;
		this.guide = $('<div class="slwGridcolumnResizerGuide"></div>');
		this.resizer = $('<div class="slwGridcolumnResizer"></div>');
		this.size = 6;
		this.dragFlag = false;
		this.preLeft = 0;
		this.curTh = null;
	};
	/**
	 * SlwGrid.Resizer方法
	 */
	SlwGrid.Resizer.prototype = {
		init : function(option) {
			var grid = this.grid;
			if (grid.option.columnResize) {
				grid.table.css({
					'width' : 'auto'
				});
				grid.table.after(this.guide);
				grid.table.after(this.resizer);
				this.initEvent();
				this.initMenu();
			}
		},
		initEvent : function() {
			var grid = this.grid;
			var that = this;
			grid.table.find('thead tr th').on('mousemove', function(e) {
				if (that.dragFlag) return;
				var th = $(this);
				var bRet = false;
				if ((th.outerWidth() - (e.clientX - th.offset().left)) < that.size) {
					var pos = {};
					pos.left = th.offset().left + th.outerWidth() - that.size;
					pos.top = th.offset().top;
					pos.height = th.outerHeight();
					that.curTh = th;
					that.show(pos);
				}
				else {
					that.hide();
				}
			});
			that.resizer.on('mousedown.slwGridResize', function(e) {
				that.dragFlag = true;
				e.preventDefault();
				that.preLeft = that.guide.position().left;
				that.startEvent();
			});
		},
		startEvent : function() {
			var that = this;
			$(document).on('mousemove.slwGridResize', function(e) {
				e.preventDefault();
				that.move(e.clientX);
			});
			$(document).on('mouseup.slwGridResize', function(e) {
				e.preventDefault();
				that.resize();
				that.stopEvent();
			});
		},
		stopEvent : function() {
			$(document).unbind('mousemove.slwGridResize mouseup.slwGridResize');
		},
		move : function(left) {
			var that = this;
			this.guide.css({
				left : (left - 2 + that.size - 1) + 'px'
			});
			this.resizer.css({
				left : (left - 2) + 'px'
			});
		},
		resize : function() {
			var width = Math.round(this.curTh.outerWidth() + this.guide.position().left - this.preLeft);
			this.setWidth(this.curTh, width);
		},
		show : function(pos) {
			var grid = this.grid;
			var that = this;
			this.guide.css({
				left : (pos.left + that.size - 1) + 'px',
				top : pos.top + 'px',
				height : (grid.table.height() - (that.curTh.offset().top - grid.table.offset().top)) + 'px'
			});
			this.resizer.css({
				left : pos.left + 'px',
				top : pos.top + 'px',
				height : pos.height + 'px'
			});
			this.guide.show();
			this.resizer.show();
		},
		hide : function() {
			this.guide.hide();
			this.resizer.hide();
		},
		hideAll : function() {
			this.dragFlag = false;
			this.grid.selection.hideAll();
			this.hide();
		},
		initMenu : function() {
			var grid = this.grid;
			var str = '<ul class="dropdown-menu" id="slwGridThMenu">';
			str = str.concat('<li rel="left"><a href="javascript:;">居左(Left)</a></li>');
			str = str.concat('<li rel="center"><a href="javascript:;">居中(Center)</a></li>');
			str = str.concat('<li rel="right"><a href="javascript:;">居右(Right)</a></li>');
			str = str.concat('<li class="divider"></li>');
			str = str.concat('<li rel="top"><a href="javascript:;">上对齐(Top)</a></li>');
			str = str.concat('<li rel="middle"><a href="javascript:;">中对齐(Middle)</a></li>');
			str = str.concat('<li rel="bottom"><a href="javascript:;">下对齐(Bottom)</a></li>');
			str = str.concat('</ul>');
			grid.table.after(str);
			this.showMenu(grid.table.find('thead tr th'));
		},
		showMenu : function(obj) {
			var that = this;
			var grid = this.grid;
			obj.each(function() {
				$(this).contextMenu('slwGridThMenu', {
					init : function(el, menu) {
						var key = el.index();
						var cfg = grid.cfgHelper.getConfig(key);
						that.clearCheck(menu);
						that.checkItem(cfg.alignArray[0], menu);
						that.checkItem(cfg.alignArray[1], menu);
					},
					callback : {
						'left' : function(el, align) {
							that.setAlign(el, align, 0)
						},
						'center' : function(el, align) {
							that.setAlign(el, align, 0)
						},
						'right' : function(el, align) {
							that.setAlign(el, align, 0)
						},
						'top' : function(el, align) {
							that.setAlign(el, align, 1)
						},
						'middle' : function(el, align) {
							that.setAlign(el, align, 1)
						},
						'bottom' : function(el, align) {
							that.setAlign(el, align, 1)
						}
					}
				});
			});
		},
		clearCheck : function(menu) {
			menu.find('a').each(function() {
				$(this).html($(this).text());
			});
		},
		checkItem : function(key, menu) {
			var item;
			if (key != '') {
				item = menu.find('[rel=' + key + '] a');
				var txt = item.text();
				item.html('<i class="fa fa-check text-red"></i> ' + txt);
			}
		},
		setAlign : function(el, align, index) {
			var grid = this.grid;
			var key = el.index();
			var cfg = grid.cfgHelper.getConfig(key);
			cfg.alignArray[index] = align;
			grid.trs.each(function() {
				var td = $(this).find('td').eq(key);
				td.removeClass('text-left text-center text-right text-top text-middle text-bottom');
				td.addClass('text-' + cfg.alignArray[0] + ' text-' + cfg.alignArray[1]);
			});
		},
		smallSize : function() {
			var grid = this.grid;
			grid.table.css({
				'width' : 'auto',
				'max-width' : 'auto'
			});
			grid.table.find('td, th').css({
				'white-space' : 'nowrap',
				'text-overflow' : 'ellipsis',
				'-o-text-overflow' : 'ellipsis'
			});
			grid.table.find('thead tr th').each(function() {
				$(this).css('width', '0px');
			});
			this.hide();
		},
		fitSize : function() {
			var grid = this.grid;
			grid.table.css({
				'width' : '100%',
				'max-width' : '100%'
			});
			grid.table.find('td, th').css({
				'white-space' : '',
				'text-overflow' : '',
				'-o-text-overflow' : ''
			});
			grid.table.find('thead tr th').each(function() {
				var th = $(this);
				var width = th.attr('width');
				if (Slw.Utils.isUndefined(width)) width = '0px';
				th.css('width', width);
			});
			this.hide();
		},
		autoFit : function() {
			var grid = this.grid;
			grid.table.css({
				'width' : '100%',
				'max-width' : '100%'
			});
			grid.table.find('td, th').css({
				'white-space' : '',
				'text-overflow' : '',
				'-o-text-overflow' : ''
			});
			grid.table.find('thead tr th').each(function() {
				$(this).css('width', '0px');
			});
			this.hide();
		},
		setWidth : function(el, width) {
			if (el.length > 0 && width != el.outerWidth()) {
				el.css('width', width + 'px');
				this.hideAll();
				if ($.isFunction(this.grid.option.afterColumnResize)) {
					this.grid.option.afterColumnResize.apply(this.grid, [ el.index(), width ]);
				}
			}
			this.hide();
		}
	};
	
})(jQuery);

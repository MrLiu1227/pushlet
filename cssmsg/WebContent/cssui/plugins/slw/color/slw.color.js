/**
 * SlwPlugins.SlwColor v2.1 2012.6 by CSS WangWeidong
 */
;
(function ($) {
	 $.fn.slwColor = function(option) {
			var color = new SlwPlugins.SlwColor(this, option);
			color.init();
			return color;
	 };
	 
    SlwPlugins.SlwColor = function (el, option) {
        this.version = 'SlwColor v2.0';
        this.defaults = {
            color: '#000000',
            bgColor: true,
            cssStyle: 'slw-color-btn',
            lang: 1, //0:en, 1,中文
            onClose: null
        };
        this.option = $.extend(this.defaults, option);
        this.el = $(el);
    }
    /**
     * SlwPlugins.SlwColor方法
     */
    SlwPlugins.SlwColor.prototype = {
        init: function () {
            var o = this.option;
            var that = this;
            if (that.el.length == 0) return;
            that.el.addClass(o.cssStyle);
            that.el.each(function () {
                var obj = $(this);
                obj.attr('readonly', 'readonly');
                obj.css('cursor', 'pointer');
                that.initColor(obj);
                obj.unbind('click.slwColor');
                obj.on('click.slwColor', function () {
                    that.show(obj);
                });
            });
        },
        isShow: function () {
            if (!$SlwColorPanel.isLoad) return false;
            return $SlwColorPanel.panel.is(":visible");
        },
        focus: function (obj) {
            if (this.isShow())
                this.hide();
            else
                this.show(obj);
        },
        show: function (obj) {
            $SlwColorPanel.show(obj, this.option);
        },
        hide: function () {
            $SlwColorPanel.hide();
        },
        testColor: function (_c) {
            return $SlwColorPanel.testColor(_c, this.option)
        },
        initColor: function (obj) {
            $SlwColorPanel.initColor(obj, this.option);
        }
    };
    SlwPlugins.SlwColorPanel = function () {
        this.isLoad = false;
        this.inputObj;
        this.clear = '<div class="clear"></div>';
        this.space = '<div class="spacebar"></div>';
        this.data = {
            theme: ["Theme Colors>>", "主题颜色>>"],
            stand: ["Standard Colors", "标准颜色"],
            close: ["Close", "关闭"]
        };
        this.option;
    };
    SlwPlugins.SlwColorPanel.prototype = {
        show: function (el, o) {
            this.inputObj = el;
            this.option = o;
            var that = this;
            if (!that.isLoad) {
                that.isLoad = true;
                that.panel = $('<div class="slw-color"></div>');
                $('body').append(that.panel);
                that.drawTop();
                that.drawBody();
                that.drawLess();
                that.drawMore();
                that.drawBottom();
                that.initEvent();
            }
            that.initText();
            that.setValue();
            var pos = that.inputObj.offset();
            var top = pos.top + that.inputObj.outerHeight() + 1;
            if (top + this.panel.outerHeight() > $(window).height())
                top = pos.top - this.panel.outerHeight();
            var left = pos.left;
            if (left + this.panel.outerWidth() > $(window).width())
                left = $(window).width() - this.panel.outerWidth() - 20;
            that.panel.css({left: left + 'px', top: top + 'px'});
            that.panel.show();
            $(document).unbind('mousedown.slwColorPanel')
            $(document).bind('mousedown.slwColorPanel', function (e) {
               /* e.stopPropagation();
                e.preventDefault();*/
                var checkFlag = !(Slw.Event.onElement(e, that.panel[0]) || Slw.Event.onElement(e, that.inputObj[0]))
                if (checkFlag) {
                    that.hide();
                }
            });
        },
        hide: function () {
            if (!this.isLoad) return;
            this.panel.hide();
            if ($.isFunction(this.option.onClose)) {
                this.option.onClose.apply(this);
            }
        },
        testColor: function (_c, o) {
            if (!o)
                o = this.option;
            _c = _c.toUpperCase();
            var bRet = Slw.Valid.test('color', _c);
            return bRet ? _c : o.color;
        },
        initColor: function (obj, o) {
            var _c = this.testColor(obj.val(), o);
            //_c=obj.val();
            obj.val(_c);
            if (o.bgColor)
                obj.css({
                    'background-color': _c,
                    'color': Slw.Color.basicColor(_c)
                });
            else
                obj.css('background-color', '#FFFFFF');
            return _c;
        },
        setValue: function () {
            var _c = this.initColor(this.inputObj, this.option);
            this.cur.css('background-color', _c);
            this.curText.html(_c);
        },
        initText: function () {
            var o = this.option;
            this.theme.html(this.data.theme[o.lang]);
            this.standard.html(this.data.stand[o.lang]);
            this.close.html(this.data.close[o.lang]);
        },
        initEvent: function () {
            var that = this;
            that.theme.click(function () {
                $('.lessDiv,.moreDiv').toggle();
            });
            $('li', that.body).hover(function () {
                var c = $(this).attr('rel').toUpperCase();
                that.pre.css('background-color', c);
                that.preText.html(c);
            }).click(function () {
                that.inputObj.val($(this).attr('rel'))
                that.setValue();
                that.hide();
            });
            that.close.click(function () {
                that.hide();
            });
        },
        drawArray: function (c, clsFlag) {
            var str = '';
            for (var i = 0; i < c.length; i++) {
                var cls = '';
                if (clsFlag) {
                    if (i < 10) cls = ' class="topLi"';
                    else if (i > 39) cls = ' class="bottomLi"';
                }
                str += '<li rel="#' + c[i] + '"' + cls + ' style="background-color:#' + c[i] + '"></li>';
            }
            return str;
        },
        drawTop: function () {
            this.theme = $('<a href="javascript:;" class="theme"></a>');
            this.close = $('<a href="javascript:;"></a>');
            this.panel.append(this.theme).append(this.close).append(this.clear);
        },
        drawBody: function () {
            this.body = $('<div class="body"></div>');
            this.panel.append(this.body);
        },
        drawLess: function () {
            this.lessDiv = $('<div class="lessDiv"></div>');
            var _c1 = ['ffffff', '000000', 'eeece1', '1f497d', '4f81bd', 'c0504d', '9bbb59', '8064a2', '4bacc6', 'f79646'],
                _c2 = ['f2f2f2', '7f7f7f', 'ddd9c3', 'c6d9f0', 'dbe5f1', 'f2dcdb', 'ebf1dd', 'e5e0ec', 'dbeef3', 'fdeada',
                    'd8d8d8', '595959', 'c4bd97', '8db3e2', 'b8cce4', 'e5b9b7', 'd7e3bc', 'ccc1d9', 'b7dde8', 'fbd5b5',
                    'bfbfbf', '3f3f3f', '938953', '548dd4', '95b3d7', 'd99694', 'c3d69b', 'b2a2c7', '92cddc', 'fac08f',
                    'a5a5a5', '262626', '494429', '17365d', '366092', '953734', '76923c', '5f497a', '31859b', 'e36c09',
                    '7f7f7f', '0c0c0c', '1d1b10', '0f243e', '244061', '632423', '4f6128', '3f3151', '205867', '974806'],
                _c3 = ['c00000', 'ff0000', 'ffc000', 'ffff00', '92d050', '00b050', '00b0f0', '0070c0', '002060', '7030a0'];

            this.c1 = $('<ul></ul>');
            this.c1.append(this.drawArray(_c1));
            this.c2 = $('<ul class="c2"></ul>');
            this.c2.append(this.drawArray(_c2, true));
            this.standard = $('<div></div>');
            this.c3 = $('<ul></ul>');
            this.c3.append(this.drawArray(_c3));
            this.lessDiv.append(this.c1).append(this.space).append(this.c2).append(this.clear).append(this.standard).append(this.c3).append(this.space);
            this.body.append(this.lessDiv);
        },
        drawMore: function () {
            this.moreDiv = $('<div class="moreDiv"></div>');
            var _c4 = [
                ['003366', '336699', '3366cc', '003399', '000099', '0000cc', '000066'],
                ['006666', '006699', '0099cc', '0066cc', '0033cc', '0000ff', '3333ff', '333399'],
                ['669999', '009999', '33cccc', '00ccff', '0099ff', '0066ff', '3366ff', '3333cc', '666699'],
                ['339966', '00cc99', '00ffcc', '00ffff', '33ccff', '3399ff', '6699ff', '6666ff', '6600ff', '6600cc'],
                ['339933', '00cc66', '00ff99', '66ffcc', '66ffff', '66ccff', '99ccff', '9999ff', '9966ff', '9933ff', '9900ff'],
                ['006600', '00cc00', '00ff00', '66ff99', '99ffcc', 'ccffff', 'ccccff', 'cc99ff', 'cc66ff', 'cc33ff', 'cc00ff', '9900cc'],
                ['003300', '009933', '33cc33', '66ff66', '99ff99', 'ccffcc', 'ffffff', 'ffccff', 'ff99ff', 'ff66ff', 'ff00ff', 'cc00cc', '660066'],
                ['333300', '009900', '66ff33', '99ff66', 'ccff99', 'ffffcc', 'ffcccc', 'ff99cc', 'ff66cc', 'ff33cc', 'cc0099', '993399'],
                ['336600', '669900', '99ff33', 'ccff66', 'ffff99', 'ffcc99', 'ff9999', 'ff6699', 'ff3399', 'cc3399', '990099'],
                ['666633', '99cc00', 'ccff33', 'ffff66', 'ffcc66', 'ff9966', 'ff6666', 'ff0066', 'd60094', '993366'],
                ['a58800', 'cccc00', 'ffff00', 'ffcc00', 'ff9933', 'ff6600', 'ff0033', 'cc0066', '660033'],
                ['996633', 'cc9900', 'ff9900', 'cc6600', 'ff3300', 'ff0000', 'cc0000', '990033'],
                ['663300', '996600', 'cc3300', '993300', '990000', '800000', '993333']
            ];
            this.c4 = $('<div class="moreUl">&nbsp;</div>');
            for (var i = 0; i < _c4.length; i++)
                this.c4.append('<ul style="clear:both" class="mul' + i + '">' + this.drawArray(_c4[i]) + '</ul>');
            this.moreDiv.append(this.c4).append(this.space);
            this.body.append(this.moreDiv);
        },
        drawBottom: function () {
            this.footer = $('<div class="footer"></div>');
            this.cur = $('<div class="cur"></div>');
            this.curText = $('<div class="curText"></div>');
            this.pre = $('<div class="pre"></div>');
            this.preText = $('<div class="preText">#FFFFFF</div>');
            this.footer.append(this.cur).append(this.curText).append(this.pre).append(this.preText);
            this.panel.append(this.footer);
            if (Slw.Utils.ieVersion() == 6) {
                var frame = $('<iframe id="slw-color-frm" hideFocus="true" frameborder="0" src="about:blank" style="position:absolute;z-index:-1;width:100%;top:0px;left:0px;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0)"></iframe>');
                frame.css('height', this.panel.height() + 'px');
                this.panel.append(frame);
            }
        }
    };
    $SlwColorPanel = new SlwPlugins.SlwColorPanel();
})(jQuery)
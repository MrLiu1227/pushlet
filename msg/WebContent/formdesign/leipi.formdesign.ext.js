/*
* 设计器插件配置扩展
* 一
* UE.leipiFormDesignUrl  插件路径
* 
* 二
*UE.getEditor('myFormDesign',{
*          toolleipi:true,//是否显示，设计器的清单 tool
*/
//UE.leipiFormDesignUrl = 'formdesign';
/**
 * 插件构建模版函数
 * @method template_func
 * @param { String } ctlName 插件名称 唯一标识
 * @param { String } ctlDesc 插件描述
 * @param { String } templateSubUrl 插件模版文件url
 * @param { String } ele 插件所用html元素
 * @param { String } height 插件dialog高度
 * @param { String } width 插件dialog宽度
 */
function template_func(ctlName,ctlDesc,templateSubUrl,ele,height,width){
	if(! height) height=400;
	if(! width) width=600;
	
	return function () {
		var me = this,thePlugins = ctlName;
		me.commands[thePlugins] = {
			execCommand:function () {
				var dialog = new UE.ui.Dialog({
					iframeUrl:this.options.UEDITOR_HOME_URL + UE.leipiFormDesignUrl+templateSubUrl,
					name:thePlugins,
					editor:this,
					title: ctlDesc,
					cssRules:"width:"+width+"px;height:"+height+"px;",
					buttons:[
					{
						className:'edui-okbutton',
						label:'确定',
						onclick:function () {
							dialog.close(true);
						}
					},
					{
						className:'edui-cancelbutton',
						label:'取消',
						onclick:function () {
							dialog.close(false);
						}
					}]
				});
				dialog.render();
				dialog.open();
			}
		};
		var popup = new baidu.editor.ui.Popup( {
			editor:this,
			content: '',
			className: 'edui-bubble',
			_edittext: function () {
				  baidu.editor.plugins[thePlugins].editdom = popup.anchorEl;
				  me.execCommand(thePlugins);
				  this.hide();
			},
			_delete:function(){
				var anchorEl = this.anchorEl;
				window.confirms('确认删除该'+ctlDesc+'吗？',function(){
					baidu.editor.dom.domUtils.remove(anchorEl,false);
				});
				this.hide();
			}
		} );
		popup.render();
		me.addListener( 'mouseover', function( t, evt ) {
			evt = evt || window.event;
			var el = evt.target || evt.srcElement;
	        if ( $(el).parents(ele).attr('dfplugintype')==thePlugins ) {
	        	el =  $(el).parents(ele).get(0);
			}
	        var leipiPlugins = el.getAttribute('dfplugintype');
			if ( eval('/'+ele+'/ig').test(el.tagName) && leipiPlugins==thePlugins) {
				var html = popup.formatHtml(
					'<nobr>'+ctlDesc+': <span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>' );
				if ( html ) {
					popup.getDom( 'content' ).innerHTML = html;
					popup.anchorEl = el;
					popup.showAnchor( popup.anchorEl );
				} else {
					popup.hide();
				}
			}
		});
	};
}

/**
 * 日期输入框
 * @command date
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'date');
 * ```
 */
UE.plugins['date'] = template_func('date','日期控件','/date.html','input'); 
/**
 * 附件
 * @command file
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand('file');
 * ```
 */
UE.plugins['file'] = template_func('file','附件控件','/file.html','span',350); 
UE.plugins['org'] = template_func('org','机构控件','/org.html','span',200); 
UE.plugins['post'] = template_func('post','岗位控件','/post.html','span',200); 
UE.plugins['user'] = template_func('user','用户控件','/user.html','span',200); 
UE.plugins['doc'] = template_func('doc','正文控件','/doc.html','input',200); 
/**
 * 子表单选择
 * @command subform
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'subform');
 * ```
 */
UE.plugins['subform'] = template_func('subform','子表单控件','/subform.jsp?formId='+thisFormId,'span',230,600);
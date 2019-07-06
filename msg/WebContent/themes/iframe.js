if(!String.prototype["trim"]){
	String.prototype["trim"] = function() {
		return this.replace(/(^\s*)|(\s*$)|\r|\n/g, "");
	}
}
var DfpluginListener = function(win,doc){
	var listeners = {};
	win = win || window;
	doc = doc|| document;
	return {
		add:function(key,fn){
			if(key && fn && typeof(fn)=="function"){
				$.each(key.split(","),function(i,v){
					if(v && v.trim()){
						listeners[v.trim()] = fn;
					}
				});
			}
			return this;
		}
		,trigger:function(key,parm){
			if(key){
				$.each(key.split(","),function(i,v){
					if(v && v.trim() && listeners[v.trim()]){
						listeners[v.trim()].call(win,doc,parm);
					}
				});
			}
			return this;
		}
		,remove:function(key){
			if(key){
				$.each(key.split(","),function(i,v){
					if(v && v.trim() && listeners[v.trim()]){
						delete listeners[v.trim()];
					}
				});
			}
			return this;
		}
	};
};
top.dfTool.loadJs(document,"dform/js/ueditor/formdesign/easyloader.js",function(){
	if(window.$ && $.dialog && $.dialog.focus){
		//对tree和file的元素加载事件
		var dom = $.dialog.focus.DOM;
		var content = dom.content[0];
		var dfpluginListener = DfpluginListener(window,content);
		dfpluginListener.add("org",function(doc,el){
			setTimeout(function(){
				//top.dfTool.loadFunc(document,id,'$(function(){$("'+inputId+'").OrgTree({chkType:2});})');
				$(el).children("input:first").OrgTree({chkType:2});
			},10);
		}).add("post",function(doc,el){
			setTimeout(function(){
				//top.dfTool.loadFunc(document,id,'$(function(){$("'+inputId+'").PostTree({chkType:2});})');
				$(el).children("input:first").PostTree({chkType:2});
			},10);
		}).add("user",function(doc,el){
			setTimeout(function(){
				//top.dfTool.loadFunc(document,id,'$(function(){$("'+inputId+'").PostTree({chkType:2});})');
				$(el).children("input:first").UserTree({chkType:2});
			},10);
		}).add("file",function(doc,el){
			setTimeout(function(){
				//top.dfTool.loadFunc(document,id,'$(function(){new _AjaxUpload($("body #'+id+'").find("input[class~=upload]"));})');
				new _AjaxUpload($(el).children("input:first"));
			},10);
		}).add("text,date,radios,checkboxs,textarea",function(doc,el){
			setTimeout(function(){
				if($(el).attr("dfisnull")=="2"){
					$(el).after('<span class="requiredflag">*</span>');
				}
			},10);
		});
		$.each($('[dfplugintype][id]',content),function(i,v){
			dfpluginListener.trigger($(v).attr("dfplugintype"),v);
		});
		
		dom.close.click(function(){
			//top.dfTool.unloadFunc(document);
		});
	}else{
		//加载date,commontree，file等控件
		using("common");
		using("date");
		using("commontree");
		using("file");
	}
});

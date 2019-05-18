var oNode = null;
var dfplugintype = 'text';
var type = 'text';
var uuid = null;
var dfdatatype = null;
$(function(){
    if( UE.plugins[dfplugintype].editdom ){
        oNode = UE.plugins[dfplugintype].editdom;
		var dfname = oNode.getAttribute('dfname');
		var title = oNode.getAttribute('title');
		dfdatatype = oNode.getAttribute('dfdatatype');
		var value = oNode.getAttribute('value')||'';
		var styletextalign = getStyle(oNode,'styletextalign','text-align');
		var stylewidth = getStyle(oNode,'stylewidth','width');
		var styleheight = getStyle(oNode,'styleheight','height');
		var dfisnull = oNode.getAttribute('dfisnull');
		var dfminlength = getAttribute(oNode,'dfminlength','minlength');
		var dfmaxlength = getAttribute(oNode,'dfmaxlength','maxlength');
		uuid = oNode.getAttribute('id');
		$G('dfname').value = dfname;
        $G('title').value = title;
        $G('value').value = value;
        $G('styletextalign').value = styletextalign;
        $G('stylewidth').value = stylewidth.replace("px","");
        $G('styleheight').value = styleheight.replace("px","");
        $G('dfminlength').value = dfminlength;
        $G('dfmaxlength').value = dfmaxlength;
        setRadioValue('dfisnull', dfisnull);
    }else{
		uuid = getUUid();
    }
    
    $.ajax({
        type:'POST',
        url:'getDictsForDesigner.action',
        data:'tableName=d_datatype',
        dataType:"json",
        cache: false,
        success: function(data){
        	if(data.result == 0){
        		var dicts = data.msg;
        		var jsonDicts = eval("(" + dicts + ")");
        		initDict(jsonDicts);
        	}else{
        		alert(data.msg);
        	}
        }
    });	
});

function initDict(dicts){
	var selectObj = document.getElementById('dfdatatype');
	for ( var i = 0; i < dicts.length; i++ ){
		var dict = dicts[i];
		var option = new Option(dict.name, dict.code);
		selectObj.options.add(option);
	}
	if(dfdatatype != null){
		selectObj.value = dfdatatype;
	}
}

dialog.oncancel = function () {
    if( UE.plugins[dfplugintype].editdom ) {
        delete UE.plugins[dfplugintype].editdom;
    }
};
dialog.onok = function (){
    if($G('dfname').value==''){
        alert('请输入控件名称');
        return false;
    }
    if($G('title').value==''){
        alert('请输入控件描述');
        return false;
    }
	var dfname = $G('dfname').value.replace(/&quot;/g,"\"");
	var title = $G('title').value.replace(/&quot;/g,"\"");
	var dfdatatype = $G('dfdatatype').value;
	var value = $G('value').value.replace(/&quot;/g,"\"")||'';
	var styletextalign = $G('styletextalign').value;
	var stylewidth = $G('stylewidth').value.replace(/&quot;/g,"\"")||'';
	var styleheight = $G('styleheight').value.replace(/&quot;/g,"\"")||'';
	var dfisnull = getRadioValue('dfisnull');
	var dfminlength = $G('dfminlength').value.replace(/&quot;/g,"\"")||'';
	var dfmaxlength = $G('dfmaxlength').value.replace(/&quot;/g,"\"")||'';
    try {
    	var isNew = !oNode;
        if( isNew ) {
        	oNode = createElement('input', dfname);
        	oNode.setAttribute('type', type);
        }
    	oNode.setAttribute('id', uuid);
    	oNode.setAttribute('name', uuid);
    	oNode.setAttribute('dfplugintype', dfplugintype);
        oNode.setAttribute('dfdatatype', dfdatatype);
        oNode.setAttribute('dfname', dfname);
        oNode.setAttribute('title', title);
        oNode.setAttribute('value', value);
        oNode.setAttribute('dfisnull', dfisnull);
        setAttribute(oNode,dfminlength,'dfminlength','minlength');
        setAttribute(oNode,dfmaxlength,'dfmaxlength','maxlength');
        
        setStyle(oNode,styletextalign,"styletextalign","text-align");
        setStyle(oNode,stylewidth,"stylewidth","width");         
        setStyle(oNode,styleheight,"styleheight","height");         
    
        if(isNew) {
        	editor.execCommand('insertHtml', oNode.outerHTML);
	    } else {
	        delete UE.plugins[dfplugintype].editdom;
	    }
    } catch (e) {
        try {
            editor.execCommand('error');
        } catch ( e ) {
            alert('控件异常，请检查代码！');
        }
        return false;
    }
};
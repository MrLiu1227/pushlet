var oNode = null;
var dfplugintype = 'file';
var uuid = null;
var dfdatatype = 8;
$(function(){
    if( UE.plugins[dfplugintype].editdom ){
        oNode = UE.plugins[dfplugintype].editdom;
		var dfname = oNode.getAttribute('dfname');
		var title = oNode.getAttribute('title');
		var dfmaxsize = oNode.getAttribute('dfmaxsize');
		var dffilecount = oNode.getAttribute('dffilecount');
		var dfuploadformat = oNode.getAttribute('dfuploadformat');
		var dfisnull = oNode.getAttribute('dfisnull');
		uuid = oNode.getAttribute('id');
		$G('dfname').value = dfname;
        $G('title').value = title;
        $G('dfmaxsize').value = dfmaxsize;
        $G('dffilecount').value = dffilecount;
        $G('dfuploadformat').value = dfuploadformat;
        setRadioValue('dfisnull', dfisnull);
    }else{
		uuid = getUUid();
    }
    
});


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
	var dfmaxsize = $G('dfmaxsize').value||20;
	var dffilecount = $G('dffilecount').value.replace(/&quot;/g,"\"")||'';
	var dfuploadformat = $G('dfuploadformat').value;
	var dfisnull = getRadioValue('dfisnull');
    try {
        if( !oNode ) {
        	oNode = createElement('span', dfname);
        	
        	oNode.setAttribute('dfplugintype', dfplugintype);
        	
        	
        	oNode.setAttribute('id', uuid);
        	oNode.setAttribute('name', uuid);
            oNode.setAttribute('dfname', dfname);
            oNode.setAttribute('title', title);
            oNode.setAttribute('dfmaxsize', dfmaxsize);
            oNode.setAttribute('dffilecount', dffilecount);
            oNode.setAttribute('dfuploadformat', dfuploadformat);
            oNode.setAttribute('dfisnull', dfisnull);
            oNode.setAttribute('dfdatatype', dfdatatype);
            
            oNode.setAttribute('unselectable', 'on');
            oNode.innerHTML = getInnerHtml(dfmaxsize,dffilecount,dfuploadformat,dfisnull);
            
            editor.execCommand('insertHtml', oNode.outerHTML);
	    } else {
	    	oNode.setAttribute('id', uuid);
        	oNode.setAttribute('name', uuid);
            oNode.setAttribute('dfname', dfname);
            oNode.setAttribute('title', title);
            oNode.setAttribute('dfmaxsize', dfmaxsize);
            oNode.setAttribute('dffilecount', dffilecount);
            oNode.setAttribute('dfuploadformat', dfuploadformat);
            oNode.setAttribute('dfisnull', dfisnull);
            oNode.setAttribute('dfdatatype', dfdatatype);
            
            oNode.innerHTML = getInnerHtml(dfmaxsize,dffilecount,dfuploadformat,dfisnull);
            //dfmaxsize="20" dffilecount="10" dfuploadformat="" dfisnull="2"
            
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


function getInnerHtml(dfmaxsize,dffilecount,dfuploadformat,dfisnull){
	return '<span id="filelist"></span><input unselectable="on" class="upload" type="button" '
	       +' dfmaxsize="'+dfmaxsize+'" dffilecount="'+dffilecount+'" dfuploadformat="'+dfuploadformat+'" dfisnull="'+dfisnull+'" '
	       +' onclick="" value="上传" />';
}
var oNode = null;
var dfplugintype = 'user';
var uuid = null;
$(function(){
    if( UE.plugins[dfplugintype].editdom ){
    	oNode = UE.plugins[dfplugintype].editdom;
		var dfname = oNode.getAttribute('dfname');
		var title = oNode.getAttribute('title');
		var dfisnull = oNode.getAttribute('dfisnull');
		var dfismult = oNode.getAttribute('dfismult');
		uuid = oNode.getAttribute('id');
		$G('dfname').value = dfname;
        $G('title').value = title;
        setRadioValue('dfisnull', dfisnull);
        setRadioValue('dfismult', dfismult);
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
	var dfisnull = getRadioValue('dfisnull');
	var dfismult = getRadioValue('dfismult');
    try {
        if( !oNode ) {
        	oNode = createElement('span', dfname);
        	
        	oNode.setAttribute('dfplugintype', dfplugintype);
        	
        	
        	oNode.setAttribute('id', uuid);
        	oNode.setAttribute('name', uuid);
            oNode.setAttribute('dfname', dfname);
            oNode.setAttribute('title', title);
            oNode.setAttribute('dfisnull', dfisnull);
            oNode.setAttribute('dfismult', dfismult);
            
            oNode.innerHTML = getInnerHtml(uuid);
            editor.execCommand('insertHtml', oNode.outerHTML);
	    } else {
	    	oNode.setAttribute('id', uuid);
        	oNode.setAttribute('name', uuid);
            oNode.setAttribute('dfname', dfname);
            oNode.setAttribute('title', title);
            oNode.setAttribute('dfisnull', dfisnull);
            oNode.setAttribute('dfismult', dfismult);
	        
	        delete UE.plugins[dfplugintype].editdom;
	    }
        //修复焦点在span里，造成设计器enter时，复制span里的内容
        $(document).focus();
    } catch (e) {
        try {
            editor.execCommand('error');
        } catch ( e ) {
            alert('控件异常，请检查代码！');
        }
        return false;
    }
};


function getInnerHtml(){
	return '<input type="button" onclick="" value="选择用户" /><span id="userlist"><input type="hidden" name="users" /></span>';
}
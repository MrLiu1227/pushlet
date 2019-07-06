var oNode = null;
var dfPluginType = 'subform';
var uuid = null;
var dfFormId = null;
var value = null;

$(function(){
    if( UE.plugins[dfPluginType].editdom ){
        oNode = UE.plugins[dfPluginType].editdom;
		
        var dfname = oNode.getAttribute('dfname');
		var title = oNode.getAttribute('title');
		dfFormId = oNode.getAttribute('dfSubform');  
		/*
		  $G('dfname').value = dfname;
          $G('title').value = title;
		  var dfname = oNode.getAttribute('dfname');
		  var title = oNode.getAttribute('title');
		*/
		//var dfisnull = oNode.getAttribute('dfisnull');
        //setRadioValue('dfisnull', dfisnull);
    	uuid = oNode.getAttribute('id');
    	$G('dfname').value = dfname;
        $G('title').value = title;
    }else{
		uuid = getUUid();
    }

    $.ajax({
        type:'POST',
        url:'getSubFormList.action',
        dataType:"json",
        data:"formId="+parentFormId,
        cache: false,
        success: function(data){
        	if(data.result == 0){
        		var subformDicts = data.info;        		 
        		initSubForms(subformDicts);
        	}else{
        		alert(data.msg);
        	}
        }
    });	
});

function initSubForms(dicts){
	var selectObj = document.getElementById('dfSubform');
	if(selectObj==null)
	{
		alert('子表单下拉控件不存在!');
		return;
	}
	var option = new Option("请选择", "",true);
	selectObj.options.add(option);
	
	for ( var i = 0; i < dicts.length; i++ ){
		var dict = dicts[i];
		if(dfFormId != null && dfFormId==dict.code){
			option = new Option(dict.name, dict.code,false,true);
		}
		else
		  option = new Option(dict.name, dict.code);
		selectObj.options.add(option);
	}
	//selectObj.value = dfFormId;
}
 
function setDefaultValue(curObj) {
	var spanObj = document.getElementById(uuid);
	spanObj.setAttribute('value', curObj.value);
	setRadioChecked(dfPluginType + '_' + uuid);
}


dialog.oncancel = function () {
    if( UE.plugins[dfPluginType].editdom ) {
        delete UE.plugins[dfPluginType].editdom;
    }
}
function attrCheck(key,value){
	var nodes = editor.document.getElementsByTagName('span');
	for(var i=0;i<nodes.length;i++){
		var node = nodes[i];
		if(!oNode){
			//新建
			if(value==node.getAttribute(key)){
				return false;
			}
		}else{
			//编辑
			if(oNode.getAttribute('id')!=node.getAttribute('id') && value==node.getAttribute(key)){
				return false;
			}
		}
	}
	return true;
}
dialog.onok = function (){
	var dfname = $G('dfname').value.replace(/&quot;/g,"\"");
	if(dfname==''){
        alert('请输入控件名称');
        return false;
    }
	if(!attrCheck('dfname',dfname)){
		alert('输入的控件名称重复');
		return false;
	}
	var title = $G('title').value.replace(/&quot;/g,"\"");
    if(title==''){
        alert('请输入控件描述');
        return false;
    }
	var dfSubform = $G('dfSubform').value.replace(/&quot;/g,"\"");
	if(dfSubform == ''){
        alert('请选择子表单!');
        return false;
    }
   /*
    var dfname = $G('dfname').value.replace(/&quot;/g,"\"");
	var title = $G('title').value.replace(/&quot;/g,"\"");
	var dfisnull = getRadioValue('dfisnull');
	spanObj.setAttribute('dfname', dfname);
	spanObj.setAttribute('title', title);
	*/
    if( !oNode ) {
        try {
        	oNode = createSubformElement(uuid);
        	oNode.setAttribute('name', uuid);
        	oNode.setAttribute('dfplugintype', dfPluginType);
        	oNode.setAttribute('dfSubform', dfSubform);
        	oNode.setAttribute('dfname', dfname);
            oNode.setAttribute('title', title);
            oNode.setAttribute('dfisnull', '1');
            //oNode.setAttribute('dfdatatype', '0');
            oNode.setAttribute('value', '');
            editor.execCommand('insertHtml', oNode.outerHTML);
            return true ;
        } catch ( e ) {
            try {
                editor.execCommand('error');
            } catch ( e ) {
                alert('控件异常，请检查代码！');
            }
            return false;
        }
    } else {
       /*
        oNode.setAttribute('dfname', dfname);
        oNode.setAttribute('title', title);
        */
        oNode.setAttribute('dfisnull', '1');
        oNode.setAttribute('dfSubform', dfSubform);
        oNode.setAttribute('dfplugintype', dfPluginType);
        oNode.setAttribute('dfname', dfname);
        oNode.setAttribute('title', title);
        
        oNode.innerHTML = getShowContent();
        delete UE.plugins[dfPluginType].editdom;
        return true;
    }
}

function createSubformElement(id)
{
    var element = null;     
    try {
        element = document.createElement('<span id="'+id+'">');     
    } catch (e) {}   
    if(element==null){
        element = document.createElement('span');     
        element.setAttribute("id", id);
    } 
    
    //插入示例代码
    //element.innerHTML='<thead><tr><th>字段1</th><th>字段2</th></tr></thead><tbody><tr class="firstRow"><td>值1</td><td>值2</td></tr></tbody>';
    element.innerHTML = getShowContent();
    
    return element; 
}

function getShowContent(){
	var selectObj = document.getElementById('dfSubform');
	var selOption = selectObj.options[selectObj.selectedIndex];
	return "子表单区域:&nbsp;<a href='javascript:;'  style='cursor:pointer;text-decoration:none' onclick=\"window.open('getDFormForDesign.action?formId="+selOption.value+"','upd"+selOption.value+"');\">"+selOption.text+'</a>';
}
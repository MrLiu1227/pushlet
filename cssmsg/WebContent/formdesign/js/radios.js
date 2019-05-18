var oNode = null;
var dfPluginType = 'radios';
var uuid = null;
var dfDictName = null;

$(function(){
    if( UE.plugins[dfPluginType].editdom ){
        oNode = UE.plugins[dfPluginType].editdom;
		var dfname = oNode.getAttribute('dfname');
		var title = oNode.getAttribute('title');
		var dfisnull = oNode.getAttribute('dfisnull');
		dfDictName = oNode.getAttribute('dfDictName');  
		$G('dfname').value = dfname;
        $G('title').value = title;
        $G('dfDictName').dfDictName = dfDictName;
        setRadioValue('dfisnull', dfisnull);
    	uuid = oNode.getAttribute('id');
    }else{
		uuid = getUUid();
    }

    $.ajax({
        type:'POST',
        url:'getDictsForDesigner.action',
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
	var selectObj = document.getElementById('dfDictName');
	$( selectObj ).autocomplete(dicts,{
        minChars: 0,
		max: 12,
		delay: 400,
		autoFill: true,
		mustMatch: false,
		matchContains: true,
		scrollHeight: 160,
		formatItem: function(row, i, max) {
			return row.name + "(" + row.code + ")";
		},
		formatResult: function(row) {
			return row.name + "(" + row.code + ")";
		}
	}).result(function(event,row,formatted){
		selectObj.dfDictName = row.code;
		initDictItem(row.code);
	});
	if(dfDictName){
		for ( var i = 0; i < dicts.length; i++ ){
			var dict = dicts[i];
			if(dict.code==dfDictName){
				$( selectObj ).val( dict.name + "(" + dict.code + ")" );
				continue;
			}
		}
		initDictItem(dfDictName,oNode && getEditorRadioValue(oNode,dfPluginType + '_' + uuid));
	}
}

function initDictItem(tableName,selected){
	var selectObj = document.getElementById('dfDictName');
	tableName = tableName||selectObj.dfDictName;
	if(!tableName)return;
    $.ajax({
        type:'POST',
        url:'getDictsForDesigner.action',
        data:'tableName=' + tableName,
        dataType:"json",
        cache: false,
        success: function(data){
        	if(data.result == 0){
        		var dictItems = data.msg;
        		var jsonDictItems = eval("(" + dictItems + ")");
        		var html = buildRadios(jsonDictItems);
        		document.getElementById('dictItems').innerHTML = html;
        		//setRadioValue(dfPluginType + '_' + uuid,jsonDictItems && jsonDictItems[0] && jsonDictItems[0].code);
        		setRadioChecked(dfPluginType + '_' + uuid,selected);
        	}else{
        		alert(data.msg);
        	}
        }
    });
}

function buildRadios(dicts){
	var dfname = $G('dfname').value.replace(/&quot;/g,"\"");
	var title = $G('title').value.replace(/&quot;/g,"\"");
	var dfisnull = getRadioValue('dfisnull');
	var dfDictName = $G('dfDictName').value;
	var html = '<span id="' + uuid + '" name="' + uuid + '" dfname="' + dfname + '" title="' + title + '" dfPluginType="' + dfPluginType + '" dfDictName="' + dfDictName + '" dfisnull="' + dfisnull + '" >';
	var options = '';
	for ( var i = 0; i < dicts.length; i++ ){
		var dict = dicts[i];
		options += '<input name="' + dfPluginType + '_' + uuid + '" value="' + dict.code + '" type="radio" />' + dict.name + '&nbsp;';
	}
	html += options;
	html += '</span>';
	return html;
}


dialog.oncancel = function () {
    if( UE.plugins[dfPluginType].editdom ) {
        delete UE.plugins[dfPluginType].editdom;
    }
}

dialog.onok = function (){
    if($G('dfname').value==''){
        alert('请输入控件名称');
        return false;
    }
    if($G('title').value==''){
        alert('请输入控件描述');
        return false;
    }
    if($G('dfDictName').value==''){
    	alert('请选中字典');
    	return false;
    } 
    
    var dfname = $G('dfname').value.replace(/&quot;/g,"\"");
	var title = $G('title').value.replace(/&quot;/g,"\"");
	var dfisnull = getRadioValue('dfisnull');
	var dfDictName = $G('dfDictName').dfDictName.replace(/&quot;/g,"\"");
	var spanObj = $G(uuid);
	spanObj.setAttribute('dfname', dfname);
	spanObj.setAttribute('title', title);
	spanObj.setAttribute('dfisnull', dfisnull);
	spanObj.setAttribute('dfDictName', dfDictName);
	setRadioChecked(dfPluginType + '_' + uuid);
    if( !oNode ) {
        try {
        	var html = spanObj.outerHTML;
            editor.execCommand('insertHtml',html);
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
        oNode.outerHTML = spanObj.outerHTML;
        delete UE.plugins[dfPluginType].editdom; 
        return true;
    }
}
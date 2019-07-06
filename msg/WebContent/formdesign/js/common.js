function isnull(str){
	if(str == null || str == "null" || str == "" || str == "undefined")
		return true;
	else
		return false;
}
function createElement(type, name)
{
    var element = null;     
    try {        
        element = document.createElement('<'+type+' name="'+name+'">');     
    } catch (e) {}   
    if(element==null) {     
        element = document.createElement(type);     
        element.name = name;     
    } 
    return element;     
}

function getRadioValue(radioName){
	var arr = document.getElementsByName(radioName);
	for(var i = 0; i < arr.length; i++){
		if(arr[i].checked){
			return arr[i].value;
		}
	}
}
function getEditorRadioValue(doc,radioName){
	var arr = doc.getElementsByTagName("input");
	for(var i = 0; i < arr.length; i++){
		if(arr[i].name==radioName && arr[i].checked==true){
			return arr[i].value;
		}
	}
}

function setRadioValue(radioName, radioValue){
	var arr = document.getElementsByName(radioName);
	for(var i = 0; i < arr.length; i++){
		if(arr[i].value == radioValue){
			return arr[i].checked = true;
		}
	}
}

function setRadioChecked(radioName,selected){
	var arr = document.getElementsByName(radioName);
	for(var i = 0; i < arr.length; i++){
		if(arr[i].checked == true || (selected && arr[i].value==selected)){
			arr[i].setAttribute('checked', 'checked');
		}else{
			arr[i].removeAttribute('checked');
		}
	}
}


function setCheckboxValue(checkboxName, checkboxValue){
	if(!isnull(checkboxName) && !isnull(checkboxValue)){
		var arr = document.getElementsByName(checkboxName);
		for(var i = 0; i < arr.length; i++){
			if(checkboxValue.indexOf(arr[i].value) > -1 ){
				arr[i].checked = true;
			}else{
				arr[i].checked = false;
			}
		}
	}
}

function getCheckboxValue(checkboxName){
	var value = '';
	if(!isnull(checkboxName)){
		var arr = document.getElementsByName(checkboxName);
		for(var i = 0; i < arr.length; i++){
			if(arr[i].checked == true){
				value += arr[i].value + ',';
			}
		}
	}
	return value;
}

function getEditortCheckbox(doc,checkboxName){
	var value = '';
	if(doc && !isnull(checkboxName)){
		var arr = doc.getElementsByTagName("input");
		for(var i = 0; i < arr.length; i++){
			if(arr[i].name==checkboxName && arr[i].checked == true){
				value += arr[i].value + ',';
			}
		}
	}
	return value;
}

function setCheckboxChecked(checkboxName,selected){
	var arr = document.getElementsByName(checkboxName);
	for(var i = 0; i < arr.length; i++){
		if(arr[i].checked == true || (selected && selected.indexOf(arr[i].value) > -1)){
			arr[i].setAttribute('checked', 'checked');
		}else{
			arr[i].removeAttribute('checked');
		}
	}
}

function setSelectSelected(selectId,selected){
	var selectObj = document.getElementById(selectId);
	var arr = selectObj.options;
	for(var i = 0; i < arr.length; i++){
		var option = arr[i];
		if(option.selected == true || (selected && option.value == selected)){
			option.setAttribute('selected', 'selected');
		}else{
			option.removeAttribute('selected');
		}
	}
}

/**
 * 属性的获取
 * 属性命名规则: maxlength====dfmaxlength
 * 获取优先级：dfmaxlength>maxlength
 * @oNode 节点DOM
 * @dfattr 属性如dfmaxlength
 * @attr 属性如maxlength
 */
function getAttribute(oNode,dfattr,attr){
	var attrValue = "";
	if(dfattr){
		attrValue = oNode.getAttribute(dfattr);
	}
	if(!attrValue && attr){
		attrValue = oNode.getAttribute(attr);
	}
	return attrValue||"";
}
/**
 * 属性的设置
 * 属性命名规则: maxlength====dfmaxlength
 * @oNode 节点DOM
 * @attr 属性如maxlength
 */
function setAttribute(oNode,value,dfattr,attr){
	if(dfattr){
		oNode.setAttribute(dfattr, value);
	}
	if(attr && value){
		oNode.setAttribute(attr, value);
	}
}

/**
 * 样式的获取
 * 样式命名规则: width====stylewidth
 * 获取优先级：stylewidth>width
 * @oNode 节点DOM
 * style 样式如width
 */
function getStyle(oNode,dfstyle,style){
	var styleValue = "";
	if(style){
		styleValue = $(oNode).css(style);
	}
	if(!styleValue && dfstyle){
		styleValue = oNode.getAttribute(dfstyle);
	}
	if(!styleValue && style){
		styleValue = oNode.style[style];
	}
	return styleValue||"";
}
function setStyle(oNode,value,dfstyle,style){
	if(dfstyle){
		oNode.setAttribute(dfstyle, value);
	}
	if(style && value){
		if(style=="width" || style=="height"){
			if(value!="auto" && value.indexOf("px")==-1)value += "px";
		}
		oNode.style[style] = value;
	}
}



if(top.$ && top.$.dialog && top.$.dialog.alert){
	window.alert = top.$.dialog.alert;
}
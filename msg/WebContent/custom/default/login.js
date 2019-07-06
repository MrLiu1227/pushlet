var ENTER = 13;
function loginReady() {
	$('#login-form').validate({
		focusInvalid : true,
		ignore : "",
		errorPlacement : function(label, element) {
			$('<div class="msg"></div>').insertAfter(element.parent()).append(label);
			$(element).next('i').attr('class', 'invalid');
		},
		
		success : function(label, element) {
			$(element).next('i').attr('class', 'valid');
		},
		
		submitHandler : function(form) {
		}
	
	});
	$('#loginName').keyup(onKeyUp)
	$('#password').keyup(onKeyUp);
	$('#loginName').focus();
	$('#loginName').select();
}

// 处理回车事件提交表单
function onKeyUp(event) {
	if (event.keyCode == ENTER) {
		if ($('#loginName').val() && $('#password').val()) {
			$(this).parents('form').submit();
		}
	}
}

var submitFlag = false;
function validateCallback(form, callback) {
	if (submitFlag == true) alert("登录中，请稍候...");
	var $form = $(form);
	if (!$form.valid()) {
		return false;
	}
	submitFlag = true;
	var para = {};
	para.loginName = $('#loginName').val();
	para.password = md5($('#password').val());
	$.ajax({
		type : form.method || 'POST',
		url : $form.attr("action"),
		data : para,
		dataType : "json",
		cache : false,
		success : callback
	});
	return false;
}

function loginCallback(json) {
	if (json.result == 0) 
		document.location = "console.jsp";
	else{
		submitFlag = false;
		alert(json.msg);
	}
}
function loginReset() {
	$('#login-form input').val('');
}

<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%String parentFormId = request.getParameter("formId");
if(parentFormId==null || parentFormId.trim().equals(""))
	parentFormId=null;
%>
<html>
<head>
    <title>子表单</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
    <link rel="stylesheet" href="bootstrap/css/bootstrap.css" />
    <link rel="stylesheet" href="leipi.style.css" />
    <script>
     var parentFormId = '<%=parentFormId%>';
    </script>   
    <script type="text/javascript" src="jquery-1.7.2.min.js"></script>  
    <script type="text/javascript" src="../dialogs/internal.js"></script>
    <script type="text/javascript" src="js/common.js"></script>
    <script type="text/javascript" src="js/subform.js"></script>
    <script type="text/javascript" src="js/uuid.js"></script>  
</head>
<body>
<div class="content">
    <input id="hidname"  type="hidden"/>
    <table class="table table-bordered table-striped">
	    <tr>
	        <th><span>控件名称</span><span class="label label-important">*</span></th>
	        <th><span>控件描述</span><span class="label label-important">*</span></th>
	    </tr>
	    <tr>
	        <td><input type="text" id="dfname" placeholder="必填项"></td>
	        <td><input type="text" id="title" placeholder="必填项"></td>
	        
	    </tr>
	    <tr>
	        <th colspan="2"><span>选择子表单</span><span class="label label-important">*</span></th>
	        <!--<th><span>是否必填</span> </th>
	    --></tr>      
	    <tr>
	        <td colspan="2">
	        	<select id="dfSubform" name="dfSubform" >
	        	</select>
	        </td>
	        <!--<td>
	            <label class="checkbox inline">
	            	<input name="dfisnull" type="radio" checked="checked" value="2" />是
	            </label>
	            <label class="checkbox inline">
	            	<input name="dfisnull" type="radio" value="1" />否  
	           	</label>
	        </td>	        
	    --></tr>
    </table>
</div>
</body>
</html>
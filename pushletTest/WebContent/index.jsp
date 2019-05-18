<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>  
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />  
<meta http-equiv="Pragma" content="no-cache" />  
<script type="text/javascript" src="ajax-pushlet-client.js"></script>         
<script type="text/javascript">

    PL._init();
    PL.joinListen('/test');
    function onData(event) {   
        //document.getElementById("mess").innerHTML=decodeURIComponent(event.get("cnmess"));  
        alert(decodeURIComponent(event.get("cnmess")));
    }

</script>  
</head>  
<body>  
    <center>  
	    <h1>  
	        my first pushlet!  
	    </h1>  
    </center>  
</body>  
</html>
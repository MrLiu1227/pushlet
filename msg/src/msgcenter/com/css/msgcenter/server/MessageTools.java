package com.css.msgcenter.server;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import net.sf.json.JSONObject;
import com.css.util.StringHelper;
import com.css.msgcenter.common.Address;
import com.css.msgcenter.common.Message;

public class MessageTools {
	public static String dateToStr(Date d){
		if(d == null)
	      return "";
		return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(d);
	}
	public static Date StrToDate(String str) throws ParseException{
		if(StringHelper.isEmpty(str))
			return null;
		return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(str);
	}
	
	public static void main(String[] args) {
		
		Message m = new Message();
		m.setTitle("title1");
		List lst = new ArrayList();
		Address a = new Address();
//		a.setPhone("123456");
		lst.add(a);
		m.setAddrlist(lst);
		
		JSONObject j = JSONObject.fromObject(m);
		System.out.println(j.toString());
		
		
		Map<String, Class> classMap = new HashMap<String, Class>();  
        classMap.put("addrlist", Address.class);  
		Message mm = (Message) JSONObject.toBean(j, Message.class, classMap);
		System.out.println("title:"+mm.getTitle());
//		System.out.println("phone:"+mm.getAddrlist().get(0).getPhone());
		
		
	}
	
}

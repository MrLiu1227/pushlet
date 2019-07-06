package com.css.msgcenter.client;

import com.css.msgcenter.common.Address;
import com.css.msgcenter.common.Constants;
import com.css.msgcenter.common.Message;

public class MkData {

	
	public static void main(String[] args) {
		mkData();
		
	}
	
	private static void mkData() {
		if("on".equals(MessageClient.PUSH)) {
			Message message = new Message();
			message.setTitle("来自"+MessageClient.SYSNAME+"的消息");
			message.setMessagebody("您有一条新的消息@@"+MessageClient.SYSURL+"/index.jsp");
			message.setSender( "sendueerid444" );
			message.setSenderAppCode(MessageClient.SYSCODE); 
			
			Address addr;
			addr = new Address();	
			addr.setUesrName("lix1018-7");
			addr.setAddressDetail("8a8d81495142bae7015142c1a666000a");
			addr.setAddressType(Constants.TYPE_WX);
			message.pushAddress(addr);
			
			addr = new Address();	
			addr.setUesrName("lix1018-7");
			addr.setAddressDetail("8a8d81495142bae7015142c1a666000a");
			addr.setAddressType(Constants.TYPE_IM);
			message.pushAddress(addr);
			
			addr = new Address();	
			addr.setUesrName("lix1018-7");
			addr.setAddressDetail("lixiao1989@yeah.net");
			addr.setAddressType(Constants.TYPE_EMAIL);
			message.pushAddress(addr);
			
			
			MessageClient.push(message);
			System.out.println("abc");
		}
	}

		
}

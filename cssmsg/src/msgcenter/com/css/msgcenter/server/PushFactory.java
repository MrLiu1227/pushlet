package com.css.msgcenter.server;

import com.css.msgcenter.common.Constants;
import com.css.msgcenter.server.imp.*;
import com.css.msgcenter.server.model.MsgMain;
import com.css.msgcenter.server.model.MsgTask;


public class PushFactory {


	public static IPusher create(MsgTask tt, MsgMain mm)
	{
		switch(tt.getMsgType()) {
			case Constants.TYPE_EMAIL:
				return new EmailPusher(tt, mm);
			case Constants.TYPE_IM:
				return new ImPusher(tt, mm);
			case Constants.TYPE_PHONE:
				return new PhonePusher(tt, mm);
			case Constants.TYPE_LETTER:
				return new LetterPusher(tt, mm);
			case Constants.TYPE_WX:
				return new WxPusher(tt, mm);
			case Constants.TYPE_MQ:
				return new MqDeskPusher(tt, mm);
			default:
				return null;
		}
//		switch(tt.getMsgType()) {
//			case Constants.TYPE_EMAIL:
//			case Constants.TYPE_IM:
//			case Constants.TYPE_PHONE: 
//			case Constants.TYPE_LETTER:
//			case Constants.TYPE_WX:
//				return new TestPusher(tt, mm);
//			default:
//				return null;
//		}
	}


}

package com.css.msgcenter.server;

import net.sf.json.JSONObject;

public interface IMSendPushMessageInterface {
	int sendMessage(JSONObject taskMessage, JSONObject mainMessage);
}

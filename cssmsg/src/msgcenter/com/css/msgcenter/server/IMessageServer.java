/**
 * 
 */
package com.css.msgcenter.server;

import com.css.msgcenter.common.Message;
import com.css.msgcenter.common.Results;


public interface IMessageServer {
	Results push(Message message);
}
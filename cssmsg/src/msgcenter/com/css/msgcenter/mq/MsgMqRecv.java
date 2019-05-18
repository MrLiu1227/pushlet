package com.css.msgcenter.mq;

import java.util.List;
import java.util.ResourceBundle;

import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.Destination;
import javax.jms.MessageConsumer;
import javax.jms.Session;
import javax.jms.TextMessage;

import com.css.app.personalmsg.model.PersonalMsg;
import com.css.msgcenter.mq.service.MsgSaveService;
import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQConnectionFactory;

import com.css.msgcenter.common.Address;
import com.css.msgcenter.common.Message;
import com.css.msgcenter.mq.service.MsgMqService;
import com.css.util.StringHelper;
import com.sun.xml.internal.ws.message.StringHeader;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
public class MsgMqRecv extends Thread {
    private static final ResourceBundle bundle = ResourceBundle.getBundle("msgcenter");
    public static final String ACTIVEMQ_SERVER = bundle.getString("msgcenter.selfMqUrl");
    public static final String ACTIVEMQ_QUEUE = bundle.getString("msgcenter.selfMqQueueName");
    public static final String OPEN_FLAG = bundle.getString("msgcenter.openFlag");
	
	public void run(){
		MsgMqRecv.startRecv();
	}
	
	public static void startRecv()  {
		
		if(StringHelper.equals("off", OPEN_FLAG)){
			return;
		}
		
        // ConnectionFactory ：连接工厂，JMS 用它创建连接
        ConnectionFactory connectionFactory;
        // Connection ：JMS 客户端到JMS Provider 的连接
        Connection connection = null;
        // Session： 一个发送或接收消息的线程
        Session session;
        // Destination ：消息的目的地;消息发送给谁.
        Destination destination;
        // 消费者，消息接收者
        MessageConsumer consumer;
        connectionFactory = new ActiveMQConnectionFactory(
                ActiveMQConnection.DEFAULT_USER,
                ActiveMQConnection.DEFAULT_PASSWORD, ACTIVEMQ_SERVER);
        
	    while (true) {
	        try {
	            // 构造从工厂得到连接对象
	            connection = connectionFactory.createConnection();
	            // 启动
	            connection.start();
	            // 获取操作连接
	            session = connection.createSession(Boolean.TRUE,//开启事务
	                    Session.AUTO_ACKNOWLEDGE);
	            // 获取session注意参数值xingbo.xu-queue是一个服务器的queue，须在在ActiveMq的console配置
	            destination = session.createQueue(ACTIVEMQ_QUEUE+"?customer.prefetchSize=1");
	            consumer = session.createConsumer(destination);
	            
	            // 可以设置接收者接收消息的时间
	            TextMessage message = (TextMessage) consumer.receive();
	            if (null != message) {
	                System.out.println("收到消息" + message.getText());
	                //string -> JSON
	                try {

						JSONObject  json =   JSONObject.fromObject(message.getText());
						PersonalMsg msg = (PersonalMsg) JSONObject.toBean(json, PersonalMsg.class);
						MsgSaveService.saveMsg(msg);
						session.commit();
					} catch (Exception e) {
						e.printStackTrace();
					} 
	                
	            } else {
	                //break;
	            }

	        } catch (Exception e) {
	            e.printStackTrace();
	        } finally {
	            try {
	                if (null != connection)
	                    connection.close();
	                
	            } catch (Throwable ignore) {
	            }
	        }
	     }
	}
    
	public static void main(String[] args) {
		MsgMqRecv.startRecv();
	}

}

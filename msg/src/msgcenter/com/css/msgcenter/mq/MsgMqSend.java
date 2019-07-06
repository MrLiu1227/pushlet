package com.css.msgcenter.mq;

import java.util.ResourceBundle;
import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.DeliveryMode;
import javax.jms.Destination;
import javax.jms.MessageProducer;
import javax.jms.Session;
import javax.jms.TextMessage;

import com.css.app.personalmsg.model.PersonalMsg;
import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQConnectionFactory;
import com.css.msgcenter.common.Address;
import com.css.msgcenter.common.Constants;
import com.css.msgcenter.common.Message;
import net.sf.json.JSONObject;

public class MsgMqSend {
    private static final ResourceBundle bundle = ResourceBundle.getBundle("msgcenter");
    public static final String ACTIVEMQ_SERVER = bundle.getString("msgcenter.selfMqUrl");
    public static final String ACTIVEMQ_QUEUE = bundle.getString("msgcenter.selfMqQueueName");
    
    public static boolean sendMessage(String msg)  {
    	
    	
        ConnectionFactory connectionFactory; // ConnectionFactory--连接工厂，JMS用它创建连接
        // Provider 的连接
        Connection connection = null; // Connection ：JMS 客户端到JMS
        Session session; // Session： 一个发送或接收消息的线程
        Destination destination; // Destination ：消息的目的地;消息发送给谁.
        MessageProducer producer; // MessageProducer：消息发送者
        try {
        	// 构造ConnectionFactory实例对象，此处采用ActiveMq的实现jar
        	connectionFactory = new ActiveMQConnectionFactory(ActiveMQConnection.DEFAULT_USER,
            ActiveMQConnection.DEFAULT_PASSWORD, ACTIVEMQ_SERVER);
        	// 构造从工厂得到连接对象
            connection = connectionFactory.createConnection();
            // 启动
            connection.start();
            // 获取操作连接
            session = connection.createSession(Boolean.TRUE, Session.AUTO_ACKNOWLEDGE);
            // 获取session注意参数值xingbo.xu-queue是一个服务器的queue，须在在ActiveMq的console配置
            destination = session.createQueue(ACTIVEMQ_QUEUE);
            // 得到消息生成者【发送者】
            producer = session.createProducer(destination);
            // 设置不持久化，此处学习，实际根据项目决定
            producer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);
            // 构造消息，此处写死，项目就是参数，或者方法获取
            
            TextMessage message = session.createTextMessage(msg);
            // 发送消息到目的地方
            System.out.println("发送消息：" + ACTIVEMQ_QUEUE +"-"+ msg);
            producer.send(message);
            //producer.send(destination,message,DeliveryMode.NON_PERSISTENT,1,0);
            session.commit();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            try {
                if (null != connection)
                    connection.close();
            } catch (Throwable ignore) {
            	
            }
        }
		return true;
    }
    
    public static void main(String[] args) {
        PersonalMsg msg = new PersonalMsg();
        msg.setMsgName("我是测试消息");
        msg.setMsgContent("测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试");
        msg.setMsgKeyWord("消息");
        msg.setMsgType("2");
        msg.setMsgUrl("http://www.baidu.com");
        msg.setReceiver("张三");
        msg.setSender("李四");
		JSONObject json = JSONObject.fromObject(msg);
		MsgMqSend.sendMessage(json.toString());
	}
}

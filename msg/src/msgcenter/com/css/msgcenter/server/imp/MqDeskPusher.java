package com.css.msgcenter.server.imp;

import com.caucho.hessian.client.HessianProxyFactory;
import com.css.msgcenter.common.Constants;
import com.css.msgcenter.common.Results;
import com.css.msgcenter.server.BizLog;
import com.css.msgcenter.server.IAMServlet;
import com.css.msgcenter.server.IPusher;
import com.css.msgcenter.server.PassServlet;
import com.css.msgcenter.server.model.MsgMain;
import com.css.msgcenter.server.model.MsgTask;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQConnectionFactory;

import javax.jms.*;
import java.util.Date;
import java.util.ResourceBundle;

public class MqDeskPusher implements IPusher {
    private MsgTask task;
    private MsgMain main;
    private static BizLog log = new BizLog(MqDeskPusher.class);

    private static final ResourceBundle bundle = ResourceBundle.getBundle("msgcenter");
    /*   public static final String ACTIVEMQ_SERVER = bundle.getString("msgcenter.activemqDeskServer");
       public static final String ACTIVEMQ_QUEUE = bundle.getString("msgcenter.activemqDeskQueueName");*/
    private static final String IMSERVER = ResourceBundle.getBundle("appconfig").getString("msgcenter.desktopserver");
    public MqDeskPusher(MsgTask task, MsgMain main) {
        this.task = task;
        this.main = main;
    }


    /* @Override
     public Results send() {
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

             String[] msgContents = this.main.getMsgContent().split("@@");
             MessagecenterAdvices messagecenterAdvices = new MessagecenterAdvices();
             messagecenterAdvices.setAppId(this.main.getAppId());
             messagecenterAdvices.setContent(msgContents[0]);
             messagecenterAdvices.setCreateTime(new Date());
             messagecenterAdvices.setLinkUrl(msgContents[1]);
             messagecenterAdvices.setPublisherId("");
             messagecenterAdvices.setPublisherName(this.main.getSender());
             messagecenterAdvices.setReceiverId(this.task.getReceiverId());
             messagecenterAdvices.setTitle(this.main.getMsgTopic());
             messagecenterAdvices.setType("2");//消息类型(公共消息：1；私人消息：2)
             JsonConfig jsonConfig=new JsonConfig();
             jsonConfig.registerJsonValueProcessor(Date.class, new DateJsonValueProcessor("yyyy-MM-dd HH:mm"));
             JSONObject jsonObject = JSONObject.fromObject(messagecenterAdvices, jsonConfig);



             // 构造消息，此处写死，项目就是参数，或者方法获取

             TextMessage message = session.createTextMessage(jsonObject.toString());
             // 发送消息到目的地方
             System.out.println("发送消息：" + ACTIVEMQ_QUEUE +"-"+ jsonObject.toString());
             producer.send(message);
             //producer.send(destination,message,DeliveryMode.NON_PERSISTENT,1,0);
             session.commit();
             return new Results(Constants.RES_SUCCESS, jsonObject);

         } catch (Exception e) {
             e.printStackTrace();
             return new Results(Constants.RES_ERROR, new JSONObject().element("info", "exception"));
         } finally {
             try {
                 if (null != connection)
                     connection.close();
             } catch (Throwable ignore) {

             }
         }
     }*/
    @Override
    public Results send() {
        try {
//			发送
            final String URL = IMSERVER;
            HessianProxyFactory factory = new HessianProxyFactory();
            PassServlet servlet = (PassServlet) factory.create(PassServlet.class, URL);
            int res = servlet.push(task.toJson().toString(), main.toJson().toString());
            if (res == Constants.RES_SUCCESS) {
                log.info("==Push Success: "+URL);
            } else {
                log.info("==Push Failed: "+URL);
            }
            JSONObject resj = new JSONObject().element("receiverId", task.getReceiverId()).element("url", URL);
            return new Results(res, resj);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return new Results(Constants.RES_ERROR, new JSONObject().element("info", "exception"));
        }


    }


    public static void main(String[] args) {
        MqDeskPusher mq = new MqDeskPusher(new MsgTask(), new MsgMain());
        mq.send();
    }



}
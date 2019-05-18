package com.css.app.personalmsg.server;

import nl.justobjects.pushlet.core.Dispatcher;
import nl.justobjects.pushlet.core.Event;
import nl.justobjects.pushlet.core.Session;
import nl.justobjects.pushlet.core.SessionManager;

import java.util.Date;

public class PushThread2 extends Thread {
    // 主题
    public String aSubject; // 客户端传递过来
    // sessionId
    public String thisSessionId;

    /**
     * 构造函数
     *
     * @param aSubject
     */
    public PushThread2(String aSubject, String thisSessionId) {
        this.aSubject = aSubject;
        this.thisSessionId = thisSessionId;
    }
    @Override
    public void run() {
        while (true) {
            try {
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                // 线程阻塞，结束线程
                System.out.println("=========>sleep异常 --->" + "线程" + Thread.currentThread().getId() + "关闭");
                break;
            }
            Event event = Event.createDataEvent(thisSessionId);
            System.out.println("\n-----Thread ID: " + Thread.currentThread().getId());
            // 判断当前连接的会话个数，没有会话，则线程退出
            Session session = SessionManager.getInstance().getSession(thisSessionId);
            // 当前无会话，结束线程
            if (session == null) {
                System.out.println("=========>无sessions --->" + "线程" + Thread.currentThread().getId() + "关闭");
                break;
            }
            // 判断当前会话中是否订阅该主题，没有订阅则结束线程
            if (null == session.getSubscriber().match(event)) {
                session.stop();
                System.out.println(thisSessionId+"没有订阅 --->" + "线程"	+ Thread.currentThread().getId() + "关闭");
                break;
            }
            // 模拟业务处理：获取各测点的值
           // GetPersonalMsgService msgService = new GetPersonalMsgService(aSubject);
            //int num = msgService.getmsg();
            int num = 2;
           /* str = "传递中文测试！！";*/
           /* try {
                str = URLEncoder.encode(str,"UTF-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }*/
            event.setField("num", num);
            event.setField("who",aSubject);
            event.setField("date",new Date().toString());
            // 推送消息
            Dispatcher.getInstance().multicast(event); // 一对一
            System.out.println(new Date()+"发送了消息");

        }
    }
}













package com.css.app.personalmsg.server;

import nl.justobjects.pushlet.core.Dispatcher;
import nl.justobjects.pushlet.core.Event;
import nl.justobjects.pushlet.core.Session;
import nl.justobjects.pushlet.core.SessionManager;

import java.util.Date;

public class PushThread extends Thread {
    // 主题
    public String aSubject; // 客户端传递过来
    // sessionId
    public Event event;

    /**
     * 构造函数
     *
     * @param aSubject
     */
    public PushThread(String aSubject, Event event) {
        this.aSubject = aSubject;
        this.event = event;
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
            if(Thread.currentThread().isInterrupted()){
                System.out.println("我是多余线程：："+Thread.currentThread().getId());
                break;
            }
            System.out.println("\n-----Thread ID: " + Thread.currentThread().getId() + "-----Thread name: " + Thread.currentThread().getName());
            Session[] sessions = SessionManager.getInstance().getSessions();
            // 当前无会话，结束线程
            if (0 == sessions.length) {
                System.out.println("=========>无sessions --->" + "线程"
                        + Thread.currentThread().getId() + "关闭");
                break;
            }
            // 判断当前会话中是否存在订阅该主题的订阅者，不存在则结束线程
            boolean if_exist_subscriber = true;
            // 遍历所有session
            for (int j = 0; j < sessions.length; j++) {
                System.out
                        .println(sessions[j].getSubscriber().match(event) == null ? "Session"
                                + j + ": 未订阅该事件 "
                                : "Session" + j + "：订阅了该事件 ");
                if (null != sessions[j].getSubscriber().match(event)) {
                    if_exist_subscriber = false;
                }
            }
            if (if_exist_subscriber) {
                System.out.println("=========>无"+aSubject+"订阅者 --->" + "线程"	+ Thread.currentThread().getId() + "关闭");
                break;
            }

            //如果上面还没有关闭漏网的线程，那么只有一种情况，就是刷新，刷新的特性是当前session只有一个，但是session只有一个时候，有多种情况，
            //1.用户单处登录刷新了。2.用户两处登录，关闭了一处。3.两个用户分别登录一处。
            //但其中2情况线程不会出现关闭，数量为1个，3情况会经过上面的关闭会关闭1个，也只有1个，唯独刷新，会有两个，快速点击刷新时会大于2，关掉多余的
           /* if(sessions.length == 1){
                int num = 0;
                ThreadGroup group = Thread.currentThread().getThreadGroup();
                Thread[] threads = new Thread[group.activeCount()];
                group.enumerate(threads);
                for(Thread t: threads){
                    if(t.getName().equals(Thread.currentThread().getName())){
                        num++;
                        if(num >= 2){
                            t.interrupt();
                        }
                    }
                }
            }
            if(Thread.currentThread().isInterrupted()){
                System.out.println("我是多余线程：："+Thread.currentThread().getId());
                break;
            }*/

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
            Dispatcher.getInstance().multicast(event);
            System.out.println(new Date()+"发送了消息");

        }
    }
}













package com.css.app.personalmsg.server;

import nl.justobjects.pushlet.core.Dispatcher;
import nl.justobjects.pushlet.core.Event;
import nl.justobjects.pushlet.core.Session;
import nl.justobjects.pushlet.core.SessionManager;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class TestServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    public TestServlet() {
        super();
    }
    /**
     * get/post方法的处理函数
     */
    protected void service(HttpServletRequest request,
                           HttpServletResponse response) throws ServletException, IOException {

        // 读取请求报文数据
        request.setCharacterEncoding("UTF-8");
        // 获取订阅主题名称
        String aSubject = request.getParameter("subject");
        String thisSessionId = request.getParameter("thisSessionId");

        Event event = Event.createDataEvent(aSubject);
        boolean old_if_exist_subscriber = false;
        Session[] sessions = SessionManager.getInstance().getSessions();//不包括当前线程
        if(sessions.length > 0){
            for (int j = 0; j < sessions.length; j++) {
                if(!sessions[j].getId().equals(thisSessionId)){
                    if(sessions[j].getSubscriber().match(event) != null){
                        old_if_exist_subscriber = true;
                        break;
                    }
                }
            }
            if (old_if_exist_subscriber) {
                System.out.println("不需要再开启线程");
            } else{
               /* int num = 0;
                ThreadGroup group = Thread.currentThread().getThreadGroup();
                Thread[] threads = new Thread[group.activeCount()];
                group.enumerate(threads);
                for(Thread t: threads){
                    if(t.getName().equals(aSubject)){
                        if(num >= 2){
                            t.interrupt();
                        }
                    }
                }*/
                // 启动一个线程，实现创建Pushlet事件、做业务、向前台推送数据等功能
                PushThread pushThread = new PushThread(aSubject, event);
                pushThread.setName(aSubject);
                pushThread.start();
            }
        } else {
            int num = 0;
            ThreadGroup group = Thread.currentThread().getThreadGroup();
            Thread[] threads = new Thread[group.activeCount()];
            group.enumerate(threads);
            for(Thread t: threads){
                if(t.getName().equals(aSubject)){
                      num ++;
                      break;
                }
            }
            if(num == 0){
                PushThread pushThread = new PushThread(aSubject, event);
                pushThread.setName(aSubject);
                pushThread.start();
            } else{
                System.out.println("监控到是刷新方法，不需要再开启线程");
            }
        }
    }
}
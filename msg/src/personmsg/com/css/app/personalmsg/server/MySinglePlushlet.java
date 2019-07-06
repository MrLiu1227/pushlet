package com.css.app.personalmsg.server;

import nl.justobjects.pushlet.core.Event;
import nl.justobjects.pushlet.core.EventPullSource;
import nl.justobjects.pushlet.core.Session;
import nl.justobjects.pushlet.core.SessionManager;

import javax.servlet.http.HttpServlet;
import java.util.Date;


public class MySinglePlushlet extends HttpServlet {
    private static final long serialVersionUID =1l;
    //private static SystemService systemService;


    static public class HwPlushlet extends EventPullSource {
        // 休眠五秒  执行一次pullEvent
        @Override  
        protected long getSleepTime() {  
            return 5000;
        }

        @SuppressWarnings("deprecation")
        @Override  
        protected Event pullEvent() {  
            Event event = Event.createDataEvent("/msgNum");
            int s = Thread.currentThread().getThreadGroup().activeCount();
            System.out.println("共有"+s+"条线程！！！");
            Session[] sessions = SessionManager.getInstance().getSessions();
            if(sessions.length > 0){
                for(Session session : sessions){
                    if (session.getSubscriber().match(event) != null) {
                        try {
                            String userId = session.getId().split("_")[0];
                            //  GetPersonalMsgService service = new GetPersonalMsgService(userId);
                            // int num = service.getmsg();
                             int num = 2;
                            event.setField(userId, num);
                            event.setField("who",userId);
                            event.setField("date",new Date().toString());
                            System.out.println(session.getId()+"执行中...");
                        } catch (Exception e) {
                            event.setField("mess", "异常错误！");
                        }
                    } else{
                        session.stop();
                        System.out.println(session.getId()+"已经取消订阅了=================================");
                    }
                }
            }else{
                System.out.println("no pushlet session");
            }
            return event;
        }  
    }  
}
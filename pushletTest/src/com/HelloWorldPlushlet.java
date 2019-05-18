package com;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;

import nl.justobjects.pushlet.core.Event; 
import nl.justobjects.pushlet.core.EventPullSource;

public class HelloWorldPlushlet {
	static public class HwPlushlet extends EventPullSource {  
        // 休眠五秒  执行一次pullEvent
        @Override  
        protected long getSleepTime() {  
            return 5000;  
        }  
        @SuppressWarnings("deprecation")  
        @Override  
        protected Event pullEvent() {  
            Event event = Event.createDataEvent("/test");  
            try {  
                SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
                String text = format.format(new Date());                  
                String str = "传递中文测试！" + text + "！";  
                str = URLEncoder.encode(str,"UTF-8");  
                event.setField("cnmess", str);  
            } catch (Exception e) {  
                event.setField("mess", "异常错误！");  
            }  
            return event;  
        }  
    }  
}

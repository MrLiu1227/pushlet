package com.css.app.personalmsg.server;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class TestServlet2 extends HttpServlet {
    private static final long serialVersionUID = 1L;
    public TestServlet2() {
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
        // 启动一个线程，实现创建Pushlet事件、做业务、向前台推送数据等功能
        PushThread2 pushThread = new PushThread2(aSubject, thisSessionId);
        pushThread.start();
    }
}
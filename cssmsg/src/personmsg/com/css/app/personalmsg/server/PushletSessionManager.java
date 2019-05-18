package com.css.app.personalmsg.server;

import nl.justobjects.pushlet.core.Event;
import nl.justobjects.pushlet.core.Session;
import nl.justobjects.pushlet.core.SessionManager;
import nl.justobjects.pushlet.util.PushletException;

public class PushletSessionManager extends SessionManager {

    @Override
    public Session createSession(Event anEvent) throws PushletException {
        //Event的getField方法的第二个参数为当传递参数中不存在第一个参数字段时默认使用的值。
        return Session.create(anEvent.getField("mySessionId", "visitor"));
    }
}

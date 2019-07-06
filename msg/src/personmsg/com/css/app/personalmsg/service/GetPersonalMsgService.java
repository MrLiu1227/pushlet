package com.css.app.personalmsg.service;

import api.Mem;
import com.css.app.MsgEnvironment;
import com.css.app.personalmsg.model.PersonalMsg;
import com.css.apps.base.user.model.SUser;
import com.css.core.configuration.Environment;
import com.css.db.query.QueryCache;
import nl.justobjects.pushlet.core.Event;
import org.slw.framework.context.SlwContext;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

public class GetPersonalMsgService {

    public String aSubject;

    private Date  beginTime;

    public GetPersonalMsgService() {
    }

    public GetPersonalMsgService(String aSubject) {
        this.aSubject = aSubject;
    }

    public int getMsgNumForTiming(){
        List<PersonalMsg> personalMsgList = new ArrayList<PersonalMsg>();
        beginTime = (Date) Mem.MAIN.get("aSubject");
        if(beginTime == null){
            Mem.MAIN.set("aSubject", new Date());
            return 0;
        }
        QueryCache qc = new QueryCache("select a.uuid from PersonalMsg a "+ getWhere() + getOrder());
        setWhere(qc);
        personalMsgList = api.Dao.getList(qc, PersonalMsg.class);
        Mem.MAIN.set("aSubject", new Date());
        if(personalMsgList.size() > 0 ){
            return personalMsgList.size();
        }
        System.out.println("=================================================="+beginTime);
        return (int)(Math.random()* 3);
        //return 0;
    }

    public int getMsgNumForHome(){
        SUser user = (SUser) SlwContext.getSession(Environment.SESSION_LOGIN_KEY);
        aSubject = user.getLoginName();
        List<PersonalMsg> personalMsgList = new ArrayList<PersonalMsg>();
        QueryCache qc = new QueryCache("select a.uuid from PersonalMsg a "+ getWhere() + getOrder());
        setWhere(qc);
        personalMsgList = api.Dao.getList(qc, PersonalMsg.class);
        if(personalMsgList.size() > 0 ){
            return personalMsgList.size();
        }
        return 0;
    }

    public String getWhere() {
        StringBuffer sb = new StringBuffer(" where 1=1");
        sb.append("and a.delStatus = :delStatus ");
        sb.append("and a.readFlag = :readFlag");
        sb.append(" and a.receiver =:receiver");
        if (beginTime != null)
             sb.append(" and a.receiveTime >=:receiveTime");
        return sb.toString();
    }
    public void setWhere(QueryCache qc) {
        qc.setParameter("delStatus", MsgEnvironment.DEL_STATUS_NO);
        qc.setParameter("readFlag", MsgEnvironment.READ_FLAG_NO);
        qc.setParameter("receiver",aSubject );
        if (beginTime != null)
             qc.setParameter("receiveTime",beginTime );
    }
    public String getOrder() {
        return " order by a.receiveTime DESC";
    }


    public static void main(String[] args) {
        //System.out.println( GetPersonalMsgService.getmsg());
        Mem.MAIN.delete("beginTime");
    }
}

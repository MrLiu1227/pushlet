package com.css.msgcenter.server.imp;

import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.Message.RecipientType;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import com.css.msgcenter.common.Constants;
import com.css.msgcenter.common.Results;
import com.css.msgcenter.server.BizLog;
import com.css.msgcenter.server.IPusher;
import com.css.msgcenter.server.QueryMsg;
import com.css.msgcenter.server.model.MsgApp;
import com.css.msgcenter.server.model.MsgMain;
import com.css.msgcenter.server.model.MsgTask;
import com.css.util.DesUtil;

import net.sf.json.JSONObject;

public class EmailPusher implements IPusher{
	private static BizLog log = new BizLog(EmailPusher.class); 
	private MsgTask task;
	private MsgMain main;
	
	public EmailPusher(MsgTask task, MsgMain main) {
		this.task = task;
		this.main = main;
	}

	@Override
	public Results send() {
		try {
			MsgApp app = QueryMsg.get(MsgApp.class, main.getAppId());
			JSONObject j = JSONObject.fromObject(app.getMemo());
			// 配置发送邮件的环境属性
	        final Properties props = new Properties();
	        /*
	         * 可用的属性： mail.store.protocol / mail.transport.protocol / mail.host /
	         * mail.user / mail.from
	         */
	        // 表示SMTP发送邮件，需要进行身份验证
	        props.put("mail.smtp.auth", "true");
	        props.put("mail.smtp.host", j.getString("mail.smtp.host"));
	        // 发件人的账号
	        props.put("mail.user", j.getString("mail.user"));
	        // 访问SMTP服务时需要提供的密码
	        props.put("mail.password", DesUtil.decrypt(j.getString("mail.password")));
	
	        // 构建授权信息，用于进行SMTP进行身份验证
	        Authenticator authenticator = new Authenticator() {
	            @Override
	            protected PasswordAuthentication getPasswordAuthentication() {
	                // 用户名、密码
	                String userName = props.getProperty("mail.user");
	                String password = props.getProperty("mail.password");
	                return new PasswordAuthentication(userName, password);
	            }
	        };
        
	     // 使用环境属性和授权信息，创建邮件会话
	        Session mailSession = Session.getInstance(props, authenticator);
	        // 创建邮件消息
	        MimeMessage message = new MimeMessage(mailSession);
	        // 设置发件人
	        InternetAddress form = new InternetAddress(
	                props.getProperty("mail.user"));
	        message.setFrom(form);

	        // 设置收件人
	        InternetAddress to = new InternetAddress(task.getReceiverId());
	        message.setRecipient(RecipientType.TO, to);

	        // 设置邮件标题
	        message.setSubject(main.getMsgTopic());

	        // 设置邮件的内容体
	        message.setContent(main.getMsgContent(), "text/html;charset=UTF-8");
	        
	        // 发送邮件
	        Transport.send(message);
	        
	        //	        返回值处理
	        log.info("==EmailPusher return Success");
			JSONObject resj = new JSONObject()
		    	.element("receiverId", task.getReceiverId())
		    	.element("mail.user", j.getString("mail.user"))
		    	.element("mail.smtp.host", j.getString("mail.smtp.host"));
	        return new Results(Constants.RES_SUCCESS, resj);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return new Results(Constants.RES_ERROR, new JSONObject().element("info", "exception"));
		}
		
		
		
	}


}

package com.css.msgcenter.server;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

/*import com.css.apps.task.job.JobTemplate;*/
import com.css.db.query.TransactionCache;
import com.css.msgcenter.common.Constants;
import com.css.msgcenter.common.Results;
import com.css.msgcenter.server.model.MsgMain;
import com.css.msgcenter.server.model.MsgTask;
import com.css.msgcenter.server.model.MsgTaskLog;
import com.css.util.UuidUtil;

/*public class MessageJob extends JobTemplate {*/
public class MessageJob {
	private static BizLog log = new BizLog(MessageJob.class);
	
	public List beforeJob() {
		log.info("MsgJob beforeJob---"+Calendar.getInstance().getTime());
		
		TransactionCache tx = null;
		try{
//			等待执行的任务，一直在队列中但过5分钟无回应的任务
			List<MsgTask> taskList = new QueryMsg("select * from msg_task a where a.msg_status=:wait or " 
				+"(a.msg_status=:sending and a.create_time<(sysdate - interval '"+Constants.MAX_TIME+"' minute))", true)
				.setParameter("wait", Constants.TASK_WAITING)
				.setParameter("sending", Constants.TASK_SENDING)
				.addEntity("a", MsgTask.class)
				.listNoCache();
			
//			把任务状态改为队列中
			if(taskList != null && taskList.size() > 0) {
				Date cur = (Date) new QueryMsg("select sysdate from dual", true).uniqueResult();
				for(MsgTask t : taskList) {
					t.setMsgStatus(Constants.TASK_SENDING);
					t.setBeginTime(cur);
				}
				tx = new QueryMsg().getTransaction();
				tx.update(taskList);
				tx.commit();
			}
			return taskList;
		} catch(Exception ex){
			if (tx != null) {
				tx.rollback();
			}
			log.error(ex.getMessage(), ex);
			return null;
		}
		
	}
	public void doJob(Object obj) {
		log.info("MsgJob doJob---"+Calendar.getInstance().getTime());
		
		MsgTask tt = (MsgTask) obj;
		MsgMain mm = QueryMsg.get(MsgMain.class, tt.getMsgId());
		TransactionCache tx = null;
		try{
			tx = new QueryMsg().getTransaction();
//			发送
			Results pushRes = PushFactory.create(tt, mm).send();
			Date end = (Date) new QueryMsg("select sysdate from dual", true).uniqueResult();

//			记日志
			MsgTaskLog tl = new MsgTaskLog();
			tl.setUuid(UuidUtil.getUuid());
			tl.setTaskId(tt.getUuid());
			tl.setSender(mm.getSender());
			tl.setMsgType(tt.getMsgType());
			tl.setReceiver(tt.getReceiverName());
			tl.setServerIp(java.net.InetAddress.getLocalHost().getHostAddress());
			tl.setMsgStatus(pushRes.getStatus()==Constants.RES_SUCCESS?Constants.TASK_SUCCESS:Constants.TASK_FAILED);
			tl.setMsgStatusInfo(pushRes.getInfo()!=null?pushRes.getInfo().toString():"");
			tl.setCreateTime(end);
			tx.save(tl);
			
//			处理结果
			if(pushRes.getStatus()==Constants.RES_SUCCESS) {
				tt.setFinishTime(end);
				tt.setMsgStatus(Constants.TASK_SUCCESS);
				mm.setTaskSuccess(mm.getTaskSuccess()+1);
			} else {
				tt.setFailCount(tt.getFailCount()+1);
				if(tt.getFailCount() < Constants.TRY_COUNT) {
					tt.setMsgStatus(Constants.TASK_WAITING);
				} else {
					tt.setFinishTime(end);
					tt.setMsgStatus(Constants.TASK_FAILED);
					mm.setTaskFail(mm.getTaskFail()+1);
				}
			}
			if(mm.getTaskSuccess() + mm.getTaskFail() + mm.getTaskInvalid()>= mm.getTaskSum()) {
				mm.setLastExecTime(end);
				mm.setMsgStatus(Constants.MAIN_FINISH);
			}
				
			tx.update(tt);
			tx.update(mm);
			tx.commit();
			
		} catch(Exception ex){
			if (tx != null) {
				tx.rollback();
			}
			log.error(ex.getMessage(), ex);
		}
		
	}
}

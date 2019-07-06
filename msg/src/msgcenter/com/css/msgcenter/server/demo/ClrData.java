package com.css.msgcenter.server.demo;

import com.css.db.query.TransactionCache;
import com.css.msgcenter.server.QueryMsg;

public class ClrData {

	
	public static void main(String[] args) {
		
		clrData();
		
	}
	

	private static void clrData() {
		TransactionCache tx = new QueryMsg().getTransaction();
		tx.getSession().createSQLQuery("delete from msg_task").executeUpdate();
		tx.getSession().createSQLQuery("delete from msg_main").executeUpdate();
		tx.commit();
	}

	
	
}

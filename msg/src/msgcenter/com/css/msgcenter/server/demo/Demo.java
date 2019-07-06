package com.css.msgcenter.server.demo;

import java.text.ParseException;
import java.util.Date;

import com.css.msgcenter.server.QueryMsg;

public class Demo {
//	public static class Aaa {
//		void doo() {
//			int i = 1/0;
//			try {
//				int j = 1/0;
//				System.out.println("success");
//			} catch (Exception e) {
//				// TODO: handle exception
//				System.out.println("error");
//			}
//			System.out.println("end");
//		}
//	}
	/**
	 * @param args
	 * @throws ParseException 
	 */
	public static void main(String[] args) throws ParseException {
		Date cur = (Date) new QueryMsg("select sysdate from dual", true).uniqueResult();
		System.out.println(cur);
		
//		String strDate = "2016-02-14"; 
//		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd"); 
//		Calendar calendar = new GregorianCalendar(); 
//		Date date1 = sdf.parse(strDate); 
//		calendar.setTime(date1); //放入你的日期 
//		System.out.println("天数为=" + calendar.getActualMaximum(Calendar.DAY_OF_MONTH)); 
		
//		 byte[] DES_KEY = { 127, 1, -110, 82, -32, -85, -128, -65 };
//		String password = "admin111111";
//		String en = DesUtil.encrypt(password);
//		System.out.println(en);
//		String de = DesUtil.decrypt(en);
//		System.out.println(de);
		 
//		MsgApp app = QueryMsg.get(MsgApp.class, "e543206d4dcf7b80eae8efa64c07788c");
//		JSONObject j = JSONObject.fromObject(app.getMemo());
//		System.out.println();
//		new Aaa().doo();
		// TODO Auto-generated method stub
//		System.out.println("begin");
//		TransactionCache tx = new QueryMsg().getTransaction();
//		tx.commit();
//		System.out.println("ok");
//		System.out.println(UuidUtil.getUuid());
//		System.out.println(UuidUtil.getUuid());
//		System.out.println(UuidUtil.getUuid());
		
//		Map m = new HashMap();
		
		
//		Message a = new Message();
//		a.setTitle("123");
//		a.setMessagebody("123");
//		List<Message> arr = new ArrayList();
//		arr.add(a);
//		a.setTitle("456");
//		arr.add(a);
//		a.setTitle("789");
//		arr.add(a);
//		for(Message i : arr) {
//			System.out.println("--------------");
//			System.out.println(i.getTitle());
//			System.out.println(i.getMessagebody());
//			
//		}
		
//		
//		Message a = new Message();
//		a.setTitle("123");
//		a.setMessagebody("123");
//		List<Message> arr = new ArrayList();
//		arr = add(a, arr);
//		a.setTitle("456");
//		arr = add(a, arr);
//		a.setTitle("789");
//		arr = add(a, arr);
//		for(Message i : arr) {
//			System.out.println("--------------");
//			System.out.println(i.getTitle());
//			System.out.println(i.getMessagebody());
//			
//		}
		
//		Integer a = 1;
//		List<Integer> arr = new ArrayList();
//		arr.add(a);
//		a = 2;
//		arr.add(a);
//		for(Integer i : arr) {
//			System.out.println("--------------");
//			System.out.println(i);
//			
//		}
		
//		Map a = new HashMap();
//		a.put("1", "1");
//		a.put("2", "2");
//		Map b = a;
//		b.put("1","3");
//		Iterator i = a.keySet().iterator();
//		System.out.println("--------------");
//		while(i.hasNext()){
//			String k = (String) i.next();
//			System.out.println(k+":"+a.get(k));
//		}
//		i = b.keySet().iterator();
//		System.out.println("--------------");
//		while(i.hasNext()){
//			String k = (String) i.next();
//			System.out.println(k+":"+b.get(k));
//		}
		
		int result = 4;
//		JSONObject o = new JSONObject().element("a", "a").element("b", "b");
//		PushResult a = new PushResult(result, "asdf");
//		System.out.println(a.toStringInfo());
//		System.out.println(a.toStringAll());
//		System.out.println(a.toStringInfo());
//		System.out.println(a.toStringAll());
	}
	

}

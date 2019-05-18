package com.css.msgcenter.server;

/**
 * @program: Desk1
 * @description: json对date的处理
 * @author: LSD
 * @create: 2018-11-05 19:34
 **/
import net.sf.json.JsonConfig;
import net.sf.json.processors.JsonValueProcessor;

import java.text.SimpleDateFormat;

/**
 * json-lib 日期处理类
 * @author Administrator
 *
 */
public class DateJsonValueProcessor implements JsonValueProcessor{

    private String format;

    public DateJsonValueProcessor(String format){
        this.format = format;
    }

    public Object processArrayValue(Object value, JsonConfig jsonConfig) {
// TODO Auto-generated method stub
        return null;
    }

    public Object processObjectValue(String key, Object value, JsonConfig jsonConfig) {
        if(value == null)
        { 
            return ""; 
        } 
        if(value instanceof java.sql.Timestamp) 
        { 
            String str = new SimpleDateFormat(format).format((java.sql.Timestamp)value); 
            return str; 
        } 
        if (value instanceof java.util.Date) 
        { 
            String str = new SimpleDateFormat(format).format((java.util.Date) value); 
            return str; 
        } 

        return value.toString(); 
    }

}



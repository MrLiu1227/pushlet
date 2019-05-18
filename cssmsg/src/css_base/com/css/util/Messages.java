package com.css.util;

import java.text.MessageFormat;
import java.util.List;
import java.util.MissingResourceException;
import java.util.ResourceBundle;

public class Messages
{
  private static final String BUNDLE_NAME = "messages";
  private static final ResourceBundle RESOURCE_BUNDLE = ResourceBundle.getBundle("messages");
  
  public static String getString(String key)
  {
    try
    {
      return RESOURCE_BUNDLE.getString(key);
    }
    catch (MissingResourceException e)
    {
      e.printStackTrace();
    }
    return '!' + key + '!';
  }
  
  public static String getString(String key, String[] paras)
  {
    try
    {
      String message = RESOURCE_BUNDLE.getString(key);
      return MessageFormat.format(message, paras);
    }
    catch (MissingResourceException e) {}
    return '!' + key + '!';
  }
  
  public static String getString(String key, List arg)
  {
    try
    {
      if (!arg.isEmpty())
      {
        String[] paras = new String[arg.size()];
        for (int i = 0; i < arg.size(); i++) {
          paras[i] = ((String)arg.get(i));
        }
        return getString(key, paras);
      }
      return "";
    }
    catch (MissingResourceException e) {}
    return '!' + key + '!';
  }
}

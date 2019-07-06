/*
 * Created on 2006-8-20
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package com.css.util;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author Administrator TODO To change the template for this generated type
 *         comment go to Window - Preferences - Java - Code Style - Code
 *         Templates
 */
public class CookieUtil {
	public static void SetCookies(String CookieName, String CookieValues, int CookieDay, HttpServletResponse response) {
		try {
			Cookie cookie = new Cookie(CookieName, CookieValues);
			cookie.setMaxAge(CookieDay);
			response.addCookie(cookie);
		} catch (Exception ex) {
		}
	}
	public static String GetCookies(String CookieName, HttpServletRequest request) {
		String cookie = "";
		try {
			Cookie cookies[] = request.getCookies();
			if (cookies != null) {
				for (int i = 0; i < cookies.length; i++) {
					if (cookies[i].getName().equals(CookieName)) {
						cookie = cookies[i].getValue();
					}
				}
			}
		} catch (Exception ex) {
		}
		return cookie;
	}
}

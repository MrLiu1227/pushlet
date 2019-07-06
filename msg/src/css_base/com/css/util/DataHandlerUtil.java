/**
 * 
 */
package com.css.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.activation.DataHandler;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class DataHandlerUtil {
	private static final Log logger = LogFactory.getLog(DataHandlerUtil.class);
	public static boolean saveFile(String filePath, DataHandler handler) {
		InputStream is = null;
		OutputStream os = null;
		try {
			is = handler.getInputStream();
			os = new FileOutputStream(new File(filePath));
			byte[] b = new byte[8192];
			int r = 0;
			while ((r = is.read(b)) != -1) {
				os.write(b, 0, r);
			}
			return true;
		} catch (IOException e) {
			logger.error("File upload exception: ", e);
			return false;
		} finally {
			if (os != null) {
				try {
					os.flush();
					os.close();
				} catch (IOException e) {
					logger.error("Closing output exception: ", e);
				}
			}
			if (is != null) {
				try {
					is.close();
				} catch (IOException e) {
					logger.error("Closing input exception: ", e);
				}
			}
		}
	}
}

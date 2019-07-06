package com.css.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.commons.io.IOUtils;

public class ZipHelp {

	public static void main(String[] args) {
		List<String> files = Extract("C:/axis.jar", "C:/axisjar/", 1024);
		for (int i = 0; i < files.size(); i++) {
			String name = files.get(i).replaceAll("C:/axisjar/", "");
			if (name.endsWith(".class")) {
				System.out.println(name.replaceAll(".class", "").replaceAll(
						"/", ".")
						+ " " + files.get(i));
			}
			//System.out.println( files.get(i).replaceAll("C:/axisjar/", "") );
		}
	}

	private static void dirMake(String dir, boolean isfile) {
		if (isfile) {
			int last = dir.lastIndexOf("/");
			dir = dir.substring(0, last);
		}
		File f = new File(dir);
		if (!f.exists()) {
			f.mkdirs();
		}
	}


	public static List<String> Extract(String zipFilePath, String extractPath,
			int bufferSize) {
		dirMake(extractPath, false);
		FileInputStream fis = null;
		ZipInputStream zis = null;
		FileOutputStream fop = null;
		List<String> files = new ArrayList<String>();
		try {
			fis = new FileInputStream(new File(zipFilePath));
			zis = new ZipInputStream(fis);
			ZipEntry entry = null;
			byte[] data = new byte[bufferSize];
			String workname = null;
			while ((entry = zis.getNextEntry()) != null) {
				workname = extractPath + entry.getName();
				if (entry.isDirectory()) {
					//dirMake(workname, false);
				} else {
					dirMake(workname, true);
					fop = new FileOutputStream(workname);
					while (true) {
						int size = zis.read(data, 0, data.length);
						if (size > 0) {
							fop.write(data, 0, size);
						} else {
							break;
						}
					}
					fop.flush();
					fop.close();
					files.add(workname);
				}
			}

		} catch (Exception e) {
			files.clear();
			e.printStackTrace();
		} finally {
			IOUtils.closeQuietly(zis);
			IOUtils.closeQuietly(fis);
			IOUtils.closeQuietly(fop);
		}
		return files;
	}
}

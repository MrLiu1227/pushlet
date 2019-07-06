package com.css.util;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.Closeable;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;
 /**
  * 文件操作
  * @author paladin
  * @since 1.0
  */
public class FileUtil {
	/**
	 * 创建多级目录，不需要判断父级目录是否存在
	 * @param file
	 */
	public static void mkdir(File file){	 
		if(file != null && !file.exists()){
			file.mkdirs();
		}
		 
	} 
	
	/**
	 * 重载mkdir
	 * @param file
	 */
	public static void mkdir(String file){
		mkdir(new File(file));
	}
	
	/**
	 * 创建文件，若文件所在目录不存在，则创建目录
	 * @param file
	 * @throws IOException 
	 */
	public static void mkfile(File file) throws IOException{	 
			if(file != null && !file.exists()){
				File parentFile = file.getParentFile();
				if(parentFile != null && !parentFile.exists()){
					mkdir(parentFile);
				}
				file.createNewFile();
			}
		 		
	}
	
	/**
	 * 重载mkfile
	 * @param file
	 * @throws IOException 
	 */
	public static void mkfile(String file) throws IOException{
		mkfile(new File(file));
	}
	
	/**
	 * 删除指定文件
	 * @param filename 文件位置
	 * @throws Exception
	 */
	public static void del(String filename) throws Exception {		 
			File file = new File(filename);
			if(file.exists()){
				file.delete();
			}		 
	}
	
	/**
	 * 删除特定目录或者文件(目录递归删除)
	 * @param path
	 * @throws Exception
	 */
	public static void delFile(File path) throws Exception{
		if (!path.exists()) {
			throw new RuntimeException("文件"+path+"不存在!");
		} else {
			if (path.isFile()) {
				del(path.getAbsolutePath());
			} else {
				File[] files = path.listFiles();
				for (int i = 0; i < files.length; i++) {
					delFile(files[i]);
					del(files[i].getAbsolutePath());
				}
			}		
		}	
	}
	
	/**
	 * 删除特定目录
	 * @param path
	 * @throws Exception
	 */
	public static void delFile(String path) throws Exception{
		delFile(new File(path));
	}
	/**
	 * 获取文件扩展名
	 * @param f
	 * @return
	 */
	public static String getExtension(File f) { 
        return (f != null) ? getExtension(f.getName()) : ""; 
    } 

    /**
     * 获取文件扩展名
     * @param filename
     * @return
     */
    public static String getExtension(String filename) { 
        return getExtension(filename, ""); 
    } 

    /**
     * 获取文件扩展名
     * @param filename
     * @param defExt
     * @return
     */
    public static String getExtension(String filename, String defExt) { 
        if ((filename != null) && (filename.length() > 0)) { 
            int i = filename.lastIndexOf('.'); 

            if ((i >-1) && (i < (filename.length() - 1))) { 
                return filename.substring(i + 1).toLowerCase(); 
            } 
        } 
        return defExt; 
    } 

    /**
     * 去掉文件扩展名，返回文件名
     * @param filename
     * @return
     */
    public static String trimExtension(String filename) { 
        if ((filename != null) && (filename.length() > 0)) { 
            int i = filename.lastIndexOf('.'); 
            if ((i >-1) && (i < (filename.length()))) { 
                return filename.substring(0, i); 
            } 
        } 
        return filename; 
    } 
    
	/**
	 * 遍历当前目录及子目录下得所有文件，并将满足extArr扩展名的文件路径存放在map中
	 * @param path 要遍历的目录
	 * @param extArr 文件扩展名
	 * @param hm 将文件路径存放至hm中
	 */	
	public static void list(File path, String[] extArr,HashMap hm) {
		if (!path.exists()) {
			System.out.println("文件名称不存在!");
		} else {
			if (path.isFile()) {
				for (int i = 0; i < extArr.length; i++) {
					if (path.getName().toLowerCase().endsWith(extArr[i])) {// 文件格式						
						hm.put(path.getName(), path.getAbsolutePath());
					}				
				}
			} else {
				File[] files = path.listFiles();
				for (int i = 0; i < files.length; i++) {
					list(files[i], extArr,hm);
				}			
			}		
		}	
	}

	/**
	 * 遍历当前目录及子目录下得所有文件并存放在map中
	 * @param path 要遍历的目录
	 * @param hm 将文件路径存放至hm中
	 */
	public static void list(File path, Map hm) {
		if (!path.exists()) {
			System.out.println("文件名称不存在!");
		} else {
			if (path.isFile()) {
				hm.put(Md5Util.MD5Encode(path.getAbsolutePath()), path.getAbsolutePath());
			} else {
				File[] files = path.listFiles();
				for (int i = 0; i < files.length; i++) {
					list(files[i], hm);
				}		
			}		
		}	
	}

	public static void list(String path, Map hm) {
		list(new File(path), hm);
	}
 
	/**
	 * 将数据写到指定文件
	 * @param b  数据
	 * @param outputFile 文件路径
	 * @return
	 */
	public static File getFileFromBytes(byte[] b, String outputFile) {
		BufferedOutputStream stream = null;
		File file = null;
		try {
			file = new File(outputFile);
			FileOutputStream fstream = new FileOutputStream(file);
			stream = new BufferedOutputStream(fstream);
			stream.write(b);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (stream != null) {
				try {
					stream.close();
				} catch (IOException e1) {
					e1.printStackTrace();
				}
			}
		}
		return file;
	}

	/**
	 * 获取指定文件中的数据
	 * @param path 文件路径
	 * @return
	 */
	public static byte[] getBytesFromFile(String path) {
		BufferedInputStream stream = null;
		File file=null;
		byte[] b = null;
		try {
			file = new File(path);
			b=new byte[(int)file.length()];
			FileInputStream fstream = new FileInputStream(file);
			stream = new BufferedInputStream(fstream);
			stream.read(b);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (stream != null) {
				try {
					stream.close();
				} catch (IOException e1) {
					e1.printStackTrace();
				}
			}
		}
		return b;
	}
	
	/**
	 * 复制文件
	 * @param oldPath 源文件路径
	 * @param newPath 目标路径
	 * @param arrSize  缓存大小
	 * @throws Exception
	 */
	public static void copyFile(String oldPath, String newPath, Integer arrSize) throws Exception{
		InputStream inputStream = null;
		OutputStream outputStream = null;
		try {
			int bytesum = 0;
			int byteread = 0;
			File oldfile = new File(oldPath);
			if (oldfile.exists()) { // 文件存在时
				inputStream = new FileInputStream(oldPath); // 读入原文件
				outputStream = new FileOutputStream(newPath);
				byte[] buffer = new byte[arrSize];
				int length;
				while ((byteread = inputStream.read(buffer)) != -1) {
					bytesum += byteread; // 字节数 文件大小
					outputStream.write(buffer, 0, byteread);
				}
				outputStream.flush();
			}
		} catch (Exception e) {
			System.out.println("复制单个文件操作出错");
			throw e;
		} finally {
			if (inputStream != null)
				inputStream.close();
			if (outputStream != null)
				outputStream.close();

		}
	}
	
	public static void close( Closeable to )
	{
		try {
			if( to != null )
			{
				to.close();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public static String readSource( String path, String append, String encode )
	{
		InputStreamReader isr = null;
		FileInputStream  fis = null;
		try {
			fis = new FileInputStream(path);
			StringBuffer text = new StringBuffer();
			isr = new InputStreamReader( fis, encode);
			char[] buffer = new char[1024*10];
			int readsize = isr.read(buffer, 0, buffer.length);
			while( readsize != -1){
				text.append(buffer, 0 ,readsize);
				readsize = isr.read(buffer, 0, buffer.length); 
			}
			if( append != null )
			{
				text.append(append);
			}
			return text.toString();
			
		} catch (Exception e) {
			System.out.println( "path: " + path );
			e.printStackTrace();
		}finally
		{
			close( fis );
			close( isr );
		}
		return "";
	}
}

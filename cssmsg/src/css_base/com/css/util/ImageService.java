package com.css.util;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import javax.imageio.ImageIO;

import org.im4java.core.ConvertCmd;
import org.im4java.core.IM4JavaException;
import org.im4java.core.IMOperation;
import org.im4java.core.IdentifyCmd;
import org.im4java.process.ArrayListOutputConsumer;

public class ImageService {
	public static double QUALITY = 95.0;

	/**
	 * 居中缩放剪裁图片,比原图小则剪裁，比原图大则扩放
	 * 
	 * @param srcPath
	 *           源图路径
	 * @param desPath
	 *           目标图保存路径
	 * @param width
	 *           待切割在宽度
	 * @param height
	 *           待切割在高度
	 * @throws IM4JavaException
	 * @throws InterruptedException
	 * @throws IOException
	 */
	public static void cropImageCenter(String srcPath, String desPath, int width, int height)
			throws IOException, InterruptedException, IM4JavaException {
		IMOperation op = new IMOperation();
		op.addImage();
		op.resize(width, height, '^').gravity("center").extent(width, height);
		op.quality(ImageService.QUALITY);
		op.addImage();
		ConvertCmd convert = new ConvertCmd(true);
		convert.run(op, srcPath, desPath);
	}

	/**
	 * * 同比例缩放剪裁图片，size比原图小则剪裁，size比原图大则扩放
	 * 
	 * @param srcPath
	 *           源图路径
	 * @param desPath
	 *           目标图保存路径
	 * @param size
	 * @param max
	 *           true表示图片的宽和高不能大于size, false表示图片的宽和高不能小于size
	 * @throws IOException
	 * @throws InterruptedException
	 * @throws IM4JavaException
	 */
	public static void cropImage(String srcPath, String desPath, int size, boolean max)
			throws IOException, InterruptedException, IM4JavaException {
		IMOperation op = new IMOperation();
		op.addImage();
		if (max)
			op.resize(size, size);
		else
			op.resize(size, size, '^');
		op.quality(ImageService.QUALITY);
		op.addImage();
		ConvertCmd convert = new ConvertCmd(true);
		convert.run(op, srcPath, desPath);
	}

	/**
	 * 根据坐标裁剪图片
	 *
	 * @param srcPath
	 *           要裁剪图片的路径
	 * @param newPath
	 *           裁剪图片后的路径
	 * @param x
	 *           起始横坐标
	 * @param y
	 *           起始挫坐标
	 * @param width
	 *           裁剪的宽度
	 * @param height
	 *           裁剪的高度
	 */
	public static void corpImage(String srcPath, String desPath, int x, int y, int width, int height) throws Exception {
		IMOperation op = new IMOperation();
		op.addImage();
		op.crop(width, height, x, y);
		op.addImage();
		ConvertCmd convert = new ConvertCmd(true);
		convert.run(op, srcPath, desPath);
	}

	/**
	 * 根据尺寸缩放图片
	 * 
	 * @param width
	 *           缩放后的图片宽度
	 * @param height
	 *           缩放后的图片高度
	 * @param srcPath
	 *           源图片路径
	 * @param desPath
	 *           缩放后图片的路径
	 */
	public static void zoomImage(String srcPath, String desPath, int width, int height) throws Exception {
		IMOperation op = new IMOperation();
		op.addImage();
		op.resize(width, height);
		op.addImage();
		ConvertCmd convert = new ConvertCmd(true);
		convert.run(op, srcPath, desPath);
	}

	/**
	 * 图片旋转
	 * 
	 * @param imagePath
	 *           源图片路径
	 * @param newPath
	 *           处理后图片路径
	 * @param degree
	 *           旋转角度
	 */
	public static void rotate(String srcPath, String desPath, double degree)
			throws IOException, InterruptedException, IM4JavaException {
		// 1.将角度转换到0-360度之间
		degree = degree % 360;
		if (degree <= 0)
			degree = 360 + degree;
		IMOperation op = new IMOperation();
		op.addImage();
		op.rotate(degree);
		op.quality(ImageService.QUALITY);
		op.addImage();
		ConvertCmd convert = new ConvertCmd(true);
		convert.run(op, srcPath, desPath);
	}

	// 《2》你的原图片只是一个输入流，你的输出图片只想要一个输出流
	// op.addImage("-"); // read from stdin
	// op.addImage("jpg:-"); // write to stdout in jpg-format
	// 注意这里的jpg可以根据你的图片格式而改变，但是必须要有，否则不知道你要以何格式生成转换后的图片
	// Pipe pipeIn = new Pipe(is, null);
	// Pipe pipeOut = new Pipe(null, os);
	// cmd.setInputProvider(pipeIn);
	// cmd.setOutputConsumer(pipeOut);
	// cmd.run(op);
	//
	/**
	 * 图片信息
	 * 
	 * @param imagePath
	 * @return
	 */
	public static String getImageInfo(String imagePath) {
		String line = null;
		try {
			IMOperation op = new IMOperation();
			op.format("width:%w,height:%h,path:%d%f,size:%b%[EXIF:DateTimeOriginal]");
			op.addImage(1);
			IdentifyCmd identifyCmd = new IdentifyCmd(true);
			ArrayListOutputConsumer output = new ArrayListOutputConsumer();
			identifyCmd.setOutputConsumer(output);
			identifyCmd.run(op, imagePath);
			ArrayList<String> cmdOutput = output.getOutput();
			assert cmdOutput.size() == 1;
			line = cmdOutput.get(0);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return line;
	}

	public static Integer[] getPosition(File inF, int wPos, int hPos, float autoFit) {
		try {
			BufferedImage bis = ImageIO.read(inF);
			int w = bis.getWidth();
			int h = bis.getHeight();
			float pW, pH, pX, pY;
			float ratio = wPos * 1f / hPos * 1f;
			if (ratio > 1) {
				pW = w * autoFit;
				pH = pW / ratio;
				if (pH > h) {
					pH = h * autoFit;
					pW = pH * ratio;
				}
			} else {
				pH = h * autoFit;
				pW = pH * ratio;
				if (pW > w) {
					pW = w * autoFit;
					pH = pW / ratio;
				}
			}
			pX = (w - pW) / 2;
			pY = (h - pH) / 2;
			Integer pos[] = new Integer[4];
			pos[0] = Math.round(pX);
			pos[1] = Math.round(pY);
			pos[2] = Math.round(pW);
			pos[3] = Math.round(pH);
			return pos;
		} catch (Exception ex) {
			return null;
		}
	}

	public static void main(String[] args) throws Exception {
		ImageService.cropImage("d:/test/2.jpg", "d:/test/test01.jpg", 150, true);
		ImageService.cropImage("d:/test/2.jpg", "d:/test/test02.jpg", 150, false);
		ImageService.cropImageCenter("d:/test/2.jpg", "d:/test/test03.jpg", 50, 50);
		ImageService.cropImageCenter("d:/test/2.jpg", "d:/test/test04.jpg", 1500, 1500);
		ImageService.rotate("d:/test/2.jpg", "d:/test/test05.jpg", 15);
		ImageService.rotate("d:/test/2.jpg", "d:/test/test06.jpg", -15);
	}
}
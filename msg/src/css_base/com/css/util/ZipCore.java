package com.css.util;

import java.io.File;
import java.io.FileOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * Created by vicegle on 16-4-22.
 */
public class ZipCore {

    private File zipfile = null;
    private ZipOutputStream zipout = null;
    private FileOutputStream outstream = null;
    private byte[] buffer = new byte[1024];

    public ZipCore(String zipfilename) {

        try {
            if (StringHelper.isEmpty(zipfilename)) {
                zipfilename = UuidUtil.getUuid() + ".zip";
            }
            zipfile = new File(zipfilename);
            outstream = new FileOutputStream(zipfile);
            zipout = new ZipOutputStream(outstream);
        } catch (Exception e) {
        }
    }

    public boolean zipStream(String name, byte[] context) {
        boolean result = true;
        try {
            ZipEntry entry = new ZipEntry(name);
            zipout.putNextEntry(entry);
            if (context != null) {
                zipout.write( context );
            }
        } catch (Exception e) {
            result = false;
            e.printStackTrace();
        }
        return result;
    }

    public File compelte() {
        try {
            if( zipout != null )
            {
                zipout.flush();
                zipout.finish();
            }
            if (outstream != null) {
                outstream.flush();
            }
            FileUtil.close( zipout);
            FileUtil.close( outstream );

            return  zipfile;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }


}

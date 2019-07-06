package com.css.util;

import java.io.File;
import java.io.FileOutputStream;
import java.util.jar.Attributes;
import java.util.jar.JarEntry;
import java.util.jar.JarOutputStream;
import java.util.jar.Manifest;
import java.util.zip.Deflater;

/**
 * Created by vicegle on 2016/5/2.
 */
public class JarCore {

    private File jarfile = null;
    private JarOutputStream jarout = null;
    private FileOutputStream outstream = null;
    private byte[] buffer = new byte[1024];

    public JarCore(String zipfilename) {

        try {
            if (StringHelper.isEmpty(zipfilename)) {
                zipfilename = UuidUtil.getUuid() + ".jar";
            }
            Manifest man = new Manifest();
            man.getMainAttributes().putValue(Attributes.Name.MANIFEST_VERSION.toString(), "1.0");
            man.getMainAttributes().putValue("CreateBy","IPS");
            jarfile = new File(zipfilename);
            outstream = new FileOutputStream(jarfile);
            jarout = new JarOutputStream(outstream,man);
            jarout.setLevel(Deflater.BEST_COMPRESSION);
        } catch (Exception e) {
        }
    }

    public boolean jarStream(String name, byte[] context) {
        boolean result = true;
        try {
            JarEntry entry = new JarEntry(name);
            jarout.putNextEntry(entry);
            if (context != null) {
                jarout.write( context );
            }
            jarout.closeEntry();
        } catch (Exception e) {
            result = false;
            e.printStackTrace();
        }
        return result;
    }

    public File compelte() {
        try {
            if( jarout != null )
            {
                jarout.flush();
                jarout.finish();
            }
            if (outstream != null) {
                outstream.flush();
            }
            FileUtil.close( jarout);
            FileUtil.close( outstream );

            return  jarfile;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }
}

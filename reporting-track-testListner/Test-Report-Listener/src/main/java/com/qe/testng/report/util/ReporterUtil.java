package com.qe.testng.report.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.JarURLConnection;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLConnection;
import java.util.Enumeration;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;

import org.apache.commons.lang.StringUtils;
import org.testng.ITestNGMethod;

import com.ebay.maui.controller.Logging;
import com.thoughtworks.qdox.JavaDocBuilder;
import com.thoughtworks.qdox.model.JavaClass;
import com.thoughtworks.qdox.model.JavaMethod;
import com.thoughtworks.qdox.model.Type;

public class ReporterUtil {
	public static boolean copyFile(final File toCopy, final File destFile) {
		try {
			return copyStream(new FileInputStream(toCopy),
					new FileOutputStream(destFile));
		} catch (final FileNotFoundException e) {
			e.printStackTrace();
		}
		return false;
	}

	private static boolean copyFilesRecusively(final File toCopy, final File destDir) {
		// assert destDir.isDirectory();

		if (!toCopy.isDirectory()) {
			return copyFile(toCopy, new File(destDir, toCopy.getName()));
		}
		final File newDestDir = new File(destDir, toCopy.getName());
		if (!newDestDir.exists() && !newDestDir.mkdir()) {
			return false;
		}
		for (final File child : toCopy.listFiles()) {
			if (!copyFilesRecusively(child, newDestDir)) {
				return false;
			}
		}
		return true;
	}

	public static boolean copyJarResourcesRecursively(final File destDir,
			final JarURLConnection jarConnection) throws IOException {

		final JarFile jarFile = jarConnection.getJarFile();

		for (final Enumeration<JarEntry> e = jarFile.entries(); e
				.hasMoreElements();) {
			final JarEntry entry = e.nextElement();
			if (entry.getName().startsWith(jarConnection.getEntryName())) {
				final String filename = StringUtils.removeStart(
						entry.getName(), //
						jarConnection.getEntryName());

				final File f = new File(destDir, filename);
				if (!entry.isDirectory()) {
					final InputStream entryInputStream = jarFile
							.getInputStream(entry);
					if (!copyStream(entryInputStream, f)) {
						return false;
					}
					entryInputStream.close();
				} else {
					if (!ensureDirectoryExists(f)) {
						throw new IOException("Could not create directory: "
								+ f.getAbsolutePath());
					}
				}
			}
		}
		return true;
	}

	public static boolean copyResourcesRecursively(final URL originUrl, final File destination) {
		try {
			final URLConnection urlConnection = originUrl.openConnection();
			if (urlConnection instanceof JarURLConnection) {
				return copyJarResourcesRecursively(destination,
						(JarURLConnection) urlConnection);
			}
			return copyFilesRecusively(new File(originUrl.getPath()),
					destination);
		} catch (final IOException e) {
			e.printStackTrace();
		}

		return false;
	}

	private static boolean copyStream(final InputStream is, final File f) {
		try {
			return copyStream(is, new FileOutputStream(f));
		} catch (final FileNotFoundException e) {
			e.printStackTrace();
		}
		return false;
	}

	private static boolean copyStream(final InputStream is,
			final OutputStream os) {
		try {
			final byte[] buf = new byte[1024];

			int len = 0;
			while ((len = is.read(buf)) > 0) {
				os.write(buf, 0, len);
			}
			is.close();
			os.close();
			return true;
		} catch (final IOException e) {
			e.printStackTrace();
		}
		return false;
	}

	private static boolean ensureDirectoryExists(final File f) {
		return f.exists() || f.mkdir();
	}
	
	/**
	 * Returns the java documentation of a test case as a String.
	 * 
	 * @param testMethod
	 * @return
	 * @throws URISyntaxException
	 */
	
	public static String getJavadocComments(ITestNGMethod testMethod) throws URISyntaxException {

		String testClassContainingThisMethod = testMethod.getTestClass().getName();
		String testMethodName = testMethod.getMethodName();

		Class testClass = testMethod.getTestClass().getRealClass();
		String projectPath = new File("").getAbsolutePath();
		String packagePath = testClass.getPackage().getName().replaceAll("\\.", "/");;
		JavaDocBuilder builder = new JavaDocBuilder();
		URL resource = Thread.currentThread().getContextClassLoader().getResource(packagePath);
		
		File src = new File(resource.toURI());
		builder.addSourceTree(src);
		// project source folder
		File realFolder = new File(projectPath + "/src/main/java/" + packagePath);
	
		if (realFolder.exists())
			builder.addSourceTree(realFolder);

		JavaClass qdoxClass = builder.getClassByName(testClassContainingThisMethod);
		Class<?>[] types = testMethod.getConstructorOrMethod().getParameterTypes();
		
		Type[] qdoxTypes = new Type[types.length];
		
		for (int i = 0; i < types.length; i++) {
			
			String type = getType(types[i]);
			int dim = getDim(types[i]);
			qdoxTypes[i] = new Type(type, dim);
		}

		JavaMethod qdoxJavaMethod = qdoxClass.getMethodBySignature(testMethodName, qdoxTypes);
		return qdoxJavaMethod.getComment();

	}

	public static String getType(Class<?> cls) {

		while (cls.isArray()) {
			cls = cls.getComponentType();
		}
		return cls.getName();
	}

	public static int getDim(Class<?> cls) {
		
		int dim = 0;
		while (cls.isArray()) {
			
			dim++;
			cls = cls.getComponentType();
		}
		return dim;
	}
	
	public static String replaceLogLine(String line) {
		
		String newLine = "";
		if (line.startsWith("<li> Step: Setting Attribute")){
			line="";
		}
		
		if(line.contains("<li>")){
			line = line.replaceAll("<li>", " ");
		}
		if(line.contains("</li>")){
			line = line.replaceAll("</li>", " ");
		}
		line = line.trim();
			
		if (line.startsWith("DBCall:")){
			System.out.println(line.indexOf('<'));
			System.out.println(line.indexOf('>'));
		}
		
		if (line.startsWith("APICall:")) {
			String[] arr = line.split(" \\| ");
			for (String s : arr) {
				System.out.println(s);
					
				if (s.contains("request headers") || s.contains("response headers")){
					s = "";
				}
					
				if (s.contains("input")){
					//System.out.println(s);
					s = " | " + Logging.getXmlRequestName().remove() + " |" ; 
				}
				
				if (s.contains("output")){
					//System.out.println(s);
					s= " " + Logging.getXmlResponseName().remove() + " | " ; 
				}
				newLine = newLine + s;
				System.out.println(line);
			}
			line=newLine;
		}
		return line;
	}
}
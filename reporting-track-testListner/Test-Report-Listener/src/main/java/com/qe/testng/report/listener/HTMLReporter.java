package com.qe.testng.report.listener;

import java.awt.Desktop;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.InetAddress;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLConnection;
import java.net.UnknownHostException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.testng.IReporter;
import org.testng.ISuite;
import org.testng.ISuiteListener;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;
import org.testng.internal.Utils;
import org.testng.xml.XmlSuite;

import com.ebay.maui.controller.Logging;
import com.qe.testng.report.dto.MethodDataModel;
import com.qe.testng.report.util.ReporterUtil;
//import com.ebay.maui.reporter.HTMLReporter.TestMethodSorter;
//import com.ebay.maui.reporter.HTMLReporter.TestResultSorter;

public class HTMLReporter implements IReporter, ITestListener, ISuiteListener {

	// private MethodDataModel reporterDO;
	MethodDataModel reporterSuiteDO;
	private Map<String, MethodDataModel> listOfDTO;
	private DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	// WebUXDriver driver;
	private Boolean firstTimeWrite = true;
	private String jsonData = "";
	private StringBuffer jsonDataForFile = new StringBuffer();
	// private String outputDirectory;
	private Boolean postData = true;

	public void onTestStart(ITestResult result) {

		for (Entry<String, MethodDataModel> entry : listOfDTO.entrySet()) {
			String key = entry.getKey();
			System.out.println("  ,key:" + key);
			// do stuff
		}

		MethodDataModel reporterTestDO = new MethodDataModel(reporterSuiteDO);

		listOfDTO.put(result.getName(), reporterTestDO);
		listOfDTO.get(result.getName()).setMethodStartTime(getCurrentTime());
		listOfDTO.get(result.getName()).setTestMethodName(result.getName());

		long time = System.currentTimeMillis();
		listOfDTO.get(result.getName()).setTestRunId(result.getName() + "_" + time);

		try {
			listOfDTO.get(result.getName()).setJavadoc(ReporterUtil.getJavadocComments(result.getMethod()));
		} catch (URISyntaxException uriSyntaxException) {
			uriSyntaxException.printStackTrace();
		}

	}

	/**
	 * This method is used to set properties after the test is Success -> It set
	 * the following parameters --> test result = passed --> test end time
	 */
	public void onTestSuccess(ITestResult result) {

		listOfDTO.get(result.getName()).setTestStatus("passed");

		createJSON(listOfDTO.get(result.getName()));
	}

	/**
	 * This method is used to set properties after the test is Fail -> It set
	 * the following parameters --> test result = failed
	 * 
	 */
	public void onTestFailure(ITestResult result) {

		listOfDTO.get(result.getName()).setTestStatus("failed");
		String Exception = "";

		Throwable ex = result.getThrowable();
		String stackTrace = "";
		if (ex != null) {
			stackTrace = Utils.stackTrace(ex, false)[0];
			Exception = stackTrace.substring(0, stackTrace.indexOf("\n"));
		}

		listOfDTO.get(result.getName()).setException(Exception);
		listOfDTO.get(result.getName()).setStackTrace(stackTrace);
		createJSON(listOfDTO.get(result.getName()));
	}

	/**
	 * This method is used to set properties after the test is skipped -> It set
	 * the following parameters --> test result = skipped
	 * 
	 */
	public void onTestSkipped(ITestResult result) {
		System.out.println("On test skipped");
		listOfDTO.get(result.getName()).setTestStatus("skipped");
		createJSON(listOfDTO.get(result.getName()));
	}

	/**
	 * This method is used to set properties after the test is Partial pass ->
	 * It set the following parameters --> test result = Partial pass
	 * 
	 */
	public void onTestFailedButWithinSuccessPercentage(ITestResult result) {
		System.out.println("On test partially failed");
		listOfDTO.get(result.getName()).setTestStatus("partiallyPassed");
		createJSON(listOfDTO.get(result.getName()));
	}

	public void onStart(ITestContext testContext) {
		System.out.println("On test start");
	}

	public void onFinish(ITestContext context) {
		System.out.println("On test finish");
	}

	public void generateReport(List<XmlSuite> xmlSuites, List<ISuite> suites, String outputDirectory) {

		System.out.println("Generating report");

		File destination = new File(outputDirectory);

		URL url = getClass().getResource("/HTMLReport/");

		ReporterUtil.copyResourcesRecursively(url, destination);
		System.out.println("Reources copied");

		File file = new File(outputDirectory + "/HTMLReport/js/reporterData.js");

		String data = "var testData = [" + jsonDataForFile + "];";
		// if file doesn't exists, then create it
		try {
			file.createNewFile();
			FileWriter fw = new FileWriter(file.getAbsoluteFile());
			BufferedWriter bw = new BufferedWriter(fw);
			bw.write(data);
			bw.close();
			System.out.println("Done");
		} catch (IOException e) {
			e.printStackTrace();
		}
		if (suites.get(0).getParameter("openReportInBrowser") != null) {
			try {
				File endReport = new File(outputDirectory + "/HTMLReport/Local report.html");
				Desktop.getDesktop().open(endReport);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

	public void onFinish(ISuite suite) {
		//
		System.out.println("On suite finish");
		String suiteEndTime = getCurrentTime();

	}

	public void onStart(ISuite suite) {
		//
		reporterSuiteDO = new MethodDataModel();
		listOfDTO = new HashMap<String, MethodDataModel>();

		System.out.println("On suite start");

		String suiteStartTime = getCurrentTime();
		// outputDirectory = suite.getOutputDirectory();

		String hostName = suite.getHost();
		String ipAddress;
		String domain = suite.getParameter("domain");
		String subDomain = suite.getParameter("subDomain");
		String configSpec = suite.getParameter("getConfigSpecFor");
		getConfigSpec(configSpec);
		String testSuiteName = suite.getName();

		String postDataParam = suite.getParameter("postDataToServer");
		if ((postDataParam != null) && (postDataParam.equalsIgnoreCase("false"))) {
			postData = false;
		}
		// To be retrieved from testng.xml
		Map<String, String> configSpecForDependentPools = getConfigSpec(suite.getParameter("getConfigSpecFor"));
		Object[] testNGParameters;

		ipAddress = "127.0.0.1";
		try {
			ipAddress = InetAddress.getLocalHost().getHostAddress();
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}

		try {
			hostName = InetAddress.getLocalHost().getCanonicalHostName();
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}

		reporterSuiteDO.setConfigSpecForDependentPools(configSpecForDependentPools);
		reporterSuiteDO.setIpAddress(ipAddress);
		reporterSuiteDO.setSuiteStartTime(suiteStartTime);
		reporterSuiteDO.setDomain(domain);
		reporterSuiteDO.setSubDomain(subDomain);
		reporterSuiteDO.setHostName(hostName);
		reporterSuiteDO.setTestSuiteName(testSuiteName);
		reporterSuiteDO.setSuiteRunId(suite.getName() + "_" + System.currentTimeMillis());

	}

	public Map<String, String> getConfigSpec(String configValue) {

		String keys;
		String values;

		Map<String, String> configSpec = new HashMap<String, String>();

		if (configValue == null || configValue.isEmpty()) {
			System.out.println("Please add \"getConfigSpecFor\" property in your TestNG.xml");
			return null;
		}

		String startPattern = "<Property name=\"CONFIG_SPEC\">";
		String endPattern = "end time]]>";

		WebDriver driver = new HtmlUnitDriver();

		String[] urls = configValue.split(",");

		// Get VI in the form of text and save it in the POJO
		try {

			for (String url : urls) {

				// Call the VI for the pool
				driver.get(url);

				String viPageSource = driver.getPageSource();
				int startIndex = viPageSource.indexOf(startPattern) + 40;
				int endIndex = viPageSource.indexOf(endPattern, startIndex);

				keys = url;
				values = viPageSource.substring(startIndex, endIndex + 8);

				System.out.println("Getting config spec : " + keys);
				configSpec.put(keys.replace('.', '-'), values);

			}

		} catch (Exception e) {
			System.err.println("Error: " + e.getMessage());
		}

		return configSpec;
	}

	public String getCurrentTime() {
		// get current date time with Date()
		Date date = new Date();
		String curTime = dateFormat.format(date);
		System.out.println("Current time : " + curTime);
		return curTime;
	}

	public synchronized void createJSON(MethodDataModel reporterLocalDO) {
		System.out.println("Create JSON of the object");
		ObjectMapper mapper = new ObjectMapper();
		String newLine = "";
		Map<String, String> screenShotMap = Logging.getScreenShotMap();
		Map<String, String> requestMap = Logging.getXmlRequests();
		Map<String, String> responseMap = Logging.getXmlResponses();

		reporterLocalDO.setScreenShot(screenShotMap);
		reporterLocalDO.setMethodEndTime(getCurrentTime());

		List<String> logLine = Logging.getRawLogs();
		StringBuilder testLog = new StringBuilder();
		for (String line : logLine) {

			// This method reads each line in the test log and replaces the dead
			// HTML link with a place holder
			// The place holder is a String coming from Logger class - Its one
			// of the value from a lost of API calls
			newLine = ReporterUtil.replaceLogLine(line);
			if (!newLine.isEmpty()) {
				testLog.append(newLine).append("\r\n");
				System.out.print(testLog.toString());
			}
		}

		reporterLocalDO.setLoggerData(testLog.toString());
		reporterLocalDO.setXmlRequests(requestMap);
		reporterLocalDO.setXmlResponse(responseMap);

		try {

			System.out.println("--Value before print " + reporterLocalDO.getTestMethodName());

			jsonData = mapper.writeValueAsString(reporterLocalDO);
			System.out.println("Value after print " + reporterLocalDO.getTestMethodName());

			if (firstTimeWrite) {
				jsonDataForFile.append(jsonData);
				firstTimeWrite = false;
			} else {
				jsonDataForFile.append(jsonDataForFile + "," + jsonData);
			}

			if (postData) {
				String url = "http://phx7b02c-d9d7.stratus.phx.qa.ebay.com:3000/";
				try {
					System.out.println("Json data1 is " + jsonData);

					postDataToServer(url, jsonData);
				} catch (Throwable e) {

					e.printStackTrace();
				}
			}

		} catch (JsonGenerationException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void postDataToServer(String url, String JSONData) throws Throwable {
		System.out.println("Posting data to server at : " + url);

		URL sendURL = new URL(url);
		URLConnection urlConn = sendURL.openConnection();
		urlConn.setDoInput(true);
		urlConn.setDoOutput(true);
		urlConn.setUseCaches(false);
		urlConn.setRequestProperty("Content-Type", "application/json");
		OutputStreamWriter wr = new OutputStreamWriter(urlConn.getOutputStream());
		String dataStr = JSONData.toString();
		wr.write(dataStr, 0, dataStr.length());
		wr.flush();
		wr.close();

		BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
		in.close();
	}

}
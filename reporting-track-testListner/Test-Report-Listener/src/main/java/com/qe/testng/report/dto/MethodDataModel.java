package com.qe.testng.report.dto;

import java.util.Map;

import org.apache.log4j.Logger;

/**
 * Class representing listener data that needs to be set in the Mongo DB.
 * 
 * @author sramkumar
 *
 */

public class MethodDataModel implements Cloneable { 
	private String suiteRunId;
	private String testRunId;
	private String suiteStartTime;
	private String suiteEndTime;
	private String methodStartTime;
	private String methodEndTime;
	private String hostName;
	private String ipAddress;
	private String domain;
	private String subDomain;
	private String loggerData;
	private String stackTrace;
	private String exception; // Check if this works.
	private String testMethodName;
	private String testSuiteName;
	private String testStatus;
	private String javadoc;
	private Map<String, String> configSpecForDependentPools; // To be retrived from testng.xml
	private Object[] testNGParameters;
	private Map<String,String> screenShot;
	private Map<String,String> xmlRequests;
	private Map<String,String> xmlResponses;
	
	
	//TODO: 
    // 1. Rules
	
	public Object clone() throws CloneNotSupportedException {
	        return super.clone();
	    }
	
	 public MethodDataModel(MethodDataModel c)
	{
	
			 suiteRunId=c.suiteRunId;
			 testRunId=c.testRunId;
			 suiteStartTime=c.suiteStartTime;
			 suiteEndTime=c.suiteEndTime;
			 methodStartTime=c.methodStartTime;
			 methodEndTime=c.methodEndTime;
			 hostName=c.hostName;
			 ipAddress=c.ipAddress;
			 domain=c.domain;
			 subDomain=c.subDomain;
			 loggerData=c.loggerData;
			 stackTrace=c.stackTrace;
			 exception=c.exception; // Check if this works.
			 testMethodName=c.testMethodName;
			 testSuiteName=c.testSuiteName;
			 testStatus=c.testStatus;
			 javadoc=c.javadoc;
			/*private Map<String, String> configSpecForDependentPools; // To be retrived from testng.xml
			private Object[] testNGParameters;
			private Map<String,String> screenShot;
			private Map<String,String> xmlRequests;
			private Map<String,String> xmlResponses;
			*/
			 configSpecForDependentPools=c.configSpecForDependentPools;
			 testNGParameters=c.testNGParameters;
			 screenShot=c.screenShot;
			 xmlRequests=c.xmlRequests;
			 xmlResponses=c.xmlResponses;
			 
			 
	}
	public MethodDataModel() {
		// TODO Auto-generated constructor stub
	}

	public String getHostName() {
		return hostName;
	}
	
	public String getTestRunId() {
		return testRunId;
	}

	public void setTestRunId(String testRunId) {
		this.testRunId = testRunId;
	}

	public String getSuiteStartTime() {
		return suiteStartTime;
	}

	public void setSuiteStartTime(String suiteStartTime) {
		this.suiteStartTime = suiteStartTime;
	}

	public String getSuiteEndTime() {
		return suiteEndTime;
	}

	public void setSuiteEndTime(String suiteEndTime) {
		this.suiteEndTime = suiteEndTime;
	}

	public String getMethodStartTime() {
		return methodStartTime;
	}

	public void setMethodStartTime(String methodStartTime) {
		this.methodStartTime = methodStartTime;
	}

	public String getMethodEndTime() {
		return methodEndTime;
	}

	public void setMethodEndTime(String methodEndTime) {
		this.methodEndTime = methodEndTime;
	}

	public void setHostName(String hostName) {
		this.hostName = hostName;
	}
	public String getIpAddress() {
		return ipAddress;
	}
	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}
	public String getDomain() {
		return domain;
	}
	public void setDomain(String domain) {
		this.domain = domain;
	}
	public String getSubDomain() {
		return subDomain;
	}
	public void setSubDomain(String subDomain) {
		this.subDomain = subDomain;
	}
	public String getLoggerData() {
		return loggerData;
	}
	public void setLoggerData(String loggerData) {
		this.loggerData = loggerData;
	}
	public String getStackTrace() {
		return stackTrace;
	}
	public void setStackTrace(String stackTrace) {
		this.stackTrace = stackTrace;
	}
	public String getException() {
		return exception;
	}
	public void setException(String exception) {
		this.exception = exception;
	}
	public String getTestMethodName() {
		return testMethodName;
	}
	public void setTestMethodName(String testMethodName) {
		this.testMethodName = testMethodName;
	}
	public String getTestSuiteName() {
		return testSuiteName;
	}
	public void setTestSuiteName(String testSuiteName) {
		this.testSuiteName = testSuiteName;
	}
	public String getJavadoc() {
		return javadoc;
	}
	public void setJavadoc(String javadoc) {
		this.javadoc = javadoc;
	}
	public Map<String, String> getConfigSpecForDependentPools() {
		return configSpecForDependentPools;
	}
	public void setConfigSpecForDependentPools(
			Map<String, String> configSpecForDependentPools) {
		this.configSpecForDependentPools = configSpecForDependentPools;
	}
	public Object[] getTestNGParameters() {
		return testNGParameters;
	}
	public void setTestNGParameters(Object[] testNGParameters) {
		this.testNGParameters = testNGParameters;
	}
	public String getTestStatus() {
		return testStatus;
	}
	public void setTestStatus(String testStatus) {
		this.testStatus = testStatus;
	}
	public Map<String, String> getScreenShot() {
		return screenShot;
	}
	public void setScreenShot(Map<String, String> screenShot) {
		this.screenShot = screenShot;
	}
	public Map<String, String> getXmlRequests() {
		return xmlRequests;
	}
	public void setXmlRequests(Map<String, String> xmlRequests) {
		this.xmlRequests = xmlRequests;
	}
	public Map<String, String> getXmlResponse() {
		return xmlResponses;
	}
	public void setXmlResponse(Map<String, String> xmlResponses) {
		this.xmlResponses = xmlResponses;
	}

	/**
	 * @return the suiteRunId
	 */
	public String getSuiteRunId() {
		return suiteRunId;
	}

	/**
	 * @param suiteRunId the suiteRunId to set
	 */
	public void setSuiteRunId(String suiteRunId) {
		this.suiteRunId = suiteRunId;
	}

}
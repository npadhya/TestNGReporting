var endPoint = "http://phx7b02c-d9d7.stratus.phx.qa.ebay.com:3000/";
var selectedData;
var qsp;
var navBar = document.getElementById("navBar");
var testCaseID = "";
var filters = "";
var columnView = [
				{ headerText: "Test status" , visible: false}, 
				{ headerText: "Test Name" , visible: true}, 
				{ headerText: "Sub domain", visible: true }, 
				{ headerText: "Test start time", visible: true },
				{ headerText: "Method ID", visible: false },
			];
var allowPageSize = 30;

$(document).ready(function () {

	var urlParams;
	(window.onpopstate = function () {
		var match,
		pl     = /\+/g,  // Regex for replacing addition symbol with a space
		search = /([^&=]+)=?([^&]*)/g,
		decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
		query  = window.location.search.substring(1);

		// Check if "&" is present in the URL - This indicates if the "_id=XXXXX&filter=" patterns is present
		if(query.indexOf("_id") != -1){
			testCaseID = (query.substring(query.indexOf("_id"),query.indexOf("&")-1));
		}
		if(query.indexOf("filter") != -1){
			filters = query.substring(query.indexOf("filter"));
		}
		console.log("Test case ID : "+testCaseID);
		console.log("Filters : "+filters);

		/*console.log(query.substring(query.indexOf("_id")+4,query.indexOf("&")-1));

		if(query.indexOf("&") == -1){
			console.log("ID NOT PRESENT");
		}
		var querySplit = query.split('&');
	
		// This will get the Test case ID from the URL
		testCaseID = querySplit[0];
		console.log("Test case ID : "+testCaseID);

		// This will get the list of requested filters
		// In the report we are not using the requested filter but the implementation is in place from server
		filters = querySplit[1];
		console.log("Filters : "+filters);*/

		qsp = "?_id="+testCaseID + "&" + filters;

		urlParams = {};
		while (match = search.exec(query))
		   urlParams[decode(match[1])] = decode(match[2]);
	})();

	loadArrowFunctionality();
	getAllTests();

	paintTable();

});

function paintTable(){

	var q = "?";
	if(testCaseID.length > 0){
		q = q+testCaseID+"&";
	}

	var queryTo = endPoint+q+"filter=methodStartTime,subDomain,testMethodName,testStatus";
	console.log("Query to  : "+queryTo);
	// This method will take the testData and paint the table by inserting the data in to the existing table.
	var passData = [];
	var failData = [];
	var skipData = [];
	var partialData = [];

	$.getJSON(queryTo, function(json){
		console.log("JSON Object is : ");
		console.log(json);
		$("#wijgridAll").wijgrid({
			allowSorting: true,
			allowColSizing: true,
			selectionMode: "singleRow",
			allowPaging: true,
			pageSize: allowPageSize,
			data: json,
			columns: columnView,
			selectionChanged: onSelectTestCase,
			rowStyleFormatter: function (args) {
				if ((args.state & $.wijmo.wijgrid.renderState.rendering) && (args.type & $.wijmo.wijgrid.rowType.data)) {
					if(args.data.testStatus =="passed"){
						passData.push(args.data);
						args.$rows.attr("class","wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow alert alert-success");
						args.$rows.attr("id","testSuccess");
					}
					if(args.data.testStatus =="skipped"){
						skipData.push(args.data);
						args.$rows.attr("class","wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow alert alert-warning");
						args.$rows.attr("id","testWarning");
					}
					if(args.data.testStatus =="failed"){
						failData.push(args.data);
						args.$rows.attr("class","wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow alert alert-error");
						args.$rows.attr("id","testError");
					}
				}
			}
		});
	})
	.fail(function() {
		console.log("Loading Data table failed");
	})
	.done(function() {
		console.log("Data table loaded");
		selectedData = 00;
		
		var container = document.getElementById("testError");

		$("#wijgridPass").wijgrid({
			allowSorting: true,
			allowColSizing: true,
			selectionMode: "singleRow",
			allowPaging: true,
			pageSize: allowPageSize,
			data: passData,
			columns: columnView,
			selectionChanged: onSelectTestCase,
			rowStyleFormatter: function (args) {
				if ((args.state & $.wijmo.wijgrid.renderState.rendering) && (args.type & $.wijmo.wijgrid.rowType.data)) {
					if(args.data.testStatus =="passed"){
						args.$rows.attr("class","wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow alert alert-success");
					}
					if(args.data.testStatus =="skipped"){
						args.$rows.attr("class","wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow alert alert-warning");
					}
					if(args.data.testStatus =="failed"){
						args.$rows.attr("class","wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow alert alert-error");
					}
				}
			}
		});

		$("#wijgridFail").wijgrid({
			allowSorting: true,
			allowColSizing: true,
			selectionMode: "singleRow",
			allowPaging: true,
			pageSize: allowPageSize,
			data: failData,
			columns: columnView,
			selectionChanged: onSelectTestCase,
			rowStyleFormatter: function (args) {
				if ((args.state & $.wijmo.wijgrid.renderState.rendering) && (args.type & $.wijmo.wijgrid.rowType.data)) {
					if(args.data.testStatus =="passed"){
						args.$rows.attr("class","wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow alert alert-success");
						args.$rows.attr("id","testSuccess");
					}
					if(args.data.testStatus =="skipped"){
						args.$rows.attr("class","wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow alert alert-warning");
					}
					if(args.data.testStatus =="failed"){
						args.$rows.attr("class","wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow alert alert-error");
					}
				}
			}
		});
		
		$("#wijgridSkip").wijgrid({
			allowSorting: true,
			allowColSizing: true,
			selectionMode: "singleRow",
			allowPaging: true,
			pageSize: allowPageSize,
			data: skipData,
			columns: columnView,
			selectionChanged: onSelectTestCase,
			rowStyleFormatter: function (args) {
				if ((args.state & $.wijmo.wijgrid.renderState.rendering) && (args.type & $.wijmo.wijgrid.rowType.data)) {
					if(args.data.testStatus =="passed"){
						args.$rows.attr("class","wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow alert alert-success");
					}
					if(args.data.testStatus =="skipped"){
						args.$rows.attr("class","wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow alert alert-warning");
					}
					if(args.data.testStatus =="failed"){
						args.$rows.attr("class","wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow alert alert-error");
					}
				}
			}
		});

		$("#wijgridPass").wijgrid("doRefresh");

		$("#wijgridFail").wijgrid("doRefresh");

		$("#wijgridSkip").wijgrid("doRefresh");
	});
}

function onSelectTestCase(selectedTable) {

	var hiddenItem = $("#"+selectedTable.target.id).wijgrid("currentCell").rowIndex();
	var currentPageId = $("#"+selectedTable.target.id).wijgrid("option", "pageIndex");
	var currentPageSize = $("#"+selectedTable.target.id).wijgrid("option", "pageSize");
	var pageIndex = (currentPageId * currentPageSize) + hiddenItem;
	var data = $("#"+selectedTable.target.id).wijgrid("data");

	var ss = data[pageIndex];

	var screenshotUrl = endPoint+'?_id='+ss["_id"]+'&filter=screenShot';
	
	var stackTraceUrl = endPoint+'?_id='+ss["_id"]+'&filter=stackTrace';
	
	var debugInfoUrl = endPoint+'?_id='+ss["_id"]+'&filter=debugInfo';
	
	var testLogsUrl = endPoint+'?_id='+ss["_id"]+'&filter=testLogs';
	
	var reqResUrl = endPoint+'?_id='+ss["_id"]+'&filter=xmlRequests,xmlResponse';
	
	// Get Screen shot data for selected testcase, By making getJSON call to server with the testcase ID
	// The ScreenShot URL is dynamically created after selecting a testCase
	console.log(screenshotUrl);
	$.getJSON(screenshotUrl, function(json) {
		var screenShotObj = json[0]["screenShot"];
		getScreenShots(screenShotObj);
	})
	.fail(function(){
		console.error("Screen shot data loading failed...");
	})
	.done(function(){
		console.log("Screen shot data loaded");
	});

	// Get Stacktrace data for selected testcase, By making getJSON call to server with the testcase ID
	// The Stacktrace URL is dynamically created after selecting a testCase
	console.log(stackTraceUrl);
	$.getJSON(stackTraceUrl, function(json) {
		var stacktraceObj = json[0]["stackTrace"];
		getStackTrace(stacktraceObj);
	})
	.fail(function(){
		console.error("StackTrace data loading failed...");
	})
	.done(function(){
		console.log("Stack trace data loaded");
	});

	// Get Test logs for selected testcase, By making getJSON call to server with the testcase ID
	// The TestLogs URL is dynamically created after selecting a testCase
	console.log(testLogsUrl);
	$.getJSON(testLogsUrl, function(json) {
		var testlogsObj = json[0]["debugInfo"];
		getTestLogs(testlogsObj);
	})
	.fail(function(){
		console.error("Test Logs loading failed...");
	})
	.done(function(){
		console.log("Test Logs data loaded");
	});

	// Get Debuginformation data for selected testcase, By making getJSON call to server with the testcase ID
	// The DebugInfo URL is dynamically created after selecting a testCase
	console.log(debugInfoUrl);
	$.getJSON(debugInfoUrl, function(json) {
		var debuginfoObj = json[0]["debugInfo"];
		getDebuggingHelpData(debuginfoObj);
	})
	.fail(function(){
		console.error("Debug data loading failed...");
	})
	.done(function(){
		console.log("Debug data loaded");
	});

	// Get Request and Responses data for selected testcase, By making getJSON call to server with the testcase ID
	// The Request/Response URL is dynamically created after selecting a testCase
	console.log(reqResUrl);
	$.getJSON(reqResUrl, function(json) {
		var xmlReq = json[0]["xmlRequests"];
		console.log("xmlRequest : ");
		console.log(xmlReq);
		var xmlRes = json[0]["xmlResponse"];
		console.log("xmlResponse : ");
		console.log(xmlRes);

		if(xmlReq || xmlRes){
			$('#reqResHeader').show();
			$('#reqResContent').show();
			getXMLRequestResponse(xmlReq,xmlRes);

		} else {
			$('#reqResHeader').hide();
			$('#reqResContent').hide();
		}
	})
	.fail(function(){
		console.error("Request Response data loading failed...");
	})
	.done(function(){
		console.log("Request Response data loaded");
	});
}	

function getScreenShots(screenshotObj){
	// Get the screen shot for this method by Date
	//inseart the new screen shots in to the Screen Shot DIV
	//alert('getting screen shot for :' + screenshotObj );

	if(screenshotObj){
		var container = document.getElementById("imageContainer");
		container.innerHTML = '';

		$('#screenShotListHeader').show();
		$('#screenShotListContent').show();
		$('#screenShotListDivider').show();

		var i=0;

		var ul = document.createElement("ul");
		ul.setAttribute("class","thumbnails");

		var mainContainer = document.createElement("div");

		for (var key in screenshotObj ) {

			id = "lightBoxImage"+i;
			var li = document.createElement("li");
			li.setAttribute("class","span2");

			var a = document.createElement("a");
			a.setAttribute("data-toggle","lightbox");
			a.setAttribute("href","#"+id);
			a.setAttribute("class","thumbnail");

			var thisImg = "data:image/jpeg;base64,"+screenshotObj[key];

			var thumbImage = document.createElement("img");
			thumbImage.setAttribute("src",thisImg);
			thumbImage.setAttribute("title",key);
			thumbImage.setAttribute("class","img-polaroid");
			thumbImage.setAttribute("style","width: 120px; height: 120px;");

			a.appendChild(thumbImage);
			li.appendChild(a);
			ul.appendChild(li);

			var mainLightBox = document.createElement("div");
			mainLightBox.setAttribute("id",id);
			mainLightBox.setAttribute("class","hide fade lightbox");
			mainLightBox.setAttribute("tabindex","-1");
			mainLightBox.setAttribute("role","dialog");
			mainLightBox.setAttribute("aria-hidden","true");

			var lightboxContent = document.createElement("div");
			lightboxContent.setAttribute("class","lightbox-content");

			var p = document.createElement("p");
			p.innerHTML = key;

			var divCaption = document.createElement("div");
			divCaption.setAttribute("class","lightbox-caption");

			divCaption.appendChild(p);

			var mainImage = document.createElement("img");
			mainImage.setAttribute("src",thisImg);
			mainImage.setAttribute("title",key);
			mainImage.setAttribute("style","width: 50%; height: 50%;");

			lightboxContent.appendChild(mainImage);
			lightboxContent.appendChild(divCaption);

			mainLightBox.appendChild(lightboxContent);

			mainContainer.appendChild(mainLightBox);

			i++;
		}
		container.appendChild(ul);
		container.appendChild(mainContainer);
	} else {
		$('#screenShotListHeader').hide();
		$('#screenShotListContent').hide();
		$('#screenShotListDivider').hide();
	}
}

function getDebuggingHelpData(debuginfoObj){
	// This function will fillup the debugging info DIV
	// This data is set by the test case 
	if(debuginfoObj){

	} else {
		$('#debugHelperHeader').hide();
		$('#debugHelperContent').hide();
		$('#debugHelperDivider').hide();
	}
}

function getStackTrace(stacktraceObj){
	// This function is used to retrive only the stackTrace of a testCase whose status=Failed
	// The data is than randered on the stackTrace section.
	if(stacktraceObj){

	} else {
		$('#stackTraceHeader').hide();
		$('#stackTraceContent').hide();
		$('#stackTraceDivider').hide();
	}
}

function getTestLogs(testlogsObj){
	// This function will fillup the debugging info DIV
	// This data is set by the test case

	console.log(testlogsObj);
	var testLogContainer = document.getElementById("testLogs");
	var div = document.createElement("div");

	if(testlogsObj){
		testLogContainer.innerHTML = testlogsObj.testLogs;
		$('#testLogHeader').show();
		$('#testLogContent').show();
		$('#testLogDivider').show();
	} else {
		$('#testLogHeader').hide();
		$('#testLogContent').hide();
		$('#testLogDivider').hide();
	}
}

function getXMLRequestResponse(xmlrequestsObj,xmlresponseObj){
	// This function will fillup the debugging info DIV
	// This data is set by the test case 
	if(xmlrequestsObj){

	} else {
		$('#reqResHeader').hide();
		$('#reqResContent').hide();
	}
}

function getAllTests(){
	//Get list of all the test cases in the DB
	$.getJSON(endPoint+'?stats=yes', 
		function(json) {
			document.getElementById("totalTests").innerHTML=json;
		})
		.fail(function() {
			console.log("Failed");
		})
		.done(function() {
			$('#loadingAll').hide();
		}
	);

	//Get list of test cases whose status = Passed
	// Between the fromDate and toDate parameters
	$.getJSON(endPoint+"?testStatus=passed&stats=yes", 
		function(json) {
			console.log(endPoint+"?testStatus=passed&stats=yes");
			document.getElementById("passedTests").innerHTML=json;
		})
		.fail(function() {
			console.log("Failed");
		})
		.done(function() {
			$('#loadingPass').hide();
		}
	);

	//Get list of test cases whose status = Failed
	// Between the fromDate and toDate parameters
	$.getJSON(endPoint+'?testStatus=failed&stats=yes', 
		function(json) {
			document.getElementById("failedTests").innerHTML=json;
		})
		.fail(function() {
			console.log("Failed");
		})
		.done(function() {
			$('#loadingFail').hide();
		}
	);

	//Get list of test cases whose status = Skipped
	// Between the fromDate and toDate parameters
	$.getJSON(endPoint+'?testStatus=skipped&stats=yes', 
		function(json) {
			document.getElementById("skippedTests").innerHTML=json;
		})
		.fail(function() {
			console.log("Failed");
		})
		.done(function() {
			$('#loadingSkip').hide();
		}
	);
}

function loadArrowFunctionality(){
	$("#screenShotListHeader").click(function() {
		$("#screenShotListContent").toggle('slow', function() {
			if ($('#screenShotArrow').hasClass("icon-chevron-up pull-right")) {
				$('#screenShotArrow').removeClass("icon-chevron-up pull-right");
				$('#screenShotArrow').addClass("icon-chevron-down pull-right");
			}else {
				$('#screenShotArrow').removeClass("icon-chevron-down pull-right");
				$('#screenShotArrow').addClass("icon-chevron-up pull-right");
			}
		});
	});

	$("#debugHelperHeader").click(function() {
		$("#debugHelperContent").toggle('slow', function() {
			if ($('#debugHelperArrow').hasClass("icon-chevron-up pull-right")) {
				$('#debugHelperArrow').removeClass("icon-chevron-up pull-right");
				$('#debugHelperArrow').addClass("icon-chevron-down pull-right");
			}else {
				$('#debugHelperArrow').removeClass("icon-chevron-down pull-right");
				$('#debugHelperArrow').addClass("icon-chevron-up pull-right");
			}
		});
	});

	$("#stackTraceHeader").click(function() {
		$("#stackTraceContent").toggle('slow', function() {
			if ($('#stackTraceArrow').hasClass("icon-chevron-up pull-right")) {
				$('#stackTraceArrow').removeClass("icon-chevron-up pull-right");
				$('#stackTraceArrow').addClass("icon-chevron-down pull-right");
			}else {
				$('#stackTraceArrow').removeClass("icon-chevron-down pull-right");
				$('#stackTraceArrow').addClass("icon-chevron-up pull-right");
			}
		});
	});


	$("#testLogHeader").click(function() {
		$("#testLogContent").toggle('slow', function() {
			if ($('#testLogArrow').hasClass("icon-chevron-up pull-right")) {
				$('#testLogArrow').removeClass("icon-chevron-up pull-right");
				$('#testLogArrow').addClass("icon-chevron-down pull-right");
			}else {
				$('#testLogArrow').removeClass("icon-chevron-down pull-right");
				$('#testLogArrow').addClass("icon-chevron-up pull-right");
			}
		});
	});

	$("#reqResHeader").click(function() {
		$("#reqResContent").toggle('slow', function() {
			if ($('#reqResArrow').hasClass("icon-chevron-up pull-right")) {
				$('#reqResArrow').removeClass("icon-chevron-up pull-right");
				$('#reqResArrow').addClass("icon-chevron-down pull-right");
			}else {
				$('#reqResArrow').removeClass("icon-chevron-down pull-right");
				$('#reqResArrow').addClass("icon-chevron-up pull-right");
			}
		});
	});
}
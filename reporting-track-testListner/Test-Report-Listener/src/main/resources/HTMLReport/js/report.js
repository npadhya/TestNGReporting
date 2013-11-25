var endPoint = "http://phx7b02c-d9d7.stratus.phx.qa.ebay.com:3000/";
var selectedData;
var qsp;
var navBar = document.getElementById("navBar");
var columnView = [
				{ headerText: "XML Responses", visible: false },
				{ headerText: "XML Requests", visible: false },
				{ headerText: "Screen shot", visible: false },
				{ headerText: "test Status" , visible: false}, 
				{ headerText: "testNG paramaters", visible: false }, 
				{ headerText: "ConfigSpec" , visible: false},
				{ headerText: "Java Logs", visible: false }, 
				{ headerText: "Suite Name", visible: false },
				{ headerText: "Method Name" , visible: true}, 
				{ headerText: "Exception" , visible: false}, 
				{ headerText: "Stack Trace", visible: false },
				{ headerText: "Documentation", visible: false }, 
				{ headerText: "Sub domain", visible: true }, 
				{ headerText: "Domain" , visible: false}, 
				{ headerText: "IP Address", visible: false },
				{ headerText: "Method end time", visible: false },
				{ headerText: "Method start time", visible: true },
				{ headerText: "Suite end time", visible: false },
				{ headerText: "Suite start time", visible: false },
				{ headerText: "Test Run Id", visible: false }, 
				{ headerText: "Host Name", visible: false },
				{ headerText: "Id Parameter lists", visible: false }
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
        qsp = "?"+query;
	    urlParams = {};
	    while (match = search.exec(query))
	       urlParams[decode(match[1])] = decode(match[2]);
	})();

	getAllTests();

	paintTable();

});

function paintTable(){
	console.log("Query to  : "+endPoint+qsp);
	// This method will take the testData and paint the table by inserting the data in to the existing table.
	var passData = [];
	var failData = [];
	var skipData = [];
	var partialData = [];

	$.getJSON(endPoint+qsp, function(json){
		
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
						var div = document.createElement("div");
						args.$rows.attr.appendChild(div);
					}
					if(args.data.testStatus =="skipped"){
						skipData.push(args.data);
						args.$rows.attr("class","wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow alert alert-warning");
					}
					if(args.data.testStatus =="failed"){
						failData.push(args.data);
						args.$rows.attr("class","wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow alert alert-error");
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
						passData.push(args.data);
						args.$rows.attr("class","wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow alert alert-success");
					}
					if(args.data.testStatus =="skipped"){
						skipData.push(args.data);
						args.$rows.attr("class","wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow alert alert-warning");
					}
					if(args.data.testStatus =="failed"){
						failData.push(args.data);
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
						passData.push(args.data);
						args.$rows.attr("class","wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow alert alert-success");
						var div = document.createEle
					}
					if(args.data.testStatus =="skipped"){
						skipData.push(args.data);
						args.$rows.attr("class","wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow alert alert-warning");
					}
					if(args.data.testStatus =="failed"){
						failData.push(args.data);
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
						passData.push(args.data);
						args.$rows.attr("class","wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow alert alert-success");
					}
					if(args.data.testStatus =="skipped"){
						skipData.push(args.data);
						args.$rows.attr("class","wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow alert alert-warning");
					}
					if(args.data.testStatus =="failed"){
						failData.push(args.data);
						args.$rows.attr("class","wijmo-wijgrid-row ui-widget-content wijmo-wijgrid-datarow alert alert-error");
					}
				}
			}
		});
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
	
	var testLogs = endPoint+'?_id='+ss["_id"]+'&filter=testLogs';
	
	var requests = endPoint+'?_id='+ss["_id"]+'&filter=xmlRequests';
	
	var responses = endPoint+'?_id='+ss["_id"]+'&filter=xmlResponse';
	
	getScreenShots(screenshotUrl);
	getStackTrace(stackTraceUrl);
	getDebuggingHelpData(debugInfoUrl);
	getTestLogs(testLogs);
	getXMLRequest(requests);
	getXMLResponses(responses);
}	

function getScreenShots(screenshotUrl){
	// Get the screen shot for this method by Date
	// insert the new screen shots in to the Screen Shot DIV
	// alert('getting screen shot for :' + screenshotUrl);
	var container = document.getElementById("imageContainer");

	container.innerHTML = '';
	$.getJSON(screenshotUrl, function(json) {
		//console.log(json[0]["screenShot"]);
		var screenShotObj = json[0]["screenShot"];

		if(screenShotObj){
			var i=0;

			var ul = document.createElement("ul");
			ul.setAttribute("class","thumbnails");

			var mainContainer = document.createElement("div");

			for(var key in screenShotObj) {
				id = "lightBoxImage"+i;
				var li = document.createElement("li");
				li.setAttribute("class","span2");

				var a = document.createElement("a");
				a.setAttribute("data-toggle","lightbox");
				a.setAttribute("href","#"+id);
				a.setAttribute("class","thumbnail");

				var thisImg = "data:image/jpeg;base64,"+screenShotObj[key];

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
				mainLightBox.setAttribute("class","lightbox hide fade");
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
				mainImage.setAttribute("style","width: 0px; height: 0px;");


				lightboxContent.appendChild(mainImage);
				lightboxContent.appendChild(divCaption);

				mainLightBox.appendChild(lightboxContent);

				mainContainer.appendChild(mainLightBox);

				i++;
			}
			container.appendChild(ul);
			container.appendChild(mainContainer);
		/*}
		if(screenShotObj){
			var i=0;
			for(var key in screenShotObj) {
				
				var thisImg = "data:image/jpeg;base64,"+screenShotObj[key];

				var mainImage = document.createElement("img");
				mainImage.setAttribute("src",thisImg);
				mainImage.setAttribute("title",key);
				mainImage.setAttribute("class","img-polaroid");
				mainImage.setAttribute("style","position: fixed; width: 100%; height: 100%; top: 10%; left: 50%; margin-left: -466.5px; ");

				var p = document.createElement("p");
				p.innerHTML = key;

				var divCaption = document.createElement("div");
				divCaption.setAttribute("class","lightbox-caption");

				divCaption.appendChild(p);

				var divLightBoxContent = document.createElement("div");
				divLightBoxContent.setAttribute("class","lightbox-content");

				divLightBoxContent.appendChild(mainImage);
				divLightBoxContent.appendChild(divCaption);

				var divLightbox = document.createElement("div");
				id = "lightBoxImage"+i;
				divLightbox.setAttribute("id",id);
				divLightbox.setAttribute("class","lightbox hide fade");
				divLightbox.setAttribute("tabindex","-1");
				divLightbox.setAttribute("role","dialog");
				divLightbox.setAttribute("aria-hidden","true");

				divLightbox.appendChild(divLightBoxContent);

				var a = document.createElement("a");
				a.setAttribute("data-toggle","lightbox");
				a.setAttribute("href","#"+id);

				var thumb = document.createElement("img");
				thumb.setAttribute("src",thisImg);
				thumb.setAttribute("title",key);
				thumb.setAttribute("class","img-polaroid");
				thumb.setAttribute("style","width: 120px; height: 120px;");
				
				a.appendChild(thumb);

				container.appendChild(a);
				container.appendChild(divLightbox);
				i++;
			}
			$('#lightBoxImage').lightbox();*/
		} else {
			$('#screenShotListHeader').hide();
			$('#screenShotListContent').hide();
			$('#screenShotListDivider').hide();
		}
	})
	.fail(function(){
		console.error("Screen shot data loading failed...");
	})
	.done(function(){
		console.log("Screen shot data loaded");
	})
	;
}

function getStackTrace(stacktraceUrl){
	// This function is used to retrive only the stackTrace of a testCase whose status=Failed
	// The data is than randered on the stackTrace section.
	console.log(stacktraceUrl);
	var stacktraceContainer = document.getElementById("stackTraceContainer");

	$.getJSON(stacktraceUrl, function(json) {
		if(json[0].stackTrace){
			stacktraceContainer.innerHTML = json[0].stacktrace;
		} else {
			$('#stackTraceHeader').hide();
			$('#stackTraceContent').hide();
			$('#stackTraceDivider').hide();
		}
	})
	.fail(function() {
		console.log("Stacktrace data loading failed...");
	})
	.done(function() {
		console.log("Stacktrace data loaded");
	});
}

function getDebuggingHelpData(debuginfoUrl){
	// This function is used to retrive only the stackTrace of a testCase whose status=Failed
	// The data is than randered on the stackTrace section.
	console.log(debuginfoUrl);
	var debugContainer = document.getElementById("debugHelperContainer");

	$.getJSON(debuginfoUrl, function(json) {
		if(json[0].debugInfo){
			debugHelperContainer.innerHTML = json[0].debugInfo;
		} else {
			$('#debugHelperHeader').hide();
			$('#debugHelperContent').hide();
			$('#debugHelperDivider').hide();
		}
	})
	.fail(function() {
		console.log("Debug info data loading failed...");
	})
	.done(function() {
		console.log("Debug info data loaded");
	});
}

function getTestLogs(testLogURL){
	// This function is used to retrive only the stackTrace of a testCase whose status=Failed
	// The data is than randered on the stackTrace section.
	console.log(testLogURL);
	var testLogContainer = document.getElementById("testLogContainer");

	$.getJSON(testLogURL, function(json) {
		if(json[0].testLogs){
			testLogContainer.innerHTML = json[0].testLogs;
		} else {
			$('#testLogHeader').hide();
			$('#testLogContent').hide();
			$('#testLogDivider').hide();
		}
	})
	.fail(function() {
		console.log("Test Log data loading failed...");
	})
	.done(function() {
		console.log("Test log data loaded");
	});
}

function getXMLRequest(requestURL){
	// This function is used to retrive only the stackTrace of a testCase whose status=Failed
	// The data is than randered on the stackTrace section.
	console.log(requestURL);
	var requestContainer = document.getElementById("reqResContainer");

	$.getJSON(requestURL, function(json) {
		if(json[0].xmlRequests){
			requestContainer.innerHTML = json[0].xmlRequests;
		} else {
			$('#reqResHeader').hide();
			$('#reqResContent').hide();
		}
	})
	.fail(function() {
		console.log("Request data loading failed...");
	})
	.done(function() {
		console.log("Request data loaded");
	});
}

function getXMLResponses(responseURL){
	// This function is used to retrive only the stackTrace of a testCase whose status=Failed
	// The data is than randered on the stackTrace section.
	console.log(responseURL);
	var requestContainer = document.getElementById("reqResContainer");

	$.getJSON(responseURL, function(json) {
		if(json[0].xmlResponse){
			requestContainer.innerHTML = json[0].xmlResponse;
		} else {
			$('#reqResHeader').hide();
			$('#reqResContent').hide();
		}
	})
	.fail(function() {
		console.log("Response data loading failed...");
	})
	.done(function() {
		console.log("Response data loaded");
	});
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
	$.getJSON(endPoint+'?status=passed&stats=yes', 
		function(json) {
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
	$.getJSON(endPoint+'?status=failed&stats=yes', 
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
	$.getJSON(endPoint+'?status=skipped&stats=yes', 
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
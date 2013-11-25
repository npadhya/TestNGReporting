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

	getAllTests();
	//testData is retrived from reporterData.js file - This is a static data for testing...
	paintTable();

	loadArrowFunctionality();
});

function paintTable(){
	// This method will take the testData and paint the table by inserting the data in to the existing table.
	var jsonObj = [];
	/*for (var i = 0; i < testData.length; i++) {
		jsonObj.push({id: status.options[i].text, optionValue: status.options[i].value});
	}*/

	var passData = [];
	var failData = [];
	var skipData = [];
	var partialData = [];

	$("#wijgridAll").wijgrid({
		showGroupArea: true,
		allowSorting: true,
		allowColSizing: true,
		selectionMode: "singleRow",
		allowPaging: true,
		pageSize: allowPageSize,
		data:  testData,
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

}

function onSelectTestCase(selectedTable) {

	var hiddenItem = $("#"+selectedTable.target.id).wijgrid("currentCell").rowIndex();
	var currentPageId = $("#"+selectedTable.target.id).wijgrid("option", "pageIndex");
	var currentPageSize = $("#"+selectedTable.target.id).wijgrid("option", "pageSize");
	var pageIndex = (currentPageId * currentPageSize) + hiddenItem;
	var data = $("#"+selectedTable.target.id).wijgrid("data");

	var screenshotObj  = testData[pageIndex].screenShot;
	
	var stackTraceObj = testData[pageIndex].stackTrace;
	
	var debugInfoObj =testData[pageIndex].debugInfo;
	
	var testLogsObj = testData[pageIndex].testLogs;
	
	var xmlRequestsObj = testData[pageIndex].xmlRequests;
	
	var xmlResponsesObj = testData[pageIndex].xmlResponse;
	
	getScreenShots(screenshotObj );
	getStackTrace(stackTraceObj);
	getDebuggingHelpData(debugInfoObj);
	getTestLogs(testLogsObj);
	getXMLRequest(xmlRequestsObj);
	getXMLResponses(xmlResponsesObj);
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
		mainContainer.setAttribute("style","width: 50%; height: 50%;");
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
			//lightboxContent.setAttribute("style","width: 50%; height: 50%;");

			var p = document.createElement("p");
			p.innerHTML = key;

			var divCaption = document.createElement("div");
			divCaption.setAttribute("class","lightbox-caption");

			divCaption.appendChild(p);

			var mainImage = document.createElement("img");
			mainImage.setAttribute("src",thisImg);
			mainImage.setAttribute("title",key);
			//mainImage.setAttribute("style","width: 50%; height: 50%;");

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

function getXMLRequest(xmlrequestsObj){
	// This function will fillup the debugging info DIV
	// This data is set by the test case 
	if(xmlrequestsObj){

	} else {
		$('#reqResHeader').hide();
		$('#reqResContent').hide();
	}
}

function getXMLResponses(xmlresponsesObj){
	// This function will fillup the debugging info DIV
	// This data is set by the test case 
	if(xmlresponsesObj){

	} else {
		$('#reqResHeader').hide();
		$('#reqResContent').hide();
	}
}

function getAllTests(){
	var allTestCount = testData.length;
	document.getElementById("totalTests").innerHTML=allTestCount;
	$('#loadingAll').hide();

	var passTestCount=0;
	var failTestCount=0;
	var skipTestCount=0;

	for(var i=0; i < testData.length;i++ ){

		//console.log(testData[i].testStatus);

		if(testData[i].testStatus=="passed"){
			passTestCount++;
		}

		if(testData[i].testStatus=="failed"){
			failTestCount++;
		}

		if(testData[i].testStatus=="skipped"){
			skipTestCount++;
		}
		/*console.log("Pass test count : "+passTestCount);
		console.log("Fail test count : "+failTestCount);
		console.log("Skip test count : "+skipTestCount);*/
	}

	document.getElementById("passedTests").innerHTML=passTestCount;
	$('#loadingPass').hide();

	document.getElementById("failedTests").innerHTML=failTestCount;
	$('#loadingFail').hide();

	document.getElementById("skippedTests").innerHTML=skipTestCount;
	$('#loadingSkip').hide();
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
//Creating server
var http = require('http');
var express = require('express');
var app = express();
var url = require("url");
var mongoose = require('mongoose');
var Enum = require('enum');

//this function return the lengh of the array . 
Object.size = function(obj){
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};


var unitArr={};

function wrapper(x){
  return '{'+x+'}';
}

//contstructs a json base unit from the key value pair 
function returnBaseUnit(key, value){
  if(key=='runId')
    return '"'+key+'": '+value;
  else 
    return '"'+key+'": '+'"'+value+'"';
}



//Connecting to MongoDB
mongoose.connect('mongodb://phx7b02c-d9d7.stratus.phx.qa.ebay.com/test');
app.use(express.bodyParser());

// displays the url hit 
function displayRequestandReturnPath(request){
  var pathname = url.parse(request.url).pathname;
  console.log("Request for " + pathname + " received.");
  return pathname;
}

//Models using Mongoose
//siteinfo model
var Schema = mongoose.Schema
var SuiteInfo = new Schema({
  runId : Number,
  suiteName : String,
  runDate : { type: Date},
  passed : Number,
  failed : Number,
  __v: {type: Number, select: false}
});

//testinfo model
var TestInfo = new Schema({
  hostName : String,
  testRunId : String,
  suiteRunId : String,
  suiteStartTime : { type: Date},
  suiteEndTime : { type: Date},
  methodStartTime : { type: Date},
  methodEndTime : { type: Date},
  ipAddress : String,
  domain : String,
  subDomain : String,
  documentation : String,
  stackTrace : String,
  exception : String,
  testMethodName : String,
  testSuiteName : String,
  javadoc : String,
  configspec : Object,
  testNGParameters : String,
  testStatus : String,
  screenShot : Object,
  xmlRequests : Object,
  xmlResponse : Object,
  __v: {type: Number, select: false}
});

var MySuiteInfoModel = mongoose.model('SuiteInfo', SuiteInfo);
var MyTestInfoModel = mongoose.model('TestInfo', TestInfo);

var suiteInfo = new MySuiteInfoModel();
var testInfo = new MyTestInfoModel();
var query=MyTestInfoModel.findOne({ suitename: 'CCS'});
app.get('/', function(request, response){

var showstats=0;

//constructs the  json query string from the array  
function joiner(arrpar){

  console.log("Stringified arrray is  "); //cant write console log here 
  arrpar.length=Object.size(arrpar);
  console.log(JSON.stringify(arrpar)); //Good one  

  console.log("Length of array is " + arrpar.length);
  var runnningString='';
  var flag=0;
  for (var i in arrpar){
    if((i=='length') ){
      flag=1;
    }
    else{
      runnningString += ''+arrpar[i];
    }
    var comparer=arrpar.length;
    if (flag==1){
      comparer=arrpar.length-1;
    }
    //because f spurious 
    if (i<comparer-1){
        runnningString += ',';
      }
    }

    arrpar=[];
    arrpar.length=0;
    return "{"+runnningString+"}";
  }

  displayRequestandReturnPath(request);

  var queryData = url.parse(request.url, true).query;

  var headers = {};
  headers["Access-Control-Allow-Origin"] = "*";
  headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
  headers["Access-Control-Allow-Credentials"] = true;
  headers["Access-Control-Max-Age"] = '86400'; // 24 hours
  headers["Access-Control-Allow-Headers"] = "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept";
  response.writeHead(200, headers);

  // var query=MyTestInfoModel.findOne({ suiteName: queryData.suiteName});
  var urlHit=displayRequestandReturnPath(request);
  console.log("+++urlHit"+urlHit);
  if(urlHit=='/stats/'){
    if(queryData.teststatus){
      query=MyTestInfoModel.count({ teststatus: queryData.teststatus });
    }
  }
 
  else{
  if(queryData.dis)
  {
  console.log('here 1');
  if(queryData.dis=='domain')
  {
  query=MyTestInfoModel.distinct('domain');
    console.log('here 2');
  }
   if(queryData.dis=='subDomain')
  {
  query=MyTestInfoModel.distinct('subDomain');
  }
  }
  else
  {
   console.log('here 3');
  var continueQuery=0;

    if(queryData.dateOp){
      //set post processing flag of the query in case date op is present   
      continueQuery=1;
      if(queryData.dateOp=='before'){
          //day //month //year
          //decide whether stats or fulldata is to be returned  
        if(queryData.stats){
          query=MyTestInfoModel.count({"rundate": {$gt: new Date(2000,02,17), $lt: new Date(queryData.year,queryData.month-1,queryData.day)}});
        }
        else{
          query=MyTestInfoModel.find({"rundate": {$gt: new Date(2000,02,17), $lt: new Date(queryData.year,queryData.month-1,queryData.day)}});
        }
      }
      if(queryData.dateOp=='after'){
        if(queryData.stats){
          query=MyTestInfoModel.count({"rundate": {$gt: new Date(queryData.year,queryData.month-1,queryData.day), $lt: new Date(2999,02,17)}});
        }
        else{
          query=MyTestInfoModel.find({"rundate": {$gt: new Date(queryData.year,queryData.month-1,queryData.day), $lt: new Date(2999,02,17)}});
        }
        //day //month //year
      }

      if(queryData.dateOp=='between'){
          //day1 //month1 //year1
          //day2 //month2 //year2
        if(queryData.stats){
          query=MyTestInfoModel.count({"rundate": {$gt: new Date(queryData.year1,queryData.month1-1,queryData.day1), $lt: new Date(queryData.year2,queryData.month2-1,queryData.day2)}});
        }
        else{
          query=MyTestInfoModel.find({"rundate": {$gt: new Date(queryData.year1,queryData.month1-1,queryData.day1), $lt: new Date(queryData.year2,queryData.month2-1,queryData.day2)}});
        }
      }
    } 
    else{   
      //decide which querydata parameters are part of the query response / query aggregation/ query filtering :  construct the json array accordingly  
      var unitArrIndex=0;
      for (var j in queryData){
        if(j=='length'){
          //no op
        }
        else if(j=='stats'){
          showstats=1;
        }
        else if(j=='dateOp'||j=='day'||j=='month'||j=='year'||j=='day1'||j=='month1'||j=='year1'||j=='day2'||j=='month2'||j=='year2'){
          //no op
        }
        else if(j=='filter'){
          //no op
        } 
        else{ 
          unitArr[unitArrIndex]=returnBaseUnit(j,queryData[j]);
          console.log(" j=="+j)
          console.log("Added "+returnBaseUnit(j,queryData[j])+" at location "+ unitArrIndex)
          unitArrIndex++;
        }
      }//END OF FOR   
      
      unitArrIndex--;
      console.log(JSON.stringify(unitArr));  
      var joined=joiner(unitArr);
      console.log("the generated query for unit arr is " +joined);
      
     // var retquery='{'+joined+',{__v: 0}}';
       var retquery=joined;
      
      console.log("the generated query for unit arr is " +retquery);
      var theParsedArray=JSON.parse(retquery);
      
      if(showstats==1){    
        query =MyTestInfoModel.count(theParsedArray);
      }
      else{
        query =MyTestInfoModel.find(theParsedArray);
      }
      
      unitArr=[];
      unitArr.length=0;
    }//end of else
  }
  
  // apply remaining query parameters in case the query involved a date operation

  if(continueQuery==1){
      console.log("inside continue query ");
    if(queryData.testname){

      console.log('Inside 293');
      query.where('testname').equals(queryData.testname);
      console.log(query);
    }

    if(queryData.suitename){
      query.where('suitename').equals(queryData.suitename);
    }
    if(queryData.domain){
      query.where('domain').equals(queryData.domain);
    }
    if(queryData.subdomain){
      query.where('subdomain').equals(queryData.subdomain);
    }
    if(queryData.exception){
      query.where('exception').equals(queryData.exception);
    }
    if(queryData.teststatus){
      query.where('teststatus').equals(queryData.teststatus);
    }
    if(queryData.hostname){
      query.where('hostname').equals(queryData.hostname);
    }
  }

  //apply filter
  //parse filter queryparameter, detikenise it based on comma, and apply he filter on the query in a loop 

  if(queryData.filter){
    var tstr=queryData.filter
    var filter_keys=tstr.split(',')
    console.log('printingful array '+filter_keys);
    for(var k in filter_keys){
      query.select(filter_keys[k])
    }
  } 
  //end of apply filter 
  }
  query.exec(function(error, result){
    if(error)
    {
     response.write(JSON.stringify(error));

    }
    else if(result == null)
    {
           response.write(JSON.stringify(['not found!']));
    }
    else
    {
      response.write(JSON.stringify(result));
    }
    response.end();
  });
  //}     
});


app.post('/', function(request, response){

  console.log(request.body);
  response.end();
  var obj =request.body ;
  var tcr = new MyTestInfoModel();
  var slr = new MySuiteInfoModel();

  tcr.hostName = obj.hostName;
  tcr.testRunId = obj.testRunId;
  tcr.suiteStartTime = obj.suiteStartTime;
  tcr.suiteEndTime = obj.suiteEndTime;
  tcr.methodStartTime = obj.methodStartTime;
  tcr.methodEndTime = obj.methodEndTime;
  tcr.ipAddress = obj.ipAddress;
  tcr.domain = obj.domain;
  tcr.subDomain = obj.subDomain;
  tcr.documentation = obj.loggerData;
  tcr.stackTrace = obj.stackTrace;
  tcr.exception = obj.exception;
  tcr.testMethodName = obj.testMethodName;
  tcr.testSuiteName = obj.testSuiteName;
  tcr.javadoc = obj.javadoc;
  tcr.configspec = obj.configSpecForDependentPools;
  tcr.testNGParameters = obj.testNGParameters;
  tcr.testStatus = obj.testStatus;
  tcr.screenShot = obj.screenShot;
  tcr.xmlRequests = obj.xmlRequests;
  tcr.xmlResponse = obj.xmlResponse;

  var ss = obj.screenShot;
  for (var key in ss) {
    console.log(' name=' + key + ' value=' + ss[key]);
  }

  tcr.save(function(err, tcr_Saved){
    console.log('inside callback');
    if(err){
      throw err;
      console.log(err);
    }else{
      console.log('saved!');
    }
  });
  slr.suiteName=obj.testSuiteName;
  slr.save(function(err, slr_Saved){
    console.log('inside callback');
    if(err){
      throw err;
      console.log(err);
    }else{
      console.log('saved!');
    }
  });
});
app.listen(3000);

console.log("Server running at http://127.0.0.1:3000/");

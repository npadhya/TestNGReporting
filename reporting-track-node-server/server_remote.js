    //Creating server
	var express = require('express');
      var app = express();
      var mongoose = require('mongoose');

	//Connecting to MongoDB
   mongoose.connect('mongodb://fm-wtf-dash01.vip.qa.ebay.com/wtf-dash');
  //mongoose.connect('mongodb://localhost/test');

	//Models using Mongoose
  var Schema = mongoose.Schema
var SuiteInfo = new Schema({
    runId     : Number,
    test_failed : Number,
    test_host_name : String,
    test_last_updated : Number,
    test_passed : Number, 
    test_run_id :Number,
    test_suite_name : String,
    test_timestamp : Number
});


   

   var MySuiteInfoModel = mongoose.model('suitecollections', SuiteInfo); //create and access the model SuiteInfo

var suiteInfo = new MySuiteInfoModel();

     //Get all product catalog 
    app.get('/', function(req,res){	
        MySuiteInfoModel.find({}, function(error, data){
			if(error){
			 res.json(error);
			}
			else if(data == null){
			 res.json('Data not found!')
			}
			else{
			  res.json(data);
			}
            
        });
    });
    


app.get('getSuiteWithName/:test_suite_name', function(req,res)
{   
       var query=MySuiteInfoModel.find({ test_suite_name: req.params.test_suite_name});
    //   var query=MySuiteInfoModel.findOne({ 'suiteName': 'CCS'});
      
        query.exec(function(error, result)
        {
            if(error)
            {
                res.json(error);
            }
            else if(result == null)
            {
                res.json('not found!')
            }
            else
            {
                res.json(data);
        }
        }); 
});

app.get('/fetchRun/:runIdi', function(req,res)
{   

    // var runIndex = req.query["runId"];
       var query=MySuiteInfoModel.findOne({ runId: req.params.runIdi});
       //   var query=MySuiteInfoModel.findOne({ 'suiteName': 'CCS'});
      
        query.exec(function(error, result)
        {
            if(error)
            {
                res.json(error);
            }
            else if(result == null)
            {
                res.json('not found!')
            }
            else
            {
            res.writeHead(200, {"Content-Type": "text/html"});
            
            res.write( ' <script type="text/javascript">');
            res.write( ' alert("Passed '+ result.passed+'");'); //+result.passed +'.'
            res.write( ' </script>');
            
            res.end();


        }
        }); 
});


app.get('/fetchSuiteWithName/:test_suite_name', function(req,res)
{   

    
       var query=MySuiteInfoModel.find({test_suite_name: req.params.test_suite_name});
      //query.where('runId').equals(1);
      
       

        query.exec(function(error, result)
        {
            if(error)
            {
                res.json(error);
            }
            else if(result == null)
            {
                res.json('not found!')
            }
            else
            {

             res.json(result);

        }
        }); 
});


app.get('/fetchRunDate/:passedw', function(req,res)
{   

    
       MySuiteInfoModel.find({ $and: [{"passed": req.params.passedw}, {"runDate": {$gte: new Date('2013-03-16T20:54:35.630Z'), $lt: new Date('2013-03-18T20:54:35.630Z')}}]}, 
      //query.where('runId').equals(1);
       function(error, result)
        {
            if(error)
            {
                res.json(error);
            }
            else if(result == null)
            {
                res.json('not found!')
            }
            else
            {

             res.json(result);

        }
        }); 
});

app.get('/fetchDateDatelessthan/:month/:day/:year', function(req,res)
{   

    
       MySuiteInfoModel.find({"runDate": {$gt: new Date(2012,02,17), $lt: new Date(req.params.year,req.params.month-1,req.params.day)}}, 
      //query.where('runId').equals(1);
       function(error, result)
        {
            if(error)
            {
                res.json(error);
            }
            else if(result == null)
            {
                res.json('not found!')
            }
            else
            {

             res.json(result);

        }
        }); 
});
/*

app.get('/view', function(req, res) {
    var viewName = req.query["viewName"];
    if (!viewName) { res.redirect("/views"); }

    models.views.findOne({'view_name': viewName}, 'suites views', function(err, results) {
  
*/


    app.listen(3000);
    console.log("listening on port %d", 3000);
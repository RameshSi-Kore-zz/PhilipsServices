var express = require('express');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var model = require('./model');
var bodyParser = require('body-parser');
var _ = require('lodash');
var app = express();
app.use(bodyParser.json());
//mongoose.connect('mongodb://52.71.161.217/PhilipsUtterances');
mongoose.connect('mongodb://localhost:27017/ramesh');

//Insert utterances into database

app.post('/storeutterance',function(req,res){
	var data = new model();
	data.utterance = req.body.utterance;
	data.Status = req.body.Status; //Failure or Success
	data.taskName = req.body.taskName;
	data.created_date = new Date();
	data.save(function(err){
		if(err){
			console.log(err)
		}else{
			res.json({message:'Bear created'});
		}
	})
});

//Get utterances from database
app.get('/utterances',function(req,res){
	var toDate = req.query.toDate;
	var fromDate =req.query.fromDate;
	var status = req.query.Status;//req.query.Status!==undefined?req.query.Status:null;
	//var taskName = req.query.taskName;


	console.log('toDate'+toDate+'--------fromDate'+fromDate)



	console.log(status+'@@@@');

var customToDate;

if(toDate){
	var date = new Date(toDate);
	var tomorrow = new Date(date);
	console.log(tomorrow);
	tomorrow.setDate(date.getDate()+1);
	console.log(tomorrow)
	var tommorowDate = tomorrow.toISOString();
	customToDate = tommorowDate.split('T')[0];
}

console.log('CustomDate'+customToDate)

var query;
if(toDate && fromDate) {
  query = {created_date:{
		$lt:new Date((customToDate).concat('T00:00:00.000Z')),
		$gte:new Date((fromDate).concat('T00:00:00.000Z')),
	}};

	if(status){
		query.Status = status;
	}

  }/*else if(toDate){
	query = {$and:[{created_date:{
		$lt:new Date((customToDate).concat('T00:00:00.000Z'))
	}},{
		Status:status
	}]
  }
}else if(fromDate){
	query = {$and:[{created_date:{
		$gte:new Date((fromDate).concat('T00:00:00.000Z'))
	}},{
		Status:status
	}]
  }}else if(status){
   query = {Status:status}
}else{
	query ={}
}*/


console.log(JSON.stringify(query));
	
	model.find(query,function(err,response){
		if(err){
			console.log(err);
		}else{
			console.log(response);
			if(!status){
				var response = _.mapValues(_.groupBy(response, 'Status'),clist => clist.map(car => _.omit(car, 'Status')));
				console.log("----/////////////////////////---------------"+typeof(status));
			//res.send(grouped);
		}
		res.send(response);
		}
	})
})

app.listen(3000);
console.log('Server running on port 3000');
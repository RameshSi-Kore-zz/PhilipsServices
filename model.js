var mongoose = require('mongoose');
var utterancesSchema = new mongoose.Schema({
	utterance:String,
	taskName:String,
	Status:String,
	created_date: {type: Date, default: Date.now}
});

module.exports= mongoose.model('philipsutteranceslist',utterancesSchema);

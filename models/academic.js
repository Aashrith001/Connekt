var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var AcademicSchema = mongoose.Schema({
	branch:String,
	subjects : [{
		id:{
			type : mongoose.Schema.Types.ObjectId,
			ref  : "Subject"
		},
	}],
});
module.exports = mongoose.model('Academic', AcademicSchema);
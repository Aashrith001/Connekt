var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var SubjectSchema = mongoose.Schema({
	name: String,
	sem: String,
	branch: String,
	questions : [{
		type : mongoose.Schema.Types.ObjectId,
		ref  : "Question"
	}],
	tutors:[]
});
module.exports = mongoose.model('Subject', SubjectSchema);

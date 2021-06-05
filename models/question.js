var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var QuestionSchema = mongoose.Schema({
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref : "User"
		},
		username : String
	},
	img:[
		{
			url:String,
			filename:String
		}
	],
	text: String,
	replies : [{
		type : mongoose.Schema.Types.ObjectId,
		ref  : "Reply"
	}],
	date:Date
});
module.exports = mongoose.model("Question",QuestionSchema);
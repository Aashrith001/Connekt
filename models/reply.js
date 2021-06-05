var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var ReplySchema = mongoose.Schema({
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref : "User"
		},
		username : String
	},
	text: String,
	img:[
		{
			url:String,
			filename:String
		}
	],
	date:Date
});
module.exports = mongoose.model("Reply",ReplySchema);
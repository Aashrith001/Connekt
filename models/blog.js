var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var BlogSchema = mongoose.Schema({
	title: String,
	img:[
		{
			url:String,
			filename:String
		}
	],
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref : "User"
		},
		username : String
	},
	desc: String,
});
module.exports = mongoose.model("Blog",BlogSchema);
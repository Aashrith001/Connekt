var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var CommentSchema = mongoose.Schema({
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref : "User"
		},
		username : String
	},
	text: String,
	date:Date
});
module.exports = mongoose.model("Comment",CommentSchema);
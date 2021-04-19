var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');	

var UserSchema = mongoose.Schema({
	username: String,
	email:String,
	rollno:String,
	year:String,
	branch:String,
	password: String
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);
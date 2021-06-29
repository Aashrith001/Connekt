var middlewareObj = {};
var User = require("../models/user"),
	Blog = require("../models/blog"),
	Comment = require("../models/comment"),
	Question = require("../models/question"),
	Reply = require("../models/reply");

middlewareObj.checkBlogOwner = function(req,res,next){
	if(req.isAuthenticated()){
		Blog.findById(req.params.id,function(err,foundBlog){
			if(err){
				req.flash("error","Uh ooh !! Something went wrong");
				res.redirect("back");
			}else{
				if(foundBlog.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
			}
		});	
	}
	else{
		req.flash("error","You need to Log In to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwner = function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
				res.redirect("back");
			}else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
			}
		});	
	}
	else{
		req.flash("error","You need to Log In to do that");
		res.redirect("back");
	}
}

middlewareObj.checkQuestionOwner = function(req,res,next){
	if(req.isAuthenticated()){
		Question.findById(req.params.qid,function(err,foundQuestion){
			if(err){
				res.redirect("back");
			}else{
				if(foundQuestion.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
			}
		});	
	}
	else{
		req.flash("error","You need to Log In to do that");
		res.redirect("back");
	}
}

middlewareObj.checkReplyOwner = function(req,res,next){
	if(req.isAuthenticated()){
		Reply.findById(req.params.rid,function(err,foundReply){
			if(err){
				res.redirect("back");
			}else{
				if(foundReply.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
			}
		});	
	}
	else{
		req.flash("error","You need to Log In to do that");
		res.redirect("back");
	}
}

middlewareObj.isAdminLoggedIn = function(req,res,next){
	
	if(req.isAuthenticated()){
		User.findOne({username:"admin"},function(err,admin){
			if(err){
				res.redirect("back");
			}else{
				if(admin._id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You don't have permission to access it");
					res.redirect("/blogs");
				}
			}
		});	
	}
	else{
		req.flash("error","You need to Log In to do that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to Log In to do that");
	res.redirect("/");
}


module.exports = middlewareObj;
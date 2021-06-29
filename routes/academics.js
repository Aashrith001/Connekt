if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

var express = require('express');
var router = express.Router();
var passport = require('passport');
var { cloudinary } = require('../cloudinary');
var path = require('path');
var multer = require('multer');
var { storage } = require('../cloudinary');
var upload = multer({ storage });
var { cloudinary } = require('../cloudinary');
var User = require('../models/user');
var Academic = require('../models/academic');
var Subject = require('../models/subject');
var Question = require('../models/question');
var Reply = require('../models/reply');
var middleware = require("../misc/middleware");

router.get('/', middleware.isLoggedIn,function (req, res) {
	Subject.find({ branch: req.user.branch }, function (err, sub) {
		res.render('./academics/subjects', { subjects: sub });
	});
});

router.get('/db',middleware.isAdminLoggedIn, function (req, res) {
	res.render('dbManipulation/insertion');
});

router.get('/db/tutor',middleware.isAdminLoggedIn, function (req, res) {
	res.render('dbManipulation/tutor');
});


router.get('/:id',middleware.isLoggedIn, function (req, res) {
	var id = req.params.id;
	Subject.findById(id)
		.populate('questions')
		.exec(function (err, sub) {
			if (err) {
				res.redirect("/academics");
			} else {
				res.render('./academics/show', { subject: sub });
			}
		});
});


router.get('/:id/:qid',middleware.isLoggedIn, function (req, res) {
	Question.findById(req.params.qid)
		.populate("replies")
		.exec(function (err, question) {
			if (err) res.redirect("/academics/"+req.params.id);
			else {
				res.render('./academics/question', { question: question,sub_id:req.params.id });
			}
	});
});

router.post('/:id/new',middleware.isLoggedIn, upload.array('img'), function (req, res) {
	var author = {
		id: req.user._id,
		username: req.user.username,
	};
	var obj = {
		author: author,
		img: req.files.map((f) => ({ url: f.path, filename: f.filename })),
		text: req.body.text,
	};
	Subject.findById(req.params.id, function (err, subject) {
		if (err) res.send(err);
		else {
			Question.create(obj, function (err, que) {
				if (err) res.send(err);
				else {
					que.date = new Date();
					que.save();
					subject.questions.push(que);
					subject.save();
					req.flash('success','You just raised a question');
					res.redirect("/academics/"+req.params.id);
				}
			});
		}
	});
});

router.post('/db/create',middleware.isAdminLoggedIn,function (req, res) {
	Academic.findOne({ branch: req.body.branch }, function (err, acad) {
		if (err) res.send(err);
		else {
			var obj = {
				name: req.body.subject,
				sem: req.body.sem,
				branch: req.body.branch,
			};
			Subject.create(obj, function (err, newobj) {
				if (err) res.send(err);
				else {
					acad.subjects.push(newobj);
					acad.save();
					req.flash('info','New subject added');
					res.redirect('back');
				}
			});
		}
	});
});

router.post('/db/tutor',middleware.isAdminLoggedIn, function (req, res) {
	Subject.findOne({name:req.body.subject},function(err,sub){
		if(err) res.send(err);
		else{
			sub.tutors.push(req.body.tutor);
			sub.save();
			req.flash('info','New tutor added');
			res.redirect('back');
		}
	})
});

router.post('/:sid/:id/reply/new',middleware.isLoggedIn, upload.array('img'), function (req, res) {
	var author = {
		id: req.user._id,
		username: req.user.username,
	};
	var obj = {
		author: author,
		img: req.files.map((f) => ({ url: f.path, filename: f.filename })),
		text: req.body.text,
	};
	Question.findById(req.params.id, function (err, que) {
		if (err) res.send(err);
		else {
			Reply.create(obj, function (err, rep) {
				if (err) res.send(err);
				else {
					rep.date = new Date();
					rep.save();
					que.replies.push(rep);
					que.save();
					req.flash('success','You just responded to a question');
					res.redirect("/academics/"+req.params.sid+"/"+req.params.id);
				}
			});
		}
	});
});


router.delete('/:sid/:qid',middleware.checkQuestionOwner,function(req,res){
	Question.findById(req.params.qid,function(err,question){
		if(err) res.send(err);
		else{
			var deletedImages = [];
			question.img.forEach(function (ques) {
				deletedImages.push(ques.filename);
			});
			if (deletedImages.length > 0) {
				for (var i of deletedImages) {
					cloudinary.uploader.destroy(i);
				}
			}
			Question.findByIdAndRemove(req.params.qid,function(err){
				if(err) res.send(err);
				req.flash('info','You just removed your question');
				res.redirect("/academics/"+req.params.sid);
			})
		}
	})
})

router.delete('/:sid/:qid/:rid',middleware.checkReplyOwner,function(req,res){
	Reply.findById(req.params.rid,function(err,reply){
		if(err) res.send(err);
		else{
			var deletedImages = [];
			reply.img.forEach(function (rep) {
				deletedImages.push(rep.filename);
			});
			if (deletedImages.length > 0) {
				for (var i of deletedImages) {
					cloudinary.uploader.destroy(i);
				}
			}
			Reply.findByIdAndRemove(req.params.rid,function(err){
				if(err) res.send(err);
				req.flash('info','You just removed your response');
				res.redirect("/academics/"+req.params.sid+"/"+req.params.qid);
			})
		}
	})
})

module.exports = router;
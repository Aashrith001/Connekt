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

router.get('/', function (req, res) {
	Subject.find({ branch: req.user.branch }, function (err, sub) {
		res.render('./academics/subjects', { subjects: sub });
	});
});

router.get('/db', function (req, res) {
	res.render('insertion');
});

router.get('/:id', function (req, res) {
	var id = req.params.id;
	Subject.findById(id)
		.populate('questions')
		.exec(function (err, sub) {
			if (err) {
				res.send(err);
			} else {
				res.render('./academics/showa', { subject: sub });
			}
		});
});

router.get('/:id/new', function (req, res) {
	Subject.findById(req.params.id, function (err, subject) {
		if (err) res.send(err);
		else {
			res.render('./academics/addQue', { subject: subject });
		}
	});
});

router.get('/:id/:qid', function (req, res) {
	Question.findById(req.params.qid)
		.populate("replies")
		.exec(function (err, question) {
			if (err) res.send(err);
			else {
				res.render('./academics/answer', { question: question });
			}
	});
});

router.post('/:id/new', upload.array('img'), function (req, res) {
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
					res.render("./academics/showa",{subject:subject})
				}
			});
		}
	});
});

router.post('/db/create', function (req, res) {
	Academic.findOne({ branch: req.body.branch }, function (err, acad) {
		if (err) console.log(err);
		else {
			var obj = {
				name: req.body.subject,
				sem: req.body.sem,
				branch: req.body.branch,
			};
			Subject.create(obj, function (err, newobj) {
				if (err) console.log(err);
				else {
					acad.subjects.push(newobj);
					acad.save();
					res.send(acad.populate('subjects'));
				}
			});
		}
	});
});

router.post('/:id/reply/new', upload.array('img'), function (req, res) {
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
					res.send(que);
				}
			});
		}
	});
});

/*
router.get('/:id/:sub',function(req,res){
	var id= req.params.id;
	Academic.findById(id,function(err,academic){
		if(err) console.log(err)
		else{
			var branch={
				id:academic._id,
				branch:academic.branch
			}
			var newSubject ={
				name:req.params.sub,
				branch:branch,
				forum:[
					{
						que:'what is c programming?',
						response:[
						'c is a programming language',
						'c is low level programming language',
						'c is c',
						'i don"t know about c'
						]
					},
					{
						que:'what is java programming?',
						response:[
							'java is a programming language',
							'java is low level programming language',
							'j is c',
							'i don"t know about c'
						]
					}
				]
			}
			Subject.create(newSubject,function(err,ns){
				if(err) console.log(err)
				else console.log(ns);
			})
		}
	});
});

*/

module.exports = router;
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
				res.render('./academics/show', { subject: sub });
			}
		});
});

// router.get('/:id/new', function (req, res) {
// 	Subject.findById(req.params.id, function (err, subject) {
// 		if (err) res.send(err);
// 		else {
// 			res.render('./academics/addQue', { subject: subject });
// 		}
// 	});
// });

router.get('/:id/:qid', function (req, res) {
	Question.findById(req.params.qid)
		.populate("replies")
		.exec(function (err, question) {
			if (err) res.send(err);
			else {
				res.render('./academics/question', { question: question,sub_id:req.params.id });
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
					res.redirect("/academics/"+req.params.id);
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
				if (err) res.send(err);
				else {
					acad.subjects.push(newobj);
					acad.save();
					res.send(acad.populate('subjects'));
				}
			});
		}
	});
});

router.post('/:sid/:id/reply/new', upload.array('img'), function (req, res) {
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
					res.redirect("/academics/"+req.params.sid+"/"+req.params.id);
				}
			});
		}
	});
});


router.delete('/:sid/:qid',function(req,res){
	Question.findByIdAndRemove(req.params.qid,function(err){
		if(err) res.send(err);
		else{
			res.redirect("/academics/"+req.params.sid);
		}
	})
})

router.delete('/:sid/:qid/:rid',function(req,res){
	Reply.findByIdAndRemove(req.params.rid,function(err){
		if(err) res.send(err);
		else{
			res.redirect("/academics/"+req.params.sid+"/"+req.params.qid);
		}
	})
})


module.exports = router;
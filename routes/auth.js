var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Blog = require('../models/blog');
var Question = require('../models/question');

router.get('/', function (req, res) {
	res.render('index');
});

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', "Goodbye!");
	res.redirect('/');
});

router.get('/profile', function (req, res) {
	var author = {
		id: req.user._id,
		username: req.user.username,
	};
	Blog.find({ author: author }, function (err, blogs) {
		if (err) res.send(err);
		else {
			Question.find({ author: author }, function (err, questions) {
				if (err) res.send(err);
				else res.render('profile', { blogs: blogs, questions: questions });
			});
		}
	});
});

router.post('/register', (req, res) => {
	User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
		if (err) {
			req.flash('error',err.message);
			res.redirect('back');
		}
		var usernameString = req.body.username;
		user.email = req.body.email;
		user.rollno = req.body.rollno;
		user.year = req.body.year;
		user.branch = req.body.branch;
		user.save();
		passport.authenticate('local')(req, res, () => {
			req.flash('success', 'Welcome to Connekt ' + usernameString);
			res.redirect('/blogs');
		});
	});
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/blogs',
		failureRedirect: '/',
		failureFlash: true,
		successFlash: "Welcome",
	}),
	(req, res) => {
		
	}
);

module.exports = router;
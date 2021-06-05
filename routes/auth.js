var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get('/', function (req, res) {
	res.render('index');

});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.post('/register', (req, res) => {
	User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			return res.render('index');
		}
		user.email = req.body.email;
		user.rollno = req.body.rollno;
		user.year = req.body.year;
		user.branch = req.body.branch;
		user.save();
		passport.authenticate('local')(req, res, () => {
			res.redirect('/blogs');
		});
	});
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/blogs',
		failureRedirect: '/',
	}),
	(req, res) => {}
);


module.exports = router;
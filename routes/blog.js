if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

var express = require('express');
var path = require('path');
var router = express.Router();
var { cloudinary } = require('../cloudinary');
var multer = require('multer');
var { storage } = require('../cloudinary');
var upload = multer({ storage });
var User = require('../models/user');
var Blog = require('../models/blog');
var Comment = require('../models/comment');

// get routes

router.get('/', isLoggedIn, function (req, res) {
	Blog.find({}, function (err, blogs) {
		if (err) {
			console.log(err);
		} else {
			res.render('blogs/home', { blogs: blogs });
		}
	});
});

router.get('/new', isLoggedIn, function (req, res) {
	req.flash('success','create a new blog');
	res.render('blogs/new');
});

router.get('/:id', function (req, res) {
	Blog.findById(req.params.id)
		.populate('comments')
		.exec(function (err, bloginfo) {
			if (err) {
				console.log(err);
			} else {
				res.render('blogs/show', { bloginfo: bloginfo });
			}
		});
});

router.get('/:id/edit', function (req, res) {
	Blog.findById(req.params.id).exec(function (err, bloginfo) {
		if (err) {
			console.log(err);
		} else {
			res.render('blogs/edit', { bloginfo: bloginfo });
		}
	});
});

//POST Routes

router.post('/new', upload.array('img'), isLoggedIn, function (req, res) {
	var author = {
		id: req.user._id,
		username: req.user.username,
	};
	var newBlog = {
		title: req.body.title,
		desc: req.body.desc,
		img: req.files.map((f) => ({ url: f.path, filename: f.filename })),
		author: author,
		date: new Date(),
	};
	console.log(newBlog);
	Blog.create(newBlog, function (err, newcreated) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/blogs');
		}
	});
});

router.post('/:id/addcomment', function (req, res) {
	var text = req.body.text;
	Blog.findById(req.params.id, function (err, Blog) {
		if (err) {
			res.redirect('/blogs');
		} else {
			Comment.create({ text: text }, function (err, newComment) {
				if (err) {
					res.redirect('/blogs');
				} else {
					newComment.author.id = req.user._id;
					newComment.author.username = req.user.username;
					newComment.date = new Date();
					newComment.save();
					Blog.comments.push(newComment);
					Blog.save();
					res.redirect('/blogs/' + Blog._id);
				}
			});
		}
	});
});

//put methods

router.put('/:id', function (req, res) {
	Blog.findByIdAndUpdate(req.params.id, { title: req.body.title, desc: req.body.desc }, function (
		err,
		updatedBlog
	) {
		if (err) {
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs/' + req.params.id);
		}
	});
});

//delete routes

router.delete('/:id', function (req, res) {
	Blog.findById(req.params.id).exec(function (err, bloginfo) {
		if (err) {
			console.log(err);
		} else {
			var deletedImages = [];
			bloginfo.img.forEach(function (blog) {
				deletedImages.push(blog.filename);
			});
			if (deletedImages.length > 0) {
				for (var i of deletedImages) {
					cloudinary.uploader.destroy(i);
				}
			}
			Blog.findByIdAndRemove(req.params.id, function (err) {
				res.redirect('/blogs');
			});
		}
	});
});

router.delete('/:id/:comment_id', function (req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function (err) {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/blogs/' + req.params.id);
		}
	});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

module.exports = router;
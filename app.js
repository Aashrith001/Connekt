if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./models/user');
var Blog = require('./models/blog');
var multer = require('multer');
var {storage} = require('./cloudinary');
var upload = multer({storage});
var passport = require('passport');
var LocalStatergy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');


var app = express();

mongoose.connect('mongodb://localhost:27017/connekt', { useNewUrlParser: true, useUnifiedTopology: true, useUnifiedTopology: true });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require("express-session")({
	secret : "nothing",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStatergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//GET Routes
app.get("/",function(req,res){
	res.render("index");
})

app.get("/home",isLoggedIn,function(req,res){
	Blog.find({},
	function(err,blogs){
		if(err){
			console.log(err);
		}
		else{
			res.render("home",{blogs:blogs});
		}
	});
})

app.get("/new",isLoggedIn,function(req,res){
	res.render("new");
})

app.get("/show",isLoggedIn,function(req,res){
	res.render("show");
})



app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

app.get("/blogs/:id",function(req,res){
	
	Blog.findById(req.params.id).exec(function(err,bloginfo){
		if(err){
			console.log(err);
		}
		else{
			res.render("show",{bloginfo:bloginfo});
		}
	});
});


//POST Routes

app.post('/register', (req, res) => {
	User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            console.log(err)
            return res.render("index")
        }
		user.email=req.body.email
		user.rollno=req.body.rollno
		user.year=req.body.year
		user.branch=req.body.branch
		user.save()
		passport.authenticate("local")(req, res, () => {
            res.redirect('/home')
        })
    })
})
	

app.post('/login', passport.authenticate("local", {
    successRedirect: '/home',
    failureRedirect: '/'
}), (req, res) => { })

app.post('/new',upload.array('img'),isLoggedIn,function(req,res){
	
	var author = {
		id : req.user._id,
		username : req.user.username
	}
	var newBlog = {title: req.body.title, desc: req.body.desc,img:req.files.map(f=>({url:f.path,filename:f.filename})),author: author};
	console.log(newBlog);
	Blog.create(newBlog,function(err,newcreated){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/home");
		}
	});
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/');
};

app.listen(process.env.PORT || 3000, function(){
	console.log("Connekt server is running");
});

module.exports = app;

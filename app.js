var express = require('express');
var path = require('path');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./models/user');
var Blog = require('./models/blog');
var Question = require('./models/question');
var methodOverride = require('method-override');
var passport = require('passport');
var LocalStatergy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var moment = require('moment');

var authRoutes = require("./routes/auth"),
	blogRoutes = require("./routes/blog"),
	academicRoutes = require("./routes/academics");

var app = express();

mongoose.connect('mongodb://localhost:27017/connekt', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useUnifiedTopology: true,
});
mongoose.set('useFindAndModify', false);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(flash());

app.use(
	require('express-session')({
		secret: 'nothing',
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStatergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	res.locals.moment = require('moment');
	next();
});

//GET Routes
app.use("/",authRoutes);
app.use("/blogs",blogRoutes);
app.use("/academics",academicRoutes);

app.get('/events',function (req, res) {
	res.render('events/events.ejs');
});

app.all('*',function(req,res){
	res.redirect("back")
})

app.listen(process.env.PORT || 3000, function () {
	console.log('Connekt server is running');
});

module.exports = app;
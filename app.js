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

var authRoutes = require('./routes/auth'),
	blogRoutes = require('./routes/blog'),
	academicRoutes = require('./routes/academics'),
	eventRoutes = require('./routes/events');

var app = express();

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/connekt';

mongoose.connect(dbUrl, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

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
	res.locals.info = req.flash('info');
	res.locals.moment = require('moment');
	next();
});

//GET Routes
app.use('/', authRoutes);
app.use('/blogs', blogRoutes);
app.use('/academics', academicRoutes);
app.use('/events', eventRoutes);

app.all('*', function (req, res) {
	res.redirect('back');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Serving on port ${port}`);
});

module.exports = app;
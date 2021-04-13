var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./models/user');
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

app.get("/register",function(req,res){
	res.render("register");
})

app.get("/home",isLoggedIn,function(req,res){
	res.render("home");
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

//POST Routes
app.post('/register', (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            console.log(err)
            return res.render('register')
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect('/home')
        })
    })
})

app.post('/login', passport.authenticate("local", {
    successRedirect: '/home',
    failureRedirect: '/login'
}), (req, res) => { })


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login');
};

app.listen(process.env.PORT || 3000, function(){
	console.log("Connekt server is running");
});

module.exports = app;

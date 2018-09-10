var express = require('express'),
    app = express(),
    port = 5000,
    path = require('path');
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    Use     = require('./models').User,
    LocalStrategy  = require('passport-local');

var routes = require('./routes/routes');

//Mongoose connect and configure
mongoose.connect('mongodb://localhost:27017/black-app-dev', {
    useNewUrlParser: true
})
.catch((e)=> console.log('MONGOOSE CONNECTION ERROR: ' + e));

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "Our thoughts are our strongest ally and our greatest foe",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Use.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//App configure
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public')); // for stylesheets
app.use(routes);

app.listen(port, ()=> console.log("App is running on port " + port));
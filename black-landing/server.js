var express = require('express'),
    app = express(),
    port = 3000,
    path = require('path');
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy  = require('passport-local');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));


//ROUTES

//Index route
app.get('/', (req, res)=>{
    res.sendfile(path.join(__dirname, './views', 'index.html'))
});

//About Route
app.get('/about', (req,res)=>{
    res.sendFile(path.join(__dirname, './views', 'about.html'));
});

//Contact Route
app.get('/contact', (req,res)=>{
    res.sendFile(path.join(__dirname, './views', 'contact.html'));
});

//AUTH ROUTES

//GET Login 
app.get('/login', (req,res)=>{
    res.sendFile(path.join(__dirname, './views', 'login.html'));
});

//TODO: POST LOGIN ROUTE
app.post('/login', (req,res)=>{
    console.log('Post Sent!');
});

//GET SignUp
app.get('/register', (req,res)=>{
    res.sendFile(path.join(__dirname, './views', 'register.html'));
});

//TODO: POST REGISTER ROUTE
app.post('/register', (req,res)=>{
    console.log("Post Sent!");
});


app.listen(port, ()=> console.log("App is running on port " + port));
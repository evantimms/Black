var User = require("../models").User;
var Budget = require("../models").Budget;

//All midle here
var middlewareObj = {};

middlewareObj.isLoggedIn = (req,res, next)=>{
    if(req.isAuthenticated()){
        return next();
    }

    //Will redirect to login if the user has been found to not be logged in
    res.redirect('/login');
}

module.exports = middlewareObj;
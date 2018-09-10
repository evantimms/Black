var express = require('express'),
    path = require('path'),
    router = express.Router();
    User = require('../models').User;
    Budget = require('../models').Budget;
    checkLogin = require('../middleware').isLoggedIn;


//Register Routes
//Get Register Route
router.get('/register', (req,res)=>{
    res.sendFile(path.join(__dirname, '../views', 'register.html'));
});

//TODO: Implement Register Post (NEW USER) Route
router.post('/register', (req,res)=>{
    let newUser = new User({username: req.body.username});

    User.register(newUser, req.body.password, (err,user)=>{
        if(err){
            console.log(err);
            res.sendFile(path.join(__dirname, '../views', 'register.html'));
        }

        passport.authenticate('local')(req,res, ()=>{
            res.redirect('/user/' + user._id + '/new');
        });
    });
});

//Log In Routes
router.get('/login', (req,res)=>{
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
});

// Log in route
//passport.authenticate is the middleware
router.post('/login', passport.authenticate("local", {
    successRedirect: "/user",
    failureRedirect: "/login"
}),(req,res)=>{});

router.get('/logout', (req,res)=>{
    req.logout();//passport method to log out
    res.redirect('/login');
});

//Settings route
router.get('/settings',checkLogin, (req,res)=>{
    res.sendFile(path.join(__dirname, '../views', 'settings.html'));
});

router.put('/settings',checkLogin, (req,res)=>{
    res.send('settings updated');
});
/*     
User Routes are defined as follows:

/user/ - Index GET 
/user/new - New GET 
/user - Post CREATE 
/user/:budgetid - Show GET
/user/:budgetid/edit - Edit GET
/user/:budgetid - Update PUT
/user/:budgetid - Destroy DELETE
*/

//DATA ROUTE - Gets user data
router.get('/user/:id/get', checkLogin,(req,res)=>{
    User.findById(req.user._id, (err,user)=>{
        
        if(err){
            console.log(err);
        }else{
            res.json(user);
        }
    });
});

// DATA ROUTE II - Get Budget Information
router.get('/user/:id/:budget_id/get_budget', checkLogin, (req,res)=>{

    Budget.findById(req.params.budget_id, (err,budget)=>{
        if(err){
            console.log(err);
        }else{
            res.json(budget);
        }
    });
});

router.get('/user',checkLogin, (req,res)=>{
    res.redirect('/user/' + req.user._id);
});

//INDEX GET 
router.get('/user/:id', checkLogin, (req,res)=>{
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

//NEW GET - used for getting new budget form
router.get('/user/:id/new',checkLogin, (req,res)=>{
    res.sendFile(path.join(__dirname, '../views', 'new.html'));
});

//POST CREATE - used for creating budget
router.post('/user/:id',checkLogin, (req,res)=>{
    let reset_type = req.body.reset_type;

    let reset_date;
    if(reset_type == "weekly"){
        reset_date = new Date();
        reset_date.setDate(reset_date.getDate() + 7);
    }else if(reset_type == "bi-weekly"){
        reset_date = new Date();
        reset_date.setDate(reset_date.getDate() + 14);
    }else if(reset_type == "monthly"){
        reset_date = new Date();
        reset_date.setDate(reset_date.getDate() + 31);
    }else {
        reset_date = new Date();
        reset_date.setDate(reset_date.getDate() + 365);
    }

    let newBudget = new Budget({
        cycle_amount: parseInt(req.body.amount),
        remaining_amount: parseInt(req.body.amount),
        spent_amount: 0,
        
        reset_date: reset_date,
        history: [],
        cycle_history: [],
        selected: true
    }); 

    newBudget.save((err)=>{
        if(err){
            console.log("MONGOOSE DOCUMENT CREATION ERROR");
            console.log(err);
        }else{
            User.findById(req.user._id, (err,user)=>{
                if(err){
                    console.log(err);
                    res.redirect('/user');
                }else{
                    console.log(newBudget);
                    user.budget = newBudget;
                    user.save();
                    res.redirect('/user/' + req.user._id);
                }
            });
        }
    });
});

//SHOW GET - show information on budget
router.get('/user/:id/:budget_id',checkLogin, (req,res)=>{
    res.sendFile(path.join(__dirname, '../views', 'budget.html'));
});

//EDIT GET - used for editing budget
router.get('/user/:id/:budget_id/edit',checkLogin, (req,res)=>{
    res.sendFile(path.join(__dirname, '../views', 'edit.html'));
});

//UPDATE PUT - used for updated edited budget
router.put('/user/:id/:budget_id',checkLogin, (req,res)=>{
    Budget.findByIdAndUpdate(req.params.budget_id,{
        cycle_amount: req.body.cycle_amount
    } ,(err, budget)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.redirect('/user/' + req.params.id);
        }
    });
});

//DELETE DESTROY
router.delete('/user/:id/:budget_id',checkLogin, (req,res)=>{
    budget.findByIdAndRemove(req.params.budget_id, (err)=>{
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/user/" + req.params.id + '/new');
        }
    });
});

//Processing Purchase Request
router.put('/user/:id', checkLogin, (req,res)=>{
    User.findById(req.user._id, (err,user)=>{
        if(err){
            console.log(err);
        }else{
            Budget.findById(user.budget,(err,budget)=>{
                if(err){
                    console.log(err);
                }else {
                    const userInput = req.body.userInput;
    
                    //calculating new amounts
                    budget.remaining_amount -= parseInt(userInput.amount);
                    budget.spent_amount += parseInt(userInput.amount);

                    budget.history.push({
                        description: userInput.description,
                        amount: parseInt(userInput.amount),
                        transaction_date: new Date()
                    });
                    budget.save();
                    res.json(user);
                }
            });
        }
    });
});

module.exports = router;
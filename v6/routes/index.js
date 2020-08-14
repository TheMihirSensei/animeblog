var express = require("express"),
    router = express.Router(),
    passport = require("passport")
    user = require("../modules/user")


router.get("/", function(req, res){
    res.redirect("/animeblog");
})




// sign-up route
router.get("/signup", function(req, res){
    res.render("autho/signup");
});


router.post("/signup", function(req, res){
    var newUser = new user({ username: req.body.username});
    user.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.redirect("/signup");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/animeblog");
        });

    });
});

//login route

router.get("/login", function(req, res){
    res.render("autho/login");
});


router.post("/login", passport.authenticate("local", {
    successRedirect: "/animeblog",
    failureRedirect: "/login"
    }), function(req, res){

});

//logout route
router.get("/logout", function(req, res){

    req.logOut();
    res.redirect("/animeblog");
});


//middleware function for login or not
function Islogin(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");

};


module.exports = router;
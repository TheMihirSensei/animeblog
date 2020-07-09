//app setup and declare the packages
var express             = require("express"),
    app                 = express(),
    mongoose            = require("mongoose"),
    expressSanitizer    = require("express-sanitizer"),
    methodOverride      = require("method-override"),
    bodyParser          = require("body-parser"),
    animeblog           = require("./modules/animeblog"),
    seedDB              = require("./modules/seed"),
    passport            = require("passport"),
    localStagy          = require("passport-local"),
    session             = require("express-session"),
    user                = require("./modules/user"),
    comments            = require("./modules/comment");

//seed the data


//serve the thing
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
mongoose.set('useFindAndModify', false); //for using findbyidandupdare and findbyidandremove

//mongoose setup



mongoose.connect("mongodb://localhost/animeblog5",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

seedDB();

// passport set-up

app.use(session({
    secret:" I am Good boy",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
 
passport.use(new localStagy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


//middleware for all the routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});



//routes


app.get("/", function(req, res){
    res.redirect("/animeblog");
})


// =====================================================//
 // animeblog route
// ======================================================//

//index route

app.get("/animeblog", function(req, res){
    //retrieve data from the database
    animeblog.find({}, function(err, anime){
        if(err){
            console.log(err);
        }
        else{
            res.render("animeblog/index", { animeblog: anime }); 
        }
    });
    
})


//new route
app.get("/animeblog/new", Islogin ,function(req, res){
    res.render("animeblog/new");
})


//create route
app.post("/animeblog", Islogin ,function(req, res){

    req.body.animeblog.body = req.sanitize (req.body.animeblog.body);
    //create the blog
    animeblog.create(req.body.animeblog, function(err, newanime){
        if(err){
            console.log(err);
            res.render("animeblog/new");
        }
        else{
            res.redirect("/animeblog");
        }

    });
});

//show route

app.get("/animeblog/:id", function(req, res){
    animeblog.findById(req.params.id).populate("comments").exec(function(err, found){
        if(err){
            res.redirect("/animeblog");
        }
        else{
            res.render("animeblog/show", { animeblog: found});
        }
    });
});


//edit route
app.get("/animeblog/:id/edit", function(req, res){
    animeblog.findById(req.params.id, function(err, found){
        if(err){
            res.redirect("/animeblog");
        }
        else{
            res.render("animeblog/edit", { animeblog: found });
        }
    });
});


//update route
app.put("/animeblog/:id", function(req, res){
    req.body.animeblog.body = req.sanitize(req.body.animeblog.body);
    animeblog.findByIdAndUpdate(req.params.id, req.body.animeblog, function(err, updated){
        if(err){
            res.redirect("/animeblog");
        }
        else{
            res.redirect("/animeblog/" + req.params.id);
        }
    });
});

//destroy route
app.delete("/animeblog/:id", function(req, res){
    animeblog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/animeblog");
        }
        else{
            res.redirect("/animeblog");
        }
    });

});


// ============================================================ //
// Comment routes //
// ============================================================ //


// new comment route
app.get("/animeblog/:id/comment/new", Islogin ,function(req, res){
    animeblog.findById(req.params.id, function(err, animeblog){
        if(err){
            console.log(err);
            res.redirect("/animeblog");
        }
        else{
            res.render("comment/new", { animeblog: animeblog });
        }
    });  
});

// create comment route
app.post("/animeblog/:id/comment", Islogin ,function(req, res){

   
    //ger by id
    animeblog.findById(req.params.id, function(err, animeblog){
        if(err){
            console.log(err);
            res.redirect("/animeblog");
        }
        else{
             //looking for the data
             comments.create(req.body.comment, function(err ,comment){
                 if(err){
                     console.log(err);
                 }
                 else{
                     comment.author.id = req.body._id;
                     comment.author.username = req.user.username;
                     comment.text = req.body.text;
                     comment.save();
                   
                     animeblog.comments.push(comment);
                     animeblog.save();
                     console.log(comment);
                     res.redirect("/animeblog/" + animeblog._id);
                 }
              
                
             });    
        }
    });
   
});



// =============================================== //
// authenticated routes //
// ============================================== //

// sign-up route
app.get("/signup", function(req, res){
    res.render("autho/signup");
});


app.post("/signup", function(req, res){
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

app.get("/login", function(req, res){
    res.render("autho/login");
});


app.post("/login", passport.authenticate("local", {
    successRedirect: "/animeblog",
    failureRedirect: "/login"
    }), function(req, res){

});

//logout route
app.get("/logout", function(req, res){

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




// start the server

app.listen(2006, function(){
    console.log("i am alive ");
})

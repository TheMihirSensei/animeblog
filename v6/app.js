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
    comments            = require("./modules/comment"),
    date               = require("dateformat");


// require the routes
var animeblogroute = require("./routes/animeblog"),
    commentroute   = require("./routes/comment"),
    indexroute     = require("./routes/index");

//seed the data


//serve the thing
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
mongoose.set('useFindAndModify', false); //for using findbyidandupdare and findbyidandremove

//mongoose setup



mongoose.connect("mongodb://localhost/animeblog6",
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



// using routes here
app.use( indexroute);
app.use("/animeblog", animeblogroute);
app.use("/animeblog/:id/comment", commentroute);

// start the server

app.listen(2007, function(){
    console.log("i am alive ");
})

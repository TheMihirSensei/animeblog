const comment = require("./modules/comment");
const e = require("express");

//app setup
var express             = require("express"),
    app                 = express(),
    mongoose            = require("mongoose"),
    expressSanitizer    = require("express-sanitizer"),
    methodOverride      = require("method-override"),
    bodyParser          = require("body-parser"),
    animeblog           = require("./modules/animeblog"),
    seedDB              = require("./modules/seed"),
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



mongoose.connect("mongodb://localhost/animeblog3",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

seedDB();







//routes


app.get("/", function(req, res){
    res.redirect("/animeblog");
})


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
app.get("/animeblog/new", function(req, res){
    res.render("animeblog/new");
})


//create route
app.post("/animeblog", function(req, res){

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
app.get("/animeblog/:id/comment/new", function(req, res){
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
app.post("/animeblog/:id/comment", function(req, res){
    console.log(req.body.comment);
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
                     animeblog.comments.push(comment);
                     animeblog.save();
                     res.redirect("/animeblog/" + animeblog._id);
                 }
              
                
             });    
        }
    });
   
});


// start the server

app.listen(2003, function(){
    console.log("i am alive ");
})

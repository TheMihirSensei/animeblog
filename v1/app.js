//app setup
var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser");

//serve the thing
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
mongoose.set('useFindAndModify', false); //for using findbyidandupdare and findbyidandremove

//mongoose setup



mongoose.connect("mongodb://localhost/animeblog",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);


//mongoose schema
var blogSchema =  new mongoose.Schema({
    title:String,
    image:String,
    episode:Number,
    desc: String,

});

var animeblog = mongoose.model("animeblog", blogSchema);

// //create anime
// animeblog.create({
//     title:"naruto",
//     image:"https://images4.alphacoders.com/476/thumb-350-47698.png",
//     episode:720,
//     desc:"awesome anime must be watched it's all about one boy who want to hokage "
// }, function(err, anime){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(anime);
//     }
// })



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
            res.render("index", { animeblog: anime }); 
        }
    });
    
})


//new route
app.get("/animeblog/new", function(req, res){
    res.render("new");
})


//create route
app.post("/animeblog", function(req, res){

    req.body.animeblog.body = req.sanitize (req.body.animeblog.body);
    //create the blog
    animeblog.create(req.body.animeblog, function(err, newanime){
        if(err){
            console.log(err);
            res.render("new");
        }
        else{
            res.redirect("/animeblog");
        }

    });
});

//show route

app.get("/animeblog/:id", function(req, res){
    animeblog.findById(req.params.id, function(err, found){
        if(err){
            res.redirect("/animeblog");
        }
        else{
            res.render("show", { animeblog: found});
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
            res.render("edit", { animeblog: found });
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


// start the server

app.listen(2000, function(){
    console.log("i am alive ");
})

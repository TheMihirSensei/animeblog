var express = require("express")
var router = express.Router();
var animeblog = require("../modules/animeblog")
var dateformat = require("dateformat")
var now = new Date()


// showing the index
router.get("/", function(req, res){
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


//new getting new form  route
router.get("/new", Islogin ,function(req, res){
    res.render("animeblog/new");
})


//create anime in database  route
router.post("/", Islogin ,function(req, res){

    //create the blog

    console.log(req.user)
    console.log(req.body)
    var title = req.body.title;
    var image = req.body.image;
    var episode = req.body.episode;
    var desc = req.body.desc;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    
    animblog = {
        title : title,
        image : image,
        episode: episode,
        desc : desc,
        author : author,
        date : dateformat(now)  
    }
 
    animeblog.create(animblog, function(err, newanime){
        if(err){
            console.log(err);
            res.render("animeblog/new");
        }
        else{
            console.log(newanime);
            res.redirect("/animeblog");
        }

    });
});

//show route

router.get("/:id" , function(req, res){
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
router.get("/:id/edit",Islogin , function(req, res){
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
router.put("/:id", Islogin , function(req, res){
    // animeblog model
    var title = req.body.title;
    var image = req.body.image;
    var episode = req.body.episode;
    var desc = req.body.desc;
    var author = {
        id : req.user._id,
        username : req.user.username
    };
    
    animblog = {
        title : title,
        image : image,
        episode: episode,
        desc : desc,
        author : author,
        date : dateformat(now)  
    };
    
    animeblog.findByIdAndUpdate(req.params.id, animblog, function(err, updated){
        if(err){
            res.redirect("/animeblog");
        }
        else{
            res.redirect("/animeblog/" + req.params.id);
        }
    });
});

//destroy route
router.delete("/:id",Islogin , function(req, res){
    animeblog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/animeblog");
        }
        else{
            res.redirect("/animeblog");
        }
    });

});


function Islogin(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");

};

module.exports = router;
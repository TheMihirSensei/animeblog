var express = require("express"),
    router = express.Router({mergeParams:true}),
    animeblog = require("../modules/animeblog"),
    comments = require("../modules/comment")


// ============================================================ //
// Comment routes //
// ============================================================ //


// new comment route
router.get("/new", Islogin ,function(req, res){
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
router.post("/", Islogin ,function(req, res){

   
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

function Islogin(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");

};

module.exports = router;
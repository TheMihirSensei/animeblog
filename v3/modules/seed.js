var mongoose = require("mongoose"),
    animeblog = require("./animeblog"),
    comment   = require("./comment");



    mongoose.set('useFindAndModify', false); 

var data = [
    {
        title:"naruto",
        image:"https://images2.alphacoders.com/718/thumb-350-71840.jpg",
        episode:720,
        desc:"Naruto (ナルト) is a Japanese manga series written and illustrated by Masashi Kishimoto. It tells the story of Naruto Uzumaki, a young ninja who seeks to gain recognition from his peers and also dreams of becoming the Hokage, the leader of his village. The story is in two parts, the first set in Naruto's pre-teen years, and the second in his teens. The series is based on two one-shot manga by Kishimoto: Karakuri (1995), which earned Kishimoto an honorable mention in Shueisha's monthly Hop Step Award the following year, and Naruto (1997)."

    },
    {
        title:"classroom of the elite",
        image:"https://upload.wikimedia.org/wikipedia/en/5/52/Y%C5%8Dkoso_Jitsuryoku_Shij%C5%8D_Shugi_no_Ky%C5%8Dshitsu_e%2C_Volume_1.jpg",
        episode:12,
        desc:"underratted anime but aweosme like hell"

    }
]

//remove all the data and add new data

function seedDB(){
    animeblog.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("data removed succesfully");
        
        data.forEach(function(seed){
            animeblog.create(seed, function(err, animeblog){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("added succesfully");
                    comment.create({
                        text:"this is awesome anime it's lovely",
                        author:"Mihir Sidhdhapura"
                    }, function(err, comment){
                        if(err){
                            console.log(err);
                        }
                        else{

                            animeblog.comments.push(comment);
                            animeblog.save();
                            console.log("comment created succesffuly");
                        }
                    });
                }
            });
        });
    });

}

module.exports = seedDB;




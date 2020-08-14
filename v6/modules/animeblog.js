var mongoose = require("mongoose");

//mongoose schema
var blogSchema =  new mongoose.Schema({
    title:String,
    image:String,
    episode:Number,
    desc: String,
    date : String,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
        username: String
    },
    comments:  [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }
    ]
});

module.exports = mongoose.model("animeblog", blogSchema);
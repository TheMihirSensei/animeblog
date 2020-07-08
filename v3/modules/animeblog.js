var mongoose = require("mongoose");

//mongoose schema
var blogSchema =  new mongoose.Schema({
    title:String,
    image:String,
    episode:Number,
    desc: String,
    comments:  [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }
    ]
});

module.exports = mongoose.model("animeblog", blogSchema);
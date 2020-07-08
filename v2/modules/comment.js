var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text:String,
    author:String
});

module.exports = mongoose.model("comment", commentSchema);
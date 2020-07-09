var mongoose = require("mongoose"),
    passlocalmongoose = require("passport-local-mongoose");


var userSchema = mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passlocalmongoose);


module.exports = mongoose.model("user", userSchema);
const { name } = require('ejs');
const mongoose = require ('mongoose');

mongoose.connect("mongodb://localhost:27017/Posts").then(() => {
    console.log("MongoDB connected successfully");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});


const userSchema = new mongoose.Schema({
    // User schema definition


    name: String,
    email: String,
    password: String,
    age:Number,
    username : String,
    posts : [ {type: mongoose.Schema.Types.ObjectId , ref:"post"}]
});

module.exports = mongoose.model("User" , userSchema);

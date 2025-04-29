const { name } = require('ejs');
const mongoose = require ('mongoose');
const user = require('./user');

const postSchema = new mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date : {
        type: Date,
        default: Date.now
    },
    content : String,
    likes : [ {type: mongoose.Schema.Types.ObjectId , ref:"user"}]
});

module.exports = mongoose.model("post" , postSchema);
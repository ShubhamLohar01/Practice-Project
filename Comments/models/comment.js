// const { create } = require("../Authentication/models/user");
const user = require("./user");
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'//Use to establish connection between user model ;If you use
        //  Mongoose's populate() method, the author field will be replaced with the full User document:
    },
    content: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes : {
        type: Number,
        default: 0
    },
});

module.exports = mongoose.model("Comment", commentSchema);
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/Comments")
.then(() => {
    console.log("MongoDB connected successfully");
}).catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);//exit the process if connection is not successful
});

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    age:{
        type: Number,
        required: true,
    },
    role:{
        type: String,
        enum : ["user", "admin"],
        default: "user",
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Comment"
    }],
    createdAt: { type: Date, default: Date.now },
});

// Corrected export statement
module.exports = mongoose.model("User", userSchema);

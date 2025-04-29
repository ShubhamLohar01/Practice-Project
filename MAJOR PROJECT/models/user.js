const mongoose = require("mongoose");
const  Schema  = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({

    email: {
        type: String,
        required: true,
        // unique: true //its use for to make sure that email is unique like if we have already one email then we can not create another email with same name
    },
})

userSchema.plugin(passportLocalMongoose);
// passportLocalMongoose is a plugin that adds username and password
//  fields to the schema and also adds methods for authentication (salting and hashing the password).

module.exports = mongoose.model("User", userSchema);

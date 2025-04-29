const express = require("express");
const app = express();
const dbConnection = require("./init");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash =  require("connect-flash");
// const wrapAsync = require("./utility/wrapAsync.js");
// const { listingSchema,reviewSchema } = require("./schema.js");//for validation of data
// const Joi = require('joi');
const passport = require("passport");
const User = require("./models/user.js");
const LocalStrategy = require("passport-local");


if(process.env.NODE_ENV != "production"){
    require("dotenv").config(); // for use in .env file for env variables like mongodb url ,jwt secret etc
}


app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("public", path.join(__dirname, "public"));
app.use(express.urlencoded({ extended: true }));//for data parse by request
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);



const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");



const sessionOptions ={
    secret :"mysecret",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
        maxAge  : 7 * 24 * 60 * 60 * 1000, // 1 week
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    }

} //session is working when in inspect application cookies are there like connect.sid
app.use(session(sessionOptions));
//session is used to store data on server side and send a cookie to client side and that cookie is used to identify the session on server side
app.use(flash());

//------passport middleware------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//that use is used to authenticate the user and serializeUser is used to 
// store the user id in session and deserializeUser is used to get the user id from 
// session and find the user in database

//--------------------
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error"); 
    res.locals.currUser = req.user; //for getting the current user in all pages
    next();
});

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    console.log("Current User:", res.locals.currUser); // Debugging
    next();
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);




// Use the connection
dbConnection.then(() => {

}).catch(err => {
    console.error("Failed to start server:", err);
});



app.all("*", (req, res) => {
    res.status(404).send("Page not found");
});

// app.use((req,res,err,next) => {
//     res.status(404).send("Somethind went Wrong ");
// })





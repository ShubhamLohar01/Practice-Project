const express = require('express');
const router = express.Router();
const wrapAsync = require("../utility/wrapAsync.js");
const User = require('../models/user');
const passport = require('passport');



const saveRedirectUrl = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; // Store the original URL in 
        //session of user click when its not logged in so we can redirect it to that page after login
    }
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl; // Make it available in locals
    }
    next(); // Call the next middleware
}

// Render the signup form
router.get('/signup', (req, res) => {
    res.render("users/signup.ejs");
});

// Handle signup form submission
router.post('/signup', wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password); // Register the user

        req.flash('success', 'Registered! Welcome to the app!');
        // res.redirect('/login'); // Redirect to login page after successful registration
        console.log(registerUser);

        req.login(registerUser, (err) => {
            if (err) return next(err); // Handle login error
            req.flash('success', 'Login Success --Welcome to the app!--');
            res.redirect('/listings'); // Redirect to listings page after login
        }); //ths is is used to login the user after registration
    } catch (err) {

            req.flash('error', 'A user with that username already exists.');
            return res.redirect('/signup');
        
        // next(err); // Pass other errors to the global error handler
    }
}));
router.get('/login', (req, res) => {
    res.render("users/login.ejs");
});

router.post('/login',
    saveRedirectUrl,
     passport.authenticate('local',
     { failureFlash: true,
     failureRedirect: 'users/login' }),
     async (req, res) => {
    req.flash('success', 'Login Success --Welcome back!--');
    let redirectUrl = res.locals.redirectUrl || '/listings'; 
    res.redirect (redirectUrl); // Redirect to the original URL or listings page
        // Redirect to the original URL or listings page
  
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash('success', 'Goodbye! See you again!');// // Flash message for logout
        res.redirect('/listings'); // Redirect to the listings page after logout
    });
});

module.exports = router;
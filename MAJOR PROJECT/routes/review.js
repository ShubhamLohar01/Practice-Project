const express = require('express');
const wrapAsync = require("../utility/wrapAsync.js");
const router = express.Router({ mergeParams: true }); // Enable mergeParams to access :id from parent route
const Joi = require('joi');
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { reviewSchema } = require("../schema.js"); // For validation of data
const { isLoggedIn } = require("./listing.js"); // Import isLoggedIn middleware

// Middleware to validate reviews
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error);
    } else {
        next();
    }
};
const ReviewAuthor = async (req,res,next)=>{
    let { reviewId,id } = req.params;
    let review = await Review.findById(reviewId);// Populate the author field to get user details

    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorized to do this!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


// Delete review route
router.delete('/:reviewId',
    ReviewAuthor,
     async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove the review ID from the listing
    await Review.findByIdAndDelete(reviewId); // Delete the review from the database
    res.redirect(`/listings/${id}`);
});

// Add review route
router.post('/',
    // isLoggedIn,
     validateReview,
      wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; 

    listing.reviews.push(newReview); // Push the review into the listing's reviews array

    await newReview.save(); // Save the review in the database
    await listing.save(); // Save the updated listing in the database
    req.flash("success", "Successfully created a new review!");
    res.redirect(`/listings/${listing._id}`); // Redirect to the listing page
}));

module.exports = router;
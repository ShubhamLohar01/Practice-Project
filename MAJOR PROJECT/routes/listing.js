const express = require('express');
const wrapAsync = require("../utility/wrapAsync.js");
const router = express.Router();
const Joi = require('joi');
const multer  = require('multer');

const {storage} = require("../cloudConfig.js");
const upload = multer({ storage:storage });

const { listingSchema } = require("../schema.js");//for validation of data
const Listing = require("../models/listing.js"); //one . means one's step back and .. means two times back


const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        return  res.status(400).send(error);
        
    } else {
        console.log(req.body);
        next();
    }

}

const isOwner = async (req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);


    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorized to do this!");
        return res.redirect(`/listings/${id}`);
    }
    next();
    // if the user is not owner of the listing then it will redirect to the listing page with error message
}


//Index route with search functionality
router.get("/", async (req, res) => {
    const { search } = req.query;
    let allListings;
    if (search) {
        // Case-insensitive search on title or description
        const regex = new RegExp(escapeRegex(search), 'i');
        allListings = await Listing.find({
            $or: [
                { title: regex },
                { description: regex }
            ]
        });
    } else {
        allListings = await Listing.find({});
    }
    res.render("listings/index.ejs", { allListings });
})

// Helper function to escape special characters in regex
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

//function to check user is logged in or not
const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must be Login in first!");
        return res.redirect("/login");
    }
    next();
}



// Create route
router.post('/',
    isLoggedIn,
    upload.single('listing[image]'), 
    validateListing,
    wrapAsync(  async (req, res) => {
        // if(!req.body.listing) throw new Error('Invalid Listing Data');
        // if we send post req but we do not send listing data (object)then it will throw error
        let url = req.file.path; 
        let filename = req.file.filename;


        const newlisting = new Listing(req.body.listing);
        newlisting.image = { url, filename }; 
        newlisting.owner = req.user._id; // Set the owner to the logged-in user
        await newlisting.save();

        req.flash("success", "Successfully created a new listing!");
       
        res.redirect('/listings');
        console.log(newlisting);
        // Save the listing to the database (if needed

        //Agar tu multiple images
    //  upload karna chahta hai future me, toh upload.array()
    //  ka use kar sakta hai instead of upload.single()

    }));



//new route
router.get("/new", isLoggedIn,(req, res) => {//(Problem in link)
    res.render("listings/new.ejs")
});


// Show route for returning data of a particular id
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path  :"reviews" ,
         populate : {
            path  : "author",

         },
        })
         .populate("owner");

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing, currUser:res.locals.currUser}); // Pass currUser to the view
    //for getting the current user in show.ejs file
}));

//edit route
router.get('/:id/edit',isLoggedIn,
    isOwner,
     async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        // return res.status(404).send("Listing not found"); // Handle case where listing is null
        req.flash("error", "Listing not found!");
        return res.redirect("/listings"); 

    }
    res.render("listings/edit", { listing });
});

//Update route
router.put('/:id', isLoggedIn,
    isOwner,
    upload.single('listing[image]'), 
    validateListing,
    async (req, res) => {
        if (!req.body.listing) throw new Error('Invalid Listing Data');

        let { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });


        if(typeof req.file !== 'undefined'){
            //use of typeof operator to check if file is uploaded or not(undefine or not)
            // If a new file is uploaded, update the image field
         let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
        }
        
        req.flash("success", "Successfully updated the listing!");
        res.redirect(`/listings/${id}`);
     
    });
//delete route
router.delete('/:id', isLoggedIn,
    isOwner,async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted the listing!");
    res.redirect("/listings");
});
module.exports = router;
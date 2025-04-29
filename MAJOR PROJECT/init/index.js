const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongoUrl = 'mongodb://127.0.0.1:27017/Wonderlust';

// Create the connection and export it
const dbConnection = mongoose.connect(mongoUrl)
  .then(() => {
    console.log("MongoDB connection successful");
    
    // Initialize database (optional - only if you want to run this when importing)
    const initDb = async () => {
      try {
        const listingCount = await Listing.countDocuments(); // Check if the database already has listings
        if (listingCount === 0) {
          initData.data = initData.data.map((obj) => ({
            ...obj,
            owner: "6808ae1f8489686011a22081", // Adds a default owner
          }));

          await Listing.insertMany(initData.data); // Inserts sample data only if the database is empty
          console.log("Data was initialized");
        } else {
          console.log("Database already initialized. Skipping initialization.");
        }
      } catch (err) {
        console.error("Error initializing database:", err);
      }
    };
    initDb();
    
    return mongoose.connection; // Return the connection
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

module.exports = dbConnection; // Export the connection promise
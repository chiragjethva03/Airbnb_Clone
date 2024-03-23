const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilis/wrapAsync.js")
const ExpressErr = require("../utilis/ExpressErr.js")
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLogin} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const multer  = require('multer')
const {storage} = require("../cloudConfing.js");
const upload = multer({ storage})

const listingController = require("../controllers/listing.js");


//Index Routes
router.get("/", listingController.index);

//new Routes
router.get("/new",isLogin, listingController.newPage);

//Show Routes for indivisual data information
router.get("/:id", wrapAsync(listingController.showInfo));

//create for post
router.post("/", upload.single('listing[image]'), wrapAsync(listingController.createPost));

//edit routes
router.get("/:id/edit", isLogin, isOwner,wrapAsync(listingController.edit));

//put/updated raoutes
router.put("/:id",isLogin, isOwner, upload.single('listing[image]'),wrapAsync(listingController.update));

//delete
router.delete("/:id", isLogin, isOwner ,wrapAsync(listingController.delete));

//find location
router.post("/find", listingController.findListing);

module.exports = router;
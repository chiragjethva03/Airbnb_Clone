const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utilis/wrapAsync.js")
const {isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js")

//post for reviews
router.post("/", wrapAsync(reviewController.postInfo));

//delete for reviews
router.delete("/:reviewId", isReviewAuthor, wrapAsync(reviewController.delete))

module.exports = router;
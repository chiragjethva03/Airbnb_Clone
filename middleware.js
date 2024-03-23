const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLogin = (req, res, next) => {
    try{
        if(!req.isAuthenticated()){
            req.flash("error", "You must be logged in first");
            res.redirect("/login");
        }
        next();
    } catch(err){
        console.error("Error in authentication middleware:", err);
        req.flash("error", "An error occurred during authentication");
        return res.redirect("/login");
    }
    
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "your not author of this review");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "you are not owner of this listings");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
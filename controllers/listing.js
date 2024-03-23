const Listing = require("../models/listing.js");
const multer = require('multer')
const { storage } = require("../cloudConfing.js");
const upload = multer({ storage })
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}

module.exports.newPage = (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.showInfo = async (req, res) => {
    let { id } = req.params;
    const info = await Listing.findById(id).populate({
        path: "reviews", populate: {
            path: "author"
        }
    }).populate("owner");
    if (!info) {
        req.flash("error", "Listing you requested not exist.!");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { info });
}

module.exports.createPost = async (req, res, next) => {
    let responce = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();

    let url = req.file.path;
    let filename = req.file.filename;
    const final = new Listing(req.body.listing);
    final.owner = req.user._id;
    final.image = { url, filename }

    final.geometry = responce.body.features[0].geometry;

    let newListing = await final.save();
    console.log(newListing);
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

module.exports.edit = async (req, res) => {
    let { id } = req.params;
    const edit = await Listing.findById(id);
    if (!edit) {
        req.flash("error", "Listing you requested not exist.!");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { edit });
}

module.exports.update = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.delete = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}

module.exports.findListing = async (req, res) => {
    let { find } = req.body;
    let findListing = await Listing.find({location: find});
    if(findListing.length === 0){
        req.flash("error", "Not Available");
        return res.redirect("/listings");
    }
    res.render("./listings/find.ejs", {findListing});

}
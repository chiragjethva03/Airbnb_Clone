const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description :Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0),
        image : Joi.string().allow("", null)
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        range: Joi.number().required(),
        comment: Joi.string().required()
    }).required()
})

// const validateReviews = (req, res, next) => {
//     let error = reviewSchema.valid(req.body);
//     if (error) {
//         // let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressErr(400, error);
//     } else {
//         next();
//     }
// }
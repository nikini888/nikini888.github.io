const User = require('../models/user')
const Campground = require('../models/campground')
const Review = require('../models/review')


module.exports.reviews = {
    makeNewReview: async (req, res, next) => {
        const camp = await Campground.findById(req.params.id);
        const review = new Review(req.body.review)
        review.author = req.user._id;
        camp.reviews.push(review)
        await camp.save();
        await review.save();
        req.flash('success', 'Successfully add a review!');
        res.redirect(`/campgrounds/${camp._id}`)
    },
    deleteReview: async (req, res, next) => {
        await Campground.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.review_id } })
        await Review.findByIdAndDelete(req.params.review_id);//xóa dữ liệu trong db reviews, vẫn còn id trong campgrounds{reviews[id]}, phải dùng findByIdAndUpdate với $pull
        req.flash('success', 'Successfully delete a review!');
        res.redirect(`/campgrounds/${req.params.id}`)
    },
}
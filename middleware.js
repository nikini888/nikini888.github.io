const errorApp = require('./helper/errorApp')

const Campground = require('./models/campground')
const Review = require('./models/review')

const { campSchema, updateCampSchema, reviewSchema } = require('./joiShema');



module.exports.isLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //store Url user went before login
        console.log(req.originalUrl)
        req.session.storeUrl = req.originalUrl;
        req.flash('error', "You must be login first!")
        return res.redirect('/login')
    } next()
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const findCamp = await Campground.findById(id);
    if (!findCamp.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { review_id } = req.params;
    const findReviewId = await Review.findById(review_id);
    if (!findReviewId.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.pushNewCamDetail = function (req, res, next) {
    const imageFiles = req.files.map(f => ({ url: f.path, fileName: f.filename }))
    req.body.campground.images = imageFiles;
    const coordinates = req.body.geometry.coordinates.split(',').map(e => +e)
    req.body.geometry.coordinates = coordinates;
    next()
}


module.exports.updateCamDetail = async (req, res, next) => {
    const { id } = req.params;
    const originCamp = await Campground.findById(id);
    if (req.body.delImage && !Array.isArray(req.body.delImage)) {
        req.body.delImage = req.body.delImage.split();
    }
    if (req.files.length > 0) {
        const imageFiles = req.files.map(f => ({ url: f.path, fileName: f.filename }))
        req.body.updateAddImage = imageFiles;
    }
    if (originCamp.geometry.coordinates !== req.body.geometry.coordinates) {
        const coordinates = req.body.geometry.coordinates.split(',').map(e => +e)
        req.body.geometry.coordinates = coordinates;
    }
    next()
}

module.exports.validateCamp = function (req, res, next) {
    const { error } = campSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(', ') //v???i m???i e tr??? v??? e.mesage v?? ch??n th??m ", " gi???a m???i mesage. V?? details ??ang l?? object n??n c???n ch???y map() ????? qua t???ng gi?? tr??? trong details.
        throw new errorApp(msg, 400)
    } else {
        req.body.campground.geometry = req.body.geometry;
        req.body.campground.geometry.type = 'Point';
        next()
    }

}
module.exports.validateUpdateCamp = function (req, res, next) {
    const { error } = updateCampSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(', ') //v???i m???i e tr??? v??? e.mesage v?? ch??n th??m ", " gi???a m???i mesage. V?? details ??ang l?? object n??n c???n ch???y map() ????? qua t???ng gi?? tr??? trong details.
        throw new errorApp(msg, 400)
    } else {
        req.body.campground.geometry = req.body.geometry;
        req.body.campground.geometry.type = 'Point';
        next()
    }

}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); //ph???i l?? req.body v?? ????y l?? object ch???a review n???u ????a tr???c ti???p req.body.review th?? s??? l?? {content,rating} => k c?? error trong n??y.
    if (error) {
        const msg = error.details.map(e => e.message).join(', ')
        throw new errorApp(msg, 400)
    } else {
        next()
    }
}
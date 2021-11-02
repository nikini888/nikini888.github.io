const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground')
const Review = require('../models/review')
const { reviews } = require('../controllers/reviews')
const catchAsync = require('../helper/catchAsync')
const { validateReview, isLogin, isReviewAuthor } = require('../middleware')

router.post('/', isLogin, validateReview, catchAsync(reviews.makeNewReview))

router.delete('/:review_id', isLogin, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;
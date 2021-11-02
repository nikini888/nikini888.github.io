const express = require('express');
const router = express.Router();
const { campgrounds } = require('../controllers/campgrounds')
const catchAsync = require('../helper/catchAsync')
const { validateCamp, isLogin, isAuthor, pushNewCamDetail, updateCamDetail, validateUpdateCamp } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(campgrounds.renderIndex))
    .post(upload.array('image'), pushNewCamDetail, validateCamp, catchAsync(campgrounds.makeNewCampground))
    .post(catchAsync(campgrounds.makeNewCampground))

router.get('/new', isLogin, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.renderShowCampDetail))
    .put(isLogin, isAuthor, upload.array('editAddImage'), updateCamDetail, validateUpdateCamp, catchAsync(campgrounds.updateCampDetail))
    .delete(isLogin, isAuthor, catchAsync(campgrounds.deleteCampDetail))

router.get('/:id/edit', isLogin, isAuthor, catchAsync(campgrounds.renderEditCampDetail))

module.exports = router;

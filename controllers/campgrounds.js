const Campground = require('../models/campground')
const User = require('../models/user')
const { cloudinary } = require('../cloudinary')

module.exports.campgrounds = {
    renderIndex: async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campground/index', { campgrounds })
    },
    renderNewForm: async (req, res) => {
        const user = await User.findById(req.user._id);
        res.render('campground/new', { user })
    },
    makeNewCampground: async (req, res, next) => {
        // if (!req.body) throw new errorApp("Invalid information!")
        const newCamp = new Campground(req.body.campground);
        newCamp.author = req.user._id;
        const user = await User.findById(req.user._id);
        if (user.about !== req.body.about) {
            user.about = req.body.about
            await user.save();
        };
        await newCamp.save();
        req.flash('success', "Successfully make a Campground!")
        res.redirect(`/campgrounds/${newCamp._id}`)
    },
    renderShowCampDetail: async (req, res) => {
        const { id } = req.params;
        const camp = await Campground.findById(id).populate(
            {
                path: 'reviews',
                populate: { path: 'author' }
            }).populate('author');
        if (!camp) {
            req.flash('error', "Can't find the Campground!");
            return res.redirect('/campgrounds') //phải dùng return để kết thúc request/response cycle hoặc res.end()
        }
        res.render('campground/show', { camp })
    },
    updateCampDetail: async (req, res, next) => {
        const { id } = req.params;
        var camp = await Campground.findByIdAndUpdate(id, req.body.campground)
        if (req.body.updateAddImage) {
            camp.images.push(...req.body.updateAddImage)
            await camp.save()
        }
        if (req.body.delImage) {
            await Campground.updateOne({ $pull: { images: { fileName: { $in: req.body.delImage } } } })
            await camp.save()
            await cloudinary.api.delete_resources(req.body.delImag)
        }
        req.flash('success', "Successfully update a Campground!")
        res.redirect(`/campgrounds/${camp._id}`)
    },
    deleteCampDetail: async (req, res) => {
        const { id } = req.params;
        const camp = await Campground.findById(id);
        await cloudinary.api.delete_resources(camp.images.map(img => img.fileName))
        await Campground.findByIdAndDelete(id);
        req.flash('success', "Successfully delete a Campground!")
        res.redirect('/campgrounds');
    },
    renderEditCampDetail: async (req, res) => {
        const { id } = req.params;
        const camp = await Campground.findById(id);
        if (!camp) {
            req.flash('error', "Can't find the Campground!");
            return res.redirect('/campgrounds') //phải dùng return để kết thúc request/response cycle hoặc res.end()
        }
        res.render('campground/edit', { camp })
    }
}


const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user')
const Schema = mongoose.Schema;

// Make Mongoose attach virtuals whenever calling `JSON.stringify()`,
// including using `res.json()`
mongoose.set('toJSON', { virtuals: true });

const imageSchema = new Schema({
    url: String,
    fileName: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})
imageSchema.virtual('showImg').get(function () {
    return this.url.replace('/upload', '/upload/c_fill,w_800,h_500')
})
const campgroundSchema = new Schema({
    title: String,
    images: [imageSchema],
    price: {
        type: Number,
        require: [true, "Plz add price!"]
    },
    description: String,
    location: String,
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

campgroundSchema.virtual('properties.popUpMaker').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <br><span>${this.description.substr(0, 20)}...</span>`
})

campgroundSchema.post('findOneAndDelete', async (camp) => {
    if (camp.reviews.length) {
        await Review.deleteMany({ _id: { $in: camp.reviews } })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema)
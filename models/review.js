const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user')

const reviewSchema = new Schema({
    content: String,
    rating: {
        type: Number,
        min: 0,
        max: 5,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model('Review', reviewSchema)
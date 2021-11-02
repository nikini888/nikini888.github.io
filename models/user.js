const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        },
    },
    about: {
        type: String,
    },

})

userSchema.virtual('fullName')
    .get(function () {
        return this.name.first + ' ' + this.name.last;
    })
    .set(function (full) {
        this.name.first = full.substr(0, full.indexOf(' '));
        this.name.last = full.substr(full.indexOf(' ') + 1);
    })

userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', userSchema)
const BaseJoi = require('joi') //bắt lỗi khai báo form bị thiếu thông tin, nhưng bị chèn từ postman - lỗi k bắt được từ required <html>
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)
module.exports.campSchema = new Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        description: Joi.string().required().escapeHTML(),
        images: Joi.array().items(
            Joi.object({
                url: Joi.string().required(),
                fileName: Joi.string().required()
            })
        ).required(),
    }).required(),
    about: Joi.string().escapeHTML(),
    geometry: Joi.object({
        coordinates: Joi.array().items(Joi.number().required(), Joi.number().required())
    }).required(),
})

module.exports.updateCampSchema = new Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        description: Joi.string().required().escapeHTML(),
    }).required(),
    about: Joi.string().escapeHTML(),
    updateAddImage: Joi.array().items(
        Joi.object({
            url: Joi.string(),
            fileName: Joi.string()
        })
    ),
    geometry: Joi.object({
        coordinates: Joi.array().items(Joi.number().required(), Joi.number().required())
    }).required(),
    delImage: Joi.array()
})

module.exports.reviewSchema = new Joi.object({
    review: Joi.object({
        content: Joi.string().required().escapeHTML(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
})




const { Schema, model } = require('mongoose');

module.exports.Product = model("product", Schema({
    name: {
        type: String,
        minLength: 2,
        maxLength: 50,
    },
    description: String,
    price: Number,
    category: {
        type: Schema.Types.ObjectId,
        ref: "category",
        required: true,
    },
    quantity: Number,
    photo: {
        data: Buffer,
        contentType: String
    }

}, { timeStamps: true }));
const { Schema, model } = require('mongoose');
const { cartSchema } = require('./cartItem');

module.exports.Order = model('order', Schema({
    cartItems: [cartSchema],
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    tran_id: {
        type: String,
        unique: true,
        required: true
    },
    address1: String,
    address2: String,
    city: String,
    state: String,
    phone: String,
    postcode: Number,
    country: String,
    status: {
        type: true,
        enum: ['Pending', 'Complete']
    }
}));
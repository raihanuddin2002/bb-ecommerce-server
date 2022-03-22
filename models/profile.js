const { Schema, model } = require('mongoose');

module.exports.Profile = model("profile", Schema({
    user: {
        type: Schema.Types.ObjectId,
        unique: true,
        required: true,
        ref: "user"
    },
    address1: String,
    address2: String,
    city: String,
    state: String,
    phone: String,
    postcode: Number,
    country: String

}, { timeStamps: true }));
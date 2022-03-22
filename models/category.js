const { Schema, model } = require('mongoose');

module.exports.Category = model("category", Schema({
    name: {
        type: String,
        minLength: 2,
        maxLength: 50,
        unique: true
    }
}, { timeStamps: true }));
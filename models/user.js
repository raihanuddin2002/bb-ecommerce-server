const { Schema, model } = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = Schema({
    name: {
        type: String,
        maxLength: 255,
        minLength: 2,
        required: true
    },
    email: {
        type: String,
        maxLength: 255,
        minLength: 5,
        unique: true,
        required: true
    },
    password: {
        type: String,
        maxLength: 1024,
        minLength: 6,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: "user"
    }
}, { timestamps: true });

userSchema.methods.genarateJwt = function () {
    return jwt.sign({ id: this._id, email: this.email, role: this.role, name: this.name }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" })
};

module.exports.User = model("user", userSchema);
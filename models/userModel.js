const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
    studentID: {
        type: String,
        required: true,
        unique: true,
    },
    ip: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    region: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    postal: {
        type: String,
        required: true,
    }
}, {timestamps: true});

const User = mongoose.model('User', userModel);
module.exports = User;
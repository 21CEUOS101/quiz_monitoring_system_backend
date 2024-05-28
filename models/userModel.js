const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    studentID: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    events: [{ type: String }],
    screenshots: [{
        data: Buffer,
        contentType: String,
        filePath: String,
        timestamp: { type: Date, default: Date.now }
    }],
    profilePic: {
        type: String,
        required: true,
    },
    audio : [{ type: String }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;

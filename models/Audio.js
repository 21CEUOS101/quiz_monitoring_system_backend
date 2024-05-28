const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const audioSchema = new Schema({
    studentID: { type: Schema.Types.ObjectId, ref: 'User' },
    audioPath: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Audio = mongoose.model('Audio', audioSchema);
module.exports = Audio;

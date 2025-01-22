const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userid: {type: String, unique: true, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, default: 'user'},
    createdAt: {type: Date, default: Date.now},
    profileImage: String,
    region: {type: mongoose.Schema.Types.ObjectId, ref: 'Region'},
});

module.exports = mongoose.model('User', UserSchema, 'User');

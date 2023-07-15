const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstname: String,
    lastname: String,
    password: String,
    email: String,
    userType: String
})

module.exports = mongoose.model('user', userSchema);
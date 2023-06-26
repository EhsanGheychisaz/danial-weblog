const mongoose = require('mongoose');

const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');

var Post = new Schema({
    title : {
        type: String
    },
    text: {
        type: String
    },
    username: {
        type: String,
        unique:false
    }
})

Post.plugin(passportLocalMongoose);

module.exports = mongoose.model('Post', Post)
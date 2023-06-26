// User.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_I = 10;

const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
var User = new Schema({
	username: {
		type: String
	},
	password: {
		type: String
	},
})
// User.pre('save', function(next){
// 	var user = this;
// 	bcrypt.genSalt(SALT_I,function(err,salt){
// 		if(err) return next(err);
// 		bcrypt.hash(user.password , salt , function(err , hash){
// 			if (err) return next(err);
// 			user.password = hash
// 			next()
// 		})
// 	})
// })

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User)

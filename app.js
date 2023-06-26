// App.js

var express = require("express");
var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
var passport = require("passport");
var cors = require('cors');
var cookieParser = require('cookie-parser')
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local");
var passportLocalMongoose =require("passport-local-mongoose");
const User = require("./model/User");
const Post = require("./model/Post");
var app = express();
mongoose.connect("mongodb://localhost:27017/fuck");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require("express-session")({
	secret: "Rusty is a dog",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(cors())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(Post.authenticate()));
passport.serializeUser(Post.serializeUser());
passport.deserializeUser(Post.deserializeUser());


// app.use(request)
//=====================
// ROUTES
//=====================

// Showing home page
app.get("/", function (req, res) {
	res.render("home");
});

// Showing secret page
app.get("/secret", function (req, res) {
	res.render("secret");
	// let token = req.cookies.auth;
	// res.send(token);
});

// Showing register form
app.get("/register", function (req, res) {
	res.render("register");
});

// Handling user signup
app.post("/register", async (req, res) => {
	if (await User.exists({username: req.body.username })){
		res.json("this username is exist")
	}
	else{
		const user = await User.create({
			username: req.body.username,
			password: req.body.password
			});
			
			return res.redirect("/")
			// return res.json("you are registerd");
	}
});

//Showing login form
app.get("/login",isLoggedInLoginPage, function (req, res) {
	res.render("login");
});

//Handling user login
app.post("/login", async function(req, res){
	try {
		// check if the user exists
		const user = await User.findOne({ username: req.body.username });
		if (user) {
		//check if password matches
		const result = req.body.password === user.password;
		if (result) {
			let token;
// 		//Creating jwt token
		token = jwt.sign(
		{ userId: user.username},
		"secretkeyappearshere",
		// { expiresIn: "10m" }
		);
		// console.log(token);
		res.cookie("auth" , token);
		const decode = jwt.verify(token, 'secretkeyappearshere');
		// if(decode === err){
		// 	res.redirect("/")
		// }
		// console.log(decode);
		res.render("secret");
				
		} else {
			res.status(400).json({ error: "password doesn't match" });
		}
		} else {
		res.status(400).json({ error: "User doesn't exist" });
		}
	} catch (error) {
		res.status(400).json({ error });
	}
});
app.get("/logout", function (req, res) {
	req.logout(function(err) {
		res.cookie("auth" , "")
		res.render("home");
	});
});




function isLoggedIn(req, res, next) {
	token = req.cookies.auth;
	// console.log(token)
	if(token === ""){
		res.redirect("/")
	}
	else {
		const decode = jwt.verify(token, 'secretkeyappearshere');
		next();
	}

}


function isLoggedInLoginPage(req, res, next) {
	token = req.cookies.auth;
	// console.log(token)
	if(token === ""){
		return next()
	}
	else {
		const decode = jwt.verify(token, 'secretkeyappearshere');
		// if (decode === err){res.redirect("/")}
		res.render("forlogged")
	
	}
}

function isLoggedInSendUser(req, res, next) {
	token = req.cookies.auth;
	// console.log(token)
	if(token === ""){
		next()
	}
	else{
		const decode = jwt.verify(token, 'secretkeyappearshere');
		// if (decode === err){res.redirect("/")}
		res.json(decode);
	}

}
function isLoggedInShowPage(req, res, next) {
	token = req.cookies.auth;
	// console.log(token)
	if(token === ""){
		// console.log("df")
		next()
	}
	else {
		const decode = jwt.verify(token, 'secretkeyappearshere');
		// if (decode === err){res.redirect("/")}
		res.render("loginShowpost")
	}

}
var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Server Has Started!");
});

app.get("/newPost" , isLoggedIn,function(req, res){
	res.render("post")
})
app.post("/newPost" , async ( req,res) =>{
	token = req.cookies.auth;
	const decode = jwt.verify(token, 'secretkeyappearshere');
	console.log(decode.userId)
	const post = await Post.create({
		title: req.body.title,
		text: req.body.text,
		username: decode.userId,
	});
	res.json(post)
})
app.get("/posts" , isLoggedIn , async (req , res)=>{
	const book = await Post.find({});
	res.json({book});
})
app.get("/count" , async (req,res)=>{
	count = await User.count();
	res.json(count)
})

app.get("/showpost" , isLoggedInShowPage , (req, res) =>{
	res.render("showpost")
})

app.get("/listofPost" , async(req,res)=>{
	const book = await Post.find({});
	res.json(book)
})


app.get("/sendUser" , isLoggedInSendUser , (req,res)=>{
	res.json("")
})
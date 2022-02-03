const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStorage = require("passport-local");
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/logInForm', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    fName: String,
    lName: String,
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("newUser", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Log-In Route
app.get("/", function(req, res) {
    res.render("index");
});

//Sign-Up Route
app.get("/sign-up", function(req, res) {
    res.render("sign-up", {warningMessage: ""});
});

app.get("/success", function(req, res){
    res.render("success");
})

// Enabling an existing user to log in
// app.post("/", function(req, res) {
//     const enteredEmail = req.body.email;
//     const enteredPassword = req.body.password;

//     User.findOne({email: enteredEmail}, function (err, foundUser) {
//         if (err) {
//             console.log(err);
//         } else if (foundUser.password === enteredPassword) {
//             const userFName = foundUser.fName;
//             res.render("success", {userName: userFName});
//         }
//     });
// });
app.post("/", passport.authenticate("local", {
        successRedirect: "success",
        failureRedirect: "/"
    }), function(req, res) {

    const enteredUser = req.body.username;
    const enteredPassword = req.body.password;

    User.findOne({username: enteredUser}, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else if (foundUser.password === enteredPassword) {
            const userFName = foundUser.username;
            res.redirect("success", {userName: userFName});
        }
    });
  });
// app.post("/", passport.authenticate("local",{
//     successRedirect: "/success",
//     failureRedirect: "/"
// }), function(req, res){
//     res.redirect("/success");
//     console.log("User logged in");
// });

// app.post('/',
//   passport.authenticate('local', {
//     successRedirect: '/success',
//     failureRedirect: '/',
//     failureFlash: true
//   })
// );


// Registering new user when signing up
app.post("/sign-up", function(req, res, next) {
    console.log('registering user');
    // const firstName = req.body.fName;
    // const lastName = req.body.lName;
    // const email = req.body.email;
    // const password = req.body.password;
    // const confirmPassword = req.body.confirmPassword;

    User.register(new User({username: req.body.username}), req.body.password, function(err) {
        if (err) {
          console.log('error while user register!', err);
          return next(err);
        }
    
        console.log('user registered!');
        res.render("index");
    });

    // if (password !== confirmPassword) {
    //     res.render("sign-up", {warningMessage: "Passwords do not match"});
    // } else {
    //     const user = new User({
    //         fName: firstName,
    //         lName: lastName,
    //         email: email,
    //         password: password
    //     })
    //     user.save();
    //     res.render("index");
    // }
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});
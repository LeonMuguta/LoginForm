const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

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

const User = mongoose.model("newUser", userSchema);

app.get("/", function(req, res) {
    res.render("index");
});

app.get("/sign-up", function(req, res) {
    res.render("sign-up");
});

// Enabling an existing user to log in
app.post("/", function(req, res) {
    const enteredEmail = req.body.email;
    const enteredPassword = req.body.password;

    User.findOne({email: enteredEmail}, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else if (foundUser.password === enteredPassword) {
            // Add successful log in landing page!!!!
            res.send("<h1>You have successfully logged in</h1>");
        }
    });
});

// Registering new user when signing up
app.post("/sign-up", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password !== confirmPassword) {
        res.render("sign-up");
    } else {
        const user = new User({
            fName: firstName,
            lName: lastName,
            email: email,
            password: password
        })
        user.save();
        res.render("index");
    }

    // res.render("index");
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
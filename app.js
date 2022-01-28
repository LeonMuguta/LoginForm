const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

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
    res.sendFile(__dirname + '/index.html');
});

app.get("/sign-up", function(req, res) {
    res.sendFile(__dirname + '/sign-up.html');
});

// Enabling an existing user to log in
// app.post("/", function(req, res) {
//     const email = req.body.email;
//     const password = req.body.password;

//     console.log(email);
//     console.log(password);
// });

// Registering new user when signing up
app.post("/sign-up", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password !== confirmPassword) {
        console.log("Passwords are not the same");
        res.redirect("/sign-up")
    } else {
        const user = new User({
            fName: firstName,
            lName: lastName,
            email: email,
            password: password
        })
        user.save();
    }

    res.redirect("/")
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
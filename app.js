const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get("/sign-up", function(req, res) {
    res.sendFile(__dirname + '/sign-up.html');
});

// app.post("/", function(req, res) {
//     const email = req.body.email;
//     const password = req.body.password;

//     console.log(email);
//     console.log(password);
// });

// app.post("/sign-up", function(req, res) {
//     const password = req.body.password;
//     const confirmPassword = req.body.confirmPassword;

//     if (password !== confirmPassword) {
//         console.log("Passwords are not the same!");
//     }

//     console.log(password);
//     console.log(confirmPassword);
// });

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
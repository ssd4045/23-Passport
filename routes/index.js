var express = require("express");
var router = express.Router();
var User = require("../models/user");
const passport = require("passport");

/* GET home page. */

function isLogedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", function(req, res) {
  res.render("login", { title: "Express" });
});

router.get("/register", function(req, res, next) {
  res.render("register.ejs");
});

router.get("/public", function(req, res, next) {
  res.render("public.ejs");
});

router.post("/register", function(req, res, next) {
  User.create(req.body).then(response => res.redirect("/login"));
});

router.post("/login", passport.authenticate("local"), function(req, res, next) {
  console.log("USERRRRRR:" + req.User);
  res.redirect("/private");
});

router.get("/private", isLogedIn, (req, res, next) => {
  res.render("private.ejs");
});

module.exports = router;

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
var logger = require("morgan");
var bodyParser = require("body-parser");
const db = require("./db/db");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ secret: "cats" }));

//Passport: implementacion de estrategia local (ver toon.io/understanding-passportjs-auhtnetication-flow/)
passport.use(
 new LocalStrategy(
   { usernameField: "email", passwordField: "password" }
   //por default passport espera userName y password. Por eso seteo el username como email
   ,
   function(email, password, done) {
     User.findOne({ where: { email: email } })
       .then(user => {
         if (!user) {
           return done(null, false, { message: "Incorrect username." });
           console.log('aaaaaaaaaaaaaaaaaaaaaaaaaa')
         }
         if (!user.validPassword(password)) {
           return done(null, false, { message: "Incorrect password." });
           console.log('bbbbbbbbbbbbbbbbbbbbbbbbbb')
         }
         return done(null, user);
       })
       .catch(err => console.log(err));
   }
 )
);

//chequear https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
passport.serializeUser(function(user, done) {
  done(null, user.id); 
});

passport.deserializeUser(function(id, done) {
  User.findByPk(id).then(user => {
    done(null, user)
  })
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});



module.exports = app;

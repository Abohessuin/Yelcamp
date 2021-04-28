var express = require("express"),
  bodyParser = require("body-parser"),
  app = express(),
  mongoose = require("mongoose"),
  passport = require("passport"),
  localStorage = require("passport-local"),
  User = require("./models/user");
Comment = require("./models/comment");
(Campground = require("./models/campground")),
  (seedDB = require("./seed")),
  (methodOverride = require("method-override"));

var campgroundRoutes = require("./routes/campgrounds"),
    commentsRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");

seedDB();
mongoose.connect("mongodb://localhost/yel_campl");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
///Auth config
app.use(
  require("express-session")({
    secret: "ALOOOOOOOOOOOO",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(campgroundRoutes);
app.use(commentsRoutes);
app.use(indexRoutes);
passport.use(new localStorage(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.render("landingPage");
});

function checkownerMiddleware(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, found) => {
      if (err) {
        res.redirect("back");
      } else {
        if (found.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

app.listen(3000, () => {
  console.log("server has started on port 3000");
});

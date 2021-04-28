var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/campgrounds", (req, res) => {
  Campground.find({}, function (err, camp) {
    if (err) {
      console.log(err);
    } else {
      res.render("campground/campgrounds", { campgrounds: camp });
    }
  });
});

router.post("/campgrounds", (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampgrounds = { name: name, image: image, description: description };
  Campground.create(newCampgrounds, function (err, newCamp) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("campground/campgrounds");
    }
  });
});

router.get("/campgrounds/new", (req, res) => {
  res.render("campground/newCampground");
});

router.get("/campgrounds/:id", (req, res) => {
  const id = req.params.id;
  Campground.findById(id)
    .populate("comments")
    .exec(function (err, newCampground) {
      if (err) {
        console.log(err);
      } else {
        res.render("campground/moreinfo", { NCG: newCampground });
      }
    });
});

router.get("/campgrounds/:id/edit", (req, res) => {
  Campground.findById(req.params.id, (err, found) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campground/edit", { camp: found });
    }
  });
});

router.put("/campgrounds/:id", (req, res) => {
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (err, updated) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    }
  );
});

router.delete("/campgrounds/:id", (req, res) => {
  Campground.findByIdAndremove(req.params.id, (err, updated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;

const Tour = require("../models/tourModels");
const User = require("../models/userModel");
const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res, next) => {
  // get tour data
  const tours = await Tour.find();

  // build template

  // render template using tour data

  res.status(200).render("overview", {
    title: "All tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate(
    "reviews",
    "review rating user"
  );

  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour,
  });
});

const Tour = require("../models/tourModels");
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

exports.getTour = (req, res) => {
  res.status(200).render("base", {
    tour: "The Forest Hiker",
    user: "Facsimile",
  });
};

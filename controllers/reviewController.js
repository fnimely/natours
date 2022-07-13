// implement end points for getting all review and creating new reviews.
const Review = require("./../models/reviewModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  if (!reviews) {
    return next(new AppError("There was a problem retrieving reviews", 400));
  }

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: { reviews },
  });
});

exports.createReview = factory.createOne(Review);

exports.setTourUserIds = (req, res, next) => {
  // allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

const mongoose = require("mongoose");
const Tour = require("./tourModels");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review cannot be empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must have a tour."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must have an author"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate("user", "name photo").populate("tour", "name");
  this.populate("user", "name photo");
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: { _id: "$tour" },
      nRatings: { $sum: 1 },
      avgRating: { $avg: "$rating" },
    },
  ]);
  console.log(stats);

  Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRatings,
    ratingsAverage: stats[0].avgRating,
  });
};

reviewSchema.post("save", function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour);
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;

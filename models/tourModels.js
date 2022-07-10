const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const { getTour } = require("../controllers/tourController");

// creating a shcema
const toursSchema = new mongoose.Schema(
  {
    name: {
      // schema type options
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      // validate using the validator package
      // validate: [validator.isAlpha, "Tour name must only contain characters."],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: true,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"], // validator used to validate data
    },
    priceDiscount: {
      type: Number,
      validate: {
        // this only points to doc when creating new doc
        validator: function (val) {
          return val < this.price;
        },
      },
      message: "Discount price ({VALUE}) should be below regular price",
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // hide field from query
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
  },
  // schema options
  {
    toJSON: { virtuals: true }, // add vp each time the data is outputed as json
    toObject: { virtuals: true }, // or as an object
  }
);

// virtual property (vp) created each time we get some data from db
toursSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7; // tour duration in weeks
});

// mongoose doc middlware: runs before save() and create()
// only run for the save and create mongoose method
toursSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/* toursSchema.pre("save", function (next) {
  console.log("Will save document");
  next();
});

// post has access to the document just saved to db
toursSchema.post("save", function (doc, next) {
  console.log(doc);
  next();
}); */

// Query middleware
toursSchema.pre(/^find/, function (next) {
  // append a find query to every query
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

toursSchema.post(/^find/, function (docs, next) {
  // how long the query took
  console.log(`Query took ${Date.now - this.start}`);
  // console.log(docs);
  next();
});

// aggregation middleware
toursSchema.pre("aggregate", function (next) {
  // add a match stage at the beginning of the pipeline
  this.pipeline().unshift({ $match: { secretTour: true } });
  // console.log(this);
  next();
});

// create/compile a model of the schema - model is used to create a document
const Tour = mongoose.model("Tour", toursSchema);

module.exports = Tour;

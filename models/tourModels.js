const mongoose = require("mongoose");
const slugify = require("slugify");
const { getTour } = require("../controllers/tourController");

// creating a shcema - basic
const toursSchema = new mongoose.Schema(
  {
    name: {
      // schema type options
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
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
    priceDiscount: Number,
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
toursSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

toursSchema.pre("save", function (next) {
  console.log("Will save document");
  next();
});

// post has access to the document just saved to db
toursSchema.post("save", function (doc, next) {
  console.log(doc);
  next();
});

// create/compile a model of the schema - model is used to create a document
const Tour = mongoose.model("Tour", toursSchema);

module.exports = Tour;

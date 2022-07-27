const mongoose = require("mongoose");

const bookingSchema = new mongoose.schema({
  tour: {
    type: mongoose.schema.objectId,
    ref: "Tour",
    required: [true, "Booking must have a tour!"],
  },
  user: {
    type: mongoose.schema.objectId,
    ref: "User",
    required: [true, "User must have a tour!"],
  },
  price: {
    type: Number,
    required: [true, "Booking must have a price"],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "tour",
    select: "name",
  });
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;

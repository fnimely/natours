const express = require("express");
const tourController = require("./../controllers/tourController");

// create a new router
const router = express.Router();

// router.param("id", tourController.checkID);

// root is '/api/v1/tours'
router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour); // checkBody middlware
//
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

// used when we only have one export
module.exports = router;

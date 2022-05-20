const express = require("express");
const tourController = require("./../controllers/tourController");

// create a new router
const router = express.Router();

// param middleware that only runs when a parameter is present in url
// router.param("id", tourController.checkID);

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours); // on this route, the middlware runs first

// root is '/api/v1/tours'
router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour); // checkBody middlware
//
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

// used when we only have one export
module.exports = router;

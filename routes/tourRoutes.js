const express = require("express");
const fs = require("fs");

// __dirname represents where the current script is located
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  //this callback is 'route handler'

  console.log(req.requestTime);

  // sending the response
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  // where url parameters are stored
  console.log(req.params);

  const id = req.params.id * 1; // mutliple to conver to number
  const tour = tours.find((tour) => tour.id === id);

  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    // results: tours.length,
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      // 201 is 'created' status code
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 >= tours.length) {
    res.status(404).json({
      status: "success",
      message: "Invalid ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated tour data...>",
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 >= tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  // 204 is the 'no content' port number
  res.status(204).json({
    status: "success",
    data: null,
  });
};

// create a new router
const router = express.Router();

// root is '/api/v1/tours'
router.route("/").get(getAllTours).post(createTour);
//
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;

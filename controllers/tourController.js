const Tour = require("./../models/tourModels");

// __dirname represents where the current script is located
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// custom middleware
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "Bad Request",
      message: "Missing name or price",
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  //this callback is 'route handler'

  console.log(req.requestTime);

  // sending the response
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    // results: tours.length,
    // data: {
    //   tours: tours,
    // },
  });
};

exports.getTour = (req, res) => {
  // where url parameters are stored
  console.log(req.params);

  const id = req.params.id * 1; // mutliple to conver to number
  // const tour = tours.find((tour) => tour.id === id);

  res.status(200).json({
    status: "success",
    // results: tours.length,
    // data: {
    //   tour,
    // },
  });
};

exports.createTour = (req, res) => {
  // console.log(req.body);

  // 201 is 'created' status code
  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated tour data...>",
    },
  });
};

exports.deleteTour = (req, res) => {
  // 204 is the 'no content' port number
  res.status(204).json({
    status: "success",
    data: null,
  });
};

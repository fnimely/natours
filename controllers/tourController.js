// handle application requests, interact with models, and send back client response
// this files contains route handler middleware for all TOUR resources

const Tour = require("./../models/tourModels");

// __dirname represents where the current script is located
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.getAllTours = async (req, res) => {
  // this callback is 'route handler'

  // console.log(req.requestTime);

  try {
    // build query
    // filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];

    // remove all fields from query object
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(req.query, queryObj);

    // advanced filtering
    // add dollar sign in query string
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));

    // one way of writing query
    let query = Tour.find(JSON.parse(queryStr));

    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      console.log(sortBy);
      query = query.sort(req.query.sort);
    } else {
      // default sorts
      query = query.sort("-createdAt");
    }

    // { difficulty: 'easy', duration: { $gte 5 } }

    // creating query with mongoose
    // const tours = await Tour.find()
    //   .where("duration")
    //   .equals(5)
    //   .where("difficulty")
    //   .equals("easy");

    // execute query
    const tours = await query;

    // sending the response
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  // where url parameters are stored
  // console.log(req.params);

  // const id = req.params.id * 1; // mutliple to conver to number
  // const tour = tours.find((tour) => tour.id === id);

  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  // console.log(req.body);

  // const newTour = new Tour({});
  // newTour.save();
  try {
    const newTour = await Tour.create(req.body);

    // 201 is 'created' status code
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      // return new updated document
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    // 204 is the 'no content' port number
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

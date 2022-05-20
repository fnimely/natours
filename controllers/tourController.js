// handle application requests, interact with models, and send back client response
// this files contains route handler middleware for all TOUR resources

const Tour = require("./../models/tourModels");

// __dirname represents where the current script is located
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// middlware to manipulate request object for alias route
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

/** Class to implement API features (filter, sort, etc) */
class APIFeatures {
  /**
   * Sets query and query string
   * @param {Object} query - A mongoose query object (ie: Model.find())
   * @param {String} queryString - The query string on the request object
   */
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * Filters the query by manipulating the query
   */
  filter() {
    // build query
    // filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];

    // remove all fields from query object
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(req.query, queryObj);

    // advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // add dollar sign in query string

    this.query = this.query.find(JSON.parse(queryStr)); // the 'query' class field now have a find method

    return this; // returns entire object
  }

  sort() {
    if (this.query.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // default sorts
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    // limiting fields / projecting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      console.log(fields);
      this.query = this.query.select(fields);
    } else {
      // exculde __v field used by mongo
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1; // page 1 if no page in url
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

exports.getAllTours = async (req, res) => {
  // this callback is 'route handler'

  // console.log(req.requestTime);

  try {
    // { difficulty: 'easy', duration: { $gte 5 } }

    // creating query with mongoose
    // const tours = await Tour.find()
    //   .where("duration")
    //   .equals(5)
    //   .where("difficulty")
    //   .equals("easy");

    // execute query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

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

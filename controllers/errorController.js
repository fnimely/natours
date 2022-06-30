const AppError = require("./../utils/appError");

// operational error - request on invalid url
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // operational error sent to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // programming/unkown error
  else {
    // log error
    console.error("ERROR!💥", err);

    //  send a generic message
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

// this represents the different types of error handlers
module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  // assign the statusCode if it exist, else 500
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    sendErrorProd(error, res);
  }
};

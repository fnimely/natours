// this represents the different types of error handlers

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  // assign the statusCode if it exist, else 500
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

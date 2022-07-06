// main app - middleware declarations

const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// MIDDLEWARES

// only run logger middleware while the app is in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // logger middleware
}

// body parsing middleware, adds body data to each request object
app.use(express.json()); // the passed in function is added to the middleware stack

// express middlware used to serve static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  // add current time to req object
  req.requestTime = new Date().toISOString(); // ISO convert to formatted date
  next();
});

// use the tourRouter router middleware on tours resources
// mount new routers on the tours and users routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// unhandled routes
app.all("*", (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server.`);
  // err.status = "fail";
  // err.statusCode = 404;

  // a next function with a parameter is assumed to be an err, all
  // other middleware is skipped
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

// error handling middleware
app.use(globalErrorHandler);

module.exports = app;

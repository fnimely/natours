// main app - middleware declarations

const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// global MIDDLEWARES

// express middlware used to serve static files
app.use(express.static(path.join(__dirname, "public")));

// app.use(
//   // prettier-ignore
//   helmet.contentSecurityPolicy(
//     {
//     // HACK
//     directives: {
//       defaultSrc: ["'self'", 'data:', 'blob:'],

//       baseUri: ["'self'"],

//       fontSrc: ["'self'", 'https:', 'data:'],

//       scriptSrc: ["'self'", 'https://*.cloudflare.com'],

//       scriptSrc: ["'self'", 'https://*.stripe.com'],

//       scriptSrc: ["'self'", 'http:', 'https://*.mapbox.com', 'data:'],

//       frameSrc: ["'self'", 'https://*.stripe.com'],

//       objectSrc: ["'none'"],

//       styleSrc: ["'self'", 'https:', 'unsafe-inline'],

//       workerSrc: ["'self'", 'data:', 'blob:'],

//       childSrc: ["'self'", 'blob:'],

//       imgSrc: ["'self'", 'data:', 'blob:'],

//       connectSrc: ["'self'", 'blob:', 'https://*.mapbox.com'],

//       upgradeInsecureRequests: [],
//     },
//   })
// ); // set security http headers

// only run logger middleware while the app is in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // logger middleware
}

// limit request from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: `Too many request from this IP, please try again in an hour.`,
});
app.use("/api", limiter); // restric limiter to api routes

// body parsing middleware, adds body data to each request object
app.use(express.json({ limit: "10kb" })); // the passed in function is added to the middleware stack
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// sanitize - NoSQL query injection
app.use(mongoSanitize());

// XSS prevention
app.use(xss());

console.log(process.env.NODE_ENV);

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use((req, res, next) => {
  // add current time to req object
  req.requestTime = new Date().toISOString(); // ISO convert to formatted date
  next();
});

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

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

// main app - middleware declarations

const express = require("express");
const morgan = require("morgan");

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
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server.`,
  });
});

module.exports = app;

/* app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Hello from the server side! Yeah.", app: "Natrous" });
});

app.post("/", (req, res) => {
  res.send("You can no post to this endpoint.");
}); */

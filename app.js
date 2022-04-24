const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// body parsing middleware
app.use(express.json());

// express middlware used to serve static files
app.use(express.static(`${__dirname}/public`));

// custom middleware - applies to every request without specified route
app.use((req, res, next) => {
  console.log("Hello from the middleware");

  // send back response and move to next middleware - call next in stack
  next();
});

app.use((req, res, next) => {
  // add current time to req object
  req.requestTime = new Date().toISOString(); // ISO convert to formatted date
  next();
});

// use the tourRouter router middleware on tours resources
// mount new routers on the tours and users routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;

/* app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Hello from the server side! Yeah.", app: "Natrous" });
});

app.post("/", (req, res) => {
  res.send("You can no post to this endpoint.");
}); */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

// read variables from config file and save them in node env variables
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
console.log("The DB variable: ", DB);

// options to deal deprecation warnings
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connection successful"));

// console.log(process.env);

// creating a shcema - basic
const toursSchema = new mongoose.Schema({
  name: {
    // schema type options
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"], // validator used to validate data
  },
});

// creating a model out of the schema - model is used to create a document
const Tour = mongoose.model("Tour", toursSchema);

// create a document out of a tour model
const testTour = new Tour({
  name: "The Forest Hiker",
  rating: 4.7,
  price: 497,
});

// save document to db, resolves to the final doc in db
testTour
  .save()
  .then((doc) => console.log(doc))
  .catch((err) => {
    console.log("Error: ", err);
  });

const port = process.env.port || 3000;
// start a server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

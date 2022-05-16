const mongoose = require("mongoose");
const dotenv = require("dotenv");

// read variables from config file and save them in node env variables
dotenv.config({ path: "./config.env" });

const app = require("./app");
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
// console.log(process.env);
// options to deal deprecation warnings
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful"));

// // create a document out of a tour model
// const testTour = new Tour({
//   name: "The Park Camper",
//   price: 997,
// });

// // save document to db, resolves to the final doc in db
// testTour
//   .save()
//   .then((doc) => console.log(doc))
//   .catch((err) => {
//     console.log("Error: ", err);
//   });

const port = process.env.PORT || 3000;
// start a server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

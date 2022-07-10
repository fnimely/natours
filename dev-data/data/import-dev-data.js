// this file runs independently of the express application.
// It runs once in the beginning

const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModels");

// read variables from config file and save them in node env variables
dotenv.config({ path: "./config.env" });

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
  })
  .then(() => console.log("DB connection successful"));

//   read json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));

// import data into db
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data successfully created.");
    //   end running script
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// delete all data from db
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data successfully deleted.");
    //   end running script
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);

const dotenv = require("dotenv");

// read variables from config file and save them in node env variables
dotenv.config({ path: "./config.env" });

const app = require("./app");

// console.log(process.env);

const port = process.env.port || 3000;
// start a server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

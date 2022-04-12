const app = require("./app");

console.log(process.env);

const port = 3000;
// start a server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

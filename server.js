const app = require("./app");

const port = 3000;
// start a server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// App
const app = require("./app");

// Listen
app.listen(process.env.PORT, () =>
  console.log(`Running on http://localhost:${process.env.PORT}`)
);

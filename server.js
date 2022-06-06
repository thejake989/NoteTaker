// Dependencies
const express = require("express");
const path = require("path");

// Express
const app = express();

// Active port selection
const PORT = process.env.PORT || 3001;

// Data parsing through Express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Serving static files in Express, so it will load the files that are in the public directory
app.use(express.static(path.join(__dirname, "public")));

// Route
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// App listener
app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});

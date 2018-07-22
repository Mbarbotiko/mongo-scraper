const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static("public"));

const routes = require("./routes/api.js");
app.use(routes);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/ScrapeDB";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.listen(PORT, function () {
    console.log(`This application is running on port: ${PORT}`);
});


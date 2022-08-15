require("dotenv").config({ path: "./.env" });
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var cors = require('cors')
const routes = require('./routes');
const { json, urlencoded } = require('body-parser');

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(
    cors({
        origin: "*", // <-- allow all origins
        credentials: true,
    })
);


app.use('/', routes);

app.get("/", (req, res) => {
    res.send("Hello World!");
  });

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listing to port ${port}`);
})
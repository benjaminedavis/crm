// call the packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;

// app configuration
// use body-parser to grab info from post requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure app to handle CORS requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \ Authorization');
  next();
});

// log all requests to the console
app.use(morgan('dev'));

// Routes for API
// basic route for home page
app.get('/', function(req, res) {
  res.send('Welcome to the Home Page!');
});

// instance of the express router
var apiRouter = express.Router();

// test route to make sure its working
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res) {
  res.json({ message: 'Welcome to our API!' });
});

// more routes for our API will happen here

// Register our routes
// all routes will be prefixed with /api
app.use('/api', apiRouter);

// Start the server
app.listen(port);
console.log('Magic happens on port ' + port);

// call the packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;
var User = require('./app/models/user');

// connect to our database (hosted by mongolab)
mongoose.connect('mongodb://bendavis:bendavis@ds031877.mongolab.com:31877/crm');

// app configuration
// use body-parser to grab info from post requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure app to handle CORS requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

// log all requests to the console
app.use(morgan('dev'));

// Routes for our API
// basic route for home page
app.get('/', function(req, res) {
  res.send('Welcome to the Home Page!');
});

// instance of the express router
var apiRouter = express.Router();

// middleware to use for all requests
apiRouter.use(function(req, res, next) {
      // do logging
      console.log('Someone has arrived at our api!');
      // we'll add more to the middleware later
      // this is where we will authenticate users

      // go to next route
      next();
});

// test route to make sure its working
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res) {
  res.json({ message: 'Welcome to our API!' });
});

// more routes for our API will happen here
apiRouter.route('/users')

      // create a user POST at http://localhost:8080/api/users
      .post(function(req, res) {

          // create a new instance of the user model
          var user = new User();

          // set the user's information (comes from the request)
          user.name = req.body.name;
          user.username = req.body.username;
          user.password = req.body.password;

          // save the user and check for errors
          user.save(function(err) {
      if (err) {
          if (err.code == 11000)
              return res.json({ success: false, message: 'A user with that username already exists.' });
          else
              return res.send(err);
          }
              res.json({ message: 'User created!' });
          });
      })

      // get all the users GET at http://localhost:8080/api/users
      .get(function(req, res) {

          User.find(function(err, users) {
              if(err) res.send(err);

              res.json(users);
          });
      });

// routes that end in /users/:user_id
apiRouter.route('/users/:user_id')

      // get an individual user GET at http://localhost:8080/api/users/:user_id
      .get(function(res, req) {
            User.findById(req.params.user_id, function(err, user) {
                if (err) res.send(err);


                res.json(user);
            });
      })


// Register our routes
// all routes will be prefixed with /api
app.use('/api', apiRouter);

// Start the server
app.listen(port);
console.log('Magic happens on port ' + port);

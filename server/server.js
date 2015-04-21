// load the express package and create our app
var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/askout');

var Event = require('./app/models/event');

var app = express();
var path = require('path');

// send our index.html file to the user for the home page
app.get('/', function(req, res) {
res.sendFile(path.join(__dirname + '/index.html'));
});

var eventRouter = express.Router();

eventRouter.route('/events')
  .get(function(req,res){
    Event.find(function(err,events){
      if(err) res.send(err);

      //res.send('ponytiem');
      res.json(events);
     });
    //res.send('Hee33ys');
  });

eventRouter.route('/postEvents')
  .get(function(req,res){
    var event = new Event();
    
    event.data_inici = new Date();
    event.data_final = new Date();
    event.titol = "primer event";
    event.descripcio = "descripcio cutre";
    event.web = "who knows";

    event.save(function(err) { 
      if (err) {
        return res.send(err);
      }
      res.send("done");
    });    
  });

// create routes for the admin section

// get an instance of the router
var adminRouter = express.Router();

// route middleware that will happen on every request
adminRouter.use(function(req, res, next) {

// log each request to the console
console.log(req.method, req.url);

// continue doing what we were doing and go to the route
next();
});

// admin main page. the dashboard (http://localhost:1337/admin)
adminRouter.get('/', function(req, res) {
res.send('I am the dashboard!');
});

// users page (http://localhost:1337/admin/users)
adminRouter.get('/users', function(req, res) {
res.send('I show all the users!');
});

// posts page (http://localhost:1337/admin/posts)
adminRouter.get('/posts', function(req, res) {
res.send('I show all the posts!');
});

// apply the routes to our application
app.use('/admin', adminRouter);
app.use('/api', eventRouter);

// start the server
app.listen(80);
console.log('1337 leet lol is the magic port!');

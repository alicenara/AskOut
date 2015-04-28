/*Base setup  - - - - - - - */

/* calling the packages */
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require ('body-parser');
var path = require('path');
var config = require('./config');
//var Event = require('./app/models/event');

var app = express();

/*
* Connect to the DB
*/
mongoose.connect(config.database);


// send our index.html file to the user for the home page <- sha de canviar!
app.get('/', function(req, res) {
res.sendFile(path.join(__dirname + '/index.html'));
});

/*var eventRouter = express.Router();

eventRouter.route('/events')
  .get(function(req,res){
    Event.find(function(err,events){
      if(err) res.send(err);

      //res.send('ponytiem');
      res.json(events);
     });
    //res.send('Hee33ys');
});
*/
/*
// prova del getData!
app.get('/getData',function(req,res){
    var getData = require('./getData');
  res.json(getData);
});
*/
/*************************************
* API Routes!
*************************************/
console.log("ara va");
var apiRoutes = require('./app/routes/apis')(app,express);

/************************************
Routes examples, not required -> admin
*************************************/
var adminRouter = require('./app/routes/admin')(app,express);
console.log("ara no va");
// apply the routes to our application
app.use('/admin', adminRouter);
app.use('/api', apiRoutes);


// start the server
app.listen(config.port);
//app.use('/api', eventRouter);

//console.log('1337 leet lol is the magic port!');
console.log('server on');
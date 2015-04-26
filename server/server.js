/*Base setup  - - - - - - - */

/* calling the packages */
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require ('body-parser');
var path = require('path');
//var config = require('/config');

var app = express();

/*
* Connect to the DB
*/
//mongoose.connect(config.database);


// send our index.html file to the user for the home page <- sha de canviar!
app.get('/', function(req, res) {
res.sendFile(path.join(__dirname + '/index.html'));
});

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
//var apiRoutes = require('./app/routes/apis')(app,express);

/************************************
Routes examples, not required -> admin
*************************************/
/*var adminRouter = require('./app/routes/admin')(app,express);

// apply the routes to our application
app.use('/admin', adminRouter);
app.use('/api', apiRoutes);*/

// start the server
//app.listen(config.port);
app.listen(80);
//console.log('1337 leet lol is the magic port!');
console.log('server on');
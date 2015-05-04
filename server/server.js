/*Base setup  - - - - - - - */

/* calling the packages */
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require ('body-parser');
var path = require('path');
var config = require('./config');

var app = express();

/*
* Connect to the DB
*/
mongoose.connect(config.database);

// set the public folder to serve public assets
app.use(express.static(__dirname + '/public'));

// set up our one route to the index.html file
app.get('*', function(req, res) {
res.sendFile(path.join(__dirname + '/public/index.html'));
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

var apiRoutes = require('./app/routes/apis')(app,express);

/************************************
Routes examples, not required -> admin
*************************************/
var adminRouter = require('./app/routes/admin')(app,express);

// apply the routes to our application
app.use('/admin', adminRouter);
app.use('/api', apiRoutes);


// start the server
app.listen(config.port);

//console.log('1337 leet lol is the magic port!');
console.log('server on');
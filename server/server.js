/*Base setup  - - - - - - - */

/* calling the packages */
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require ('body-parser');
var path = require('path');
var config = require('./config');

/*
 * Options for the SSL part:
 */
/*var options = {
	  key:    fs.readFileSync('ssl/server.key'),
    cert:   fs.readFileSync('ssl/server.crt'),
    ca:     fs.readFileSync('ssl/ca.crt')
};*/

 

var app = express();

/*
 * Create the secure server:
*/
// Create an HTTP service.
//http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
//https.createServer(options, app).listen(443);

 

 
/*
* Connect to the DB
*/
mongoose.connect(config.database);

// set the public folder to serve public assets
app.use(express.static(__dirname + '/public'));

/*************************************
* API Routes!
*************************************/

var apiRoutes = require('./app/routes/apis')(app,express);

/************************************
Routes examples, not required -> admin
*************************************/
/*var adminRouter = require('./app/routes/admin')(app,express);

// apply the routes to our application
app.use('/admin', adminRouter);*/
app.use('/api', apiRoutes);

// set up our one route to the index.html file
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});


// start the server
app.listen(config.port);

//console.log('1337 leet lol is the magic port!');
console.log('server on');

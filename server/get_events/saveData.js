/*
* Time to get and save all events 
* from Open Data page :D
*/

var mongoose = require('mongoose');
var config = require('../config');
var Event = require('../app/models/event');

module.exports = function() {
  /*
  * Connect to the DB
  */
  mongoose.connect(config.database);

  /*
  * Getting the data (by Alvaro :D)
  */
  var getData = require('./getData');

  /*
  * Saving the data
  */

  var e = new Event();
  e.data_inici = req.body.data_inici;
  e.data_final = req.body.data_final;
  e.titol = req.body.titol;
  e.descripcio = req.body.descripcio;
  e.categoria = req.body.categoria;
  e.web = req.body.web;

  e.save(function(err){
      if (err) return err;
      return "Event created";
  });
}
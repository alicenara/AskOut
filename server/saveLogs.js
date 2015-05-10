/*
* Save logs
*/

var Log = require('./app/models/log');

module.exports = function(titol, desc, callback) {

  /*
  * New log
  */
  var l = new Log();
  l.dia = new Date;
  l.titol = titol;
  l.descripcio = desc;

  callback(l);
}
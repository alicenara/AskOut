/*
* Time to get and save all events 
* from Open Data page :D
*/

var mongoose = require('mongoose');
var config = require('../config');
var Event = require('../app/models/event');

module.exports = function(eventsArray, callback) {
  /*
  * Connect to the DB
  */
  mongoose.connect(config.database);

  /*
  * Saving the data
  */
  var i = 0;
  for(var events in eventsArray){
    var e = new Event();
    e._id = eventsArray[events].id;
    e.data_inici = transformTime(eventsArray[events].dataIni, 1, true);
    e.data_final = transformTime(eventsArray[events].dataFi, eventsArray[events].dataIni, false);
    e.nom = eventsArray[events].nom;
    e.nomLloc = eventsArray[events].nomLloc;
    e.carrer = eventsArray[events].carrer;
    e.numero = eventsArray[events].numero;
    e.districte = eventsArray[events].districte;
    e.municipi = eventsArray[events].municipi;
    e.latitude = eventsArray[events].lat;
    e.longitude = eventsArray[events].lon;
    e.categories = eventsArray[events].clasificacions;

    e.save(function(err){
      var logs = require('../saveLogs');
      if (err){         
        logs("DesarBD","Hi ha hagut l'error"+err, function(log){
          log.save(function(err){
          if (err){ /*No ha passat res*/ }
          });
        });
       }else{
        logs("DesarBD","S'han desat les dades a la BD", function(log){
          log.save(function(err){
          if (err){ /*No ha passat res*/ }
          });
        });
       }
    });
  }
  callback("done");
}

function transformTime(data, dataIni, isDate){
  if(isDate){
    if(data!=""){
      var dia = data.split('/');
      var any = dia[2].split(' ');
      var hora = any[1].split('.');
      var novaData = new Date(any[0],dia[1],dia[0],hora[0],hora[1]);
    }else{
      var novaData = new Date();
    }
    return novaData;
  }else{
    if(data!=""){
      var dia = dataIni.split('/');
      var any = dia[2].split(' ');
      var data = data.split('.');
      var novaData = new Date(any[0],dia[1],dia[0],data[0],data[1]);
    }else{
      var dia = dataIni.split('/');
      var any = dia[2].split(' ');
      var hora = any[1].split('.');
      var novaData = new Date(any[0],dia[1],dia[0],hora[0]+1,hora[1]);
    }
    return novaData;
  }
}
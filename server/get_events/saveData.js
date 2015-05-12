/*
* Time to get and save all events 
* from Open Data page :D
*/

var mongoose = require('mongoose');
var config = require('../config');
var Event = require('../app/models/event');

module.exports = function(finalData, callback) {
  /*
  * Connect to the DB
  */
  mongoose.connect(config.database);

  /*
  * Saving the data
  */
  for(var i=0; i < finalData.length; i++){
    var eventsArray = finalData[i];
    for(var events in eventsArray){
      if(eventsArray[events] != undefined){
        var e = new Event();
        e._id = eventsArray[events]._id;
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
        e.categories_generals = eventsArray[events].categories_generals;

        e.save(function(err){
          var logs = require('../saveLogs');
          if (err){ 
            console.log("error:"+err);        
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
    }
  }  
  callback("done");
}

function transformTime(data, dataIni, isDate){
  if(isDate){
    if(data!="" && data!==undefined){
      var dia = data.split('/');
      var any = dia[2].split(' ');
      var hora = [];
      if(any[1]!==undefined && any[1].indexOf(".")>=0){
        hora = any[1].split('.');
      }else{
        hora[0] = 0;
        hora[1] = 0;
      }
      
      var novaData = new Date(any[0],dia[1]-1,dia[0],hora[0],hora[1]);
    }else{
      var novaData = new Date();
    }
    return novaData;
  }else{
    if(data!=""&& data!==undefined){
      var dia = dataIni.split('/');
      var any = dia[2].split(' ');
      var data = data.split('.');
      var novaData = new Date(any[0],dia[1]-1,dia[0],data[0],data[1]);
    }else{
      if(dataIni!==undefined){
        var dia = dataIni.split('/');
        var any = dia[2].split(' ');
        var hora = [];
      if(any[1]!==undefined && any[1].indexOf(".")>=0){
        hora = any[1].split('.');
      }else{
        hora[0] = 0;
        hora[1] = 0;
      }
        var novaData = new Date(any[0],dia[1]-1,dia[0],hora[0],hora[1]);
      }else 
        novaData = new Date();
    }
    return novaData;
  }
}
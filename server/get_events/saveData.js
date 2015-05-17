/*
* Time to get and save all events 
* from Open Data page :D
*/

var mongoose = require('mongoose');
var config = require('../config');
var Event = require('../app/models/event');
var validDate = new Date();

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
        e.data_inici = transformTime(eventsArray[events].dataIni, true);
        e.data_final = transformTime(eventsArray[events].dataFi, false);
        e.nom = eventsArray[events].nom;
        e.nomLloc = (eventsArray[events].nomLloc).replace('*','');;
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

function transformTime(data, isIDate){
  //First we need to check if we're parsing dataIni or not
  if(isIDate){
    var novaData = "";
    //as sometimes data is null or undefined, we need to take it into account
    if(data !== null && data != "" && data !== undefined){
      var dia = data.split('/'); // dia = [12,05,2015 9.00]
      var any = dia[2].split(' '); // any = [2015, 9.00]
      var hora = [];
      //sometimes no hour is defined, so we need to check that too
      if(any[1] !== null && any[1] !== undefined && any[1].indexOf(".") >= 0){
        hora = any[1].split('.');
      }else{
        hora = [0,0];
      }
      //Then we need to check if it's a valid date and then we can save it:
      if(any[0] != "9999" && any[0] != "1000"){
        novaData = new Date(any[0],dia[1]-1,dia[0],hora[0],hora[1]);
        validDate = novaData;
      }      
    }
    if(novaData==""){
      novaData = validDate;
    }

  }else{
    //Sometimes there's no data_fi
    if(data !== null && data != "" && data !== undefined){
      var data = data.split('/');
      novaData = new Date(data[2],data[1]-1,data[0],0,0);
    }else{
      novaData = validDate;
      //novaData.setHours(novaData.getHours()+1);
    }
  }
  return novaData;
}
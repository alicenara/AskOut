/*
* Time to get and save all events 
* from Open Data page :D
*/

var mongoose = require('mongoose');
var config = require('../config');
var Event = require('../app/models/event');
var finalData = [];
var validDate = new Date();

module.exports = function(arrayEvents, callback) {
  /*
  * Connect to the DB
  */
  mongoose.connect(config.database);
  finalData = arrayEvents;
  /*
  * Saving the data
  */
  /*for(var i=0; i < finalData.length; i++){
    var eventsArray = finalData[i];
    var waiting_tiem = true;
    for(events in eventsArray){
      waiting_tiem = true;
      if(eventsArray[events] !== undefined){  
        console.log(eventsArray[events]._id);      
        Event.findOne({_id : eventsArray[events]._id}, function(err,e){
          if (err){} /*nose*/
           /* console.log('dins lol');
            console.log(eventsArray[events]._id);
          if (e === null || e === undefined || e.length == 0){
            var ev = new Event();
            e._id = eventsArray[events]._id;
            e.data_final = transformTime(eventsArray[events].dataFi, false);
          }else{
            ev = e;
            var hora_ini = (eventsArray[events].dataIni).split(' ');
            var hora_fi = [];
            if(eventsArray[events].dataFi!== undefined) hora_fi = (eventsArray[events].dataFi).split('.');
            if(hora_ini.length == 2 || hora_fi.length == 2){
              e.data_final = transformTimeAvui(eventsArray[events].dataFi, e.data_final);
              if(hora_ini.length>0){
                e.hora_inici = hora_ini[1];
              }
              e.hora_final = eventsArray[events].dataFi;
            }
          }
          e.data_inici = transformTime(eventsArray[events].dataIni, true);            
          e.nom = (eventsArray[events].nom).replace("’","'");
          e.nomLloc = (eventsArray[events].nomLloc).replace('*','');;
          e.carrer = eventsArray[events].carrer;
          e.numero = eventsArray[events].numero;
          e.districte = eventsArray[events].districte;
          e.municipi = eventsArray[events].municipi;
          e.categories = eventsArray[events].clasificacions;
          e.categories_generals = eventsArray[events].categories_generals;                     

          e.save(function(err){
            var logs = require('../saveLogs');
            if (err){ 
              console.log("error:"+err);        
              logs("DesarBD","Hi ha hagut l'error"+err, function(log){
                log.save(function(err){
                if (err){ /*No ha passat res*//* }
                });
              });
             }else{
              logs("DesarBD","S'han desat les dades a la BD", function(log){
                log.save(function(err){
                if (err){ /*No ha passat res*/ /*}
                });
              });
             }
          }); 
          waiting_tiem=false; 
        });    
        while(waiting_tiem){}   
      }
    }  
  }*/
  //console.log(finalData.length);
  desarBD(0,0);
  /*desarBD(1,0);
  desarBD(2,0);
  desarBD(3,0);*/

  var today = new Date();
  today.setHours(1,0,0,0);

  Event.update({data_final : { $lt: today} }, { baixa: new Date()}, { multi: true }, function(err, num){
    if (err) return callback(err);
    callback(num + " - done");
  });
  //callback("done");
}
function desarBD(i,events){
  if(events < finalData[i].length){
    eventsArray = finalData[i];
    //console.log(eventsArray[events]._id); 
    if(eventsArray[events] !== null && eventsArray[events] !== undefined){   
      var ev = new Event(); 
      Event.findOne({_id : eventsArray[events]._id}, function(err,e){
        if (err){} /*nose*/
          //console.log('dins lol');
        if(eventsArray[events] === null || eventsArray[events] === undefined){ 
         desarBD(i,events+1)
        }else{
            //console.log(eventsArray[events]._id);
          
          if (e === null || e === undefined || e.length == 0){
            var e = new Event();
            e._id = eventsArray[events]._id;
            e.data_final = transformTime(eventsArray[events].dataFi, false);
          }else{
            //console.log("mai entra");
            var hora_ini = (eventsArray[events].dataIni).split(' ');
            var hora_fi = [];
            if(eventsArray[events].dataFi!== undefined) hora_fi = (eventsArray[events].dataFi).split('.');
            if(hora_ini.length == 2 || hora_fi.length == 2){
              e.data_final = transformTimeAvui(eventsArray[events].dataFi, e.data_final);
              if(hora_ini.length>0){
                e.hora_inici = hora_ini[1].replace(".",":");
              }
              e.hora_final = (eventsArray[events].dataFi).replace(".",":");
            }
          }
          e.data_inici = transformTime(eventsArray[events].dataIni, true);            
          e.nom = (eventsArray[events].nom).replace("’","'");
          e.nomLloc = (eventsArray[events].nomLloc).replace('*','');
          e.carrer = eventsArray[events].carrer;
          e.numero = eventsArray[events].numero;
          e.districte = eventsArray[events].districte;
          e.municipi = eventsArray[events].municipi;
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
             desarBD(i,events+1);
          }); 
        }
      });        
    }else{
      desarBD(i,events+1);
    } 
  }else{
    if(i<3)
     desarBD(i+1,0);
  }
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

function transformTimeAvui(data,dataOld){
  //First we need to check if we're parsing dataIni or not
  var novaData = "";
  //as sometimes data is null or undefined, we need to take it into account
  if(data !== null && data != "" && data !== undefined){
    var hora = data.split('.'); // hora = [9,00]
    //sometimes no hour is defined, so we need to check that too
    if(hora === null || hora === undefined || hora.length <= 0){
      hora = [0,0];
    }
    //Then we need to check if it's a valid date and then we can save it:
    novaData = new Date(dataOld.getFullYear(),dataOld.getMonth(), dataOld.getDate(),hora[0],hora[1]);
  }else{
    novaData = dataOld;
  }
  return novaData;
}
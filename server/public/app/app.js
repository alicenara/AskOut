angular.module('dynamicEvent', ['routerRoutes', 'eventService'])

  .controller('mainControler', function() {
    var vm = this;
    /*
     * Possibility to change the index dynamicaly.
     */
  })

  .controller('eventControler', function($scope, $routeParams, Event) {
    var vm = this;
    //var id = $routeParams.getId;
    Event.get($routeParams.getId)
      .success(function(data){
        var mun = (data.municipi).toLowerCase();
        data.municipi = mun.substring(0,1).toUpperCase()+mun.substring(1);
        vm.events = data;
      });
    /*
    var Event = require('../../app/models/event');
    Event.find({"_id": $routeParams.getId}, function (err, events) {
      vm.nom = events.nom;
      vm.lloc = events.nomLloc;
      vm.carrer = events.carrer;
      vm.numero = events.numero;
      vm.districte = events.districte;
      vm.municipi = events.municipi;
      vm.categories = events.categories_generals;
    });*/
  });


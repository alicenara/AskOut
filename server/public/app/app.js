angular.module('dynamicEvent', ['routerRoutes'])

.controller('mainControler', function() {
  var vm = this;
  /*
   * Possibility to change the index dynamicaly.
   */
   vm.message = "heys";
})

.controller('eventControler', function ($routeParams) {
  var vm = this;
  /*var id = $routeParams.id;
  var Event = require('../models/event');
  Event.find({"_id": id}, function (err, event) {
    vm.nom = event.nom;
    vm.lloc = event.nomLloc;
    vm.carrer = event.carrer;
    vm.numero = event.numero;
    vm.districte = event.districte;
    vm.municipi = event.municipi;
    vm.categories = event.categories_generals;
  });*/
  vm.message = "heys2";
});


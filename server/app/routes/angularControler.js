var angctrl = angular.module('dynamicEvent', ['ngRoute']);

angctrl.config(['$routeProvider', function ($routeProvider, $locationProvider) {
	$routeProvider
		// route for the home page
		.when('/', {
			templateUrl: '/public/home.html',
			controller: 'mainControler',
			controllerAs: 'main'
		})
		// route for each event
		.when('/:id/', {
			templateUrl: '/public/infoEvents.html',
			controller: 'eventControler',
			controllerAs: 'ectrl'
		});
	// set the app to have pretty URLs
	$locationProvider.html5mode(true);
}]);

angctrl.controller('mainControler', function() {
	var vm = this;
	/*
	 * Possibility to change the index dynamicaly.
	 */
});

angctrl.controller('eventControler', function ($routeParams) {
	var vm = this;
	var id = $routeParams.id;
	var Event = require('../models/event');
	Event.find({"_id": id}, function (err, event) {
		vm.nom = event.nom;
		vm.lloc = event.nomLloc;
		vm.carrer = event.carrer;
		vm.numero = event.numero;
		vm.districte = event.districte;
		vm.municipi = event.municipi;
		vm.categories = event.categories_generals;
	});
});


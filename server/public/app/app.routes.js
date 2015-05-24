angular.module('routerRoutes', ['ngRoute'])

//Configure routes
.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    // route for the home page
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'mainControler',
      controllerAs: 'main'
    })
    // route for each event
    .when('/esdeveniment/:id', {
      templateUrl: 'views/infoEvents.html',
      controller: 'eventControler',
      controllerAs: 'esdeveniment'
    })

    .otherwise({
      redirectTo: '/'
    });
  // set the app to have pretty URLs
  $locationProvider.html5Mode(true);
});
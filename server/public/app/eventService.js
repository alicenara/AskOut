angular.module('eventService', [])
  .factory('Event', function($http) {
    // create a new object
    var eventFactory = {};
    // get a single user
  eventFactory.get = function(id) {
    return $http.get('/api/esdeveniment/' + id);
  };
  // get all users
  /*userFactory.all = function() {
  return $http.get('/api/users/');
  };
  // create a user
  userFactory.create = function(userData) {
  return $http.post('/api/users/', userData);
  };
  // update a user
  userFactory.update = function(id, userData) {
  return $http.put('/api/users/' + id, userData);
  };
  // delete a user
  userFactory.delete = function(id) {
  return $http.delete('/api/users/' + id);
  };*/
  // return our entire userFactory object
  return eventFactory;
});
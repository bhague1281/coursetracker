angular.module('CourseServices', ['firebase'])
.factory('Auth', ['$firebaseAuth', function($firebaseAuth) {
  var ref = new Firebase("https://coursetracker.firebaseio.com");
  return $firebaseAuth(ref);
}])

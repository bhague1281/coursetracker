angular.module('CourseServices', ['firebase'])
.factory('Auth', ['$firebaseAuth', function($firebaseAuth) {
  return {
    authObj: $firebaseAuth(new Firebase("https://coursetracker.firebaseio.com")),
    getCurrentUser: function() {
      var authData = this.authObj.$getAuth();
      return (authData && authData.github) ? authData.github : false;
    },
    isLoggedIn: function() {
      return this.getCurrentUser() ? true : false;
    },
    login: function(callback) {
      this.authObj.$authWithOAuthPopup('github').then(function(authData) {
        console.log('Logged in as:', authData.uid);
        console.log(authData);
        callback(null, authData);
      }).catch(function(error) {
        console.log('Authentication failed');
        callback({message: 'Authentication failed', error: error}, null);
      });
    },
    logout: function() {
      this.authObj.$unauth();
    }
  }
}])
.factory('Cohorts', ['$firebaseArray', function($firebaseArray) {
  return new Firebase("https://coursetracker.firebaseio.com/cohorts");
}])
.factory('Students', ['$firebaseArray', function($firebaseArray) {
  return new Firebase("https://coursetracker.firebaseio.com/students");
}])
.factory('Users', ['$firebaseArray', function($firebaseArray) {
  return new Firebase("https://coursetracker.firebaseio.com/users");
}])

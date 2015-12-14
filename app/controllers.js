angular.module('CourseCtrls', ['CourseServices'])
.controller('NavCtrl', ['$scope', 'Auth', function($scope, Auth) {
  $scope.login = function() {
    Auth.$authWithOAuthPopup('github').then(function(authData) {
      console.log('Logged in as:', authData.uid);
    }).catch(function(error) {
      console.log('Authentication failed');
    });
  };
}])

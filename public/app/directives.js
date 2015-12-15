angular.module('CourseTrackerDirectives', [])
.directive('studentCard', function() {
  return {
    restrict: 'E',
    scope: {
      student: '=',
      showCohort: '='
    },
    templateUrl: 'app/views/directives/studentCard.html',
    controller: ['$scope', function($scope) {
      if (typeof $scope.showCohort === 'undefined') $scope.showCohort = true;
    }]
  }
});

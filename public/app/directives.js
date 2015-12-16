angular.module('CourseTrackerDirectives', ['chart.js', 'CourseServices'])
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
})
.directive('attendanceGraph', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/views/directives/attendanceGraph.html',
    scope: {
      cohort: '='
    },
    controller: ['$scope', 'Attendance', '$firebaseArray', function($scope, Attendance, $firebaseArray) {
      // Attendance.ref.child('WDI 04').child()
      var attendanceRecords = $firebaseArray(Attendance.ref.child($scope.cohort));
      $scope.data = [[]];
      $scope.labels = [];
      $scope.series = ['Attendance'];
      var updateAttendanceRecords = function() {
        $scope.data[0] = [];
        $scope.labels = [];
        attendanceRecords.forEach(function(item) {
          $scope.data[0].push(item.count);
          $scope.labels.push(item.$id);
        });
      };
      attendanceRecords.$loaded().then(function() {
        updateAttendanceRecords();
        attendanceRecords.$watch(updateAttendanceRecords);
      });
    }]
  }
})

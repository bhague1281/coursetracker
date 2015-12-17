angular.module('CourseTrackerDirectives', ['chart.js', 'CourseServices', 'ui.bootstrap'])
.directive('studentCard', function() {
  return {
    restrict: 'E',
    scope: {
      student: '=',
      showCohort: '=',
      showNote: '='
    },
    templateUrl: 'app/views/directives/studentCard.html',
    controller: ['$scope', '$uibModal', function($scope, $uibModal) {
      if (typeof $scope.showCohort === 'undefined') $scope.showCohort = true;
      if (typeof $scope.showNote === 'undefined') $scope.showNote = false;

      $scope.studentDetails = function() {
        $uibModal.open({
          animation: true,
          templateUrl: 'app/views/directives/studentDetails.html',
          controller: 'StudentDetailsModal',
          resolve: {
            student: function() {
              return $scope.student;
            }
          }
        })
      };
    }]
  }
})
.controller('StudentDetailsModal', ['$scope', '$uibModalInstance', 'student', 'Students', function($scope, $uibModalInstance, student, Students) {
  $scope.student = student;
  $scope.student.firstName = 'test';
  console.log($scope.student);
}])
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

angular.module('CourseCtrls', ['CourseServices', 'CourseTrackerDirectives', 'angularMoment'])
.controller('AuthCtrl', ['$scope', 'Auth', 'Alerts', function($scope, Auth, Alerts) {
  $scope.auth = Auth;
  $scope.alerts = Alerts;

  $scope.login = function() {
    Auth.login(function(err, user) {
      if (err) {
        return console.log('error');
        console.log(err);
        $scope.alerts.add('danger', 'An error occurred!');
      }
      $scope.alerts.add('success', 'You are now logged in!');
    });
  };

  $scope.logout = function() {
    Auth.logout();
    $scope.alerts.add('success', 'You are now logged out');
  }
}])
.controller('DashboardCtrl', ['$scope', 'Students', function($scope, Students) {
  $scope.students = [];
  $scope.selectedCohort = 'WDI 04'

  Students.getCohort($scope.selectedCohort, function(err, students) {
    $scope.students = students;
  });
}])
.controller('AttendanceCtrl', ['$scope', '$filter', 'Students', 'Attendance', '$firebaseArray', function($scope, $filter, Students, Attendance, $firebaseArray) {
  $scope.currentDate = new Date();
  $scope.formattedDate = $filter('date')($scope.currentDate, 'MM-dd-yyyy');
  $scope.students = [];
  $scope.selectedCohort = 'WDI 04'

  Students.getCohort($scope.selectedCohort, function(err, students) {
    $scope.students = students;
  });

  $scope.toggleAttendance = function(githubUsername) {
    var obj = {};
    obj[githubUsername] = $scope.attended(githubUsername) ? false : true;
    Attendance.ref.child('WDI 04').child($scope.formattedDate).update(obj);
    Attendance.ref.child('WDI 04').child($scope.formattedDate).child('count').transaction(function(currentCount) {
      return obj[githubUsername] ? currentCount+1 : currentCount-1;
    });
  }

  var attendance = [];
  $scope.$watch('currentDate', function() {
    $scope.formattedDate = $filter('date')($scope.currentDate, 'MM-dd-yyyy');
    attendance = $firebaseArray(Attendance.ref.child($scope.selectedCohort).child($scope.formattedDate));
  });

  $scope.attended = function(githubUsername) {
    var attendanceRecord = attendance.$getRecord(githubUsername)
    return attendanceRecord ? attendanceRecord.$value : false;
  }
}])
.controller('AdminIndexCtrl', ['$scope', 'Cohorts', 'Students', 'Auth', '$http', '$firebaseArray', '$uibModal', function($scope, Cohorts, Students, Auth, $http, $firebaseArray, $uibModal) {
  $scope.cohorts = $firebaseArray(Cohorts);
  $scope.students = [];
  $scope.selectedCohort = false;
  $scope.newCohort = { name: '', description: '' };
  $scope.newStudent = { firstName: '', lastName: '', cohort: '', githubUsername: '', avatarUrl: '' };

  $scope.cohorts.$loaded().then(function(data) {
    $scope.selectedCohort = $scope.cohorts.$keyAt(0);
  });

  $scope.$watch('selectedCohort', function() {
    Students.getCohort($scope.selectedCohort, function(err, students) {
      $scope.students = students;
    });
  });

  $scope.changeSelectedCohort = function(idx) {
    $scope.selectedCohort = $scope.cohorts.$keyAt(idx);
  };

  $scope.addCohort = function() {
    var cohort = {};
    cohort[$scope.newCohort.name] = $scope.newCohort;
    Cohorts.update(cohort);
    $scope.alerts.add('success', 'You added ' + $scope.newCohort.name + ' as a new cohort');
    $scope.newCohort = { name: '', description: '' };
  };

  $scope.addStudent = function() {
    $http.get('https://api.github.com/users/' + $scope.newStudent.githubUsername).then(function success(res) {
      $scope.newStudent.avatarUrl = res.data.avatar_url;
      if ((!$scope.newStudent.firstName || !$scope.newStudent.lastName) && res.data.name.split(' ').length>=2) {
        $scope.newStudent.firstName = res.data.name.split(' ')[0]
        $scope.newStudent.lastName = res.data.name.split(' ')[1]
      }
      var student = {};
      student[$scope.newStudent.githubUsername] = $scope.newStudent
      Students.ref.update(student);
      $scope.alerts.add('success', 'You added ' + $scope.newStudent.firstName + ' as a new student');
      $scope.newStudent = { firstName: '', lastName: '', cohort: '' };
    }, function error(res) {
      console.log(res);
      $scope.alerts.add('danger', 'An error occurred, try again! (or check console)');
    });
  };

  $scope.newCohortModal = function() {
    $uibModal.open({
      animation: true,
      templateUrl: 'app/views/admin/newCohortModal.html',
      controller: 'NewCohortCtrl'
    });
  };
}])
.controller('NewCohortCtrl', ['$scope', '$uibModalInstance', 'Cohorts', 'Alerts', function($scope, $uibModalInstance, Cohorts, Alerts) {
  $scope.alerts = Alerts;
  $scope.newCohort = { name: '', description: '' };

  $scope.createCohort = function() {
    var cohort = {};
    cohort[$scope.newCohort.name] = $scope.newCohort;
    Cohorts.update(cohort);
    $scope.alerts.add('success', 'You added ' + $scope.newCohort.name + ' as a new cohort');
    $scope.newCohort = { name: '', description: '' };

    $uibModalInstance.dismiss('create');
  }

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  }
}])

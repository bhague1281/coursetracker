angular.module('CourseCtrls', ['CourseServices', 'CourseTrackerDirectives', 'angularMoment'])
.controller('AuthCtrl', ['$scope', 'Auth', function($scope, Auth) {
  $scope.auth = Auth;

  $scope.login = function() {
    Auth.login(function(err, user) {
      if (err) return console.log('error');
      console.log(user);
    });
  };
}])
.controller('IndexCtrl', ['$scope', function($scope) {
  console.log('index');
}])
.controller('DashboardCtrl', ['$scope', 'Auth', 'Students', '$firebaseArray', function($scope, Auth, Students, $firebaseArray) {
  $scope.auth = Auth;
  $scope.students = [];
  $scope.selectedCohort = 'WDI 04'

  Students.getCohort($scope.selectedCohort, function(err, students) {
    $scope.students = students;
  });
  console.log('dashboard');
}])
.controller('AttendanceCtrl', ['$scope', '$filter', 'Students', 'Attendance', '$firebaseArray', function($scope, $filter, Students, Attendance, $firebaseArray) {
  $scope.currentDate = new Date();
  $filter('date')($scope.currentDate, 'MMddyyyy')
  $scope.students = [];
  $scope.attendance = ['thomasvaeth'];

  Students.getCohort('WDI 04', function(err, students) {
    $scope.students = students;
  });

  $scope.toggleAttendance = function(githubUsername) {
    var obj = {};
    obj[githubUsername] = $scope.attended(githubUsername) ? false : true;
    Attendance.ref.child('WDI 04').child($filter('date')($scope.currentDate, 'MM-dd-yyyy')).update(obj);
    Attendance.ref.child('WDI 04').child($filter('date')($scope.currentDate, 'MM-dd-yyyy')).child('count').transaction(function(currentCount) {
      return obj[githubUsername] ? currentCount+1 : currentCount-1;
    });
  }

  var attendance = [];
  $scope.$watch('currentDate', function() {
    attendance = $firebaseArray(Attendance.ref.child('WDI 04').child($filter('date')($scope.currentDate, 'MM-dd-yyyy')));
  });
  $scope.attended = function(githubUsername) {
    if (attendance.$getRecord(githubUsername)) {
      return attendance.$getRecord(githubUsername).$value;
    }
    return false;
  }
}])
.controller('AdminIndexCtrl', ['$scope', 'Cohorts', 'Students', 'Auth', '$http', '$firebaseArray', function($scope, Cohorts, Students, Auth, $http, $firebaseArray) {
  $scope.cohorts = $firebaseArray(Cohorts);
  $scope.students = [];
  $scope.auth = Auth;
  $scope.selectedCohort = false;

  $scope.cohorts.$loaded().then(function(data) {
    $scope.selectedCohort = $scope.cohorts.$keyAt(0);
    console.log($scope.selectedCohort);
  });

  $scope.$watch('selectedCohort', function() {
    Students.getCohort($scope.selectedCohort, function(err, students) {
      $scope.students = students;
      console.log('students loaded');
    });
  });

  $scope.changeSelectedCohort = function(idx) {
    $scope.selectedCohort = $scope.cohorts.$keyAt(idx);
  };

  $scope.newCohort = { name: '', description: '' };
  $scope.newStudent = { firstName: '', lastName: '', cohort: '', githubUsername: '', avatarUrl: '' };

  $scope.addCohort = function() {
    var cohort = {};
    cohort[$scope.newCohort.name] = $scope.newCohort;
    Cohorts.update(cohort);
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
      $scope.newStudent = { firstName: '', lastName: '', cohort: '' };
    }, function error(res) {
      console.log(res);
    });
  };
}])

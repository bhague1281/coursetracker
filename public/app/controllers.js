angular.module('CourseCtrls', ['CourseServices'])
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
.controller('DashboardCtrl', ['$scope', 'Auth', function($scope, Auth) {
  $scope.auth = Auth;
  console.log('dashboard');
}])
.controller('AdminIndexCtrl', ['$scope', 'Cohorts', 'Students', 'Auth', '$http', '$firebaseArray', '$timeout', function($scope, Cohorts, Students, Auth, $http, $firebaseArray, $timeout) {
  var loadStudents = function() {
    Students.orderByChild('cohort').startAt($scope.selectedCohort).endAt($scope.selectedCohort).on("value", function(snapshot) {
      $timeout(function() {
        $scope.students = [];
        snapshot.forEach(function(data) {
          $scope.students.push(data.val());
          console.log(data.val());
        })
      })
    });
  }

  $scope.cohorts = $firebaseArray(Cohorts);
  $scope.students = [];
  $scope.auth = Auth;
  $scope.selectedCohort = false;

  $scope.cohorts.$loaded().then(function(data) {
    $scope.selectedCohort = $scope.cohorts.$keyAt(0);
    console.log($scope.selectedCohort);
  });

  $scope.$watch('selectedCohort', function() {
    loadStudents();
    console.log('students loaded');
  });

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
      Students.update(student);
      $scope.newStudent = { firstName: '', lastName: '', cohort: '' };
    }, function error(res) {
    });
  };

  $scope.changeSelectedCohort = function(idx) {
    $scope.selectedCohort = $scope.cohorts.$keyAt(idx);
    loadStudents();
  }
}])

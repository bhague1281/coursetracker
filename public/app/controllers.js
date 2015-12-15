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
.controller('AdminIndexCtrl', ['$scope', 'Cohorts', 'Students', 'Auth', '$http', function($scope, Cohorts, Students, Auth, $http) {
  $scope.cohorts = Cohorts;
  $scope.students = Students;
  $scope.auth = Auth;

  $scope.newCohort = { name: '', description: '' };
  $scope.newStudent = { firstName: '', lastName: '', cohort: '', githubUsername: '', avatarUrl: '' };

  $scope.addCohort = function() {
    $scope.cohorts.$add($scope.newCohort);
    $scope.newCohort = { name: '', description: '' };
  };

  $scope.addStudent = function() {
    console.log('ok');
    $http.get('https://api.github.com/users/' + $scope.newStudent.githubUsername).then(function success(res) {
      $scope.newStudent.avatarUrl = res.data.avatar_url;
      $scope.students.$add($scope.newStudent);
      $scope.newStudent = { firstName: '', lastName: '', cohort: '' };
    }, function(res) {
      // $scope.students.$add($scope.newStudent);
      // $scope.newStudent = { firstName: '', lastName: '', cohort: '' };
    });
    // $scope.students.$add($scope.newStudent);
    // $scope.newStudent = { firstName: '', lastName: '', cohort: '' };
  };
}])

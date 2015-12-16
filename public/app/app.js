angular.module('CourseTracker', ['CourseCtrls', 'ui.router', 'ngAnimate'])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('index', {
    url: '/',
    templateUrl: 'app/views/index.html',
    controller: 'IndexCtrl'
  })
  .state('admin', {
    url: '/admin',
    templateUrl: 'app/views/admin/index.html',
    controller: 'AdminIndexCtrl'
  })
  .state('dashboard', {
    url: '/dashboard',
    templateUrl: 'app/views/dashboard.html',
    controller: 'DashboardCtrl'
  })
  .state('attendance', {
    url: '/attendance',
    templateUrl: 'app/views/attendance.html',
    controller: 'AttendanceCtrl'
  })
  // .when('/', {
  //   templateUrl: 'app/views/index.html',
  //   controller: 'IndexCtrl'
  // })
  // .when('/admin', {
  //   templateUrl: 'app/views/admin/index.html',
  //   controller: 'AdminIndexCtrl'
  // })

  // $locationProvider.html5Mode(false).hashPrefix('!');
}])

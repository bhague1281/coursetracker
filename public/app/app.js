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
    templateUrl: 'app/views/dashboard/dashboard.html',
    controller: 'DashboardCtrl'
  })
  .state('dashboard.index', {
    templateUrl: 'app/views/dashboard/index.html',
    controller: 'DashboardIndexCtrl'
  })
  .state('dashboard.attendance', {
    templateUrl: 'app/views/dashboard/attendance.html',
    controller: 'AttendanceCtrl'
  })
  .state('dashboard.projects', {
    templateUrl: 'app/views/dashboard/projects.html',
    controller: 'ProjectsCtrl'
  })

  // $locationProvider.html5Mode(false).hashPrefix('!');
}])
